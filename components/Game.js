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
    width: 100,
    height: 100,
  },
  imageBox: {
    paddingBottom: 15,
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
  const [userWonCards, setUserWonCards] = useState([]);
  const [CPUWonCards, setCPUWonCards] = useState([]);
  const [isCPUTurn, setisCPUTurn] = useState(false);
  const [isTouchDisabled, setIsTouchDisabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [msg, setMsg] = useState('');
  const [currentCard, setCurrentCard] = useState([]);
  useEffect(() => {
    if (userWonCards.length > 0) {
      Toast.show({ text: '正解！' });
    }
  }, [userWonCards]);

  useEffect(() => {
    if (imgArry.length === 0) {
      return;
    }
    if (isCPUTurn) {
      Toast.show({ text: 'CPUのターンです' });
    }
    if (!isCPUTurn) {
      Toast.show({ text: 'あなたのターンです' });
      setIsTouchDisabled(false);
    }
  }, [isCPUTurn]);

  useEffect(() => {
    if (imgArry.length === 0) {
      const winner =
        userWonCards.length > CPUWonCards.length ? 'あなた' : 'CPU';
      setMsg(
        `${userWonCards.length}対${CPUWonCards.length}\n${winner}の勝ち！`
      );
      setModalVisible(true);
    }
  }, [imgArry, userWonCards, CPUWonCards]);

  const resetState = () => {
    setImgArry(randomize(generateCards()));
    setUserWonCards([]);
    setCPUWonCards([]);
    setIsTouchDisabled(false);
    setisCPUTurn(false);
  };

  const generateRandomNumArry = (count, length) => {
    let array = [];
    const num1 = generateRandomNum(count);
    array.push(num1);
    while (array.length < length) {
      const num2 = generateRandomNum(count);
      if (num1 !== num2) {
        array.push(num2);
      }
    }
    return array;
  };

  // useEffect(() => {
  //   if (!modalVisible) {
  //     resetState();
  //   }
  // }, [modalVisible]);

  const handleButtonPress = (index) => {
    // カード選択後、タッチを無効化
    setIsTouchDisabled(true);

    //** 以下はcopy[index]時にstateが反映されてしまう...（なぜ？？）
    // const copy = [...copy];
    // copy[index].isDrawn = true;

    // isDrawnをtrueに
    let newImgArry = imgArry.map((img, i) =>
      i === index ? { ...img, isDrawn: true } : img
    );

    // カード裏返す
    setImgArry(newImgArry);

    // 1枚目なら、currentCardにカード情報追加し、リターン
    const imgNum = imgArry[index].imgNum;
    if (currentCard.length === 0) {
      console.log('cuurent card は0');
      setCurrentCard((prevState) => [
        ...prevState,
        { index: index, imgNum: imgNum },
      ]);
      setIsTouchDisabled(false);
      return;
    }

    if (currentCard[0].index === index) {
      setIsTouchDisabled(false);
      return;
    }

    const userTime = 1000;
    const userWin = currentCard[0].imgNum === imgNum;
    setTimeout(() => {
      if (userWin) {
        setUserWonCards((prevState) => [...prevState, imgNum]);

        newImgArry = newImgArry.filter(
          (img, i) => !(i === index || i === currentCard[0].index)
        );
        setImgArry(newImgArry);
      } else {
        // Toast.show({ text: '残念！' });

        newImgArry = newImgArry.map((img, i) =>
          i === index || i === currentCard[0].index
            ? { ...img, isDrawn: false }
            : img
        );
        setImgArry(newImgArry);
      }
      setCurrentCard([]);

      // CPUのターン
      if (userWin) {
        setIsTouchDisabled(false);
      } else {
        setisCPUTurn(true);
        let CPUWin = false;
        let i = 0;

        const doCPUTurn = () => {
          setTimeout(() => {
            console.log(i + 1 + '回目だ');
            const [CPUindex1, CPUindex2] = generateRandomNumArry(
              newImgArry.length,
              2
            );
            console.log(CPUindex1 + 'と' + CPUindex2);
            CPUWin =
              newImgArry[CPUindex1].imgNum === newImgArry[CPUindex2].imgNum;
            console.log(i + 1 + '回目');
            i += 1;

            // 一枚目引く
            newImgArry = newImgArry.map((img, i) =>
              i === CPUindex1 ? { ...img, isDrawn: true } : img
            );

            setImgArry(newImgArry);

            // 二枚目引く
            setTimeout(() => {
              newImgArry = newImgArry.map((img, i) =>
                i === CPUindex2 ? { ...img, isDrawn: true } : img
              );
              setImgArry(newImgArry);
              //CPU勝ち

              setTimeout(() => {
                if (CPUWin) {
                  console.log('CPU勝ち');
                  newImgArry = newImgArry.filter(
                    (img, i) => !(i === CPUindex1 || i === CPUindex2)
                  );
                  setImgArry(newImgArry);
                  setCPUWonCards((prevState) => [
                    ...prevState,
                    imgArry[CPUindex1].imgNum,
                  ]);
                } else {
                  console.log('CPU負け');
                  newImgArry = newImgArry.map((img, i) =>
                    i === CPUindex1 || i === CPUindex2
                      ? { ...img, isDrawn: false }
                      : img
                  );
                  setImgArry(newImgArry);
                  setisCPUTurn(false);
                }
                if (CPUWin) {
                  doCPUTurn();
                }
              }, 1000);
            }, 1000);
          }, 1000);
        };

        doCPUTurn();
      }
      //ユーザー→CPU
    }, 1000);
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
    <Container style={{ opacity: isCPUTurn ? 0.8 : 1 }}>
      {/* // <CustomHeader /> */}
      <Content
        style={{
          paddingTop: 30,
          height: 100,
          overflow: 'hidden',
        }}
      >
        <View
          pointerEvents={isTouchDisabled ? 'none' : 'auto'}
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
