<?php namespace App\Service\Files;

trait DirectoryParser
{
    // TODO [Issue #136]: When switching to PHP 8.2, these can be made constants.
    private static string $PUBLIC_UPLOAD_DIR = '/public/';
    private static string $PRIVATE_UPLOAD_DIR = '/data/upload/';

    public function parseDirectory(string $directory): string
    {
        return preg_replace('#/+#', '/', '/' . $directory . '/');
    }

    public function getUploadDirectory(string $root, string $directory, bool $isPublic): string
    {
        return $root . $this->parseDirectory(
            ($isPublic ? self::$PUBLIC_UPLOAD_DIR : self::$PRIVATE_UPLOAD_DIR) . $directory
        );
    }
}
