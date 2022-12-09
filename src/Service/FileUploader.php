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

    /**
     * getTargetDirectory
     *
     * @return string The configured targetDirectory in /config/services.yaml.
     */
    public function getTargetDirectory(): string
    {
        return $this->targetDirectory;
    }

    /**
     * upload
     * 
     * Uploads a file to a specified directory.
     * If $public is true, the file is uploaded to /public/$directory/,
     * otherwise to /data/upload/$directory/.
     *
     * @param UploadedFile $file File data, e.g. input delivered through a form.
     * @param string|null $directory Addition to the configured $targetDirectory, e.g. /img/.
     * @param boolean $public Whether the file should be uploaded to a public directory.
     * @throws FileException If file could not be uploaded to the desired directory.
     * @return File The File objects corresponding to the uploaded file.
     */
    public function upload(UploadedFile $file, ?string $directory, bool $public = true): File
    {
        // Create a safe filename from the original filename
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $this->slugger->slug($originalFilename);
        $filename = $safeFilename . '-' . uniqid() . '.' . $file->guessExtension();

        // Specify the upload directory
        $uploadDir = $this->getTargetDirectory() 
            . ($public ? '/public/' : '/data/upload/') 
            . $directory;

        // Specify the directory property for the File object and delete unnecessary slashes
        $objectDir = '/' . $directory . '/';
        $objectDir = preg_replace('#/+#', '/', $objectDir);

        try {
            // Try uploading the file
            $file->move($uploadDir, $filename);

            // Create File object
            $fileObject = new File();
            $fileObject
                ->setFilename($filename)
                ->setDirectory($objectDir)
                ->setPublic($public)
            ;

            // Add File object to database
            $this->fileRepository->add($fileObject, true);
        } catch (FileException $e) {
            // Throw FileException if file could not be uploaded.
            throw $e;
        }

        // Return File object.
        return $fileObject;
    }

    /**
     * getExtension
     * 
     * Returns the extension of a File object 
     * or a string that is a filename (with or 
     * without directory).
     *
     * @param File|string $file A File object or a filename.
     * @return string|null The extension of the file.
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
     * isImage
     * 
     * Checks whether a File object or a string 
     * that contains a filename is an image file.
     *
     * @param File|string $file A File object or a filename.
     * @return boolean Returns true if $file is an image and false otherwise.
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
