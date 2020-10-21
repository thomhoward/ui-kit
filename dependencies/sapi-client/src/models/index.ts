
/**
 * Additional query expressions that can be combined with the user query to provide more tailored results.
 * Only the structured search syntax is supported here.
 * 
 * Here's how they are combined:
 * 
 * `(((query AND userQueryFilter) OR alternativeQuery) AND cachedFilter)`
 * @export
 * @interface AdvancedFilters
 */
export interface AdvancedFilters {
    /**
     * 
     * @type {QueryExpression}
     * @memberof AdvancedFilters
     */
    queryFilter?: QueryExpression;
    /**
     * 
     * @type {QueryExpression}
     * @memberof AdvancedFilters
     */
    alternativeQuery?: QueryExpression;
    /**
     * 
     * @type {QueryExpression}
     * @memberof AdvancedFilters
     */
    cachedFilter?: QueryExpression;
}



/**
 * Define the configuration of a generated field to retrieve.
 * @export
 * @interface AdvancedGeneratedQueryFieldParameter
 */
export interface AdvancedGeneratedQueryFieldParameter {
    /**
     * The maximum length of the value to generate.
     * @type {number}
     * @memberof AdvancedGeneratedQueryFieldParameter
     */
    length?: number;
    /**
     * 
     * @type {HighlightingSettings}
     * @memberof AdvancedGeneratedQueryFieldParameter
     */
    highlighting?: HighlightingSettings;
}



/**
 * 
 * @export
 * @interface AdvancedPagination
 */
export interface AdvancedPagination {
    /**
     * From the result sets, get the results starting from the offset position.
     * @type {number}
     * @memberof AdvancedPagination
     */
    offset?: number;
    /**
     * The maximum number of values to be returned starting from the offset.
     * @type {number}
     * @memberof AdvancedPagination
     */
    limit?: number;
}



/**
 * 
 * @export
 * @interface AdvancedQueryFieldParameters
 */
export interface AdvancedQueryFieldParameters {
    /**
     * The name of the field to include
     * @type {string}
     * @memberof AdvancedQueryFieldParameters
     */
    name: string;
    /**
     * 
     * @type {HighlightingSettings}
     * @memberof AdvancedQueryFieldParameters
     */
    highlighting?: HighlightingSettings;
}



/**
 * 
 * @export
 * @interface AndExpression
 */
export interface AndExpression {
    /**
     * 
     * @type {string}
     * @memberof AndExpression
     */
    kind: string;
    /**
     * 
     * @type {Array<QueryExpression>}
     * @memberof AndExpression
     */
    expressions: Array<QueryExpression>;
}



/**
 * Parameters related to the context of the operation.
 * @export
 * @interface BaseContextParameters
 */
export interface BaseContextParameters {
    /**
     * 
     * @type {OriginLevels}
     * @memberof BaseContextParameters
     */
    origins?: OriginLevels;
    /**
     * The custom context information to send along with the request. Must be a dictionary of key-value pairs (JSON) where each key is a string, and each value is either a string or an array of strings.
     * @type {{ [key: string]: object; }}
     * @memberof BaseContextParameters
     */
    userContext?: { [key: string]: object; };
}



/**
 * 
 * @export
 * @interface BaseError
 */
export interface BaseError {
    /**
     * A human-readable explanation specific to this occurrence of the problem.
     * @type {string}
     * @memberof BaseError
     */
    detail?: string;
}



/**
 * 
 * @export
 * @interface BaseWarning
 */
export interface BaseWarning {
    /**
     * A human-readable explanation specific to this occurrence of the problem.
     * @type {string}
     * @memberof BaseWarning
     */
    detail?: string;
}



/**
 * 
 * @export
 * @interface BinaryFieldExpression
 */
export interface BinaryFieldExpression {
    /**
     * 
     * @type {string}
     * @memberof BinaryFieldExpression
     */
    kind: string;
    /**
     * 
     * @type {string}
     * @memberof BinaryFieldExpression
     */
    fieldName: string;
    /**
     * 
     * @type {FieldOperator}
     * @memberof BinaryFieldExpression
     */
    operator: FieldOperator;
    /**
     * 
     * @type {FieldValue}
     * @memberof BinaryFieldExpression
     */
    value: FieldValue;
}



/**
 * The Problem Details JSON Object [[RFC7807](https://tools.ietf.org/html/rfc7807)].
 * @export
 * @interface BlankProblems
 */
export interface BlankProblems {
    /**
     * The HTTP status code.
     * @type {number}
     * @memberof BlankProblems
     */
    status?: number;
    /**
     * A short, human-readable summary of the problem type. It SHOULD NOT change from occurrence to occurrence of the problem, except for purposes of localization.
     * @type {string}
     * @memberof BlankProblems
     */
    title?: string;
}



/**
 * 
 * @export
 * @interface DateRangeValue
 */
export interface DateRangeValue {
    /**
     * 
     * @type {string}
     * @memberof DateRangeValue
     */
    kind: string;
    /**
     * 
     * @type {DateRangeValueDateRange}
     * @memberof DateRangeValue
     */
    dateRange: DateRangeValueDateRange;
}



/**
 * 
 * @export
 * @interface DateRangeValueDateRange
 */
export interface DateRangeValueDateRange {
    /**
     * 
     * @type {string}
     * @memberof DateRangeValueDateRange
     */
    from: string;
    /**
     * 
     * @type {string}
     * @memberof DateRangeValueDateRange
     */
    to: string;
}



/**
 * 
 * @export
 * @interface DateValue
 */
export interface DateValue {
    /**
     * 
     * @type {string}
     * @memberof DateValue
     */
    kind: string;
    /**
     * 
     * @type {string}
     * @memberof DateValue
     */
    dateValue: string;
}



/**
 * 
 * @export
 * @interface ExactMatchExpression
 */
export interface ExactMatchExpression {
    /**
     * 
     * @type {string}
     * @memberof ExactMatchExpression
     */
    kind: string;
    /**
     * 
     * @type {string}
     * @memberof ExactMatchExpression
     */
    value: string;
}



/**
 * 
 * @export
 * @interface ExtendedProblems
 */
export interface ExtendedProblems {
    /**
     * A URI reference [[RFC3986](https://tools.ietf.org/html/rfc3986)] that identifies the problem type. It should provide human-readable documentation for the problem type. When this member is not present, its value is assumed to be "about:blank".
     * @type {string}
     * @memberof ExtendedProblems
     */
    type?: string;
    /**
     * A human-readable explanation specific to this occurrence of the problem.
     * @type {string}
     * @memberof ExtendedProblems
     */
    detail?: string;
    /**
     * A URI reference [[RFC3986](https://tools.ietf.org/html/rfc3986)] that identifies the specific occurrence of the problem. It may or may not yield further information if dereferenced.
     * @type {string}
     * @memberof ExtendedProblems
     */
    instance?: string;
}



