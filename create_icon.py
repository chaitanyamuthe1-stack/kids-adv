#!/usr/bin/env python3
"""
Create placeholder PNG icons for the app.
Run this once to generate favicon.ico and icon-192.png
"""

try:
    from PIL import Image, ImageDraw
    import os
    
    # Create a colorful gradient icon
    def create_icon(size, filename):
        img = Image.new('RGB', (size, size), color=(255, 107, 107))
        draw = ImageDraw.Draw(img)
        
        # Draw a simple smiley face
        # Face
        draw.ellipse([size//4, size//4, 3*size//4, 3*size//4], fill=(255, 200, 87))
        # Eyes
        draw.ellipse([size//3, size//3, size//3+size//8, size//3+size//8], fill=(0, 0, 0))
        draw.ellipse([2*size//3, size//3, 2*size//3+size//8, size//3+size//8], fill=(0, 0, 0))
        # Smile
        draw.arc([size//3, size//2, 2*size//3, 3*size//4], 0, 180, fill=(0, 0, 0), width=size//20)
        
        img.save(filename)
        print(f"✅ Created {filename}")
    
    # Create icons
    static_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Create 192x192 icon
    create_icon(192, os.path.join(static_dir, 'icon-192.png'))
    
    # Create 16x16 favicon
    create_icon(16, os.path.join(static_dir, 'favicon.ico'))
    
    print("✅ All icons created successfully!")

except ImportError:
    print("PIL/Pillow not installed. Install it with: pip install Pillow")
    print("Icons not created, but app will still work.")
except Exception as e:
    print(f"Error creating icons: {e}")
