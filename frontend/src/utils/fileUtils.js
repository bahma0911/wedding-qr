export const formatFileSize = size => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
};

export const compressImageFile = async file => {
  if (!file.type.startsWith('image/')) return file;
  if (file.size <= 1_500_000) return file;

  const imageBitmap = await createImageBitmap(file);
  const maxWidth = 1600;
  const maxHeight = 1600;
  let { width, height } = imageBitmap;
  const ratio = Math.min(1, maxWidth / width, maxHeight / height);
  width = Math.round(width * ratio);
  height = Math.round(height * ratio);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageBitmap, 0, 0, width, height);

  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.75));
  if (!blob) return file;

  const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
  return compressedFile.size < file.size ? compressedFile : file;
};
