/**
 * Client-side image compression and resizing utility.
 * Optimizes user-uploaded photos before storing to prevent LocalStorage QuotaExceeded errors.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

/**
 * Compresses a single File or Blob to an optimized JPEG/WEBP base64 Data URL.
 */
export async function compressImageFile(
  file: File | Blob,
  options: CompressionOptions = {}
): Promise<string> {
  const { maxWidth = 1280, maxHeight = 1280, quality = 0.82 } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        resolve("");
        return;
      }

      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserving dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(width, 1);
        canvas.height = Math.max(height, 1);

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(src);
          return;
        }

        // Fill with white background for transparency fallback
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // High quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Export as web-optimized JPEG
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };

      img.onerror = () => {
        resolve(src);
      };

      img.src = src;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Compresses an array of image files in parallel.
 */
export async function compressMultipleImageFiles(
  files: (File | Blob)[],
  options: CompressionOptions = {},
  onProgress?: (loaded: number, total: number) => void
): Promise<string[]> {
  const results: string[] = [];
  let completed = 0;

  for (const file of files) {
    try {
      const compressed = await compressImageFile(file, options);
      if (compressed) {
        results.push(compressed);
      }
    } catch (e) {
      console.warn("Failed to compress image file:", e);
    }
    completed++;
    if (onProgress) {
      onProgress(completed, files.length);
    }
  }

  return results;
}
