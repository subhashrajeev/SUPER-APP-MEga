#!/bin/bash

# IVR INTERIORS Brand Asset Setup Script
# This script copies the brand visiting card to the public folder

set -e

echo "🎨 Setting up IVR INTERIORS brand assets..."

# Create public/images directory if it doesn't exist
mkdir -p public/images

# Source path (provided by user)
SOURCE_PATH="/mnt/data/WhatsApp Image 2025-11-18 at 11.24.01_c59eac15.jpg"

# Destination path
DEST_PATH="public/images/ivr-visiting-card.jpg"

# Check if source file exists
if [ -f "$SOURCE_PATH" ]; then
    echo "✓ Found brand visiting card at: $SOURCE_PATH"
    cp "$SOURCE_PATH" "$DEST_PATH"
    echo "✓ Copied to: $DEST_PATH"
else
    echo "⚠️  Source file not found at: $SOURCE_PATH"
    echo "   Creating placeholder image..."

    # Create a placeholder if source doesn't exist
    # This uses ImageMagick if available, otherwise just creates a text file
    if command -v convert &> /dev/null; then
        convert -size 1200x630 xc:blue \
            -font Arial -pointsize 72 -fill white \
            -gravity center -annotate +0+0 "IVR INTERIORS" \
            "$DEST_PATH"
        echo "✓ Created placeholder image using ImageMagick"
    else
        # Fallback: create a simple text placeholder
        echo "IVR INTERIORS - Replace with actual visiting card" > "${DEST_PATH}.placeholder.txt"
        echo "⚠️  ImageMagick not found. Created text placeholder."
        echo "   Please manually copy your visiting card to: $DEST_PATH"
    fi
fi

# Create other brand assets directories
echo ""
echo "📁 Creating additional asset directories..."
mkdir -p public/images/projects
mkdir -p public/images/materials
mkdir -p public/images/renders
mkdir -p public/models
mkdir -p public/uploads/.gitkeep

# Create .gitkeep files to preserve directory structure
touch public/uploads/.gitkeep
echo "✓ Created uploads directory with .gitkeep"

# Set appropriate permissions
chmod -R 755 public/images
echo "✓ Set permissions on public/images"

echo ""
echo "✅ Brand asset setup complete!"
echo ""
echo "Next steps:"
echo "  1. Verify the visiting card image at: $DEST_PATH"
echo "  2. If using a placeholder, replace it with your actual visiting card"
echo "  3. Add additional brand assets (logo, icons) to public/images/"
echo ""
echo "📌 Note: The visiting card will be used in:"
echo "   - Home page hero"
echo "   - Meta tags (OpenGraph, Twitter Card)"
echo "   - PDF headers (optional)"
echo ""
