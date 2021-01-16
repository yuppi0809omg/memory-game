import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title,
} from 'native-base';

export const CustomHeader = () => {
  return (
    <Header>
      <Left>
        <Button hasText transparent>
          <Text style={{ fontSize: 10 }}>戻る</Text>
        </Button>
      </Left>
      <Body>
        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>神経衰弱</Text>
      </Body>
      <Right />
    </Header>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 10,
  },
});
