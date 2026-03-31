import {UserDetailsInitialState, UserDetailsState} from './types';

const initialUserDetailsState: UserDetailsInitialState = {
  userDetails: {
    name: '',
    email: '',
    avatar: '',
  },
};

export const createUserDetailsSlice = (
  set: (
    partial: Partial<UserDetailsState>,
    replace?: boolean,
    actionName?: string,
  ) => void,
): UserDetailsState => ({
  ...initialUserDetailsState,
  setUserDetails: userDetails => {
    set({userDetails}, false, 'setUserDetails');
  },
  clearUserDetails: () =>
    set(initialUserDetailsState, false, 'clearUserDetails'),
});
