// Image optimization utilities
export const optimizeImageUrl = (url: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png';
  crop?: 'fill' | 'fit' | 'scale';
} = {}) => {
  if (!url || url.startsWith('data:')) return url;
  
  const {
    width,
    height,
    quality = 80,
    format = 'webp',
    crop = 'fill'
  } = options;

  // For Cloudinary URLs
  if (url.includes('res.cloudinary.com')) {
    const baseUrl = url.split('/upload/')[0];
    const publicId = url.split('/upload/')[1];
    
    let transformations = [];
    
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    transformations.push(`q_${quality}`);
    transformations.push(`f_${format}`);
    transformations.push(`c_${crop}`);
    
    return `${baseUrl}/upload/${transformations.join(',')}/${publicId}`;
  }
  
  return url;
};

// Generate responsive image sizes
export const generateImageSizes = (baseWidth: number) => {
  return `(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, ${baseWidth}px`;
};

// Lazy loading utility
export const lazyLoadImage = (img: HTMLImageElement, src: string) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const image = entry.target as HTMLImageElement;
        image.src = src;
        image.classList.remove('lazy');
        observer.unobserve(image);
      }
    });
  });
  
  observer.observe(img);
};

// Preload critical images
export const preloadImage = (src: string, as: 'image' = 'image') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = src;
  document.head.appendChild(link);
};

// Image format detection
export const getOptimalImageFormat = () => {
  if (typeof window === 'undefined') return 'webp';
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  // Check for AVIF support
  if (canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) {
    return 'avif';
  }
  
  // Check for WebP support
  if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
    return 'webp';
  }
  
  return 'jpg';
};
