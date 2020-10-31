// import {configureAnalytics} from '../../api/analytics/analytics';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  makeSearchActionType,
  searchPageState,
} from '../analytics/analytics-actions';
import {configureAnalytics} from '../../api/analytics/analytics';
import {OmniboxSuggestionsMetadata} from 'coveo.analytics/src/searchPage/searchPageEvents';

function filterRepeatedValues(toClean: string[]) {
  let prev = '';
  return toClean.filter((value) => {
    const isSame = value !== prev;
    prev = value;
    return isSame;
  });
}

function removeSemicolons(toClean: string[]) {
  return toClean.map((value) => {
    return value.replace(/;/g, '');
  });
}

function nextLength(cleanedData: string, i: number, data: string[]) {
  return cleanedData.length + data[i].length;
}

function cleanCustomData(toClean: string[]) {
  const analyticsLengthLimit = 256;
  const filteredOutRepeatedValues = filterRepeatedValues(toClean);
  const removedSemicolons = removeSemicolons(filteredOutRepeatedValues);
  const data = removedSemicolons.reverse();

  let cleanedData = '';
  let i = 0;
  while (
    data[i] !== undefined &&
    nextLength(cleanedData, i, data) < analyticsLengthLimit
  ) {
    cleanedData = `${removedSemicolons[i]};` + cleanedData;
    i++;
  }

  return cleanedData;
}

function buildQuerySuggestionClickPayload(
  suggestion: string,
  partialQuery: string,
  suggestions: string[],
  partialQueries: string[]
): OmniboxSuggestionsMetadata {
  return {
    suggestionRanking: suggestions.indexOf(suggestion),
    partialQuery,
    suggestions: cleanCustomData(suggestions),
    partialQueries: cleanCustomData(partialQueries),
  };
}

export const logQuerySuggestionClick = createAsyncThunk(
  'analytics/querySuggest',
  async ({id, suggestion}: {id: string; suggestion: string}, {getState}) => {
    const state = searchPageState(getState);
    const payload = buildQuerySuggestionClickPayload(
      suggestion,
      state.querySuggest[id]!.q,
      state.querySuggest[id]!.completions.map(
        (completion) => completion.expression
      ),
      state.querySuggest[id]!.partialQueries
    );
    await configureAnalytics(state).logOmniboxAnalytics(payload);
    return makeSearchActionType();
  }
);