/**
 * 
 * @export
 * @interface FacetOptions
 */
export interface FacetOptions {
    /**
     * Whether to take the scores generated by the index into account when reordering facets.
     * 
     * **Note:** Setting this to `false` implies that only the scores generated by a Coveo ML DNE model will be taken into account when automatically reordering facets. To disable automatic facet reordering entirely, set `freezeFacetOrder` to `true` instead.
     * @type {boolean}
     * @memberof FacetOptions
     */
    enableIndexFacetOrdering?: boolean;
    /**
     * Whether facets should be returned in the same order they were requested.
     * 
     * **Note:** Setting this to `true` entirely prevents automatic score-based facet reordering. To allow automatic facet reordering, but only take into account the scores generated by a Coveo ML DNE model, set `enableIndexFacetOrdering` to `false` instead.
     * @type {boolean}
     * @memberof FacetOptions
     */
    freezeFacetOrder?: boolean;
}



/**
 * 
 * @export
 * @interface FacetRequest
 */
export interface FacetRequest {
    /**
     * The base path shared by all values for the facet.
     * 
     * **Note:** This parameter has no effect unless the facet `type` is `hierarchical`.
     * @type {Array<string>}
     * @memberof FacetRequest
     */
    basePath?: Array<string>;
    /**
     * The values displayed by the facet in the search interface at the moment of the request.
     * @type {Array<FacetValue>}
     * @memberof FacetRequest
     */
    currentValues?: Array<FacetValue>;
    /**
     * A custom order by which to sort the facet values.
     * @type {Array<string>}
     * @memberof FacetRequest
     */
    customOrder?: Array<string>;
    /**
     * The character to use to split field values into a hierarchical sequence.
     * 
     * **Example**:
     * 
     * For a multi-value field containing the following values:
     * 
     * `c; c>folder2; c>folder2>folder3;`
     * 
     * The delimiting character is `>`.
     * 
     * For a hierarchical field containing the following values:
     * `c;folder2;folder3;`
     * 
     * The delimiting character is `;`.
     * @type {string}
     * @memberof FacetRequest
     */
    delimitingCharacter?: string;
    /**
     * The unique identifier of the facet in the search interface.
     * 
     * **Note:** Must match `^[A-Za-z0-9-_]{1,60}$.
     * @type {string}
     * @memberof FacetRequest
     */
    facetId?: string;
    /**
     * The name of the field on which to base the facet request.
     * 
     * **Note:** Must reference a field whose **Facet** option is enabled (see [Add or Edit Fields](https://docs.coveo.com/en/1982)).
     * @type {string}
     * @memberof FacetRequest
     */
    field: string;
    /**
     * Whether to use `basePath` as a filter for the results.
     * 
     * **Note:** This parameter has no effect unless the facet `type` is `hierarchical`.
     * @type {boolean}
     * @memberof FacetRequest
     */
    filterByBasePath?: boolean;
    /**
     * Whether to exclude folded result parents when estimating the result count for each facet value.
     * @type {boolean}
     * @memberof FacetRequest
     */
    filterFacetCount?: boolean;
    /**
     * Whether to include the facet request's `currentValues` in corresponding facet response's `values` array.
     * 
     * **Notes:**
     * - Setting this to `true` is useful to ensure that the facet does not move around while the end-user is interacting with it in the search interface.
     * - This parameter has no effect when the facet `type` is `hierarchical`.
     * @type {boolean}
     * @memberof FacetRequest
     */
    freezeCurrentValues?: boolean;
    /**
     * Whether to automatically generate range values for this facet.
     * 
     * **Notes:**
     * - Setting this to `true` is only effective when `type` is set to `dateRange` or `numericRange`, and the referenced `field` is of a corresponding type (i.e., date or numeric).
     * - Automatic range generation will fail if the referenced `field` is dynamically generated by a query function.
     * - Enabling the **Use cache for numeric queries** option on the referenced `field` will speed up automatic range generation (see [Add or Edit Fields](https://docs.coveo.com/en/1982/)).
     * - `currentValues` cannot be passed when this field is set to true.
     * @type {boolean}
     * @memberof FacetRequest
     */
    generateAutomaticRanges?: boolean;
    /**
     * Whether the facet is expanded in the search interface at the moment of the request.
     * @type {boolean}
     * @memberof FacetRequest
     */
    isFieldExpanded?: boolean;
    /**
     * 
     * @type {string}
     * @memberof FacetRequest
     */
    mlDebugTitle?: string;
    /**
     * The maximum number of facet values to fetch.
     * 
     * **Notes:**
     * - If `freezeCurrentValues` is `true` or if requesting range facet values, `numberOfValues` is automatically set to the `currentValues` array length.
     * - When requesting hierarchical facet values, `numberOfValues` is only taken account when the `currentValues` array is empty (i.e., when retrieving the first level of values).
     * @type {number}
     * @memberof FacetRequest
     */
    numberOfValues?: number;
    /**
     * Whether to prevent Coveo ML from automatically selecting values.
     * @type {boolean}
     * @memberof FacetRequest
     */
    preventAutoSelect?: boolean;
    /**
     * The sort criterion to apply to the returned facet values.
     * 
     * **Allowed values**:
     * 
     * - `score`: Sort values in descending score order. On a Coveo index, facet value scores are based on number of occurrences and position in the ranked query result set. On an Elasticsearch index, score values are based on number of occurrences only.
     * - `alphanumeric`: Sort values in ascending alphanumeric order.
     * - `ascending`: Sort in ascending order of range facet values. Only applicable to range facets.
     * - `descending`: Sort in descending order of range facet values. Only applicable to range facets.
     * - `occurrences`: Sort by number of occurrences, with field values having the highest number of occurrences appearing first. Only applicable to hierarchical facets
     * 
     * **Notes:**
     * - The Coveo ML DNE feature only works with the `score` sort criterion.
     * 
     * By default:
     * Specific facets:
     * - When `isFieldExpanded` is `false` in the facet request, and `moreValuesAvailable` is `true` in the corresponding facet response, use `score`
     * - Otherwise, use `alphanumeric`.
     * 
     * Range facets: uses `ascending`
     * Hierarchical facets: uses `occurrences`
     * @type {string}
     * @memberof FacetRequest
     */
    sortCriteria?: FacetRequestSortCriteriaEnum;
    /**
     * The kind of values to request for the facet.
     * 
     * **Allowed values:**
     * - `specific`: Request facet values representing specific values (e.g., Alice Smith, Bob Jones, etc.).
     * - `dateRange`: Request facet values representing ranges of dates (e.g., 2019-07-01..2019-07-31, 2019-08-01..2019-08-01, etc.).
     * - `numericalRange`: Request facet values representing ranges of numbers (e.g., 0..10, 11..20, etc.).
     * - `hierarchical`: Request facet values representing hierarchically structured categories (e.g., Electronics > Entertainment > Gaming Consoles;, Electronics > Computers > Laptops, etc.).
     * @type {string}
     * @memberof FacetRequest
     */
    type?: FacetRequestTypeEnum;
}

            /**
            * @export
            * @enum {string}
            */
            export enum FacetRequestSortCriteriaEnum {
                    Score = 'score',
                    Alphanumeric = 'alphanumeric',
                    Ascending = 'ascending',
                    Descending = 'descending',
                    Occurrences = 'occurrences'
            }
            /**
            * @export
            * @enum {string}
            */
            export enum FacetRequestTypeEnum {
                    Specific = 'specific',
                    DateRange = 'dateRange',
                    NumericalRange = 'numericalRange',
                    Hierarchical = 'hierarchical'
            }



