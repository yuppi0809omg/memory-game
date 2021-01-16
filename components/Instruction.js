import React, { useState, useEffect } from 'react';
import { Container, Header, Content, Button, Text } from 'native-base';
import { Image } from 'react-native';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import Images from '../Images/Images';
import { CustomText } from './CustomText';

export const Instruction = ({ navigation }) => {
  const generateRandomNum = (count) => {
    return Math.floor(Math.random() * count);
  };

  const [imageNum, setImageNum] = useState(
    generateRandomNum(Images.cards.cardPhotos.length)
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setImageNum(generateRandomNum(Images.cards.cardPhotos.length));
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  return (
    <Container>
      <Content contentContainerStyle={styles.centeredView}>
        <CustomText
          style={{ fontWeight: 'bold', fontSize: 20, paddingVertical: 20 }}
        >
          この画像を2枚探してください
        </CustomText>
        <View style={styles.imageHolder}>
          <Image
            source={Images.cards.cardPhotos[imageNum]}
            style={styles.image}
          />
        </View>
        <Button
          block
          info
          large
          style={{}}
          onPress={() => {
            navigation.navigate('Game', { imageNum: imageNum });
          }}
        >
          <CustomText style={{ color: 'white' }}>OK</CustomText>
        </Button>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 60,
  },
  imageHolder: {
    marginBottom: 20,
  },
});
