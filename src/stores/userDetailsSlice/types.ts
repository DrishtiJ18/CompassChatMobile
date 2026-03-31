export interface UserDetailsInitialState {
  userDetails: {
    name: string;
    email: string;
    avatar: string;
  };
}

export interface UserDetailsState extends UserDetailsInitialState {
  setUserDetails: (userDetails: {
    name: string;
    email: string;
    avatar: string;
  }) => void;
  clearUserDetails: () => void;
}
