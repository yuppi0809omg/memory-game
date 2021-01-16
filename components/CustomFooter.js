import React, { Component } from 'react';
import { Footer, FooterTab, Button } from 'native-base';
import { View, Text } from 'react-native';

export const CustomFooter = ({ resetState, navigateToInst }) => {
  return (
    <Footer>
      <FooterTab>
        <Button>
          <Text
            onPress={() => {
              resetState();
            }}
          >
            リセット
          </Text>
        </Button>
        <Button>
          <Text
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
