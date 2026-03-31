import React, {useContext, useEffect, useState} from 'react';
import {
  Keyboard,
  View,
  ImageBackground,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {useStore} from '@src/stores';
import screenNameConstants from '@src/navigator/AuthNavigator/screenNameConstants';
import GradientText from '@src/components/custom/gradientText';
import CustomText from '@src/components/custom/CustomText';
import CustomTouchableOpacity from '@src/components/custom/CustomTouchableOpacity';
import {authorizeUser} from '@src/apiConfigs/tokens';
import {formatEnvVariables} from '@src/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import {getConfig, getUser, handleEvent} from '@src/apiConfigs/apiServices';
import OrganizationSelectorModal from '@src/components/Modals/OrganizationSelectorModal';
import {NetInfoContext} from '@src/context/NetInfoContext';
import BG from '../../assets/images/bg.png';
import Header from '@src/layouts/header';
import {styled} from 'nativewind';

const StyledView = styled(View);

function LandingPage() {
  const [organizationId, setOrganizationId] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const {t: translate} = useTranslation();
  const setUserDetails = useStore(state => state.setUserDetails);
  const [invalidText, setInvalidText] = useState('');
  const {isOnline} = useContext(NetInfoContext);
  const isShowLoader = useStore(state => state.isShowLoader);
  const setIsShowLoader = useStore(state => state.setIsShowLoader);
  const [languageSwitchLoader, setlanguageSwitchLoader] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    if (openModal) {
      const timeoutId = setTimeout(() => {
        if (!organizationId) {
          onCloseModal();
        }
      }, 10000);

      return () => clearTimeout(timeoutId);
    }
  }, [openModal, organizationId]);

  const fetchConfig = async () => {
    try {
      Keyboard.dismiss();
      if (!organizationId) {
        setInvalidText(translate('landing_page.please_enter_org_id'));
        return;
      }

      setLoader(true);
      const configRes = await getConfig(organizationId);
      setLoader(false);
      if (
        organizationId &&
        configRes.request.responseURL.split('/').includes(organizationId)
      ) {
        const newEnvVar = formatEnvVariables(configRes.data);

        Config.CLIENT_ID = newEnvVar.VITE_SSO_CLIENT_ID;
        Config.AUTHORITY_URL = newEnvVar.VITE_SSO_AUTHORITY;
        Config.CLIENT_NAME = newEnvVar.VITE_CLIENT_PATH;
        Config.GPT = newEnvVar.VITE_CHAT_MODELS.GPT;
        Config.Jais = newEnvVar.VITE_CHAT_MODELS.Jais;
        Config.APP_LOGO = newEnvVar.VITE_LOGO;
        Config.ISSUER = newEnvVar.VITE_SSO_AUTHORITY?.match(
          /^(https:\/\/[^\/]+\/)/,
        )[1];
        if (newEnvVar?.VITE_LOGO_SIZE) {
          Config.LOGO_SIZE = newEnvVar.VITE_LOGO_SIZE;
        }
        setOpenModal(false);
        AsyncStorage.setItem('organizationId', organizationId).then(() => {
          initiate();
        });
      } else {
        setInvalidText(translate('landing_page.invalid_org_id'));
      }
    } catch (error) {
      console.log('error', error);
      setIsShowLoader(false);
    }
  };

  function onCloseModal() {
    setInvalidText('');
    setOpenModal(false);
    setOrganizationId('');
    setIsShowLoader(false);
  }

  const initiate = async () => {
    try {
      const result = await authorizeUser();
      setUserDetails({
        name: result?.name,
        email: result?.preferred_username,
        avatar: '',
      });

      if (result) {
        try {
          setIsShowLoader(false);
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                {
                  name: 'AuthScreen',
                  state: {
                    routes: [{name: screenNameConstants.HOME_SCREEN}],
                  },
                },
              ],
            }),
          );
          await getUser();
          await handleEvent({type: 'login'});
        } catch (error) {
          console.log('error', error);
        } finally {
          setIsShowLoader(false);
        }
      }
    } catch (error) {
      console.error(
        'Error initializing the pca, check your config.',
        JSON.stringify(error),
      );
    } finally {
      setIsShowLoader(false);
    }
  };

  const checkWhetherConfigured = () => {
    if (!isOnline) {
      return;
    }
    setIsShowLoader(true);
    AsyncStorage.getItem('organizationId')
      .then(orgId => {
        if (orgId) {
          initiate();
        } else {
          setOpenModal(true);
        }
      })
      .catch(orgIdErr => {
        if (orgIdErr) {
          setOpenModal(true);
        } else {
          setIsShowLoader(false);
        }
      });
  };

  function onUserInput(value: string) {
    if (invalidText) {
      setInvalidText('');
    }
    setOrganizationId(value);
  }

  return (
    <>
      <SafeAreaView className="flex-1">
        <View className="flex-1 w-full h-full">
          <View className="flex-1 w-full h-full">
            <ImageBackground
              source={BG}
              className="flex-1 w-full h-full"
              testID="bg-image-background">
              {languageSwitchLoader ? (
                <StyledView className="flex-1 flex-row justify-center items-center">
                  <ActivityIndicator size={'large'} />
                </StyledView>
              ) : (
                <View className="flex-1 w-full h-full flex flex-col">
                  <Header setlanguageSwitchLoader={setlanguageSwitchLoader} />
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View className="flex items-start justify-start mb-28 px-1">
                      <GradientText
                        className="text-[#1F2937] text-[40px] font-medium leading-[48px] font-montserrat"
                        gradientColors={['#1F2937', '#0393D1', '#03D1AD']}
                        testID="beyond-ai-gradient-text">
                        {translate('landing_page.ai_with_empathy')}
                      </GradientText>
                    </View>
                    <View className="relative flex-shrink-0 h-14 w-[343px] border border-solid border-[#1b1b19] rounded-xl flex flex-col items-center">
                      {isShowLoader ? (
                        <ActivityIndicator
                          size="small"
                          className="flex items-center justify-center h-full w-full"
                          testID="start-using-btn-loader"
                        />
                      ) : (
                        <CustomTouchableOpacity
                          className="flex items-center justify-center h-full w-full"
                          onHandlePress={checkWhetherConfigured}
                          testID="start-using-btn">
                          <CustomText
                            styles="text-[#1b1b19] font-montserrat text-lg font-medium leading-[27px] capitalize"
                            testID="start-using">
                            {translate('landing_page.start_using')}
                          </CustomText>
                        </CustomTouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              )}
            </ImageBackground>
          </View>
        </View>
      </SafeAreaView>

      <OrganizationSelectorModal
        openModal={openModal}
        organizationId={organizationId}
        onUserInput={onUserInput}
        invalidText={invalidText}
        fetchConfig={fetchConfig}
        loader={loader}
        onCloseModal={onCloseModal}
      />
    </>
  );
}

export default LandingPage;
