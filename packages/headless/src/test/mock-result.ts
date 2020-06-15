import {Result} from '../api/search/search/result';
import {buildMockRaw} from './mock-raw';

export function buildMockResult(config: Partial<Result> = {}): Result {
  return {
    title: '',
    uri: '',
    printableUri: '',
    clickUri: '',
    uniqueId: '',
    excerpt: '',
    firstSentences: '',
    summary: null,
    flags: '',
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
    raw: buildMockRaw(),
    Title: '',
    Uri: '',
    PrintableUri: '',
    ClickUri: '',
    UniqueId: '',
    Excerpt: '',
    FirstSentences: '',
    ...config,
  };
}
