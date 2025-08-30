import { ApiResource } from "@/types/api/ApiResource"

export const toIri = (apiResource: ApiResource) => apiResource["@id"]
