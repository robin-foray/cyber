<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

class ImagePipeline
{
    /**
     * Store an uploaded image as optimized WebP/AVIF (+ original fallback).
     *
     * @return array{path: string, urls: array{original?: string, webp?: string, avif?: string}}
     */
    public function storeOptimized(
        UploadedFile|TemporaryUploadedFile $file,
        string $directory,
        string $disk = 'public',
        int $maxWidth = 1600,
        int $webpQuality = 82,
        int $avifQuality = 55,
    ): array {
        $directory = trim($directory, '/');
        $basename = Str::uuid()->toString();
        $extension = strtolower($file->getClientOriginalExtension() ?: $file->extension() ?: 'jpg');

        if ($extension === '') {
            $extension = 'jpg';
        }

        $originalRelative = $directory.'/'.$basename.'.'.$extension;
        $storedPath = $file->storeAs($directory, $basename.'.'.$extension, $disk);

        $urls = [
            'original' => $this->publicUrl($disk, $storedPath ?: $originalRelative),
        ];

        $preferredPath = $storedPath ?: $originalRelative;

        try {
            $image = Image::read(Storage::disk($disk)->path($preferredPath));

            if ($image->width() > $maxWidth) {
                $image->scaleDown(width: $maxWidth);
            }

            $webpRelative = $directory.'/'.$basename.'.webp';
            Storage::disk($disk)->put($webpRelative, (string) $image->toWebp($webpQuality));
            $urls['webp'] = $this->publicUrl($disk, $webpRelative);
            $preferredPath = $webpRelative;

            try {
                $avifRelative = $directory.'/'.$basename.'.avif';
                Storage::disk($disk)->put($avifRelative, (string) $image->toAvif($avifQuality));
                $urls['avif'] = $this->publicUrl($disk, $avifRelative);
                $preferredPath = $avifRelative;
            } catch (\Throwable) {
                // AVIF optional depending on driver/build.
            }
        } catch (\Throwable) {
            // Keep original if encode/resize fails.
        }

        return [
            'path' => $preferredPath,
            'urls' => $urls,
        ];
    }

    /**
     * Re-encode an already stored raster image in place (SVG untouched).
     */
    public function optimizeStored(string $path, string $disk = 'public', int $maxWidth = 1600): string
    {
        $path = ltrim($path, '/');

        if ($path === '' || ! Storage::disk($disk)->exists($path)) {
            return $path;
        }

        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));

        if (in_array($extension, ['svg', 'svgz'], true)) {
            return $path;
        }

        try {
            $absolute = Storage::disk($disk)->path($path);
            $image = Image::read($absolute);

            if ($image->width() > $maxWidth) {
                $image->scaleDown(width: $maxWidth);
            }

            $directory = trim(dirname($path), '.');
            $basename = pathinfo($path, PATHINFO_FILENAME);
            $webpRelative = ($directory === '' ? '' : $directory.'/').$basename.'.webp';

            Storage::disk($disk)->put($webpRelative, (string) $image->toWebp(82));

            if ($webpRelative !== $path) {
                Storage::disk($disk)->delete($path);
            }

            return $webpRelative;
        } catch (\Throwable) {
            return $path;
        }
    }

    private function publicUrl(string $disk, string $path): string
    {
        $path = ltrim($path, '/');

        if ($disk === 'public') {
            return '/storage/'.$path;
        }

        if ($disk === 'public_web') {
            return '/'.$path;
        }

        return Storage::disk($disk)->url($path);
    }
}
