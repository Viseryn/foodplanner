<?php namespace App\Service\Files;

use Symfony\Component\String\Slugger\AsciiSlugger;
use Symfony\Component\String\Slugger\SluggerInterface;

trait SafeFilenameCreator
{
    private SluggerInterface $slugger;

    public function __construct()
    {
        $this->slugger = new AsciiSlugger;
    }

    public function getSafeFilenameOf(string $filename): string
    {
        $safeFilename = $this->slugger->slug($filename);
        $extension = explode('-', $safeFilename);
        $extension = end($extension);

        return md5($safeFilename) . '.' . $extension;
    }
}
