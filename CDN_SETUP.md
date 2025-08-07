# 🚀 Quick CDN Setup for Images

## 🥇 **Cloudinary (Recommended - 5 minutes)**

### **Step 1: Sign Up**
1. Go to [cloudinary.com](https://cloudinary.com)
2. Create free account
3. Get your credentials from Dashboard

### **Step 2: Configure**
Add to your `.env` file:
```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### **Step 3: Create Upload Preset**
1. Go to Cloudinary Dashboard → Settings → Upload
2. Create new upload preset called `figma_plugin`
3. Set folder to `figma-plugin`

### **Step 4: Use in Code**
```typescript
import { cloudinaryService } from './src/services/imageService';

// Upload image
const imageUrl = await cloudinaryService.uploadImage(file);

// Get optimized URL
const optimizedUrl = cloudinaryService.getOptimizedUrl(publicId, {
  width: 400,
  height: 300,
  quality: 80
});
```

---

## 🥈 **Firebase Storage (Alternative - 10 minutes)**

### **Step 1: Setup Firebase**
1. Go to [firebase.google.com](https://firebase.google.com)
2. Create project
3. Enable Storage

### **Step 2: Configure**
```typescript
// Already configured in your project!
// Just use the existing Firebase setup
```

---

## 🥉 **GitHub Pages + Imgur (Free - 3 minutes)**

### **Step 1: Use Imgur API**
1. Go to [imgur.com](https://imgur.com)
2. Create account
3. Get API key

### **Step 2: Quick Upload**
```typescript
// Simple Imgur upload
const uploadToImgur = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch('https://api.imgur.com/3/image', {
    method: 'POST',
    headers: {
      'Authorization': 'Client-ID YOUR_IMGUR_CLIENT_ID'
    },
    body: formData
  });
  
  const result = await response.json();
  return result.data.link; // CDN URL
};
```

---

## 🎯 **My Recommendation:**

**Use Cloudinary** because:
- ✅ **5-minute setup**
- ✅ **Free tier** (25GB storage, 25GB bandwidth)
- ✅ **Automatic optimization**
- ✅ **Multiple formats** (WebP, AVIF)
- ✅ **Easy integration**

### **Quick Start:**
1. Sign up at cloudinary.com
2. Copy credentials to `.env`
3. Use the service I created
4. Done! 🎉

---

## 📊 **CDN Comparison:**

| Service | Setup Time | Free Tier | Features |
|---------|------------|-----------|----------|
| **Cloudinary** | 5 min | 25GB | Auto-optimization, formats |
| **Firebase** | 10 min | 5GB | Already configured |
| **Imgur** | 3 min | Unlimited | Simple, public |
| **AWS S3** | 15 min | 5GB | Enterprise |

**Winner: Cloudinary** for your use case! 🏆