/**
 * 
 * @export
 * @interface FacetResponse
 */
export interface FacetResponse {
    /**
     * 
     * @type {Array<FacetResultValue>}
     * @memberof FacetResponse
     */
    results?: Array<FacetResultValue>;
    /**
     * A DNE facet suggestion
     * @type {Array<SuggestedFacet>}
     * @memberof FacetResponse
     */
    suggestions?: Array<SuggestedFacet>;
}



/**
 * 
 * @export
 * @interface FacetResultValue
 */
export interface FacetResultValue {
    /**
     * The children of this hierarchical facet value.
     * 
     * Each child is a full-fledged hierarchical facet value that may in turn have its own children and so forth, up to a maximum depth of 50 levels.
     * @type {Array<HierarchicalFacetResponseValue>}
     * @memberof FacetResultValue
     */
    children?: Array<HierarchicalFacetResponseValue>;
    /**
     * The value to end the range at. Must be greater (or later) than the `start` value.
     * 
     * **Note:** Timezone of date ranges are determined by the timezone parameter of the search request.
     * 
     * **Examples:**
     * - `100`
     * - `2019/12/31@23:59:59`
     * @type {string}
     * @memberof FacetResultValue
     */
    end?: string;
    /**
     * Whether to include the `end` value in the range.
     * 
     * **Note:** In an Elasticsearch index, this parameter cannot be set to `true`.
     * @type {boolean}
     * @memberof FacetResultValue
     */
    endInclusive?: boolean;
    /**
     * Whether the facet value was automatically selected by Coveo ML.
     * @type {boolean}
     * @memberof FacetResultValue
     */
    isAutoSelected?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof FacetResultValue
     */
    isSuggested?: boolean;
    /**
     * Whether additional values are available for the facet.
     * @type {boolean}
     * @memberof FacetResultValue
     */
    moreValuesAvailable?: boolean;
    /**
     * The number of query results that can be expected if the facet value is selected in the search interface.
     * 
     * **Note:** This property only gets populated when the facet currently has no selected or excluded values.
     * @type {number}
     * @memberof FacetResultValue
     */
    numberOfResults: number;
    /**
     * 
     * @type {Array<string>}
     * @memberof FacetResultValue
     */
    path?: Array<string>;
    /**
     * The value to start the range at.
     * 
     * **Note:** Timezone of date ranges are determined by the timezone parameter of the search request.
     * 
     * **Examples:**
     * - `0`
     * - `2019/01/01@00:00:00`
     * @type {string}
     * @memberof FacetResultValue
     */
    start?: string;
    /**
     * The current facet value state in the search interface.
     * @type {string}
     * @memberof FacetResultValue
     */
    state: FacetResultValueStateEnum;
    /**
     * The facet value name.
     * 
     * **Note:** In the case of a hierarchical facet value, this represents a single path segment.
     * @type {string}
     * @memberof FacetResultValue
     */
    value?: string;
}

            /**
            * @export
            * @enum {string}
            */
            export enum FacetResultValueStateEnum {
                    Idle = 'idle',
                    Selected = 'selected'
            }



/**
 * 
 * @export
 * @interface FacetValue
 */
export interface FacetValue {
    /**
     * The children of this hierarchical facet value.
     * 
     * Each child is a full-fledged hierarchical facet value that may in turn have its own children and so forth, up to a maximum depth of 50 levels.
     * @type {Array<HierarchicalFacetValue>}
     * @memberof FacetValue
     */
    children?: Array<HierarchicalFacetValue>;
    /**
     * The value to end the range at. Must be greater (or later) than the `start` value.
     * 
     * **Note:** Timezone of date ranges are determined by the timezone parameter of the search request.
     * 
     * **Examples:**
     * - `100`
     * - `2019/12/31@23:59:59`
     * @type {string}
     * @memberof FacetValue
     */
    end?: string;
    /**
     * Whether to include the `end` value in the range.
     * 
     * **Note:** In an Elasticsearch index, this parameter cannot be set to `true`.
     * @type {boolean}
     * @memberof FacetValue
     */
    endInclusive?: boolean;
    /**
     * Whether to prevent Coveo ML from automatically selecting the facet value.
     * @type {boolean}
     * @memberof FacetValue
     */
    preventAutoSelect?: boolean;
    /**
     * Whether to retrieve the children of this hierarchical facet value. Can only be used on leaf values.
     * @type {boolean}
     * @memberof FacetValue
     */
    retrieveChildren?: boolean;
    /**
     * The maximum number of children to retrieve for this hierarchical facet value. Ignored if `retrieveChildren` is `false`.
     * @type {number}
     * @memberof FacetValue
     */
    retrieveCount?: number;
    /**
     * The value to start the range at.
     * 
     * **Note:** Timezone of date ranges are determined by the timezone parameter of the search request.
     * 
     * **Examples:**
     * - `0`
     * - `2019/01/01@00:00:00`
     * @type {string}
     * @memberof FacetValue
     */
    start?: string;
    /**
     * The current facet value state in the search interface.
     * @type {string}
     * @memberof FacetValue
     */
    state?: FacetValueStateEnum;
    /**
     * The facet value name.
     * 
     * **Note:** In the case of a hierarchical facet value, this represents a single path segment.
     * @type {string}
     * @memberof FacetValue
     */
    value?: string;
}

            /**
            * @export
            * @enum {string}
            */
            export enum FacetValueStateEnum {
                    Idle = 'idle',
                    Selected = 'selected'
            }



/**
 * 
 * @export
 * @interface FieldExistsExpression
 */
export interface FieldExistsExpression {
    /**
     * 
     * @type {string}
     * @memberof FieldExistsExpression
     */
    kind?: string;
    /**
     * 
     * @type {string}
     * @memberof FieldExistsExpression
     */
    fieldName: string;
}



