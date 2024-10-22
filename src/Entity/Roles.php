<?php namespace App\Entity;

enum Roles: string {
    case ROLE_USER = "ROLE_USER";
    case ROLE_ADMIN = "ROLE_ADMIN";
}
