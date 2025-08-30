<?php namespace App\Service\Files;

trait Base64Decoder {
    public function decodeBase64(string $fileBase64): string|false {
        return base64_decode($fileBase64);
    }
}
