<?php namespace App\DataTransferObject;

interface FormOptionFieldDTO extends DataTransferObject
{
    public function getId(): int|string|null;

    public function getLabel(): ?string;
}
