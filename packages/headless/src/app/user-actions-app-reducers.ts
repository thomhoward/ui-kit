import {ReducersMapObject} from 'redux';
import {configurationReducer} from '../features/configuration/configuration-slice';
import {userProfileReducer} from '../features/user-profile/user-profile-slice';
import {UserActionsAppState} from '../state/user-actions-app-state';

/**
 * Map of reducers that make up the UserActionsAppState.
 */
export const userActionsAppReducer: ReducersMapObject<UserActionsAppState> = {
  configuration: configurationReducer,
  userProfile: userProfileReducer,
};