/**
 * 
 * @export
 * @enum {string}
 */
export enum FieldOperator {
    Contains = 'contains',
    IsExactly = 'isExactly',
    LowerThan = 'lowerThan',
    LowerThanOrEqual = 'lowerThanOrEqual',
    GreaterThan = 'greaterThan',
    GreaterThanOrEqual = 'greaterThanOrEqual',
    PhoneticMatch = 'phoneticMatch',
    FuzzyMatch = 'fuzzyMatch',
    RegexMatch = 'regexMatch',
    WildcardMatch = 'wildcardMatch',
    DifferentThan = 'differentThan'
}

/**
 * @type FieldValue
 * 
 * @export
 */
export type FieldValue = { kind: 'dateRange' } & DateRangeValue | { kind: 'date' } & DateValue | { kind: 'keyword' } & KeywordExpression | { kind: 'exactMatch' } & ExactMatchExpression;

/**
 * 
 * @export
 * @interface HierarchicalFacetResponseValue
 */
export interface HierarchicalFacetResponseValue {
    /**
     * The children of this hierarchical facet value.
     * 
     * Each child is a full-fledged hierarchical facet value that may in turn have its own children and so forth, up to a maximum depth of 50 levels.
     * @type {Array<HierarchicalFacetResponseValue>}
     * @memberof HierarchicalFacetResponseValue
     */
    children?: Array<HierarchicalFacetResponseValue>;
    /**
     * Whether the facet value was automatically selected by Coveo ML.
     * @type {boolean}
     * @memberof HierarchicalFacetResponseValue
     */
    isAutoSelected?: boolean;
    /**
     * Whether additional values are available for the facet.
     * @type {boolean}
     * @memberof HierarchicalFacetResponseValue
     */
    moreValuesAvailable?: boolean;
    /**
     * The number of query results that can be expected if the facet value is selected in the search interface.
     * 
     * **Note:** This property only gets populated when the facet currently has no selected or excluded values.
     * @type {number}
     * @memberof HierarchicalFacetResponseValue
     */
    numberOfResults: number;
    /**
     * 
     * @type {Array<string>}
     * @memberof HierarchicalFacetResponseValue
     */
    path: Array<string>;
    /**
     * The current facet value state in the search interface.
     * @type {string}
     * @memberof HierarchicalFacetResponseValue
     */
    state: HierarchicalFacetResponseValueStateEnum;
    /**
     * The facet value name.
     * 
     * **Note:** In the case of a hierarchical facet value, this represents a single path segment.
     * @type {string}
     * @memberof HierarchicalFacetResponseValue
     */
    value: string;
}

            /**
            * @export
            * @enum {string}
            */
            export enum HierarchicalFacetResponseValueStateEnum {
                    Idle = 'idle',
                    Selected = 'selected'
            }



/**
 * 
 * @export
 * @interface HierarchicalFacetValue
 */
export interface HierarchicalFacetValue {
    /**
     * The children of this hierarchical facet value.
     * 
     * Each child is a full-fledged hierarchical facet value that may in turn have its own children and so forth, up to a maximum depth of 50 levels.
     * @type {Array<HierarchicalFacetValue>}
     * @memberof HierarchicalFacetValue
     */
    children?: Array<HierarchicalFacetValue>;
    /**
     * Whether to prevent Coveo ML from automatically selecting the facet value.
     * 
     * **Default:** `false`
     * @type {boolean}
     * @memberof HierarchicalFacetValue
     */
    preventAutoSelect?: boolean;
    /**
     * Whether to retrieve the children of this hierarchical facet value. Can only be used on leaf values.
     * @type {boolean}
     * @memberof HierarchicalFacetValue
     */
    retrieveChildren?: boolean;
    /**
     * The maximum number of children to retrieve for this hierarchical facet value. Ignored if `retrieveChildren` is `false`.
     * @type {number}
     * @memberof HierarchicalFacetValue
     */
    retrieveCount?: number;
    /**
     * The current facet value state in the search interface.
     * @type {string}
     * @memberof HierarchicalFacetValue
     */
    state?: HierarchicalFacetValueStateEnum;
    /**
     * The facet value name.
     * 
     * **Note:** In the case of a hierarchical facet value, this represents a single path segment.
     * @type {string}
     * @memberof HierarchicalFacetValue
     */
    value?: string;
}

            /**
            * @export
            * @enum {string}
            */
            export enum HierarchicalFacetValueStateEnum {
                    Idle = 'idle',
                    Selected = 'selected'
            }



/**
 * 
 * @export
 * @interface HighlightingSettings
 */
export interface HighlightingSettings {
    /**
     * Whether the highlighting should be enable or not.
     * @type {boolean}
     * @memberof HighlightingSettings
     */
    enabled?: boolean;
    /**
     * The HTML markup to mark the start of an highlight.
     * @type {string}
     * @memberof HighlightingSettings
     */
    preTag?: string;
    /**
     * The HTML markup to mark the end of an highlight.
     * @type {string}
     * @memberof HighlightingSettings
     */
    postTag?: string;
}



/**
 * 
 * @export
 * @interface InlineResponse200
 */
export interface InlineResponse200 {
    /**
     * List of results returned
     * @type {Array<QueryResult>}
     * @memberof InlineResponse200
     */
    results?: Array<QueryResult>;
    /**
     * 
     * @type {FacetResponse}
     * @memberof InlineResponse200
     */
    facets?: FacetResponse;
    /**
     * 
     * @type {QueryCorrectionsResponse}
     * @memberof InlineResponse200
     */
    queryCorrections?: QueryCorrectionsResponse;
    /**
     * 
     * @type {TriggerResponse}
     * @memberof InlineResponse200
     */
    triggers?: TriggerResponse;
    /**
     * The query [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier). Each query sent to the Search API has its own randomly generated `searchQueryId`.
     * 
     * **Note:** When logging a **Search** or **Custom** usage analytics event for a query, or a **Click** usage analytics event for an opened query result item, the `searchQueryUid` field of that event should be set to the `searchUid` value of the query response.
     * @type {string}
     * @memberof InlineResponse200
     */
    searchQueryId: string;
    /**
     * 
     * @type {QueryExecutionReport}
     * @memberof InlineResponse200
     */
    executionReport: QueryExecutionReport;
    /**
     * 
     * @type {InlineResponse200Pagination}
     * @memberof InlineResponse200
     */
    pagination: InlineResponse200Pagination;
}



/**
 * Pagination related information.
 * 
 * **Note**: Maybe we could return the requested pagination parameters?
 * @export
 * @interface InlineResponse200Pagination
 */
