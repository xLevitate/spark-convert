import imageCompression from 'browser-image-compression';
import { PDFDocument, PageSizes } from 'pdf-lib';
import { Document, Packer } from 'docx';
import { marked } from 'marked';
import mammoth from 'mammoth';

// Lazy load FFmpeg
const FFmpegPromise = () => import('@ffmpeg/ffmpeg').then(m => m.FFmpeg);
const FFmpegUtilPromise = () => import('@ffmpeg/util').then(m => ({ toBlobURL: m.toBlobURL, fetchFile: m.fetchFile }));

let ffmpeg: any = null;

async function getFFmpeg() {
  if (ffmpeg) return ffmpeg;

  const [FFmpeg, { toBlobURL }] = await Promise.all([
    FFmpegPromise(),
    FFmpegUtilPromise()
  ]);

  ffmpeg = new FFmpeg();
  
  const baseURL = 'https://unpkg.com/@ffmpeg';
  const coreURL = await toBlobURL(
    `${baseURL}/core@0.12.6/dist/umd/ffmpeg-core.wasm`,
    'application/wasm'
  );
  
  await ffmpeg.load({
    coreURL,
    wasmURL: `${baseURL}/core@0.12.6/dist/umd/ffmpeg-core.wasm`,
  });

  return ffmpeg;
}

export async function convertFile(
file: File, targetFormat: string, onProgress: (progress: number) => void, settings: (file: File, targetFormat: string, arg2: (progress: number) => void, settings: any) => unknown): Promise<Blob> {  
  if (file.type.startsWith('image/')) {
    if (targetFormat === '.pdf') {
      return await convertImageToPdf(file);
    }
    return await convertImage(file, targetFormat);
  }
  
  if (file.type.startsWith('video/') || file.type.startsWith('audio/')) {
    return await convertMediaFile(file, targetFormat, onProgress);
  }
  
  if (file.type === 'application/pdf' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'text/markdown' ||
      file.type === 'text/plain') {
    return await convertDocument(file, targetFormat);
  }
  
  throw new Error('Unsupported file type');
}

async function convertImageToPdf(file: File): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const imageBytes = await file.arrayBuffer();
  let image;

  if (file.type === 'image/jpeg') {
    image = await pdfDoc.embedJpg(imageBytes);
  } else if (file.type === 'image/png') {
    image = await pdfDoc.embedPng(imageBytes);
  } else {
    // For other formats, convert to PNG first
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
    
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    const pngData = await fetch(canvas.toDataURL('image/png')).then(res => res.arrayBuffer());
    image = await pdfDoc.embedPng(pngData);
  }

  const page = pdfDoc.addPage(PageSizes.A4);
  const { width, height } = page.getSize();
  const aspectRatio = image.width / image.height;
  
  let imageWidth = width - 40; // 20pt padding on each side
  let imageHeight = imageWidth / aspectRatio;
  
  if (imageHeight > height - 40) {
    imageHeight = height - 40;
    imageWidth = imageHeight * aspectRatio;
  }
  
  page.drawImage(image, {
    x: (width - imageWidth) / 2,
    y: (height - imageHeight) / 2,
    width: imageWidth,
    height: imageHeight,
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

async function convertImage(file: File, targetFormat: string): Promise<Blob> {
  if (targetFormat === '.svg') {
    throw new Error('SVG conversion not supported yet');
  }

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  const compressedFile = await imageCompression(file, options);
  return new Blob([compressedFile], { type: `image/${targetFormat.slice(1)}` });
}

async function convertMediaFile(
  file: File, 
  targetFormat: string,
  onProgress: (progress: number) => void
): Promise<Blob> {
  const ffmpeg = await getFFmpeg();
  const inputFileName = 'input' + getExtensionFromType(file.type);
  const outputFileName = 'output' + targetFormat;
  
  ffmpeg.on('progress', (progress: { ratio: number }) => {
    onProgress(Math.round(progress.ratio * 100));
  });

  const arrayBuffer = await file.arrayBuffer();
  await ffmpeg.writeFile(inputFileName, new Uint8Array(arrayBuffer));
  
  await ffmpeg.exec(['-i', inputFileName, outputFileName]);
  
  const data = await ffmpeg.readFile(outputFileName);
  return new Blob([data], { type: getTypeFromExtension(targetFormat) });
}

async function convertDocument(file: File, targetFormat: string): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  
  if (file.type === 'application/pdf') {
    
    if (targetFormat === '.docx') {
      // PDF to DOCX conversion
      const doc = new Document({
        sections: [{
          properties: {},
          children: []
        }]
      });
      // Add PDF content to DOCX
      const pdfBytes = await Packer.toBuffer(doc);
      return new Blob([pdfBytes], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    }
  }
  
  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (targetFormat === '.md') {
      return new Blob([result.value], { type: 'text/markdown' });
    }
  }
  
  if (file.type === 'text/markdown') {
    const text = new TextDecoder().decode(arrayBuffer);
    const html = marked(text);
    
    if (targetFormat === '.pdf') {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      page.drawText(await Promise.resolve(html).then(h => h.replace(/<[^>]*>/g, '')));
      const pdfBytes = await pdfDoc.save();
      return new Blob([pdfBytes], { type: 'application/pdf' });
    }
  }
  
  throw new Error('Unsupported conversion');
}

function getExtensionFromType(type: string): string {
  const ext = type.split('/')[1];
  return '.' + (ext === 'quicktime' ? 'mov' : ext);
}

function getTypeFromExtension(ext: string): string {
  const type = ext.slice(1);
  switch (type) {
    case 'mp4':
      return 'video/mp4';
    case 'webm':
      return 'video/webm';
    case 'gif':
      return 'image/gif';
    case 'mp3':
      return 'audio/mpeg';
    case 'wav':
      return 'audio/wav';
    case 'ogg':
      return 'audio/ogg';
    default:
      return `application/${type}`;
  }
}
