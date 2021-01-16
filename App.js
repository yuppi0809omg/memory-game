import React, { useState, useEffect } from 'react';
import { Top } from './components/Top';
import { Game } from './components/Game';
import { Instruction } from './components/Instruction';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Root } from 'native-base';
// import { useFonts } from 'expo-font';

const Stack = createStackNavigator();

export default App = () => {
  // let [fontsLoaded] = useFonts({
  //   PottaOne: require('./assets/fonts/PottaOne-Regular.ttf'),
  // });
  return (
    <Root>
      <NavigationContainer>
        <Stack.Navigator style={{ fontFamily: 'PottaOne', fontSize: 40 }}>
          <Stack.Screen
            name="Top"
            component={Top}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Instruction" component={Instruction} />
          <Stack.Screen
            name="Game"
            component={Game}
            options={{ headerLeft: null }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Root>
  );
};
