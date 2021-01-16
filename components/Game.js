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
import { CustomFooter } from './CustomFooter';
import { CustomModal } from './CustomModal';
import { Instruction } from './Instruction';
import Images from '../Images/Images';
import { generateRandomNum } from '../Help';
import { Container, Button, Icon, Toast, Content } from 'native-base';

const styles = StyleSheet.create({
  image: {
    width: 120,
    height: 120,
  },
  imageBox: {
    paddingBottom: 25,
  },
});

export const Game = ({ navigation, route }) => {
  const generateCards = () => {
    let array = [];
    for (let i = 7; i > 0; i--) {
      array.push({
        imgNum: i - 1,
        isDrawn: false,
      });
      array.push({
        imgNum: i - 1,
        isDrawn: false,
      });
    }
    return array;
  };

  const randomize = (array) => {
    for (let i = array.length; i > 0; i--) {
      const r = Math.floor(Math.random() * i);
      const temp = array[i - 1];
      array[i - 1] = array[r];
      array[r] = temp;
    }
    return array;
  };

  const images = Images.cards.cardPhotos;
  const cardBack = Images.cards.cardBack;
  const [imgArry, setImgArry] = useState(randomize(generateCards()));
  const [DrawnCardsIndex, setDrawnCardsIndex] = useState([]);
  const [userImgNum, setUserImgNum] = useState([]);
  const [userWonCards, setUserWonCards] = useState([]);
  const [CPUImgNum, setCPUImgNum] = useState([]);
  const [CPUWonCards, setCPUWonCards] = useState([]);
  const [isCPUTurn, setisCPUTurn] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (userWonCards.length > 0) {
      Toast.show({ text: '正解！' });
    }
  }, [userWonCards]);

  const CPUturn = () => {};

  const resetState = () => {
    setImgArry();

    setCardNoArry(generateRandomNumArry(9));
    setDrawnCardsIndex([]);
  };
  // useEffect(() => {
  //   if (!modalVisible) {
  //     resetState();
  //   }
  // }, [modalVisible]);

  const handleButtonPress = (index) => {
    console.log('ユーザーが勝ち取ったカード: ' + userWonCards);
    console.log('ユーザーが引いた画像: ' + userImgNum);
    console.log('引かれたカードINDEX: ' + DrawnCardsIndex);
    const copy = [...imgArry];
    let newImg;

    // isDrawnをtrueに
    copy[index].isDrawn = true;
    setImgArry(copy);

    //drawnIndexに追加;
    //引いたindexのimgNum確認;
    setDrawnCardsIndex((prevState) => [...prevState, index]);
    const imgNum = imgArry[index].imgNum;

    //もしUserImgNum（Userが引いた画像種類）に含まれていルカCHK
    // UserwOnCradに追加、useEffectでToast
    if (userImgNum.includes(imgNum)) {
      console.log('YAY FISRT PAIR!');
      setUserWonCards((prevState) => [...prevState, imgNum]);

      //含まれていなければuserImgNumに追加
    } else {
      setUserImgNum((prevState) => [...prevState, imgNum]);
    }

    // setisCPUTurn(true);
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
          pointerEvents={isCPUTurn ? 'none' : 'auto'}
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
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
                  <Image
                    source={img.isDrawn ? images[img.imgNum] : cardBack}
                    style={styles.image}
                  />
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
      <CustomFooter
        isCPUTurn={isCPUTurn}
        resetState={resetState}
        navigateToInst={navigateToInst}
      />
    </Container>
  );
};