export interface InlineResponse200Pagination {
    /**
     * The total number of items matching the query for the current user (security trimming applied).
     * 
     * **Note:** When logging a **Search** usage analytics event for a query, the `numberOfResults` field of that event should be set to the `totalCount` value of the query (for reporting purposes).
     * @type {number}
     * @memberof InlineResponse200Pagination
     */
    totalCount: number;
}



/**
 * 
 * @export
 * @interface KeywordExpression
 */
export interface KeywordExpression {
    /**
     * 
     * @type {string}
     * @memberof KeywordExpression
     */
    kind: string;
    /**
     * 
     * @type {string}
     * @memberof KeywordExpression
     */
    value: string;
}



/**
 * Contains all the parameters related to localization.
 * @export
 * @interface LocalizationParameters
 */
export interface LocalizationParameters {
    /**
     * The locale of the current user. Must comply with IETF's [BCP 47](http://www.rfc-editor.org/rfc/bcp/bcp47.txt) definition.
     * 
     * Coveo Machine Learning models use this information to provide contextually relevant output. Moreover, this information can be referred to in query expressions and QPL statements by using the `$locale` object.
     * 
     * **Note:** When logging a **Search** usage analytics event, the `language` field of that event should match the language part of the `locale` value of the query (e.g., `en-US` in `locale` becomes `en` in `language`).
     * @type {string}
     * @memberof LocalizationParameters
     */
    locale?: string;
    /**
     * The tz database identifier of the time zone to use to correctly interpret dates in the query expression and result items.
     * @type {string}
     * @memberof LocalizationParameters
     */
    timezone?: string;
}



/**
 * 
 * @export
 * @interface MatchAllExpression
 */
export interface MatchAllExpression {
    /**
     * 
     * @type {string}
     * @memberof MatchAllExpression
     */
    kind: string;
}



/**
 * 
 * @export
 * @interface NearExpression
 */
export interface NearExpression {
    /**
     * 
     * @type {string}
     * @memberof NearExpression
     */
    kind: string;
    /**
     * 
     * @type {TextValue}
     * @memberof NearExpression
     */
    start: TextValue;
    /**
     * 
     * @type {Array<NearExpressionRest>}
     * @memberof NearExpression
     */
    rest: Array<NearExpressionRest>;
}



/**
 * 
 * @export
 * @interface NearExpressionRest
 */
export interface NearExpressionRest {
    /**
     * 
     * @type {number}
     * @memberof NearExpressionRest
     */
    distance: number;
    /**
     * 
     * @type {TextValue}
     * @memberof NearExpressionRest
     */
    text: TextValue;
}



/**
 * 
 * @export
 * @interface NotExpression
 */
export interface NotExpression {
    /**
     * 
     * @type {string}
     * @memberof NotExpression
     */
    kind: string;
    /**
     * 
     * @type {QueryExpression}
     * @memberof NotExpression
     */
    expression: QueryExpression;
}



/**
 * 
 * @export
 * @interface ObjectAccessExpression
 */
export interface ObjectAccessExpression {
    /**
     * 
     * @type {string}
     * @memberof ObjectAccessExpression
     */
    kind: string;
    /**
     * 
     * @type {string}
     * @memberof ObjectAccessExpression
     */
    objectName: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof ObjectAccessExpression
     */
    properties: Array<string>;
}



/**
 * 
 * @export
 * @interface OrExpression
 */
export interface OrExpression {
    /**
     * 
     * @type {string}
     * @memberof OrExpression
     */
    kind: string;
    /**
     * 
     * @type {Array<QueryExpression>}
     * @memberof OrExpression
     */
    expressions: Array<QueryExpression>;
}



/**
 * The different origin level of the request.
 * @export
 * @interface OriginLevels
 */
export interface OriginLevels {
    /**
     * First level of origins.
     * 
     * The searchHub is implicitly required. It MUST be defined in the API Key, SearchToken or in this parameter.
     * The SearchHub specified in the authentication (API Key or SearchToken) will override this parameter if defined.
     * 
     * The searchHub will be passed as the `originLevel1` property value when logging usage analytics search events.
     * 
     * The search hub can also be used in query pipeline condition statements (e.g., `when $searchhub is \"CommunityHub\"`).
     * @type {string}
     * @memberof OriginLevels
     */
    searchHub?: string;
    /**
     * Second level of origins.
     * 
     * The referrer will be passed as the `originLevel2` property value when logging usage analytics search events.
     * @type {string}
     * @memberof OriginLevels
     */
    section?: string;
    /**
     * Third level of origins.
     * 
     * The referrer will be passed as the `originLevel3` property value when logging usage analytics search events.
     * @type {string}
     * @memberof OriginLevels
     */
    referrer?: string;
}



/**
 * @type Pagination
 * 
 * @export
 */
export type Pagination = AdvancedPagination | SimplePagination;

/**
 * 
 * @export
 * @interface ProblemDetails
 */
export interface ProblemDetails {
    /**
     * The HTTP status code.
     * @type {number}
     * @memberof ProblemDetails
     */
    status?: number;
    /**
     * A short, human-readable summary of the problem type. It SHOULD NOT change from occurrence to occurrence of the problem, except for purposes of localization.
     * @type {string}
     * @memberof ProblemDetails
     */
    title?: string;
    /**
     * A URI reference [[RFC3986](https://tools.ietf.org/html/rfc3986)] that identifies the problem type. It should provide human-readable documentation for the problem type. When this member is not present, its value is assumed to be "about:blank".
     * @type {string}
     * @memberof ProblemDetails
     */
    type?: string;
    /**
     * A human-readable explanation specific to this occurrence of the problem.
     * @type {string}
     * @memberof ProblemDetails
     */
    detail?: string;
    /**
     * A URI reference [[RFC3986](https://tools.ietf.org/html/rfc3986)] that identifies the specific occurrence of the problem. It may or may not yield further information if dereferenced.
     * @type {string}
     * @memberof ProblemDetails
     */
    instance?: string;
}



/**
 * @type Query
 * 
 * @export
 */
export type Query = { kind: 'keywords' } & QueryWithoutSyntax | { kind: 'minimal' } & QueryWithMinimalSyntax | { kind: 'structured' } & QueryStructured;

/**
 * 
 * @export
 * @interface QueryCorrection
 */
export interface QueryCorrection {
    /**
     * The resulting query expression correction suggestion.
     * @type {string}
     * @memberof QueryCorrection
     */
    correctedQuery: string;
    /**
     * The word correction suggestions.
     * @type {Array<WordCorrection>}
     * @memberof QueryCorrection
     */
    wordCorrections: Array<WordCorrection>;
}



/**
 * 
 * @export
 * @interface QueryCorrectionsResponse
 */
