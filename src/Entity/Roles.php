<?php namespace App\Entity;

enum Roles: string {
    /**
     * The standard role. Every user has this role, regardless of being active or not.
     * The anonymous user does NOT have this role.
     */
    case ROLE_USER = "ROLE_USER";

    /**
     * Only users with this role may use the app.
     */
    case ROLE_ADMIN = "ROLE_ADMIN";

    /**
     * Users with this role can use the UserAdministration; i.e., changing other users' roles, user data, ...
     */
    case ROLE_USER_ADMINISTRATION = "ROLE_USER_ADMINISTRATION";
}
