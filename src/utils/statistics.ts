interface Statistics {
  totalConversions: number;
  totalSize: number;
  lastConversion: string | null;
}

const STORAGE_KEY = 'sparkconvert_statistics';

export function getStatistics(): Statistics {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {
    totalConversions: 0,
    totalSize: 0,
    lastConversion: null,
  };
}

export function updateStatistics(fileSize: number): void {
  const stats = getStatistics();
  stats.totalConversions += 1;
  stats.totalSize += fileSize;
  stats.lastConversion = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}
