import {MLAPIClient} from './ml-api-client';
import {
  PlatformClient,
  PlatformClientCallOptions,
  platformUrl,
} from '../platform-client';
import {UserActionsRequest} from './user-profiles/user-actions-request';
import {createMockUserActionsState} from '../../test/mock-state';
import {UserActionsAppState} from '../../state/user-actions-app-state';
import {buildUserActionsRequest} from '../../features/user-profile/user-profile-actions';

jest.mock('../platform-client');
describe('machine learning api client', () => {
  const renewAccessToken = async () => 'newToken';
  let mlAPIClient: MLAPIClient;
  let state: UserActionsAppState;

  beforeEach(() => {
    mlAPIClient = new MLAPIClient(renewAccessToken);
    state = createMockUserActionsState();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`when calling MLAPIClient.userActions
  should call PlatformClient.call with the right options`, () => {
    const req = buildUserActionsRequest(state);
    mlAPIClient.userActions(req);

    const expectedRequest: PlatformClientCallOptions<UserActionsRequest> = {
      accessToken: state.configuration.accessToken,
      method: 'POST',
      contentType: 'application/json',
      url: `${platformUrl()}/rest/organizations/${
        req.organizationId
      }/machinelearning/user/actions`,
      renewAccessToken,
      requestParams: {
        userId: state.configuration.userProfile.userId,
      },
    };

    expect(PlatformClient.call).toHaveBeenCalledWith(expectedRequest);
  });
});
