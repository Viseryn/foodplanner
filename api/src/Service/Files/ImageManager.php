<?php

namespace App\Service\Files;

use App\Entity\Image;

interface ImageManager
{
    public function upload(Image $image): ?Image;

    public function remove(Image $image): void;

    public function decodeBase64(string $file): string|false;
}
