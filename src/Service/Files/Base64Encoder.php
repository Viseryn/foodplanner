<?php namespace App\Service\Files;

trait Base64Encoder {
    public function encodeBase64($data): string {
        return base64_encode($data);
    }
}