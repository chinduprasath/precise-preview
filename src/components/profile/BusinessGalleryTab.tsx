import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BusinessGalleryTab: React.FC = () => {
  const { toast } = useToast();
  const [galleryImages, setGalleryImages] = useState([
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400',
      alt: 'Business Image 1'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400',
      alt: 'Business Image 2'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400',
      alt: 'Business Image 3'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=400',
      alt: 'Business Image 4'
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=400',
      alt: 'Business Image 5'
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1525904097878-94fb15835963?q=80&w=400',
      alt: 'Business Image 6'
    },
    {
      id: 7,
      src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400',
      alt: 'Business Image 7'
    },
    {
      id: 8,
      src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=400',
      alt: 'Business Image 8'
    },
    {
      id: 9,
      src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400',
      alt: 'Business Image 9'
    }
  ]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = {
            id: Date.now() + Math.random(),
            src: e.target?.result as string,
            alt: `Uploaded Image ${galleryImages.length + 1}`
          };
          setGalleryImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });

    toast({
      title: "Images uploaded successfully",
      description: "Your images have been added to the gallery.",
    });
  };

  const handleRemoveImage = (imageId: number) => {
    setGalleryImages(prev => prev.filter(img => img.id !== imageId));
    toast({
      title: "Image removed",
      description: "The image has been removed from your gallery.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload Button */}
      <div className="flex justify-end">
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="image-upload"
          />
          <Button asChild>
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Upload Images
            </label>
          </Button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-3 gap-4">
        {galleryImages.map((image) => (
          <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 relative group">
            <CardContent className="p-0">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
              />
              {/* Remove Button */}
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8"
                onClick={() => handleRemoveImage(image.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BusinessGalleryTab;
