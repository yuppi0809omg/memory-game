import { Text } from 'react-native';
import React from 'react';
import { useFonts } from 'expo-font';
import { Spinner } from 'native-base';

export const CustomText = ({ children, style }) => {
  let [fontsLoaded] = useFonts({
    PottaOne: require('../assets/fonts/PottaOne-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return <Spinner color="red"></Spinner>;
  } else {
    return <Text style={{ ...style, fontFamily: 'PottaOne' }}>{children}</Text>;
  }
};
