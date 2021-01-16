import { Text } from 'react-native';
import React from 'react';
import { useFonts } from 'expo-font';

export const CustomText = ({ children, style }) => {
  let [fontsLoaded] = useFonts({
    PottaOne: require('../assets/fonts/PottaOne-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return <Text>ロード中...</Text>;
  } else {
    return <Text style={{ ...style, fontFamily: 'PottaOne' }}>{children}</Text>;
  }
};