export interface QueryCorrectionsResponse {
    /**
     * The query corrections suggested by the index, if the `enableDidYouMean` query parameter was set to `true`.
     * @type {Array<QueryCorrection>}
     * @memberof QueryCorrectionsResponse
     */
    corrections: Array<QueryCorrection>;
}



/**
 * The parameters regarding the DidYouMean featureof the index.
 * @export
 * @interface QueryDidYouMeanParameter
 */
export interface QueryDidYouMeanParameter {
    /**
     * Whether to enable the DidYouMean feature. If true, it will return query corrections.
     * @type {boolean}
     * @memberof QueryDidYouMeanParameter
     */
    enabled?: boolean;
}



/**
 * 
 * @export
 * @interface QueryExecutionReport
 */
export interface QueryExecutionReport {
    /**
     * 
     * @type {QueryExecutionStats}
     * @memberof QueryExecutionReport
     */
    executionStats?: QueryExecutionStats;
    /**
     * The errors that did not make the query fail, but should be addressed. They might be security issues, deprecated behaviors, or any other kind of concern.
     * @type {Array<BaseWarning>}
     * @memberof QueryExecutionReport
     */
    warnings?: Array<BaseWarning>;
    /**
     * The errors that critically changed the query behaviour. These should be addressed right away to prevent future errors.
     * @type {Array<BaseError>}
     * @memberof QueryExecutionReport
     */
    errors?: Array<BaseError>;
}



/**
 * 
 * @export
 * @interface QueryExecutionStats
 */
export interface QueryExecutionStats {
    /**
     * The `requestDuration` added to the computing time (in milliseconds) that was required by the Search API.
     * @type {number}
     * @memberof QueryExecutionStats
     */
    duration?: number;
    /**
     * The `indexDuration` added to the time (in milliseconds) that was required to establish a connection between the Search API server and the index server.
     * @type {number}
     * @memberof QueryExecutionStats
     */
    requestDuration?: number;
    /**
     * The time (in milliseconds) that was required by the index to find the query items.
     * @type {number}
     * @memberof QueryExecutionStats
     */
    indexDuration?: number;
}



/**
 * @type QueryExpression
 * 
 * @export
 */
export type QueryExpression = { kind: 'keyword' } & KeywordExpression | { kind: 'exactMatch' } & ExactMatchExpression | { kind: 'and' } & AndExpression | { kind: 'or' } & OrExpression | { kind: 'binaryField' } & BinaryFieldExpression | { kind: 'near' } & NearExpression | { kind: 'not' } & NotExpression | { kind: 'fieldExists' } & FieldExistsExpression | { kind: 'matchAll' } & MatchAllExpression | { kind: 'objectAccess' } & ObjectAccessExpression | { kind: 'queryExtensionInvocation' } & QueryExtensionInvocationExpression | { kind: 'querySyntax' } & QuerySyntaxExpression;

/**
 * 
 * @export
 * @interface QueryExtendedContextParameters
 */
export interface QueryExtendedContextParameters extends BaseContextParameters {
}



/**
 * 
 * @export
 * @interface QueryExtensionInvocationExpression
 */
export interface QueryExtensionInvocationExpression {
    /**
     * 
     * @type {string}
     * @memberof QueryExtensionInvocationExpression
     */
    kind: string;
    /**
     * 
     * @type {string}
     * @memberof QueryExtensionInvocationExpression
     */
    name: string;
    /**
     * 
     * @type {Array<QueryExtensionInvocationExpressionArguments>}
     * @memberof QueryExtensionInvocationExpression
     */
    arguments: Array<QueryExtensionInvocationExpressionArguments>;
}



/**
 * 
 * @export
 * @interface QueryExtensionInvocationExpressionArguments
 */
export interface QueryExtensionInvocationExpressionArguments {
    /**
     * 
     * @type {string}
     * @memberof QueryExtensionInvocationExpressionArguments
     */
    name: string;
    /**
     * 
     * @type {QueryExpression}
     * @memberof QueryExtensionInvocationExpressionArguments
     */
    value: QueryExpression;
}



/**
 * 
 * @export
 * @interface QueryFunction
 */
export interface QueryFunction {
    /**
     * The mathematical expression whose output should be stored in a dynamic, temporary field.
     * @type {string}
     * @memberof QueryFunction
     */
    _function?: string;
    /**
     * The name of the dynamic, temporary field in which to store the query function expression output.
     * @type {string}
     * @memberof QueryFunction
     */
    fieldName: string;
}



/**
 * 
 * @export
 * @interface QueryFunctions
 */
export interface QueryFunctions {
    /**
     * 
     * @type {Array<QueryFunction>}
     * @memberof QueryFunctions
     */
    functions?: Array<QueryFunction>;
}



/**
 * An object representing the items that matched the query.
 * @export
 * @interface QueryResult
 */
export interface QueryResult {
    /**
     * 
     * @type {QueryResultSummary}
     * @memberof QueryResult
     */
    summary?: QueryResultSummary;
    /**
     * 
     * @type {QueryResultExcerpt}
     * @memberof QueryResult
     */
    excerpt?: QueryResultExcerpt;
    /**
     * 
     * @type {QueryResultFields}
     * @memberof QueryResult
     */
    fields?: QueryResultFields;
}



/**
 * 
 * @export
 * @interface QueryResultExcerpt
 */
export interface QueryResultExcerpt {
    /**
     * The value of the excerpt
     * @type {string}
     * @memberof QueryResultExcerpt
     */
    value?: string;
    /**
     * The highlighted value.
     * @type {string}
     * @memberof QueryResultExcerpt
     */
    highlighted?: string;
}



/**
 * 
 * @export
 * @interface QueryResultFields
 */
export interface QueryResultFields {
    /**
     * An object populated from the fields specified in `fields.toInclude.fields`.
     * @type {{ [key: string]: object; }}
     * @memberof QueryResultFields
     */
    values?: { [key: string]: object; };
    /**
     * An object where each key is the fields to highlight and the value is the highlighted strings.
     * @type {{ [key: string]: object; }}
     * @memberof QueryResultFields
     */
    highlightedValues?: { [key: string]: object; };
}



/**
 * 
 * @export
 * @interface QueryResultSummary
 */
export interface QueryResultSummary {
    /**
     * The value of the summary
     * @type {string}
     * @memberof QueryResultSummary
     */
    value?: string;
    /**
     * The highlighted value.
     * @type {string}
     * @memberof QueryResultSummary
     */
    highlighted?: string;
}



/**
 * 
 * @export
 * @interface QueryStructured
 */
export interface QueryStructured {
    /**
     * 
     * @type {string}
     * @memberof QueryStructured
     */
    kind: string;
    /**
     * 
     * @type {QueryExpression}
     * @memberof QueryStructured
     */
    expression: QueryExpression;
}



/**
 * 
 * @export
 * @interface QuerySuggestContextParameters
 */
