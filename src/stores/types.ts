import {ChatSliceState} from './chatSlice/types';
import {SettingSliceState} from './settingSlice/types';
import {UserDetailsState} from './userDetailsSlice/types';

export type Store = SettingSliceState &
  UserDetailsState &
  ChatSliceState &
  object;
