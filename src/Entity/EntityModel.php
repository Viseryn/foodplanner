<?php namespace App\Entity;

/**
 * EntityModel
 * 
 * An entity class can implement this interface. If done so, the corresponding util class can 
 * extend the EntityUtil abstract class.
 * 
 * @see App\Service\EntityUtil
 */
interface EntityModel {
    public function getId(): ?int;
}
