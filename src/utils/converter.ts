import imageCompression from 'browser-image-compression';
import { PDFDocument, PageSizes } from 'pdf-lib';
import { Document, Packer, Paragraph } from 'docx';
import { marked } from 'marked';
import mammoth from 'mammoth';
import { ConversionSettings } from '../types/converter';

// Lazy load FFmpeg with proper error handling
const loadFFmpeg = async () => {
  try {
    const [{ FFmpeg }, { toBlobURL }] = await Promise.all([
      import('@ffmpeg/ffmpeg'),
      import('@ffmpeg/util')
    ]);

    const ffmpeg = new FFmpeg();
    
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
  } catch (error) {
    console.error('Failed to load FFmpeg:', error);
    throw new Error('Failed to initialize video converter');
  }
};

// Memoize FFmpeg instance
let ffmpegInstance: any = null;

async function getFFmpeg() {
  if (!ffmpegInstance) {
    ffmpegInstance = await loadFFmpeg();
  }
  return ffmpegInstance;
}

export async function convertFile(
  file: File,
  targetFormat: string,
  onProgress: (progress: number) => void,
  settings: ConversionSettings
): Promise<Blob> {
  try {
    if (file.type.startsWith('image/')) {
      if (targetFormat === '.pdf') {
        return await convertImageToPdf(file);
      }
      return await convertImage(file, targetFormat, settings);
    }
    
    if (file.type.startsWith('video/') || file.type.startsWith('audio/')) {
      return await convertMediaFile(file, targetFormat, onProgress, settings);
    }
    
    if (file.type === 'application/pdf' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type === 'text/markdown' ||
        file.type === 'text/plain') {
      return await convertDocument(file, targetFormat, settings);
    }
    
    throw new Error('Unsupported file type');
  } catch (error) {
    console.error('Conversion error:', error);
    throw error;
  }
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
  
  let imageWidth = width - 40;
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

async function convertImage(
  file: File,
  targetFormat: string,
  settings: ConversionSettings
): Promise<Blob> {
  if (targetFormat === '.svg') {
    throw new Error('SVG conversion not supported yet');
  }

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    preserveExif: settings.preserveMetadata,
    initialQuality: settings.compressionLevel === 'none' ? 1.0 :
                   settings.compressionLevel === 'low' ? 0.8 :
                   settings.compressionLevel === 'medium' ? 0.6 :
                   0.4
  };

  const compressedFile = await imageCompression(file, options);
  return new Blob([compressedFile], { type: `image/${targetFormat.slice(1)}` });
}

async function convertMediaFile(
  file: File,
  targetFormat: string,
  onProgress: (progress: number) => void,
  settings: ConversionSettings
): Promise<Blob> {
  const ffmpeg = await getFFmpeg();
  const inputFileName = 'input' + getExtensionFromType(file.type);
  const outputFileName = 'output' + targetFormat;
  
  ffmpeg.on('progress', (progress: { ratio: number }) => {
    onProgress(Math.round(progress.ratio * 100));
  });

  const arrayBuffer = await file.arrayBuffer();
  await ffmpeg.writeFile(inputFileName, new Uint8Array(arrayBuffer));
  
  const ffmpegArgs = ['-i', inputFileName];
  
  // Apply compression settings
  if (settings.compressionLevel !== 'none') {
    if (file.type.startsWith('video/')) {
      const crf = settings.compressionLevel === 'low' ? '23' :
                 settings.compressionLevel === 'medium' ? '28' :
                 '33';
      ffmpegArgs.push('-crf', crf);
    } else if (file.type.startsWith('audio/')) {
      const bitrate = settings.compressionLevel === 'low' ? '192k' :
                     settings.compressionLevel === 'medium' ? '128k' :
                     '96k';
      ffmpegArgs.push('-b:a', bitrate);
    }
  }
  
  // Preserve metadata if requested
  if (!settings.preserveMetadata) {
    ffmpegArgs.push('-map_metadata', '-1');
  }
  
  ffmpegArgs.push(outputFileName);
  await ffmpeg.exec(ffmpegArgs);
  
  const data = await ffmpeg.readFile(outputFileName);
  return new Blob([data], { type: getTypeFromExtension(targetFormat) });
}

async function convertDocument(
  file: File,
  targetFormat: string,
  settings: ConversionSettings
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  
  if (file.type === 'application/pdf') {
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    if (targetFormat === '.docx') {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: 'PDF content conversion is not fully supported yet.',
              style: 'Normal',
            }),
          ],
        }],
      });
      const docxBuffer = await Packer.toBuffer(doc);
      return new Blob([docxBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
    }
    
    if (targetFormat === '.txt' || targetFormat === '.md') {
      // Basic PDF text extraction
      const text = 'PDF text extraction is not fully supported yet.';
      return new Blob([text], { 
        type: targetFormat === '.md' ? 'text/markdown' : 'text/plain' 
      });
    }
  }
  
  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (targetFormat === '.md' || targetFormat === '.txt') {
      return new Blob([result.value], { 
        type: targetFormat === '.md' ? 'text/markdown' : 'text/plain' 
      });
    }
    
    if (targetFormat === '.pdf') {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const fontSize = 12;
      const lineHeight = fontSize * 1.2;
      const margin = 50;
      
      const lines = result.value.split('\n');
      let y = height - margin;
      
      for (const line of lines) {
        if (y < margin) {
          y = height - margin;
          page.drawText(line, {
            x: margin,
            y,
            size: fontSize,
          });
        }
        y -= lineHeight;
      }
      
      const pdfBytes = await pdfDoc.save();
      return new Blob([pdfBytes], { type: 'application/pdf' });
    }
  }
  
  if (file.type === 'text/markdown' || file.type === 'text/plain') {
    const text = new TextDecoder().decode(arrayBuffer);
    
    if (file.type === 'text/markdown' && targetFormat === '.pdf') {
      const html = marked(text);
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const plainText = await Promise.resolve(html).then(h => h.replace(/<[^>]*>/g, ''));
      page.drawText(plainText);
      const pdfBytes = await pdfDoc.save();
      return new Blob([pdfBytes], { type: 'application/pdf' });
    }
    if (targetFormat === '.docx') {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: text,
              style: 'Normal',
            }),
          ],
        }],
      });
      const docxBuffer = await Packer.toBuffer(doc);
      return new Blob([docxBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
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
