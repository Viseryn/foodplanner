<?php

namespace App\Entity;

use App\Repository\FileRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FileRepository::class)]
class File
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $filename = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $directory = null;

    #[ORM\Column]
    private ?bool $public = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFilename(): ?string
    {
        return $this->filename;
    }

    public function setFilename(string $filename): self
    {
        $this->filename = $filename;

        return $this;
    }

    public function getDirectory(): ?string
    {
        return $this->directory;
    }

    public function setDirectory(string $directory): self
    {
        $this->directory = $directory;

        return $this;
    }

    public function isPublic(): ?bool
    {
        return $this->public;
    }

    public function setPublic(bool $public): self
    {
        $this->public = $public;

        return $this;
    }

    /**
     * getPath
     * 
     * Returns the path of the File object.
     * Can be configured to add the root directory 
     * or remove the filename.
     * By default, returns the file path without the 
     * root directory but with the filename, e.g. 
     * '/someDir/filename.ext'.
     *
     * @param array<string, bool>|null $config An array with the possible keys "showRootDir", "showFilename", which can be set to a boolean value. By default, showRootDir is false and showFilename is true.
     * @return string The path of the File object, dependent of the configuration. Always begins with a '/'.
     * 
     * @deprecated 
     * @todo Move this to utils.
     */
    public function getPath(?array $config = []): string 
    {
        // Configuration of return value
        $showRootDir = (bool) ($config['showRootDir'] ?? false);
        $showFilename = (bool) ($config['showFilename'] ?? true);

        // Determine the root directory
        $rootDir = $this->isPublic() ? '/public/' : '/data/upload';

        // Set the return value
        $returnValue = '/';
        $returnValue .= $showRootDir ? $rootDir : '';
        $returnValue .= $this->getDirectory();
        $returnValue .= $showFilename ? $this->getFilename() : '';
        
        // Remove unnecessary slashes
        $returnValue = preg_replace('#/+#', '/', $returnValue);

        // Return path
        return $returnValue;
    }
}
