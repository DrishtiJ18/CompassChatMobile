import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {Store} from './types';
import {createSettingSlice} from './settingSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createUserDetailsSlice} from './userDetailsSlice';
import {createChatSlice} from './chatSlice';

export const useStore = create<Store>()(
  persist(
    set => ({
      ...createChatSlice(set),
      ...createSettingSlice(set),
      ...createUserDetailsSlice(set),
    }),
    {
      name: 'chat_bot_store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) =>
              ![
                'conversations',
                'conversationId',
                'canStop',
                'loading',
                'isShowLoader',
                'didResponseFail',
              ].includes(key),
          ),
        ),
    },
  ),
);
