<?php namespace App\Entity;

enum Role: string {
    /**
     * The standard role. Every user has this role, regardless of being active or not.
     * The anonymous user does NOT have this role.
     */
    case USER = "ROLE_USER";

    /**
     * Only users with this role may use the app.
     */
    case ADMIN = "ROLE_ADMIN";

    /**
     * Users with this role can use the UserAdministration; i.e., changing other users' roles, user data, ...
     */
    case USER_ADMINISTRATION = "ROLE_USER_ADMINISTRATION";

    /**
     * @param string[] $roles
     * @return Role[]
     */
    public static function mapToRoles(array $roles): array {
        return array_map(fn (string $role) => Role::from($role), array_unique($roles));
    }

    /**
     * @param Role[] $roles
     * @return string[]
     */
    public static function mapToStrings(array $roles): array {
        return array_unique(array_map(fn (Role $role) => $role->value, $roles));
    }
}
