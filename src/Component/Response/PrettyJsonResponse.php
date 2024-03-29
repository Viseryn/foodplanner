<?php namespace App\Component\Response;

use Symfony\Component\HttpFoundation\JsonResponse;

class PrettyJsonResponse extends JsonResponse
{
    protected $encodingOptions = parent::DEFAULT_ENCODING_OPTIONS | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE;
}
