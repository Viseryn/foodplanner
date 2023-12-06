<?php namespace App\Component\Response;

use App\Component\Exception\ValidationFailedException;
use Symfony\Component\HttpFoundation\Response;

final class ExceptionResponseFactory
{
    public static function getValidationFailedExceptionResponse(ValidationFailedException $e): Response {
        return new Response("Validation failed: " . $e->getMessage(), 400);
    }
}
