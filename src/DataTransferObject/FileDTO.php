<?php namespace App\DataTransferObject;

use App\Entity\File;

class FileDTO implements DataTransferObject
{
    private ?int $id;
    private ?string $filename;
    private ?string $directory;
    private ?bool $public;

    public function __construct(File $file) 
    {
        $this->id = $file->getId();
        $this->filename = $file->getFilename();
        $this->directory = $file->getDirectory();
        $this->public = $file->isPublic();
    }

    public function getId(): ?int 
    {
        return $this->id;
    }

    public function getFilename(): ?string
    {
        return $this->filename;
    }

    public function getDirectory(): ?string
    {
        return $this->directory;
    }

    public function getPublic(): ?bool
    {
        return $this->public;
    }
}
