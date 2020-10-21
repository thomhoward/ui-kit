/* tslint:disable */
/* eslint-disable */
/**
 * Search API
 * Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.
 *
 * The version of the OpenAPI document: 0.0.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import {
    InlineResponse200,
    ProblemDetails,
    SearchRequest,
} from '../models';

export interface RestSearchV4PostRequest {
    organizationId?: string;
    searchRequest?: SearchRequest;
}

/**
 * 
 */
export class SearchV4Api extends runtime.BaseAPI {

    /**
     * See [Performing a Query](https://docs.coveo.com/en/1445/).
     * Send search request
     */
    async restSearchV4PostRaw(requestParameters: RestSearchV4PostRequest): Promise<runtime.ApiResponse<InlineResponse200>> {
        const queryParameters: any = {};

        if (requestParameters.organizationId !== undefined) {
            queryParameters['organizationId'] = requestParameters.organizationId;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            if (typeof this.configuration.accessToken === 'function') {
                headerParameters["Authorization"] = this.configuration.accessToken("oAuth", ["full"]);
            } else {
                headerParameters["Authorization"] = this.configuration.accessToken;
            }
        }

        const response = await this.request({
            path: `/rest/search/v4`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,

            body: requestParameters.searchRequest,
        });

        return new runtime.JSONApiResponse(response);
    }

    /**
     * See [Performing a Query](https://docs.coveo.com/en/1445/).
     * Send search request
     */
    async restSearchV4Post(requestParameters: RestSearchV4PostRequest): Promise<InlineResponse200> {
        const response = await this.restSearchV4PostRaw(requestParameters);
        return await response.value();
    }

}
