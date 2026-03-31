import React, {useCallback, useMemo, useState} from 'react';
import {
  TextInput,
  View,
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import MessageFooter from './MessageFooter';
import {useFocusEffect} from '@react-navigation/native';
import {useStore} from '@src/stores';
import {useTranslation} from 'react-i18next';
import CustomText from '../custom/CustomText';
import {
  flexDirection,
  isArabic,
  listDirection,
  textDirection,
} from '@src/utils/UiUtils';
import CustomTouchableOpacity from '../custom/CustomTouchableOpacity';
import {Approaches, parseAnswerToHtml} from '@src/utils/answerParser';
import IconButton from '../custom/IconButton';
import ReGenerateIcon from '@images/message/refresh.svg';
import CloseOctagon from '@images/message/close_octagon.svg';

function hasParents(parents, type) {
  return parents.findIndex(el => el.type === type) > -1;
}

const textStyleProps = [
  'textShadowOffset',
  'color',
  'fontSize',
  'fontStyle',
  'fontWeight',
  'lineHeight',
  'textAlign',
  'textDecorationLine',
  'textShadowColor',
  'fontFamily',
  'textShadowRadius',
  'includeFontPadding',
  'textAlignVertical',
  'fontVariant',
  'letterSpacing',
  'textDecorationColor',
  'textDecorationStyle',
  'textTransform',
  'writingDirection',
];

function Message({
  message,
  selectedIndex,
  setSelectedIndex,
  mainObj,
  onRegenerate,
  editPrompt,
  onOpenCitation,
}): JSX.Element {
  const [editable, setEditable] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('');
  const setEndNode = useStore(state => state.setEndNode);
  const canStop = useStore(state => state.canStop);
  const language = useStore(state => state.language);
  const generating = useStore(state => state.generating);
  const view = useStore(state => state.view);
  const {t: translate} = useTranslation();
  const endNode = useStore(state => state.endNode);
  const setDidResponseFail = useStore(state => state.setDidResponseFail);
  const didResponseFail = useStore(state => state.didResponseFail);

  const {
    content,
    web_citations,
    work_citations,
    work_sourceFiles,
    pageNumbers,
  } = useMemo(() => {

    if (!message[selectedIndex]?.message?.content?.content) {
      return {
        content: '',
        web_citations: [],
        work_citations: [],
        work_sourceFiles: [],
        pageNumbers: [],
      };
    }

    if (message[selectedIndex]?.message?.author?.role != 'assistant') {
      return {
        content: message[selectedIndex]?.message?.content?.content,
        web_citations: [],
      };
    }
    try {
      // console.log("message[selectedIndex]?.message?.content", message[selectedIndex]?.message?.content)
      return (
        
        parseAnswerToHtml(
          message[selectedIndex]?.message?.content?.content,
          view === 'web' ? 4 : 1,
          message[selectedIndex]?.message?.content.work_citation_lookup || [],
          message[selectedIndex]?.message?.content.web_citation_lookup || [],
          message[selectedIndex]?.message?.content.thought_chain || [],
          () => {
            console.log('clicked');
          },
        ) || {
          content: '',
          web_citations: [],
          work_citations: [],
          work_sourceFiles: [],
          pageNumbers: [],
        }
      );
    } catch (error) {
      console.error('Error in parseAnswerToHtml:', error);
      return {
        content: '',
        web_citations: [],
        work_citations: [],
        work_sourceFiles: [],
        pageNumbers: [],
      };
    }
  }, [message[selectedIndex]?.message?.content?.content, view]);

  useFocusEffect(
    useCallback(() => {
      if (message[selectedIndex]?.children?.length) {
        setEndNode(null);
      } else {
        setEndNode(message[selectedIndex]);
      }
      // return () => setEndNode(null);
    }, [message, selectedIndex, setEndNode]),
  );

  const regenerate = () => {
    onRegenerate({
      parentId: message[selectedIndex]?.parent,
      prompt:
        mainObj[message[selectedIndex]?.parent]?.message?.content?.content,
      setSelectedIndex,
      selectedIndex: message.length - 1 || 0,
    });
    setSelectedIndex(selectedIndex + 1);
  };

  const onEdit = (text: string): void => {
    setEditable(true);
    setPrompt(text);
  };

  const onSendEditedPrompt = fromRetry => {
    if (!prompt && !fromRetry) return;
    // mainObj[message[selectedIndex]?.parent]?.children?.length;
    setEditable(false);
    setSelectedIndex(mainObj[message[selectedIndex]?.parent]?.children?.length);
    editPrompt({
      parentId: message[selectedIndex]?.parent,
      messageId: message[selectedIndex]?.id,
      prompt: prompt || didResponseFail.prompt,
      setSelectedIndex,
      selectedIndex: message.length - 1 || 0,
    });
    if (didResponseFail.prompt && fromRetry) {
      setDidResponseFail({prompt: '', pageIndex: undefined});
    }
  };

  const parseUrlContent = text => {
    const urlRegex = /(https?:\/\/[^\s\[\]]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return {type: 'url', value: part, key: index};
      }
      return {type: 'text', value: part, key: index};
    });
  };

  const handleOnOpenURL = (value) => {
    Linking.openURL(value).catch(err =>
      console.error('Failed to open URL:', err),
    );
  };
  

  const promptId = `${message[selectedIndex]?.message.author?.role}-${message[selectedIndex]?.message.id}`;

  return (
    <>
      <View
        className={`bg-slate-50 border ${
          editable ? 'border-teal-400' : 'border-slate-200'
        } rounded-2xl p-4 mb-4 
      ${
        message[selectedIndex]?.message?.author?.role === 'user'
          ? 'bg-slate-50'
          : 'bg-white'
      }`}
        data-testid={`${promptId}-view`}
        testID={`${promptId}-view`}>
        {editable ? (
          <View
            className="w-full"
            testID={`${promptId}-editable-view`}
            data-testid={`${promptId}-editable-view`}>
            <TextInput
              className={'text-sm font-normal max-h-[100px]'}
              placeholder={translate('chat_page.type_message_here')}
              // placeholderTextColor={placeholderTextColor}
              value={prompt}
              data-testid={`${promptId}-test-input`}
              onChangeText={value => setPrompt(value)}
              multiline={true}
              textAlign={`${language === 'ar' ? 'right' : 'left'}`}
            />
            <View className="flex-row justify-between h-[44px] w-full">
              <CustomTouchableOpacity
                className="bg-transparent h-[44px] w-[69px] items-center justify-center text-centers"
                onHandlePress={() => setEditable(false)}
                data-testid={`${promptId}-cancel-btn`}
                testID={`${promptId}-cancel-btn`}>
                <CustomText
                  styles="text-teal-500"
                  testID={`${promptId}-cancel`}
                  data-testid={`${promptId}-cancel`}>
                  {translate('message_prompt.cancel')}
                </CustomText>
              </CustomTouchableOpacity>
              <CustomTouchableOpacity
                className="bg-black h-[44px] w-[69px] items-center justify-center text-center rounded-2xl"
                onHandlePress={onSendEditedPrompt}
                data-testid={`${promptId}-send-btn`}
                testID={`${promptId}-send-btn`}>
                <CustomText
                  styles="text-white"
                  testID={`${promptId}-send`}
                  data-testid={`${promptId}-send`}>
                  {translate('message_prompt.send')}
                </CustomText>
              </CustomTouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {message[selectedIndex]?.message?.author?.role ? (
              <Markdown
                rules={{
                  link: (node, children, parent, styles, onLinkPress) => {
                    const linkAttributes = node.attributes.title || {};

                    const fileNameMatch =
                      linkAttributes.match(/FileName:\s*([^,]+),/);
                    const pageNumberMatch =
                      linkAttributes.match(/PageNumber:\s*(\d+)/);
                    const citationTypeMatch =
                      linkAttributes.match(/type:\s*([^,]+)/);

                  // Get values or set to null if not found backgroundColor: '#F1F5F9',
                  const fileName = fileNameMatch ? fileNameMatch[1].trim() : null;
                  const pageNumber = pageNumberMatch ? pageNumberMatch[1].trim() : null;
                  const citationType = citationTypeMatch ? citationTypeMatch[1].trim() : null;

                  return <> <CustomTouchableOpacity key={node.key}
                  style={[styles.link,{backgroundColor: '#F1F5F9',
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    transform: Platform.OS=="android"?[{translateY: 4}]:[],}]}
                    onHandlePress={() => { citationType === "web" ? Linking.openURL(node.attributes.href) : onOpenCitation(decodeURIComponent(node.attributes.href), fileName, pageNumber) }} >
                    <Text 
                     style={[styles.link, { lineHeight: 20, textAlignVertical: 'center',marginTop:Platform.OS=="ios"?-1:-2 }]}>
                      {children}
                    </Text>
                  </CustomTouchableOpacity></>
                },
                list_item: (
                  node,
                  children,
                  parent,
                  styles,
                  inheritedStyles = {},
                ) => {
                  // we need to grab any text specific stuff here that is applied on the list_item style
                  // and apply it onto bullet_list_icon. the AST renderer has some workaround code to make
                  // the content classes apply correctly to the child AST tree items as well
                  // as code that forces the creation of the inheritedStyles object for list_items
                  const refStyle = {
                    ...inheritedStyles,
                    ...StyleSheet.flatten(styles.list_item),
                  };

                    const arr = Object.keys(refStyle);

                    const modifiedInheritedStylesObj = {};

                    for (let b = 0; b < arr.length; b++) {
                      if (textStyleProps.includes(arr[b])) {
                        modifiedInheritedStylesObj[arr[b]] = refStyle[arr[b]];
                      }
                    }

                  if (hasParents(parent, 'bullet_list')) {
                    return (
                      <View
                        key={node.key}
                        style={styles._VIEW_SAFE_list_item}
                        data-testid={`${promptId}-bullet-list-view`}
                        testID={`${promptId}-bullet-list-view`}>
                        <Text
                          style={[
                            modifiedInheritedStylesObj,
                            styles.bullet_list_icon,
                            { color: '#000000', fontSize: Platform.OS == "ios" ? 40 : 30, lineHeight: Platform.OS == "ios" ? 32 : 28, marginTop: 2,textAlign:'center', },
                          ]}
                          accessible={false}
                          data-testid={`${promptId}-bullet-list-text`}
                          testID={`${promptId}-bullet-list-text`}>
                          {Platform.select({
                            android: '\u2022',
                            ios: '\u00B7',
                            default: '\u2022',
                          })}
                        </Text>
                        <View
                          style={[styles._VIEW_SAFE_bullet_list_content,{alignContent:'center'}]}
                          data-testid={`${promptId}-bullet-list-content-view`}
                          testID={`${promptId}-bullet-list-content-view`}>
                          {children}
                        </View>
                      </View>
                    );
                  }

                    if (hasParents(parent, 'ordered_list')) {
                      const orderedListIndex = parent.findIndex(
                        el => el.type === 'ordered_list',
                      );

                      const orderedList = parent[orderedListIndex];
                      let listItemNumber;

                      if (
                        orderedList.attributes &&
                        orderedList.attributes.start
                      ) {
                        listItemNumber =
                          orderedList.attributes.start + node.index;
                      } else {
                        listItemNumber = node.index + 1;
                      }

                      return (
                        <View
                          key={node.key}
                          style={styles._VIEW_SAFE_list_item}
                          data-testid={`${promptId}-ordered-list-view`}
                          testID={`${promptId}-ordered-list-view`}>
                          {/* <Text
                        style={[
                          modifiedInheritedStylesObj,
                          styles.ordered_list_icon,
                        ]}>
                        {isArabic(
                          message[selectedIndex]?.message?.content?.content,
                        )
                          ? node.markup + listItemNumber
                          : listItemNumber + node.markup}
                      </Text> */}
                        <Text
                          style={[
                            modifiedInheritedStylesObj,
                            styles.bullet_list_icon,
                            { color: '#000000', fontSize: Platform.OS == "ios" ? 6 : 30, lineHeight: Platform.OS == "ios" ? 20 : 30 },
                          ]}
                          accessible={false}
                          data-testid={`${promptId}-ordered-list-text`}
                          testID={`${promptId}-ordered-list-text`}>
                          {Platform.select({
                            android: '\u2022',
                            ios: '\u25CF',
                            default: '\u2022',
                          })}
                        </Text>
                        <View
                          style={styles._VIEW_SAFE_ordered_list_content}
                          data-testid={`${promptId}-ordered-list-content-view`}
                          testID={`${promptId}-ordered-list-content-view`}>
                          {children}
                        </View>
                      </View>
                    );
                  }

                  // we should not need this, but just in case
                  return (
                    <View
                      key={node.key}
                      style={styles._VIEW_SAFE_list_item}
                      data-testid={`${promptId}-safe-list-item-view`}
                      testID={`${promptId}-safe-list-item-view`}>
                      {children}
                    </View>
                  );
                },
                text: props => {
                  const {content} = props;
                  const parsedContent = parseUrlContent(content);
                  const hasUrls = parsedContent?.some(({ type }) => type === 'url');

                  return hasUrls ? (
                    <Text>
                      {parsedContent.map(({type, value, key}) => {
                        if (type === 'url') {
                          return (
                            <Text
                              key={key}
                              onPress={() => handleOnOpenURL(value)}
                            >
                              {value}
                            </Text>
                          );
                        }
                        return value;
                      })}
                    </Text>
                  ) : (
                    content
                  );
                },
              }}
              style={{
                list_item: {
                  flexDirection: listDirection(
                    language,
                    message[selectedIndex]?.message?.content?.content,
                  ),
                  color: '#000000',
                  justifyContent: 'flex-start',
                },
                bullet_list_content: {
                  color: '#000000',
                  lineHeight: 22,
                },
                textgroup: {
                  textAlign: textDirection(
                    language,
                    message[selectedIndex]?.message?.content?.content,
                  ),
                  width: '100%',
                  color: '#000000',
                  fontFamily: 'Montserrat',
                  fontSize: 14,
                  lineHeight: 23,
                },
                ordered_list_content: {
                  lineHeight: 22,
                },
                paragraph: {
                  lineHeight: 21,
                },
                heading1: {
                  flexDirection: 'row',
                  fontSize: 32,
                  marginTop: 10,
                },
                heading2: {
                  flexDirection: 'row',
                  fontSize: 24,
                  marginTop: 10,
                },
                heading3: {
                  flexDirection: 'row',
                  fontSize: 18,
                  marginTop: 10,
                },
                heading4: {
                  flexDirection: 'row',
                  fontSize: 16,
                  marginTop: 10,
                },
                heading5: {
                  flexDirection: 'row',
                  fontSize: 13,
                  marginTop: 10,
                },
                heading6: {
                  flexDirection: 'row',
                  fontSize: 11,
                  marginTop: 10,
                },
                thead: {
                  fontWeight: '600',
                },
                table: {
                  borderWidth: 1,
                  borderColor: '#000000',
                  borderRadius: 3,
                  marginTop: 15,
                },
                td: {
                  flex: 1,
                  padding: 5,
                  borderRightColor: '#000000',
                  borderRightWidth: 1,
                },
                th: {
                  flex: 1,
                  padding: 5,
                  borderRightColor: '#000000',
                  borderRightWidth: 1,
                },
                link: {
                  
                  fontSize: 12,
                  textDecorationLine: 'none',
                  textAlign: 'center'
                },
              }}>

              {(message[selectedIndex]?.message?.author?.role === 'assistant' &&
                (message[selectedIndex]?.isFinal === true ||
                  message[selectedIndex]?.isFinal === false) &&
                !message[selectedIndex]?.isFinal ? content + ' █' : content) || ''}
            </Markdown>

          ) : (
            <CustomText
              styles={`text-[14px] leading-[21px] text-black text-${textDirection(
                language,
                message[selectedIndex]?.message?.content?.content,
              )}`}
              data-testid={`${promptId}-content`}
              testID={`${promptId}-content`}>
              {message[selectedIndex]?.message?.content?.content}
            </CustomText>
          )}
          {web_citations.length ? (
            <>
              <CustomText
                styles={`mr-1 text-[12px] font-[700] text-[#626768] leading-[16px] py-4 flex w-full text-${textDirection(
                  language,
                  translate("chat_page.citations"),
                )}`}
                data-testid={`${promptId}-content`}
                testID={`${promptId}-content`}>
                {translate("chat_page.citations")}
              </CustomText>
              <View data-testid={`${message[selectedIndex]?.id}-work-cit`}
                className="grid grid-cols-3 gap-4 sm:grid-cols-1 xs:grid-cols-1"
              >
                {web_citations.map((x, i) => {
                  return (
                    <CustomTouchableOpacity
                      key={i}
                      data-testid={`${message[selectedIndex]?.id}-web_citation`}
                      style={{ flexWrap: 'wrap' }}
                      className={`inline-block font-medium border-2 py-0 rounded-[100px] border-slate-300 bg-white no-underline cursor-pointer hover:underline truncate hover:text-clip`}
                      onHandlePress={() => {
                        Linking.openURL(x)
                      }
                      }
                    >
                      <View
                        data-testid={`${message[selectedIndex]?.id}-1`}
                        // style={{ flexShrink: 1, }}
                        className={`items-center flex overflow-hidden my-1 mx-1 ${flexDirection(language, x.toString())}`}>
                        <View
                          data-testid={`${message[selectedIndex]?.id}-2`}

                          className={`w-[18px] h-[18px] bg-[#e8eff6] rounded-full flex-col justify-center items-center inline-flex ${textDirection(language, x.toString()) == 'right' ? "ml-2" : "mr-2"}`}
                        >
                          <CustomText
                            styles={`text-black text-[12px] leading-[16px] font-normal text-center font-['Helvetica Neue'] `}
                            data-testid={`${message[selectedIndex]?.id}-3`}
                            testID={`${message[selectedIndex]?.id}-3`}>
                            {++i}
                          </CustomText>

                        </View>
                        <CustomText
                          styles={`text-black text-[12px] max-w-[92%] leading-[16px] font-normal text-center font-['Helvetica Neue'] ${textDirection(language, x.toString()) == 'right' ? "ml-auto" : "mr-auto"}`}
                          numberOfLines={1}
                          ellipsizeMode='tail'
                          data-testid={`${message[selectedIndex]?.id}-3`}
                          testID={`${message[selectedIndex]?.id}-3`}>
                          {x}
                        </CustomText>

                      </View>




                    </CustomTouchableOpacity>


                  );
                })}
              </View>
            </>
          ) : null}
          {work_citations?.length ? (
            <>
              <CustomText
                styles={`mr-1 text-[12px] font-[700] text-[#626768] leading-[16px] py-4 flex w-full text-${textDirection(
                  language,
                  translate("chat_page.citations"),
                )}`}
                data-testid={`${promptId}-content`}
                testID={`${promptId}-content`}>
                {translate("chat_page.citations")}
              </CustomText>

              <View data-testid={`${message[selectedIndex]?.id}-work-cit`}
                className="grid grid-cols-3 gap-4 sm:grid-cols-1 xs:grid-cols-1"
              >
                {work_citations.map((x: string, i: number) => {
                  return (

                    <CustomTouchableOpacity
                      key={i}
                      data-testid={`${message[selectedIndex]?.id}-work_citation`}
                      style={{ flexWrap: 'wrap' }}
                      className={`inline-block font-medium border-2 py-0 rounded-[100px] border-slate-300 bg-white no-underline cursor-pointer hover:underline truncate hover:text-clip`}
                      onHandlePress={() => {
                        onOpenCitation(work_sourceFiles[x], x, pageNumbers?.[x])
                      }
                      }
                    >
                      <View
                        data-testid={`${message[selectedIndex]?.id}-1`}
                        style={{ flexShrink: 1, }}
                        className={`items-center flex overflow-hidden my-1 mx-1 ${flexDirection(language, x.toString())}`}>
                        <View
                          data-testid={`${message[selectedIndex]?.id}-2`}

                          className={`w-[18px] h-[18px] bg-[#e8eff6] rounded-full flex-col justify-center items-center inline-flex ${textDirection(language, x.toString()) == 'right' ? "ml-2" : "mr-2"}`}
                        >
                          <CustomText
                            styles={`text-black text-[12px] leading-[16px] font-normal text-center font-['Helvetica Neue']`}
                            data-testid={`${message[selectedIndex]?.id}-3`}
                            testID={`${message[selectedIndex]?.id}-3`}
                          >
                            {++i}
                          </CustomText>
                          {/* <Text data-testid={`${message[selectedIndex]?.id}-3`} className={`text-black text-[12px] leading-[16px] font-normal text-center font-['Helvetica Neue']  text-${textDirection(
                            language,
                           i.toString(),
                          )}`}>{`${++i}`}</Text> */}
                        </View>
                        <CustomText
                          styles={`text-black text-[12px] max-w-[92%] leading-[16px] font-normal text-center font-['Helvetica Neue']  t ${textDirection(language, x.toString()) == 'right' ? "ml-auto" : "mr-auto"}`}
                          numberOfLines={1}
                          ellipsizeMode='tail'
                          data-testid={`${message[selectedIndex]?.id}-3`}
                          testID={`${message[selectedIndex]?.id}-3`}>
                          {x?.split("/")
                            ?.at(-2)}
                        </CustomText>
                        {/* <Text data-testid={`${message[selectedIndex]?.id}-4`} style={{ maxWidth: '92%' }} numberOfLines={1} ellipsizeMode='tail' className=" text-sm font-normal text-[12px] leading-[16px] font-normal font-['Helvetica Neue'] leading-tight truncate text-start">{`${x
                          ?.split("/")
                          ?.at(-2)}`}</Text> */}
                        </View>
                      </CustomTouchableOpacity>
                    );
                  })}
                </View>
              </>
            ) : null}
            {(message[selectedIndex]?.message?.author?.role === 'assistant'
              ? !canStop
              : true) &&
              !generating.show && (
                <MessageFooter
                  promptId={promptId}
                  isAssistant={
                    message[selectedIndex]?.message?.author?.role === 'user'
                  }
                  text={message[selectedIndex]?.message?.content?.content}
                   onRegenerate={regenerate}
                  onEdit={onEdit}
                  messages={message}
                  setSelectedIndex={setSelectedIndex}
                  selectedIndex={selectedIndex}
                  showPagination={
                    message[selectedIndex]?.message?.author?.role ===
                    'assistant'
                      ? (message[selectedIndex]?.isFinal ?? true) &&
                        message?.length > 1
                      : message?.length > 1
                  }
                  citations={message[selectedIndex]?.message?.content?.web_citation_lookup}
                />
              )}
          </>
        )}
      </View>
      {didResponseFail.prompt &&
        selectedIndex === didResponseFail.pageIndex && (
          <View
            className={`rounded-2xl p-4 mb-4 
        ${'bg-white'} flex-row bg-[#FFE7E7] `}>
            <View className="pl-1 pr-1">
              <IconButton
                Icon={CloseOctagon}
                style={{marginRight: 8, marginLeft: -4}}
                testID={`${promptId}-regenerate-icon`}
              />
            </View>
            <View className="flex-1">
              <Text
                className="text-black"
                style={{
                  textAlign: textDirection(
                    language,
                    message[selectedIndex]?.message?.content?.content,
                  ),
                }}>
                {translate('chat_page.error_in_response_try_again')}
              </Text>
              <TouchableOpacity
                onPress={() => onSendEditedPrompt(true)}
                className={`bg-white pt-2 pb-2 rounded-3xl mt-5 w-24 items-center justify-center flex-row`}>
                <IconButton
                  disabled
                  Icon={ReGenerateIcon}
                  style={{marginRight: 8, marginLeft: -4}}
                  testID={`${promptId}-regenerate-icon`}
                />
                <Text
                  className="text-black"
                  style={{
                    textAlign: textDirection(
                      language,
                      message[selectedIndex]?.message?.content?.content,
                    ),
                  }}>
                  {translate('chat_page.retry')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
    </>
  );
}

export default Message;