export interface QuerySuggestContextParameters extends BaseContextParameters {
}



/**
 * 
 * @export
 * @interface QuerySuggestRequest
 */
export interface QuerySuggestRequest {
    /**
     * The basic query expression, typically the keywords entered by the end user in a query box.
     * @type {string}
     * @memberof QuerySuggestRequest
     */
    userQuery?: string;
    /**
     * The desired number of query suggestions.
     * @type {number}
     * @memberof QuerySuggestRequest
     */
    count?: number;
    /**
     * Whether to attempt to complete the last word of the current basic query expression
     * @type {boolean}
     * @memberof QuerySuggestRequest
     */
    enableWordCompletion?: boolean;
    /**
     * 
     * @type {QuerySuggestContextParameters}
     * @memberof QuerySuggestRequest
     */
    analytics?: QuerySuggestContextParameters;
    /**
     * 
     * @type {LocalizationParameters}
     * @memberof QuerySuggestRequest
     */
    localization?: LocalizationParameters;
    /**
     * Advanced parameters that can be used by the developers to fine tune their configuration.
     * @type {object}
     * @memberof QuerySuggestRequest
     */
    advancedParameters?: object;
}



/**
 * 
 * @export
 * @interface QuerySyntaxExpression
 */
export interface QuerySyntaxExpression {
    /**
     * 
     * @type {string}
     * @memberof QuerySyntaxExpression
     */
    kind: string;
    /**
     * 
     * @type {string}
     * @memberof QuerySyntaxExpression
     */
    value: string;
}



/**
 * 
 * @export
 * @interface QueryWithMinimalSyntax
 */
export interface QueryWithMinimalSyntax {
    /**
     * 
     * @type {string}
     * @memberof QueryWithMinimalSyntax
     */
    kind: string;
    /**
     * An expression that support a minimal set of the coveo query syntax.
     * Support the following operators:
     * 
     *     - OR
     *     - AND
     *     - NOT
     *     - @[fieldName]
     *     - @field=term
     * @type {string}
     * @memberof QueryWithMinimalSyntax
     */
    expression: string;
}



/**
 * 
 * @export
 * @interface QueryWithoutSyntax
 */
export interface QueryWithoutSyntax {
    /**
     * 
     * @type {string}
     * @memberof QueryWithoutSyntax
     */
    kind: string;
    /**
     * An expression without any syntax that will be used to search.
     * @type {string}
     * @memberof QueryWithoutSyntax
     */
    expression: string;
}



/**
 * 
 * @export
 * @interface RankingFunction
 */
export interface RankingFunction {
    /**
     * A mathematical expression to evaluate for each query result. The result of this expression for a given query result generates a boost which is then added to the ranking score of that query result.
     * @type {string}
     * @memberof RankingFunction
     */
    expression: string;
    /**
     * The maximum boost this query ranking function can add to the ranking score of any given query result.
     * @type {number}
     * @memberof RankingFunction
     */
    modifier?: number;
    /**
     * Whether to normalize the ranking score boosts resulting from the evaluation of this query ranking function using the standard index scale.
     * @type {boolean}
     * @memberof RankingFunction
     */
    normalizeWeight?: boolean;
}



/**
 * 
 * @export
 * @interface RankingFunctions
 */
export interface RankingFunctions {
    /**
     * 
     * @type {Array<RankingFunction>}
     * @memberof RankingFunctions
     */
    functions?: Array<RankingFunction>;
}



/**
 * 
 * @export
 * @interface RecommendationRequest
 */
export interface RecommendationRequest {
    /**
     * The desired number of recommendations.
     * @type {number}
     * @memberof RecommendationRequest
     */
    count?: number;
    /**
     * 
     * @type {RecommendationsContextParameters}
     * @memberof RecommendationRequest
     */
    analytics?: RecommendationsContextParameters;
    /**
     * 
     * @type {LocalizationParameters}
     * @memberof RecommendationRequest
     */
    localization?: LocalizationParameters;
    /**
     * Advanced parameters that can be used by the developers to fine tune their configuration.
     * @type {object}
     * @memberof RecommendationRequest
     */
    advancedParameters?: object;
}



/**
 * 
 * @export
 * @interface RecommendationsContextParameters
 */
export interface RecommendationsContextParameters extends BaseContextParameters {
}



/**
 * 
 * @export
 * @interface SearchRequest
 */
export interface SearchRequest {
    /**
     * 
     * @type {Query}
     * @memberof SearchRequest
     */
    query?: Query;
    /**
     * 
     * @type {AdvancedFilters}
     * @memberof SearchRequest
     */
    advancedFilters?: AdvancedFilters;
    /**
     * 
     * @type {ToIncludeParameters}
     * @memberof SearchRequest
     */
    toInclude?: ToIncludeParameters;
    /**
     * 
     * @type {Pagination}
     * @memberof SearchRequest
     */
    pagination?: Pagination;
    /**
     * 
     * @type {SortCriteria}
     * @memberof SearchRequest
     */
    sort?: SortCriteria;
    /**
     * 
     * @type {QueryExtendedContextParameters}
     * @memberof SearchRequest
     */
    analytics?: QueryExtendedContextParameters;
    /**
     * 
     * @type {QueryDidYouMeanParameter}
     * @memberof SearchRequest
     */
    didYouMean?: QueryDidYouMeanParameter;
    /**
     * 
     * @type {LocalizationParameters}
     * @memberof SearchRequest
     */
    localization?: LocalizationParameters;
    /**
     * Advanced parameters that can be used by the developers to fine tune their configuration.
     * @type {object}
     * @memberof SearchRequest
     */
    advancedParameters?: object;
}



/**
 * 
 * @export
 * @interface SimplePagination
 */
export interface SimplePagination {
    /**
     * The page of the results to get.
     * @type {number}
     * @memberof SimplePagination
     */
    page?: number;
    /**
     * The number of values to get per page.
     * @type {number}
     * @memberof SimplePagination
     */
    numberOfValues?: number;
}



/**
 * @type SortCriteria
 * 
 * @export
 */
export type SortCriteria = { by: 'relevance' } & SortCriteriaByRelevance | { by: 'fields' } & SortCriteriaByFields;

/**
 * 
 * @export
 * @interface SortCriteriaByFields
 */
export interface SortCriteriaByFields {
    /**
     * Sort using the value of a specific sortable field.
     * @type {string}
     * @memberof SortCriteriaByFields
     */
    by: string;
    /**
     * 
     * @type {Array<SortCriteriaField>}
     * @memberof SortCriteriaByFields
     */
    fields: Array<SortCriteriaField>;
}



/**
 * 
 * @export
 * @interface SortCriteriaByRelevance
 */
