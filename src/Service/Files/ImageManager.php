<?php namespace App\Service\Files;

use App\DataTransferObject\ImageDTO;
use App\Entity\Image;

interface ImageManager
{
    public function upload(ImageDTO $imageDto): ?Image;

    public function remove(Image $image): void;

    public function decodeBase64(string $file): string|false;
}
