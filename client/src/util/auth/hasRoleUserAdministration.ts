import { Authentication } from "@/types/Authentication"

export const hasRoleUserAdministration = (authentication: Authentication): boolean =>
    authentication.roles.includes("ROLE_USER_ADMINISTRATION")
