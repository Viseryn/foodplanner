import { ApiResource } from "@/types/api/ApiResource"

/**
 * This type mirrors the ApiResource `Role`.
 *
 * @see api/src/ApiResource/Role.php
 */
export type Role = ApiResource & {
    "@type": "Role"
    value: string
}
