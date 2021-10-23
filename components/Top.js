import React from 'react';
import { Container, Header, Content, Button, Text } from 'native-base';
import {
  StyleSheet,
  ImageBackground,
  View,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import Images from '../Images/Images';
import { generateRandomNum } from '../Help';
import { CustomText } from './CustomText';

export const Top = ({ navigation }) => {
  const imgNum = generateRandomNum(Images.cards.cardPhotos.length);
  return (
    <Container>
      <ImageBackground
        source={Images.cards.cardFail}
        style={styles.image}
      >
        <Content contentContainerStyle={styles.centeredView}>
          <CustomText
            style={{
              fontSize: 45,
              color: 'white',
              textShadowRadius: 2,
              textShadowColor: 'grey',
            }}
          >
            神経衰弱
          </CustomText>
          <Button
            block
            info
            large
            onPress={() => {
              navigation.navigate('Game');
            }}
          >
            <CustomText
              style={{
                fontSize: 20,
                color: 'white',
                textShadowRadius: 2,
                textShadowColor: 'grey',
              }}
            >
              ゲームを始める
            </CustomText>
          </Button>
        </Content>
      </ImageBackground>
    </Container>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  text: {
    fontSize: 50,
    color: 'white',
    fontWeight: '900',
  },
});
