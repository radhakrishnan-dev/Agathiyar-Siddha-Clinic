import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  folder?: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'auto';
}

const ImageUpload = ({
  value,
  onChange,
  multiple = false,
  folder = 'uploads',
  className,
  aspectRatio = 'auto',
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const images = multiple
    ? (Array.isArray(value) ? value : [])
    : (typeof value === 'string' && value ? [value] : []);

  const uploadFile = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('admin-uploads')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('admin-uploads')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate file types
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const invalidFiles = Array.from(files).filter(
      (file) => !validTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid file type',
        description: 'Please upload only image files (JPEG, PNG, WebP, GIF).',
      });
      return;
    }

    // Validate file sizes (max 5MB each)
    const oversizedFiles = Array.from(files).filter(
      (file) => file.size > 5 * 1024 * 1024
    );

    if (oversizedFiles.length > 0) {
      toast({
        variant: 'destructive',
        title: 'File too large',
        description: 'Please upload images smaller than 5MB.',
      });
      return;
    }

    setIsUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const url = await uploadFile(file);
        if (url) uploadedUrls.push(url);
      }

      if (multiple) {
        onChange([...images, ...uploadedUrls]);
      } else {
        onChange(uploadedUrls[0] || '');
      }

      toast({
        title: 'Upload successful',
        description: `${uploadedUrls.length} image(s) uploaded.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'Failed to upload image. Please try again.',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (indexOrUrl: number | string) => {
    if (multiple) {
      const newImages = images.filter((_, i) =>
        typeof indexOrUrl === 'number' ? i !== indexOrUrl : true
      );
      onChange(newImages);
    } else {
      onChange('');
    }
  };

  const aspectRatioClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: 'aspect-auto min-h-[120px]',
  };

  return (
    <div className={cn('space-y-3', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Image previews */}
      {images.length > 0 && (
        <div className={cn('grid gap-3', multiple ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1')}>
          {images.map((url, index) => (
            <div
              key={url}
              className={cn(
                'relative group rounded-lg overflow-hidden border bg-muted',
                aspectRatioClass[aspectRatio]
              )}
            >
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {(multiple || images.length === 0) && (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full border-dashed"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              {images.length === 0 ? 'Upload Image' : 'Add More Images'}
            </>
          )}
        </Button>
      )}

      {/* Empty state for single upload */}
      {!multiple && images.length === 0 && !isUploading && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors',
            aspectRatioClass[aspectRatio],
            'min-h-[150px]'
          )}
        >
          <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Click to upload</p>
          <p className="text-xs text-muted-foreground">JPEG, PNG, WebP, GIF (max 5MB)</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
