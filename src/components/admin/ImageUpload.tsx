
import { useState } from 'react';
import { Button } from '@/src/components/ui/Button';
import { X, Image as ImageIcon, Loader2, Upload } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/src/lib/utils';
import { UploadModal } from '@/src/components/admin/MediaLibrary';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    folder?: string;
    className?: string;
    aspectRatio?: 'video' | 'square' | 'wide';
}

export const ImageUpload = ({
    value,
    onChange,
    folder = 'uploads',
    className,
    aspectRatio = 'video'
}: ImageUploadProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRemove = () => {
        onChange('');
    };

    return (
        <>
            <UploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={(url) => onChange(url)}
            />

            <div className={cn("group relative", className)}>
                <div
                    onClick={() => setIsModalOpen(true)}
                    className={cn(
                        "relative overflow-hidden rounded-xl transition-all duration-300 cursor-pointer",
                        "bg-slate-50 border-2 border-dashed border-slate-300/80 hover:border-violet-400/50 hover:bg-slate-100",
                        aspectRatio === 'video' && 'aspect-video',
                        aspectRatio === 'square' && 'aspect-square',
                        aspectRatio === 'wide' && 'aspect-[21/9]'
                    )}
                >
                    {value ? (
                        <>
                            <Image
                                src={value}
                                alt="Uploaded image"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                <Button
                                    type="button"
                                    variant="danger"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove();
                                    }}
                                    className="h-8 w-8 p-0 rounded-full shadow-md bg-white text-red-500 hover:bg-red-500 hover:text-white border-none"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-slate-400">
                            <div className="w-12 h-12 rounded-full bg-slate-200/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform group-hover:bg-violet-100 group-hover:text-violet-600">
                                <ImageIcon className="w-6 h-6" />
                            </div>
                            <p className="text-sm font-medium text-slate-600">Click to select image</p>
                            <p className="text-xs mt-1 opacity-70">Browse Media Library</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
