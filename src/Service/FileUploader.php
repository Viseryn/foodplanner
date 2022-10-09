<?php

namespace App\Service;

use App\Entity\File;
use App\Repository\FileRepository;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;

class FileUploader 
{
    public function __construct(
        $targetDirectory, 
        SluggerInterface $slugger, 
        FileRepository $fileRepository,
    ) {
        $this->targetDirectory = $targetDirectory;
        $this->slugger = $slugger;
        $this->fileRepository = $fileRepository;
    }

    public function getTargetDirectory()
    {
        return $this->targetDirectory;
    }

    /**
     * Uploads a file to a specific directory.
     * If $public is true, the file is uploaded to /public/$directory/,
     * otherwise to /data/upload/.
     *
     * @param UploadedFile $file File data, e.g. input delivered through a form.
     * @param string|null $dir Addition to the configured $targetDirectory, e.g. /img/.
     * @throws FileException If file could not be uploaded to the desired directory.
     * @return File
     */
    public function upload(UploadedFile $file, ?string $directory, ?bool $public = true): File
    {
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $this->slugger->slug($originalFilename);
        $filename = $safeFilename . '-' . uniqid() . '.' . $file->guessExtension();

        $uploadDir = $this->getTargetDirectory() 
            . ($public ? '/public/' : '/data/upload/') 
            . $directory;

        $objectDir = '/' . $directory . '/';
        $objectDir = preg_replace('#/+#', '/', $objectDir);

        try {
            $file->move($uploadDir, $filename);

            $fileObject = new File();
            $fileObject
                ->setFilename($filename)
                ->setDirectory($objectDir)
                ->setPublic($public);

            $this->fileRepository->add($fileObject, true);
        } catch (FileException $e) {
            throw $e;
        }

        return $fileObject;
    }

    /**
     * Returns the extension of a File object 
     * or a string that is a filename (with or 
     * without directory).
     *
     * @param File|string $file
     * @return string|null
     */
    public function getExtension(File|string $file): ?string 
    {
        if (is_a($file, File::class)) {
            $filename = $file->getFilename();
        } else {
            $filename = $file;
        } 

        return pathinfo($filename, PATHINFO_EXTENSION);
    }

    /**
     * Checks whether a File object or a string 
     * that contains a filename is an image file.
     *
     * @param File|string $file
     * @return boolean Returns true if $file is an image.
     */
    public function isImage(File|string $file): bool
    {
        $allowedImageExtensions = ['gif', 'png', 'jpeg', 'jpg', 'webp'];

        return in_array(
            strtolower($this->getExtension($file)), 
            $allowedImageExtensions
        );
    }

    // public function exists(string $filename, ?string $dir): bool {}
    // public function remove(mixed $file): bool {}
}
