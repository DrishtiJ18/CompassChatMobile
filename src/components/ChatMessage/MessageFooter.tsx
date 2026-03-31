import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import CodeCopyBtn from '../CopyButton';
import ThumbDownIcon from '@images/message/thumb_down.svg';
import ThumbUpIcon from '@images/message/thumb_up.svg';
import ReGenerateIcon from '@images/message/refresh.svg';
import EditIcon from '@images/message/edit.svg';
import RightArrow from '@images/message/arrow_right.svg';
import LeftArrow from '@images/message/arrow_left.svg';
import RightArrowDisabled from '@images/message/arrow_right_disabled.svg';
import LeftArrowDisabled from '@images/message/arrow_left_disabled.svg';
import { flexDirection } from '@src/utils/UiUtils';
import { useStore } from '@src/stores';
import CustomText from '../custom/CustomText';
import IconButton from '../custom/IconButton';

const MessageFooter = ({
  text = '',
  isAssistant = false,
  onEdit = (text: string) => { },
  onLikeDislike = () => { },
  onRegenerate = () => { },
  messages,
  setSelectedIndex,
  selectedIndex,
  showPagination = false,
  promptId = '',
  citations
}) => {
  const language = useStore(state => state.language);
  const endNode = useStore(state => state.endNode);

  const canRegenerate = useMemo(() => {
    return messages?.find(message => message?.id === endNode?.id);
  }, [endNode?.id, messages]);
  function replacePlaceholdersWithLinks(): string {
    // Replace placeholders with the corresponding URL or [link] text
    const data2 = text.replace(/\[url(\d+)\]/g, (match, number) => {
      const key = `url${number}`;
      const url = citations[key];
      return url ? "[" + url?.citation + "]" : match; // If the URL exists, return it; otherwise, return the placeholder
    });
    return data2
  }

  return (

    <View
      className={` mt-3 flex-row w-full justify-between`}
      testID={`${promptId}-footer-view`}>

      <CodeCopyBtn className="mr-4" testID={`${promptId}`}>
        <CustomText testID={`${promptId}-copy`}>{replacePlaceholdersWithLinks()}</CustomText>
      </CodeCopyBtn>
      {showPagination && (
        <View
          className={` flex-row items-center justify-center`}
          testID={`${promptId}-pagination-view`}>
          <IconButton
            Icon={language === 'ar' ? (selectedIndex === messages?.length - 1 ? RightArrowDisabled : RightArrow) : (selectedIndex ? LeftArrow : LeftArrowDisabled)}
            // Icon={selectedIndex ? LeftArrow : LeftArrowDisabled}
            className="mr-2"
            disabled={language === 'ar' ? selectedIndex === messages?.length - 1 : !selectedIndex}
            onButtonPress={() => {
              setSelectedIndex(language === 'ar' ? selectedIndex + 1 : selectedIndex - 1);
            }}
            testID={`${promptId}-${language === 'ar' ? 'rightArrow-icon' : 'leftArrow-icon'}`}
          />
          <View>
            <Text
              className="text-slate-400 font-medium "
              testID={`${promptId}-pagination-text`}>{language === 'ar'
                ? `${messages?.length}/${messages?.length - selectedIndex}`
                : `${selectedIndex + 1}/${messages?.length}`}</Text>
          </View>
          <IconButton
            Icon={language === 'ar' ? (selectedIndex ? LeftArrow : LeftArrowDisabled) : (selectedIndex === messages?.length - 1 ? RightArrowDisabled : RightArrow)}
            className="mr-0 ml-2"
            disabled={language === 'ar' ? !selectedIndex : selectedIndex === messages?.length - 1}
            onButtonPress={() => {
              setSelectedIndex(language === 'ar' ? selectedIndex - 1 : selectedIndex + 1);
            }}
            testID={`${promptId}-${language === 'ar' ? 'leftArrow-icon' : 'rightArrow-icon'}`}
          />
        </View>
      )}
      {isAssistant ? (
        <IconButton
          Icon={EditIcon}
          onButtonPress={() => onEdit(text)}
          testID={`${promptId}-edit-icon`}
        />
      ) : (
        <>
          {/* <IconButton Icon={ThumbUpIcon} onButtonPress={onLikeDislike} />
            <IconButton Icon={ThumbDownIcon} onButtonPress={onLikeDislike} /> */}
          {canRegenerate && (
            <IconButton
              Icon={ReGenerateIcon}
              onButtonPress={onRegenerate}
              testID={`${promptId}-regenerate-icon`}
            />
          )}
        </>
      )}


    </View>
  );
};

export default MessageFooter;