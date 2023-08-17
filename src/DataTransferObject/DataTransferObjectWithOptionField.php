<?php namespace App\DataTransferObject;

interface DataTransferObjectWithOptionField extends DataTransferObject
{
    public function getOption(): ?FormOptionFieldDTO;
}
