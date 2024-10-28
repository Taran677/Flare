// imageUtils.js
const MAX_IMAGE_SIZE = 1024 * 1024; // 1MB
const MAX_WIDTH = 1200;
const JPEG_QUALITY = 0.8;

export const resizeImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width;
          width = MAX_WIDTH;
        }

        // Create canvas and resize image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob.size > MAX_IMAGE_SIZE) {
              // If still too large, try with lower quality
              canvas.toBlob(
                (blob) => resolve(blob),
                'image/jpeg',
                JPEG_QUALITY
              );
            } else {
              resolve(blob);
            }
          },
          file.type
        );
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const validateImage = (file) => {
  const errors = [];
  
  if (!file.type.startsWith('image/')) {
    errors.push('Please upload an image file');
  }
  
  if (file.size > 5 * 1024 * 1024) {
    errors.push('Original image size should be less than 5MB');
  }
  
  return errors;
};