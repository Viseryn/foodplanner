import { ApiResource } from "@/types/api/ApiResource"
import { Detached } from "@/types/api/Detached"
import { Iri } from "@/types/api/Iri"
import { HttpMethod } from "@/types/HttpMethod"
import { Builder } from "@/types/util/Builder"
import { ApiRequest } from "@/util/ApiRequest"
import { AxiosResponse } from "axios"

export class ApiRequestBuilder<TResponse extends ApiResource, TData = never> implements Builder<ApiRequest<TResponse>> {
    private _requestBody?: TData
    private _customHandler?: (url: Iri<ApiResource>) => Promise<AxiosResponse<TResponse>>
    private _ifSuccessfulCallbackFn?: (() => void) | ((responseData: TResponse) => void)

    private constructor(
        private readonly httpMethod: HttpMethod,
        private readonly url: Iri<ApiResource>,
    ) {
    }

    public static get<TResponse extends ApiResource>(url: Iri<ApiResource>): ApiRequestBuilder<TResponse> {
        return new ApiRequestBuilder("GET", url)
    }

    public static post<TResponse extends ApiResource = never>(url: Iri<ApiResource>): ApiRequestBuilder<TResponse, Detached<TResponse>> {
        return new ApiRequestBuilder("POST", url)
    }

    public static put<TResponse extends ApiResource = never>(url: Iri<ApiResource>): ApiRequestBuilder<TResponse, Detached<TResponse>> {
        return new ApiRequestBuilder("PUT", url)
    }

    public static patch<TResponse extends ApiResource = never>(url: Iri<ApiResource>): ApiRequestBuilder<TResponse, Partial<Detached<TResponse>>> {
        return new ApiRequestBuilder("PATCH", url)
    }

    public static delete<TResponse extends ApiResource, TData = never>(url: Iri<ApiResource>): ApiRequestBuilder<TResponse, TData> {
        return new ApiRequestBuilder("DELETE", url)
    }

    public requestBody(requestBody: TData): ApiRequestBuilder<TResponse, TData> {
        this._requestBody = requestBody
        return this
    }

    public customHandler(callbackFn: (url: Iri<ApiResource>) => Promise<AxiosResponse<TResponse>>): ApiRequestBuilder<TResponse, TData> {
        this._customHandler = callbackFn
        return this
    }

    public ifSuccessful(callbackFn: (() => void) | ((responseData: TResponse) => void)): ApiRequestBuilder<TResponse, TData> {
        this._ifSuccessfulCallbackFn = callbackFn
        return this
    }

    public build(): ApiRequest<TResponse> {
        return new ApiRequest<TResponse>(
            this.httpMethod,
            this.url,
            this._requestBody,
            this._ifSuccessfulCallbackFn,
            this._customHandler,
        )
    }

    public clear(): ApiRequestBuilder<TResponse, TData> {
        return new ApiRequestBuilder<TResponse, TData>(this.httpMethod, this.url)
    }

    /**
     * Builds and executes the `ApiRequest` asynchronously.
     */
    public async execute(): Promise<boolean> {
        return await this.build().execute()
    }
}
