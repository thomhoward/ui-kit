import {SearchResponseSuccess} from "../../search/search/search-response";
import {Result} from "../../../index";
import {QueryCorrection} from "../../search/search/query-corrections";
import {InlineResponse200, QueryCorrectionsResponse, QueryResult} from "@coveo/sapi-client";
import {isString} from "@coveo/bueno";

export const searchResponse = (response: InlineResponse200): SearchResponseSuccess => {

    return {
        results: convertResults(response.results),
        searchUid: response.searchQueryId,
        totalCountFiltered: response.pagination.totalCount,
        facets: [],
        queryCorrections: convertQueryCorrections(response.queryCorrections),
    };
}

const convertResults = (resultResponse?: QueryResult[]): Result[] => {
    if (!resultResponse) {
        return [];
    }

    return resultResponse.map(result => {
        const stdValues = result?.fields?.values;
        return {
            title:  objectToString(stdValues?.title),
            uri:  objectToString(stdValues?.uri),
            printableUri: "",
            clickUri: "",
            uniqueId: "",
            excerpt: result?.excerpt?.value ?? "",
            firstSentences: "",
            summary: null,
            flags: "",
            hasHtmlVersion: false,
            hasMobileHtmlVersion: false,
            score: 0,
            percentScore: 0,
            rankingInfo: null,
            rating: 0,
            isTopResult: false,
            isRecommendation: false,
            isUserActionView: false,
            titleHighlights: [],
            firstSentencesHighlights: [],
            excerptHighlights: [],
            printableUriHighlights: [],
            summaryHighlights: [],
            parentResult: null,
            childResults: [],
            totalNumberOfChildResults: 0,
            absentTerms: [],
            raw: {
                urihash: objectToString(stdValues?.urihash),
                parents: objectToString(stdValues?.parents),
                sfid: objectToString(stdValues?.sfid),
                sfparentid: objectToString(stdValues?.sfparentid),
                sfinsertedbyid: objectToString(stdValues?.sfinsertedbyid),
                documenttype: objectToString(stdValues?.documenttype),
                sfcreatedbyid: objectToString(stdValues?.sfcreatedbyid),
                permanentid: objectToString(stdValues?.permanentid),
                date: 0,
                objecttype: objectToString(stdValues?.objecttype),
                sourcetype: objectToString(stdValues?.sourcetype),
                sftitle: objectToString(stdValues?.sftitle),
                size: 0,
                sffeeditemid: objectToString(stdValues?.sffeeditemid),
                clickableuri: objectToString(stdValues?.clickableuri),
                sfcreatedby: objectToString(stdValues?.sfcreatedby),
                source: objectToString(stdValues?.source),
                collection: objectToString(stdValues?.collection),
                connectortype: objectToString(stdValues?.connectortype),
                filetype: objectToString(stdValues?.filetype),
                sfcreatedbyname: objectToString(stdValues?.sfcreatedbyname),
                sflikecount: 0,
                language: [],
                ...result.fields?.values
            },
            Title: objectToString(stdValues?.title),
            Uri: objectToString(stdValues?.uri),
            PrintableUri: "",
            ClickUri: "",
            UniqueId: objectToString(stdValues?.uniqueid),
            Excerpt: result?.excerpt?.value ?? "",
            FirstSentences: "",
            rankingModifier: undefined,
        };
    });
}

const objectToString = (x: unknown): string => {
    if (isString(x)) {
        return x;
    }
    return "";
}


const convertQueryCorrections = (correctionResponse?: QueryCorrectionsResponse): QueryCorrection[] => {
    if (!correctionResponse || !correctionResponse.corrections) {
        return [];
    }
    return correctionResponse?.corrections.map(x => ({
        correctedQuery: x?.correctedQuery ?? "",
        wordCorrections: x?.wordCorrections ?? []
    }));
}