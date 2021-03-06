import React, { Component } from 'react';
import { Footer, FooterTab, Button } from 'native-base';
import { View, Text } from 'react-native';
import { CustomText } from './CustomText';

export const CustomFooter = ({ resetState, navigateToInst, isCPUTurn }) => {
  return (
    <Footer>
      <FooterTab style={{ backgroundColor: 'lightgrey' }}>
        <Button
          pointerEvents={isCPUTurn ? 'none' : 'auto'}
          onPress={() => {
            console.log('RESET!!');
            resetState();
          }}
        >
          <CustomText>リセット</CustomText>
        </Button>

        <Button
          pointerEvents={isCPUTurn ? 'none' : 'auto'}
          onPress={() => {
            console.log('RESET!!');
            resetState();
          }}
        >
          <CustomText>写真チェンジ</CustomText>
        </Button>
      </FooterTab>
    </Footer>
  );
};
