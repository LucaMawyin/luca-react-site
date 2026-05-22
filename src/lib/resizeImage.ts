export default function resizeImage(
  file: File,
  maxWidth = 1200,
  quality = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    const url = URL.createObjectURL(file);

    img.src = url;

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }

      // Crop image to 3 : 2 ratio
      const targetRatio = 3 / 2;
      const imgRatio = img.width / img.height;

      let sx = 0;
      let sy = 0;
      let sw = img.width;
      let sh = img.height;

      if (imgRatio > targetRatio) {
        // too wide
        sw = img.height * targetRatio;
        sx = (img.width - sw) / 2;
      } else {
        // too tall
        sh = img.width / targetRatio;
        sy = (img.height - sh) / 2;
      }

      // Resize image after cropping
      const width = Math.min(maxWidth, sw);
      const height = Math.round(width * 2 / 3);

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);

      // Export as jpeg
      const mimeType = "image/jpeg";
      const newName = file.name.replace(/\.\w+$/, "") + ".jpg";

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to create blob"));
          return;
        }

        resolve(
          new File([blob], newName, {
            type: mimeType,
          })
        );
      }, mimeType, quality);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
  });
}