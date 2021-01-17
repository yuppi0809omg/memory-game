import React, { Component } from 'react';
import { Footer, FooterTab, Button } from 'native-base';
import { View, Text } from 'react-native';

export const CustomFooter = ({ resetState, navigateToInst, isCPUTurn }) => {
  return (
    <Footer>
      <FooterTab>
        <Button>
          <Text
            // pointerEvents={isCPUTurn ? true : false}
            onPress={() => {
              resetState();
            }}
          >
            リセット
          </Text>
        </Button>
        <Button>
          <Text
            pointerEvents={isCPUTurn ? true : false}
            onPress={() => {
              navigateToInst();
            }}
          >
            写真チェンジ
          </Text>
        </Button>
      </FooterTab>
    </Footer>
  );
};
