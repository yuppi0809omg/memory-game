import React, { Component } from 'react';
import { Footer, FooterTab, Button } from 'native-base';
import { View, Text } from 'react-native';
import { CustomText } from './CustomText';

export const CustomFooter = ({ resetState, navigateToInst, isCPUTurn }) => {
  return (
    <Footer>
      <FooterTab>
        <Button>
          <CustomText
            // pointerEvents={isCPUTurn ? true : false}
            onPress={() => {
              resetState();
            }}
          >
            リセット
          </CustomText>
        </Button>
        <Button>
          <CustomText
            pointerEvents={isCPUTurn ? true : false}
            onPress={() => {
              navigateToInst();
            }}
          >
            写真チェンジ
          </CustomText>
        </Button>
      </FooterTab>
    </Footer>
  );
};
