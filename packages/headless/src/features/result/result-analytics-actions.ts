import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  searchPageState,
  makeClickActionType,
} from '../analytics/analytics-actions';
import {
  partialDocumentInformation,
  documentIdentifier,
} from '../analytics/analytics-utils';
import {configureAnalytics} from '../../api/analytics/analytics';
import {Result} from '../../api/search/search/result';
import {StringValue, RecordValue} from '@coveo/bueno';
import {validatePayloadSchema} from '../../utils/validate-payload';
import {Raw} from '../../api/search/search/raw';

const requiredNonEmptyString = new StringValue({
  required: true,
  emptyAllowed: false,
});
const rawPartialDefinition = {
  collection: requiredNonEmptyString,
  author: requiredNonEmptyString,
  urihash: requiredNonEmptyString,
  source: requiredNonEmptyString,
  permanentid: requiredNonEmptyString,
};
const resultPartialDefinition = {
  UniqueId: requiredNonEmptyString,
  raw: new RecordValue(rawPartialDefinition),
  title: requiredNonEmptyString,
  uri: new StringValue({required: true, emptyAllowed: false, url: true}),
  clickUri: new StringValue({required: true, emptyAllowed: false, url: true}),
  rankingModifier: new StringValue({required: false, emptyAllowed: true}),
};

function partialRawPayload(raw: Raw): Partial<Raw> {
  const payload = {};
  for (const [key, value] of Object.entries(raw)) {
    if (key in resultPartialDefinition) {
      Object.assign(payload, {[key]: value});
    }
  }
  return payload;
}

function partialResultPayload(result: Result) {
  const resultPayload = {};
  for (const [key, value] of Object.entries(result)) {
    if (key in resultPartialDefinition) {
      Object.assign(resultPayload, {[key]: value});
    }
  }
  return {...resultPayload, raw: partialRawPayload(result.raw)};
}

/**
 * Logs a click event with an `actionCause` value of `documentOpen`.
 * @param result (Result) The result that was opened.
 */
export const logDocumentOpen = createAsyncThunk(
  'analytics/result/open',
  async (result: Result, {getState}) => {
    const state = searchPageState(getState);
    validatePayloadSchema(
      partialResultPayload(result),
      resultPartialDefinition
    );
    await configureAnalytics(state).logDocumentOpen(
      partialDocumentInformation(result, state),
      documentIdentifier(result)
    );

    return makeClickActionType();
  }
);
