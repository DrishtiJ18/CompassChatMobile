import React from 'react';
import {View, Text} from 'react-native';
import {DrawerActions} from '@react-navigation/native';
import ArabicFlag from '@images/header/arabicFlag.svg';
import Edit from '@images/header/EditSquare.svg';
import Menu from '@images/header/menu.svg';
import DownArrow from '@images/header/arrow_down.svg';
import CustomPressable from '../CustomPressable';
import {navigationRef} from 'ROOTDIR/App';

const Header = () => {
  return (
    <View className="w-full h-[40px] flex-row justify-between items-center pl-[15px]">
      <CustomPressable
        className=""
        onPress={() => {
          navigationRef?.dispatch(DrawerActions.toggleDrawer());
        }}>
        <View className="items-center flex-row">
          <Menu />
        </View>
      </CustomPressable>
      <View className="flex-row justify-end items-center w-[65px]">
        <Text>{'GPT'}</Text>
        {/* <View className="h-full w-[24px] items-center"> */}
        <DownArrow />
        {/* </View> */}
      </View>
      <View className="flex-row justify-between items-center">
        <View className="w-[44px]">
          <ArabicFlag className="aspect-square" />
        </View>
        <View className="w-[44px]">
          <Edit className="aspect-square" />
        </View>
      </View>
    </View>
  );
};

export default Header;
