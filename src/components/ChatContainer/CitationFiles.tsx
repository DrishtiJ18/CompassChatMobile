import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  I18nManager,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {StackActions, useNavigation, useRoute} from '@react-navigation/native';
import CustomTouchableOpacity from '@src/components/custom/CustomTouchableOpacity';
import {useStore} from '@src/stores';
import RNFS from 'react-native-fs';
import Markdown from 'react-native-markdown-display';
import Close from '@images/drawer/close.svg';
import Download from '@images/message/download.svg';
import Printing from '@images/message/printing.svg';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import RNPrint from 'react-native-print';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Pdf from 'react-native-pdf';
import WebView from 'react-native-webview';

type CitationFilesTypes = {
  fileUrl: string;
  // isOpen: boolean;
  // onClose: () => void;
  name: string;
  type: string;
  page: string;
};

const CitationFiles: React.FC<CitationFilesTypes> = () => {
  const {
    params: {fileUrl, name, type, page},
  } = useRoute();
  const language = useStore(state => state.language);
  const [plainTextContent, setPlainTextContent] = useState<string>('');
  const [markDownContent, setMarkdownContent] = useState<string>('');
  const [webViewKey, setWebViewKey] = useState(0);
  const reloadPdf = () => {
    setWebViewKey(prevKey => prevKey + 1);
  };
  const navigation = useNavigation();

  function onClose() {
    navigation.dispatch(StackActions.pop(1));
  }

  useEffect(() => {
    if (!fileUrl) {
      return;
    }
    const fetchMarkdownContent = async () => {
      try {
        const response = await fetch(fileUrl!);
        const content = await response.text();
        setShowAnimation(false);
        setMarkdownContent(content);
      } catch (error) {
        console.error('Error fetching Markdown content:', error);
      }
    };
    if (type == 'md') {
      setShowAnimation(true);
      fetchMarkdownContent();
    }
    reloadPdf();
  }, [fileUrl, type]);
  useEffect(() => {
    const fetchPlainTextContent = async () => {
      try {
        if (!fileUrl) {
          return;
        }
        const response = await fetch(fileUrl!);
        const content = await response.text();
        setShowAnimation(false);
        setPlainTextContent(content);
      } catch (error) {
        console.error('Error fetching plain text content:', error);
      }
    };

    if (['json', 'txt', 'xml'].includes(type)) {
      setShowAnimation(true);
      fetchPlainTextContent();
    }
  }, [fileUrl, type]);

  const {width} = Dimensions.get('window');
  const translateX = useSharedValue(I18nManager.isRTL ? -width : width);
  const [showAnimation, setShowAnimation] = useState<boolean>(true);
  // const animatedStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [{translateX: translateX.value}],
  //   };
  // });
  // const openModal = () => {
  //   translateX.value = withTiming(0, {duration: 500}); // Slide in from right to left
  // };

  // const closeModal = () => {
  //   translateX.value = withTiming(
  //     I18nManager.isRTL ? -width : width, // Slide out depending on the language direction
  //     {duration: 500},
  //     () => {
  //       runOnJS(onClose)(); // Optional callback when the animation completes
  //     },
  //   );
  // };
  // useEffect(() => {
  //   if (isOpen) openModal();
  //   else closeModal();
  // }, [isOpen]);

  const printPDF = async (fileUrl: string) => {
    try {
      await RNPrint.print({
        filePath: fileUrl, // Replace with your PDF URL
      });
    } catch (error) {
      console.error('Failed to print the PDF:', error);
    }
  };
  const downloadPDF = async (fileUrl: string, name: string) => {
    const filePath = `${
      Platform.OS === 'android'
        ? RNFS.DownloadDirectoryPath
        : RNFS.DocumentDirectoryPath
    }/${name}`;

    // Check and request permissions (only required for Android)
    const checkPermission = async () => {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          return true;
        } else {
          const storagePermission =
            Platform.Version < 29
              ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
              : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

          const status = await check(storagePermission);
          // console.log('Current permission status:', status);

          if (status !== RESULTS.GRANTED) {
            const requestResult = await request(storagePermission);
            if (requestResult === RESULTS.BLOCKED) {
              Linking.openSettings();
              return false;
            }
            return requestResult === RESULTS.GRANTED;
          }
        }
        return true;
      }
    };

    const hasPermission = await checkPermission();
    if (!hasPermission) {
      // Platform.OS === 'android' ? showToast("Storage permission is required to download the file.") : showToast("Permission Required");
      return;
    }

    // Download the file
    try {
      const downloadResult = await RNFS.downloadFile({
        fromUrl: fileUrl,
        toFile: filePath,
      }).promise;

      if (downloadResult.statusCode === 200) {
        // showToast(`File downloaded `+filePath);
      } else {
        // showToast('There was an issue downloading the file.');
      }
    } catch (error) {
      console.error('Download error:', error);
      // showToast('An error occurred while downloading the file.');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}} accessible={false}>
      <View style={[styles.modal]}>
        <View style={styles.closeButtonContainer}>
          <CustomTouchableOpacity
            style={styles.closeButton}
            onHandlePress={onClose}
            testID="citation-close-btn">
            <Close
              height={13}
              width={13}
              color={'#94A3B8'}
              testID="citation-close-icon"
            />
          </CustomTouchableOpacity>
        </View>
        <View style={{flex: 1}}>
          {/* {showAnimation && <View style={{
                        justifyContent: 'center',
                        alignSelf: 'center',
                        zIndex: 10,
                        backgroundColor: 'white'
                    }}>
                        <GeneratingAnimation
                            show={true}
                        />
                    </View>} */}
          <Text
            className={`text-[14px] mb-[10px] w-[90%] ${
              language === 'ar' ? 'text-left' : 'text-left'
            }`}>
            {name}
          </Text>
          {type && ['xlsx', 'pptx', 'docx', 'doc'].includes(type) && (
            <WebView
              source={{
                uri: `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                  fileUrl,
                )}&action=embedview`,
              }}
              style={{width: '100%', height: '100%', marginTop: 15}}
              onLoadStart={() => setShowAnimation(true)}
              onLoadEnd={() => setShowAnimation(false)}
            />
          )}
          {type === 'pdf' && (
            <View
              style={{
                flex: 1,
                marginTop: 15,
                margin: 0,
                padding: 0,
                overflow: 'hidden',
              }}>
              <View
                className="w-full h-[30px] justify-end items-center flex flex-row px-2"
                style={{
                  backgroundColor: '#191919',
                  position: 'absolute',
                  top: 0.2,
                }}>
                <CustomTouchableOpacity
                  onHandlePress={() => downloadPDF(fileUrl, name)}
                  testID="citation-download-btn">
                  <Download
                    height={18}
                    width={18}
                    color={'#191919'}
                    testID="citation-download-icon"
                  />
                </CustomTouchableOpacity>
                <View style={{width: 20}} />
                <CustomTouchableOpacity
                  onHandlePress={() => printPDF(fileUrl)}
                  testID="citation-print-btn">
                  <Printing
                    height={18}
                    width={18}
                    color={'#191919'}
                    testID="citation-print-icon"
                  />
                </CustomTouchableOpacity>
              </View>
              <Pdf
                source={{uri: fileUrl}}
                onLoadComplete={(numberOfPages, filePath) => {
                  setShowAnimation(false);
                }}
                // fitPolicy={1}
                trustAllCerts={false}
                page={parseInt(page)}
                onError={(error: any) => {
                  console.log(error);
                }}
                // enablePaging={true}

                style={{
                  zIndex: -1,
                  flex: 1,
                  paddingVertical: 0,
                  backgroundColor: '#525659',
                  paddingTop: 30,
                  paddingHorizontal: 0,
                }}
              />
              {/* <WebView
                                key={fileUrl + webViewKey}
                                source={{ uri: `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&page=${page}` }}
                                style={{
                                    flex: 1, margin: 0,
                                    padding: 0,
                                }}
                                onLoadStart={() => { setShowAnimation(true),console.log(`https://docs. google.com/gview?url=${encodeURIComponent(fileUrl)}&page=${page}`), console.log(fileUrl + webViewKey) }}
                                onLoadEnd={() => setShowAnimation(false)}
                            /> */}
            </View>
          )}
          {type === 'md' && (
            <ScrollView>
              <Markdown>{markDownContent}</Markdown>
            </ScrollView>
          )}
          {type && ['json', 'txt', 'xml'].includes(type) && (
            <Text style={styles.preformattedText}>{plainTextContent}</Text>
          )}
          {type == 'default' && (
            <WebView
              source={{uri: fileUrl}}
              style={{width: '100%', height: '100%', marginTop: 15}}
              onLoadStart={() => setShowAnimation(true)}
              onLoadEnd={() => setShowAnimation(false)}
            />
          )}
        </View>
        {showAnimation && (
          <ActivityIndicator
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
            size={'large'}
            testID="chat-container-loader"
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modal: {
    // position: 'absolute',
    // top: 0,
    // right: 0,
    // bottom: 0,
    flex: 1,
    width: Dimensions.get('window').width * 0.9, // Take 80% of screen width
    // backgroundColor: 'red',
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // elevation: 5,
    //padding: 20,
    margin: 20,
    alignSelf: 'center',
    zIndex: 500,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 0,
    right: 10,
    zIndex: 1,
  },
  closeButton: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 500,
  },
  preformattedText: {
    fontFamily: 'Courier New',
  },
});
export default CitationFiles;
