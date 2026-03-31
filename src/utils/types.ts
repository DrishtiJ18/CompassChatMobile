import {ImageStyle, StyleProp, TextStyle, ViewStyle} from 'react-native/types';

export type ViewStyles = StyleProp<ViewStyle>;
export type TextStyles = StyleProp<TextStyle>;
export type ImageStyles = StyleProp<ImageStyle>;

export type ParsedContentReturnType = {
  content: string;
  isFinal: Boolean;
  conversationDetails: unknown;
};

export type StyleTypes = ViewStyles | TextStyles | ImageStyles;

export type HistoryDataType = {
  conversation_id: string;
  created_at: number;
  title: string;
  updated_at: number;
  user_id: string;
};

export type GroupedByDate = {
  [key: string]: HistoryDataType[];
};
