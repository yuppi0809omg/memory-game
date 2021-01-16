import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TouchableHighlight,
} from 'react-native';
import { CustomHeader } from './CustomHeader';
import { CustomFooter } from './CustomFooter';
import { CustomModal } from './CustomModal';
import { Instruction } from './Instruction';
import Images from '../Images/Images';
import { Container, Button, Icon, Title, Content } from 'native-base';

const styles = StyleSheet.create({
  image: {
    width: 120,
    height: 120,
  },
  imageBox: {
    paddingBottom: 65,
  },
});

export const Game = ({ navigation, route }) => {
  const generateCardBack = () => {
    let array = [];
    for (i = 0; i < 9; i++) {
      array.push(Images.cards.cardBack);
    }
    return array;
  };

  const generateRandomNum = (count) => {
    return Math.floor(Math.random() * count);
  };

  const generateRandomNumArry = (count) => {
    let array = [];
    const num1 = generateRandomNum(count);
    array.push(num1);
    while (array.length < 2) {
      const num2 = generateRandomNum(count);
      if (num1 !== num2) {
        array.push(num2);
      }
    }
    array.sort();
    return array;
  };

  const [imgArry, setImgArry] = useState(generateCardBack());
  const [DrawnCardsIndex, setDrawnCardsIndex] = useState([]);
  const [cardNoArry, setCardNoArry] = useState(generateRandomNumArry(9));
  const [modalVisible, setModalVisible] = useState(false);
  const [msg, setMsg] = useState('');
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (cardNoArry.every((card) => DrawnCardsIndex.includes(card))) {
      setMsg('You won!');
      setModalVisible(true);
      return;
    }

    const isLost =
      DrawnCardsIndex.length > 4 ||
      (DrawnCardsIndex.length > 3 &&
        !(
          DrawnCardsIndex.includes(cardNoArry[0]) ||
          DrawnCardsIndex.includes(cardNoArry[1])
        ));

    if (isLost) {
      setMsg('You lost!');
      setModalVisible(true);
    }
  }, [DrawnCardsIndex, cardNoArry]);

  const resetState = () => {
    setImgArry(generateCardBack);
    setCardNoArry(generateRandomNumArry(9));
    setDrawnCardsIndex([]);
  };
  // useEffect(() => {
  //   if (!modalVisible) {
  //     resetState();
  //   }
  // }, [modalVisible]);

  const handleButtonPress = (index) => {
    const copy = [...imgArry];
    let newImg;
    if (cardNoArry.includes(index)) {
      newImg = Images.cards.cardPhotos[route.params.imageNum];
    } else {
      newImg = Images.cards.cardFail;
    }
    copy[index] = newImg;
    setImgArry(copy);

    setDrawnCardsIndex((prevState) => {
      return [...prevState, index];
    });
  };

  const closeModal = (btnName) => {
    setModalVisible(false);
    if (btnName === 'DONE') {
      navigation.navigate('Top');
    } else if (btnName === 'AGAIN') {
      resetState();
    }
  };

  const navigateToInst = () => {
    navigation.navigate('Instruction');
  };

  return (
    <Container>
      {/* // <CustomHeader /> */}
      <Content
        style={{
          paddingTop: 30,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            flexGrow: 10,
          }}
        >
          {imgArry &&
            imgArry.map((img, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  handleButtonPress(index);
                }}
              >
                <View style={styles.imageBox}>
                  <Image source={img} style={styles.image} />
                </View>
              </TouchableOpacity>
            ))}
        </View>

        <CustomModal
          modalVisible={modalVisible}
          closeModal={closeModal}
          msg={msg}
        />
      </Content>
      <CustomFooter resetState={resetState} navigateToInst={navigateToInst} />
    </Container>
  );
};
