import {StyleSheet} from 'react-native';

function styles() {
  return StyleSheet.create({
    headerShadow: {
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      shadowColor: '#101010',
      elevation: 30,
    },
  });
}

export default styles;
