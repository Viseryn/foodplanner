import { ApiResource } from "@/types/api/ApiResource"

/**
 * This type mirrors the ApiResource `RefreshDataTimestamp`.
 *
 * @see api/src/Entity/RefreshDataTimestamp.php
 */
export type RefreshDataTimestamp = ApiResource & {
    "@type": "RefreshDataTimestamp"
    timestamp: number
}