export interface SortCriteriaByRelevance {
    /**
     * Use standard index ranking factors (adjacency, TDIDF, etc.) and custom ranking expressions (QREs and QRFs) to compute a ranking `score` for each query result item, and sort the query results by descending `score` value.
     * @type {string}
     * @memberof SortCriteriaByRelevance
     */
    by: string;
}



/**
 * 
 * @export
 * @interface SortCriteriaField
 */
export interface SortCriteriaField {
    /**
     * The name of the field to sort
     * @type {string}
     * @memberof SortCriteriaField
     */
    name: string;
    /**
     * Sort order:
     * * `asc` - Ascending, from A to Z
     * * `desc` - Descending, from Z to A
     * @type {string}
     * @memberof SortCriteriaField
     */
    direction?: SortCriteriaFieldDirectionEnum;
}

            /**
            * @export
            * @enum {string}
            */
            export enum SortCriteriaFieldDirectionEnum {
                    Asc = 'asc',
                    Desc = 'desc'
            }



/**
 * 
 * @export
 * @interface SuggestedFacet
 */
export interface SuggestedFacet {
    /**
     * The name of the field on which the DNE facet suggestion is based.
     * @type {string}
     * @memberof SuggestedFacet
     */
    field: string;
    /**
     * 
     * @type {Array<SuggestedFacetValue>}
     * @memberof SuggestedFacet
     */
    values: Array<SuggestedFacetValue>;
}



/**
 * 
 * @export
 * @interface SuggestedFacetValue
 */
export interface SuggestedFacetValue {
    /**
     * The path to the suggested facet value (only applies to hierarchical facet value suggestions).
     * 
     * **Example:** If the suggested hierarchical facet value is `Parrot`, the returned path could be `["Animals", "Birds", "Parrot"]`.
     * @type {Array<string>}
     * @memberof SuggestedFacetValue
     */
    path?: Array<string>;
    /**
     * A DNE facet value suggestion.
     * @type {string}
     * @memberof SuggestedFacetValue
     */
    value: string;
}



/**
 * @type TextValue
 * 
 * @export
 */
export type TextValue = { kind: 'keyword' } & KeywordExpression | { kind: 'exactMatch' } & ExactMatchExpression;

/**
 * Defines the fields to include and their configuration.
 * @export
 * @interface ToIncludeParameters
 */
export interface ToIncludeParameters {
    /**
     * A list of fields to include in the response.
     * @type {Array<string | AdvancedQueryFieldParameters>}
     * @memberof ToIncludeParameters
     */
    fields?: Array<string | AdvancedQueryFieldParameters>;
    /**
     * 
     * @type {boolean | AdvancedGeneratedQueryFieldParameter}
     * @memberof ToIncludeParameters
     */
    summary?: boolean | AdvancedGeneratedQueryFieldParameter;
    /**
     * 
     * @type {boolean | AdvancedGeneratedQueryFieldParameter}
     * @memberof ToIncludeParameters
     */
    excerpt?: boolean | AdvancedGeneratedQueryFieldParameter;
    /**
     * 
     * @type {HighlightingSettings}
     * @memberof ToIncludeParameters
     */
    highlighting?: HighlightingSettings;
}



/**
 * @type TriggerContent
 * 
 * @export
 */
export type TriggerContent = { type: 'notify' } & TriggerContentNotify | { type: 'query' } & TriggerContentQuery | { type: 'execute' } & TriggerContentExecute | { type: 'redirect' } & TriggerContentRedirect;

/**
 * 
 * @export
 * @interface TriggerContentExecute
 */
export interface TriggerContentExecute {
    /**
     * Runs the specified JavaScript function in the client browser.
     * @type {string}
     * @memberof TriggerContentExecute
     */
    type: string;
    /**
     * 
     * @type {TriggerContentExecuteContent}
     * @memberof TriggerContentExecute
     */
    content: TriggerContentExecuteContent;
}



/**
 * An object with the function name to execute and a list of parameters for the function.
 * @export
 * @interface TriggerContentExecuteContent
 */
export interface TriggerContentExecuteContent {
    /**
     * The name of the "The name of the trigger function to execute.
     * @type {string}
     * @memberof TriggerContentExecuteContent
     */
    name: string;
    /**
     * The parameters to pass to the trigger function.
     * @type {Array<any>}
     * @memberof TriggerContentExecuteContent
     */
    params: Array<any>;
}



/**
 * 
 * @export
 * @interface TriggerContentNotify
 */
export interface TriggerContentNotify {
    /**
     * Displays the specified message in the search interface.
     * @type {string}
     * @memberof TriggerContentNotify
     */
    type: string;
    /**
     * The message to display in the interface
     * @type {string}
     * @memberof TriggerContentNotify
     */
    content: string;
}



/**
 * 
 * @export
 * @interface TriggerContentQuery
 */
export interface TriggerContentQuery {
    /**
     * Force the search interface to perform a new search with the specified query.
     * @type {string}
     * @memberof TriggerContentQuery
     */
    type: string;
    /**
     * The query to execute
     * @type {string}
     * @memberof TriggerContentQuery
     */
    content: string;
}



/**
 * 
 * @export
 * @interface TriggerContentRedirect
 */
export interface TriggerContentRedirect {
    /**
     * Runs the specified JavaScript function in the client browser.
     * @type {string}
     * @memberof TriggerContentRedirect
     */
    type: string;
    /**
     * The URI to redirect to
     * @type {string}
     * @memberof TriggerContentRedirect
     */
    content: string;
}



/**
 * The actions to perform by the client based on the Trigger statements defined in query pipelines (see the `pipeline` query parameter).
 * 
 * **Note:**
 * > A Trigger statement must have a condition. Otherwise, the Search API ignores it and does not include it in the `triggers` array of the query response (see [Managing Query Pipeline Triggers](http://www.coveo.com/go?dest=cloudhelp&lcid=9&context=146)).
 * @export
 * @interface TriggerResponse
 */
export interface TriggerResponse {
    /**
     * 
     * @type {Array<TriggerContent>}
     * @memberof TriggerResponse
     */
    results: Array<TriggerContent>;
}



/**
 * 
 * @export
 * @interface WordCorrection
 */
export interface WordCorrection {
    /**
     * The suggested word correction.
     * @type {string}
     * @memberof WordCorrection
     */
    correctedWord: string;
    /**
     * The length (in number of characters) of the corrected word.
     * @type {number}
     * @memberof WordCorrection
     */
    length: number;
    /**
     * The offset (in number of characters) of the corrected word, from the beginning of the resulting query expression correction suggestion.
     * @type {number}
     * @memberof WordCorrection
     */
    offset: number;
    /**
     * The original, un-corrected word.
     * @type {string}
     * @memberof WordCorrection
     */
    originalWord: string;
}


