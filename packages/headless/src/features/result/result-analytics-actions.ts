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
  uniqueId: requiredNonEmptyString,
  raw: new RecordValue(rawPartialDefinition),
  title: requiredNonEmptyString,
  uri: new StringValue({required: true, emptyAllowed: false, url: true}),
  clickUri: new StringValue({required: true, emptyAllowed: false, url: true}),
  rankingModifier: new StringValue({required: false, emptyAllowed: true}),
};
type rawPartialType = keyof typeof rawPartialDefinition;

function partialRawPayload(raw: Raw): rawPartialType {
  const payload = {};
  Object.assign(
    payload,
    Object.keys(rawPartialDefinition).map((key) => ({[key]: raw[key]}))
  );
  return payload as rawPartialType;
}

function partialResultPayload(result: Result) {
  const resultPayload = {};
  Object.assign(
    resultPayload,
    Object.keys(rawPartialDefinition).map((key) => ({[key]: result[key]}))
  );
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
