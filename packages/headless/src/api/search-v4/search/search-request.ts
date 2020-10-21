import * as rest from "@coveo/sapi-client";
import {SearchRequest} from "../../search/search/search-request";

export const searchRequest = (req: SearchRequest): rest.SearchRequest => {
    console.log(req.fieldsToInclude);
    return {
        ...req.q && {
            query: {
                kind: "structured",
                expression: {
                    kind: "querySyntax",
                    value: req.q
                }
            }
        },

        advancedFilters: {
            ...(req.aq && {
                queryFilter: {
                    kind: "querySyntax",
                    value: req.aq
                },
            }),
            ...(req.cq && {
                cachedFilter: {
                    kind: "querySyntax",
                    value: req.cq
                }
            })
        },
        pagination: {
            limit: req.numberOfResults,
            offset: req.firstResult
        },
        ...(req.sortCriteria && {
            sort: getSortCriteria(req.sortCriteria),
        }),
        // facets: getFacets(state),
        analytics: {
            userContext: req.context? Object(req.context) : undefined,
            origins: {
                searchHub: req.searchHub
            }
        },
         didYouMean: {
             enabled: req.enableDidYouMean
         },
        toInclude: {
            fields: req.fieldsToInclude,
            summary: true,
            excerpt: true
        },
        /*
            ...(state.configuration.analytics.enabled && {
              visitorId: configureAnalytics(state).coveoAnalyticsClient
                .currentVisitorId,
            }),*/
    };
};

/*function getFacets(state: SearchPageState) {
    return [
        ...getFacetRequests(state.facetSet),
        ...getFacetRequests(state.numericFacetSet),
        ...getFacetRequests(state.dateFacetSet),
        ...getFacetRequests(state.categoryFacetSet),
    ];
}*/

/*
function getFacetRequests(requests: Record<string, AnyFacetRequest>) {
    return Object.keys(requests).map((id) => requests[id]);
}
*/

function getSortCriteria(sortCriteria: string): rest.SortCriteria {
    if (sortCriteria === "relevancy") {
        return {by: "relevance"};
    } else {
        const perFieldSort = sortCriteria.split(",");
        return {
            by: "fields",
            fields: perFieldSort.map(fieldSort => {
                // Either `@field` or `@field direction`
                const splitSortStatements = fieldSort.split(" ");
                const name = sanitizeFieldName(splitSortStatements[0]);

                if (splitSortStatements.length === 1) {
                    return {name} as rest.SortCriteriaField;
                } else {
                    return {
                        name,
                        direction: splitSortStatements[1] === "ascending" ? rest.SortCriteriaFieldDirectionEnum.Asc : rest.SortCriteriaFieldDirectionEnum.Desc
                    } as rest.SortCriteriaField;
                }
            })
        }


    }
}

function sanitizeFieldName(fieldName: string) {
    if (fieldName.startsWith("@")) {
        return fieldName.substring(1);
    }
    return fieldName;
}