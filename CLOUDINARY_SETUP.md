# Cloudinary Setup Instructions

## 1. Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email address

## 2. Get Your Credentials
1. Log into your Cloudinary dashboard
2. Go to the "Dashboard" section
3. Copy your credentials:
   - Cloud Name
   - API Key
   - API Secret

## 3. Configure Environment Variables
Add these variables to your `.env.local` file:

```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## 4. Features Included
- ✅ Image upload with optimization
- ✅ Automatic resizing and format conversion
- ✅ Image deletion functionality
- ✅ Upload progress indicator
- ✅ Drag and drop support
- ✅ File validation (type and size)
- ✅ Image gallery component
- ✅ Admin dashboard integration

## 5. Usage Examples

### Basic Upload Component
```tsx
import ImageUpload from '@/components/admin/ImageUpload';

<ImageUpload
  onImageSelect={(url) => setImageUrl(url)}
  currentImage={imageUrl}
  folder="projects"
/>
```

### Image Gallery Component
```tsx
import ImageGallery from '@/components/admin/ImageGallery';

<ImageGallery
  folder="portfolio"
  onImageSelect={(url) => setSelectedImage(url)}
  showUpload={true}
  showDelete={true}
/>
```

## 6. API Endpoints
- `POST /api/upload` - Upload image
- `DELETE /api/upload?publicId=...` - Delete image
- `GET /api/upload?publicId=...` - Get image info

## 7. Image Optimization
All uploaded images are automatically:
- Resized to optimal dimensions
- Compressed for web delivery
- Converted to modern formats (WebP when supported)
- Quality optimized for file size vs quality balance

