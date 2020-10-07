import {
  getInitialVisitorIdState,
  visitorIdReducer,
  VisitorId,
} from './visitorId-slice';
import {updateVisitorId} from './visitorId-actions';

describe('visitorId', () => {
  const visitorId = 'mock-visitorId';
  let state: VisitorId;

  beforeEach(() => {
    state = getInitialVisitorIdState();
  });

  it('#updateVisitorId sets visitorId to the correct value', () => {
    const action = updateVisitorId(visitorId);
    state = visitorIdReducer(state, action);
    expect(state).toBe(visitorId);
  });
});
