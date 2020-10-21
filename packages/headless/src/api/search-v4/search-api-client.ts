// @ts-nocheck
import {PlatformClient, PlatformResponse, platformUrl} from '../platform-client';
import {Search, SearchResponseSuccess} from "../search/search/search-response";
import {SearchRequest} from "../search/search/search-request";
import {SearchAPIErrorWithExceptionInBody, SearchAPIErrorWithStatusCode} from "../search/search-api-error-response";
import {searchRequest} from "./search/search-request";
import {searchResponse} from "./search/search-response";
import {Configuration, SearchV4Api} from "@coveo/sapi-client";
import {Plan, PlanResponseSuccess} from "../search/plan/plan-response";
import {QuerySuggest, QuerySuggestSuccessResponse} from "../search/query-suggest/query-suggest-response";
import {QuerySuggestRequest} from "../search/query-suggest/query-suggest-request";
import {PlanRequest} from "../search/plan/plan-request";
import {FacetSearchRequest} from "../search/facet-search/facet-search-request";
import {CategoryFacetSearchRequest} from "../search/facet-search/category-facet-search/category-facet-search-request";
import {RecommendationRequest} from "../search/recommendation/recommendation-request";
import {ProductRecommendationsRequest} from "../search/product-recommendations/product-recommendations-request";

export type AllSearchAPIResponse = Plan | Search | QuerySuggest;


export interface SearchAPIClientOptions<RequestParams> {
    accessToken: string;
    apiBaseUrl: string;
    requestParams: RequestParams;
}

export type SearchAPIClientResponse<T> =
    | { success: T }
    | { error: SearchAPIErrorWithStatusCode };

export class SearchAPIClientV4 {
    // @ts-ignore
    constructor(private renewAccessToken: () => Promise<string>) {
    }

    async plan(
        req: PlanRequest
    ): Promise<SearchAPIClientResponse<PlanResponseSuccess>> {
        // return this.clientV2.plan(req);
    }

    async querySuggest(
        req: QuerySuggestRequest
      ): Promise<SearchAPIClientResponse<QuerySuggestSuccessResponse>> {
        // return this.clientV2.querySuggest(req);
      }

    async search(
        req: SearchRequest
    ): Promise<SearchAPIClientResponse<SearchResponseSuccess>> {
        const client = new SearchV4Api(new Configuration({
            basePath: platformUrl({environment: "dev"}),
            // basePath: "http://localhost:8100",
            accessToken: "Bearer " + req.accessToken
        }));
        try {
            const response = await client.restSearchV4Post({
                //  renewAccessToken: this.renewAccessToken,
                organizationId: req.organizationId,
                searchRequest: searchRequest(req)
            });
            return {
                success: searchResponse(response)
            };
        } catch (e) {
            return {
                error: unwrapError(e)
            };
        }
    }

    async facetSearch(req: FacetSearchRequest | CategoryFacetSearchRequest) {
       // return this.clientV2.facetSearch(req);
    }

    async recommendations(req: RecommendationRequest) {
        //  return this.clientV2.recommendations(req);
    }

    async productRecommendations(req: ProductRecommendationsRequest) {
        // return this.clientV2.productRecommendations(req);
    }
}

const unwrapError = (res: PlatformResponse<AllSearchAPIResponse>) => {
    if (isException(res)) {
        return unwrapByBodyException(res);
    }
    if (isError(res)) {
        return unwrapByStatusCode(res);
    }

    return {message: 'unknown', statusCode: 0, type: 'unknown'};
};

const unwrapByBodyException = (
    res: PlatformResponse<SearchAPIErrorWithExceptionInBody>
) => ({
    message: res.body.exception.code,
    statusCode: res.response.status,
    type: res.body.exception.code,
});

const unwrapByStatusCode = (
    res: PlatformResponse<SearchAPIErrorWithStatusCode>
) => ({
    message: res.body.message,
    statusCode: res.body.statusCode,
    type: res.body.type,
});


export const isSuccessResponse = <T>(
    r: SearchAPIClientResponse<T>
): r is { success: T } => {
    return (r as { success: T }).success !== undefined;
};

export const isErrorResponse = <T>(
    r: SearchAPIClientResponse<T>
): r is { error: SearchAPIErrorWithStatusCode } => {
    return (r as { error: SearchAPIErrorWithStatusCode }).error !== undefined;
};

function isError(
    r: PlatformResponse<AllSearchAPIResponse>
): r is PlatformResponse<SearchAPIErrorWithStatusCode> {
    return (
        (r as PlatformResponse<SearchAPIErrorWithStatusCode>).body.statusCode !==
        undefined
    );
}

function isException(
    r: PlatformResponse<AllSearchAPIResponse>
): r is PlatformResponse<SearchAPIErrorWithExceptionInBody> {
    return (
        (r as PlatformResponse<SearchAPIErrorWithExceptionInBody>).body
            .exception !== undefined
    );
}