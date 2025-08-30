import { ApiResource } from "@/types/api/ApiResource"
import { Detached } from "@/types/api/Detached"
import { Iri } from "@/types/api/Iri"
import { HttpMethod } from "@/types/HttpMethod"
import { Maybe } from "@/types/Maybe"
import { apiClient } from "@/util/apiClient"
import { ApiRequestBuilder } from "@/util/ApiRequestBuilder"
import axios, { AxiosError, AxiosResponse } from "axios"
import swal from "sweetalert"

export class ApiRequest<TResponse extends ApiResource> {
    private _responseData?: TResponse
    private _executed: boolean = false
    private _successful?: boolean
    private _error?: AxiosError

    public constructor(
        private readonly httpMethod: HttpMethod,
        private readonly url: Iri<ApiResource>,
        private readonly requestBody?: unknown,
        private readonly ifSuccessfulCallbackFn?: (() => void) | ((responseData: TResponse) => void),
        private readonly customHandler?: (url: Iri<ApiResource>) => Promise<AxiosResponse<TResponse>>,
    ) {
    }

    /**
     * Returns a typesafe `ApiRequestBuilder<TResponse, never>` for `GET` requests.
     */
    public static get<TResponse extends ApiResource>(url: Iri<ApiResource>): ApiRequestBuilder<TResponse> {
        return ApiRequestBuilder.get(url)
    }

    /**
     * Returns a typesafe `ApiRequestBuilder<TResponse, Detached<TResponse>>` for `POST` requests.
     */
    public static post<TResponse extends ApiResource = never>(url: Iri<ApiResource>, requestBody?: Detached<TResponse>): ApiRequestBuilder<TResponse, Detached<TResponse>> {
        const builder: ApiRequestBuilder<TResponse, Detached<TResponse>> = ApiRequestBuilder.post(url)

        if (requestBody) {
            return builder.requestBody(requestBody)
        }

        return builder
    }

    /**
     * Returns a typesafe `ApiRequestBuilder<TResponse, Detached<TResponse>>` for `PUT` requests.
     */
    public static put<TResponse extends ApiResource = never>(url: Iri<ApiResource>, requestBody?: Detached<TResponse>): ApiRequestBuilder<TResponse, Detached<TResponse>> {
        const builder: ApiRequestBuilder<TResponse, Detached<TResponse>> = ApiRequestBuilder.put(url)

        if (requestBody) {
            return builder.requestBody(requestBody)
        }

        return builder
    }

    /**
     * Returns a typesafe `ApiRequestBuilder<TResponse, Partial<Detached<TResponse>>>` for `PATCH` requests.
     */
    public static patch<TResponse extends ApiResource = never>(url: Iri<ApiResource>, requestBody?: Partial<Detached<TResponse>>): ApiRequestBuilder<TResponse, Partial<Detached<TResponse>>> {
        const builder: ApiRequestBuilder<TResponse, Partial<Detached<TResponse>>> = ApiRequestBuilder.patch(url)

        if (requestBody) {
            return builder.requestBody(requestBody)
        }

        return builder
    }

    /**
     * Returns a typesafe `ApiRequestBuilder<TResponse, never>` for `DELETE` requests.
     */
    public static delete<TResponse extends ApiResource>(url: Iri<ApiResource>): ApiRequestBuilder<TResponse> {
        return ApiRequestBuilder.delete(url)
    }

    /**
     * Executes the configured `ApiRequest`, using the default request handlers depending on `this.httpMethod`,
     * or using `this.customHandler` if defined. If the request was successful and a `ifSuccessful` handler
     * is defined, it will be executed as well with the response data as possible argument (or no arguments).
     *
     * @returns Returns `true` if the request execution was successful, `false` otherwise.
     */
    public async execute(): Promise<boolean> {
        this._executed = true

        if (this.customHandler) {
            await this.handleRequest(this.customHandler)
        } else {
            await this.defaultHandler()
        }

        if (this._successful) {
            if (this.ifSuccessfulCallbackFn !== undefined) {
                // this._respondeData may be undefined (e.g. for DELETE requests that respond with "204 No Content").
                // That's why the type is asserted here. If it is really undefined, then this method should not have been used for this specific REST endpoint.
                this.ifSuccessfulCallbackFn(this._responseData!)
            }

            return true
        } else {
            return false
        }
    }

    /**
     * Returns the response data of the `ApiRequest`. If the `ApiRequest` has not been executed yet,
     * it will be executed by using the `execute()` method.
     */
    public async getResponse(): Promise<Maybe<TResponse>> {
        if (!this._executed) {
            await this.execute()
        }

        if (this._successful) {
            return this._responseData
        } else {
            this.showErrorMessage(this._error)
        }

        return undefined
    }

    private async defaultHandler(): Promise<void> {
        switch (this.httpMethod) {
            case "GET":
                await this.handleRequest(url => apiClient.get(url))
                break
            case "POST":
                await this.handleRequest(url => apiClient.post(url, this.requestBody))
                break
            case "PUT":
                await this.handleRequest(url => apiClient.put(url, this.requestBody))
                break
            case "PATCH":
                await this.handleRequest(url => apiClient.patch(url, this.requestBody))
                break
            case "DELETE":
                await this.handleRequest(url => apiClient.delete(url))
                break
            default:
                throw Error("Unsupported operation.")
        }
    }

    private async handleRequest(handler: (url: Iri<ApiResource>) => Promise<AxiosResponse<TResponse>>): Promise<boolean> {
        try {
            const response: AxiosResponse<TResponse> = await handler(this.url)

            this._responseData = response.data
            this._successful = true
        } catch (error) {
            this._successful = false

            if (axios.isAxiosError(error)) {
                this._error = error
                this.showErrorMessage(this._error)
            }
        }

        return this._successful
    }

    private showErrorMessage(error?: AxiosError): void {
        if (error) {
            void swal({
                dangerMode: true,
                icon: "error",
                title: error.message,
                text: `[ERROR] (${this.httpMethod} ${this.url}): ${error.code}`,
            })
        } else {
            void swal({
                dangerMode: true,
                icon: "error",
                title: "Unknown error",
                text: "An unknown error occurred while fetching the response data.",
            })
        }
    }
}
