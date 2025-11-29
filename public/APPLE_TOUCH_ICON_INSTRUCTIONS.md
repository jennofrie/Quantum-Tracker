# Apple Touch Icon Setup Instructions

## Image Processing Required

You need to process your golden airplane logo image and create the `apple-touch-icon.png` file.

### Steps:

1. **Take your attached golden airplane logo image**

2. **Resize/Crop to Square:**
   - The image should be a perfect square
   - Recommended size: **180x180px** (minimum) or **512x512px** (optimal for all devices)
   - Use an image editor (Photoshop, GIMP, online tools like Canva, or image resizing websites)

3. **Save as PNG:**
   - Format: PNG with transparency support
   - File name: `apple-touch-icon.png`
   - Location: Save it in the `public/` directory

4. **Quality Requirements:**
   - High resolution (at least 180x180px, preferably 512x512px)
   - Transparent background (if your logo has one)
   - Sharp edges (no blur)
   - The golden/metallic appearance should be preserved

### Quick Online Tools:
- https://www.iloveimg.com/resize-image
- https://www.resizepixel.com/
- https://imageresizer.com/

### After Processing:
Once you've created the `apple-touch-icon.png` file, place it in the `public/` directory. The application is already configured to use it!

## Current Configuration

The following has been set up:
- ✅ Apple Touch Icon link tag in layout.tsx
- ✅ PWA meta tags for standalone mode
- ✅ Manifest.json with icon references
- ⏳ **Waiting for:** `public/apple-touch-icon.png` file

## Testing

After adding the icon file:
1. Deploy your app
2. Open on iPhone/iPad Safari
3. Tap the Share button
4. Select "Add to Home Screen"
5. The golden airplane icon should appear on the home screen!

