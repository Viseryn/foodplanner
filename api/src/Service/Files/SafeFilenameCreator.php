<?php namespace App\Service\Files;

trait SafeFilenameCreator {
    public function getSafeFilenameOf(string $filename): string {
        $safeFilename = $this->slugger->slug($filename);
        $extension = explode('-', $safeFilename);
        $extension = end($extension);

        return md5($safeFilename . time()) . '.' . $extension;
    }
}
