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
  ImageBackground,
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
    width: 90,
    height: 90,
  },
  imageBox: {
    paddingBottom: 15,
  },
  image2: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export const Game = ({ navigation, route }) => {
  const generateCards = () => {
    let array = [];
    for (let i = 11; i > 0; i--) {
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
    console.log(array);
    return array;
  };

  const images = Images.cards.cardPhotos;
  const cardBack = Images.cards.cardBack;
  const [imgArry, setImgArry] = useState([]);
  const [userWonCards, setUserWonCards] = useState([]);
  const [CPUWonCards, setCPUWonCards] = useState([]);
  const [isCPUTurn, setisCPUTurn] = useState(false);
  const [isTouchDisabled, setIsTouchDisabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [CPUturnNum, setCPUturnNum] = useState(1);
  const [msg, setMsg] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [currentCard, setCurrentCard] = useState([]);

  useEffect(() => {
    setImgArry(randomize(generateCards()));
    setIsReady(true);
  }, []);
  useEffect(() => {
    if (
      imgArry.length === 0 &&
      (userWonCards.length > 0 || CPUWonCards.length > 0)
    ) {
      console.log('モーダル');
      const winner =
        userWonCards.length > CPUWonCards.length ? 'あなた' : 'CPU';
      setMsg(
        `${userWonCards.length}対${CPUWonCards.length}\n${winner}の勝ち！`
      );
      setModalVisible(true);
    }
  }, [imgArry, userWonCards, CPUWonCards, isReady]);

  useEffect(() => {
    if (userWonCards.length > 0 && imgArry.length > 0) {
      Toast.show({ text: '正解！' });
    }
  }, [userWonCards]);

  useEffect(() => {
    if (isCPUTurn) {
      console.log('はいきたー');
      let CPUWin = false;
      setCPUturnNum((prevState) => prevState + 1);
      let newImgArry = [...imgArry];
      let secondWinningTurn = false;

      const doCPUTurn = () => {
        // newImgArry.forEach((img) => {
        //   console.log(img);
        // });

        console.log(CPUturnNum);
        let CPUindex1, CPUindex2;

        if (CPUturnNum > 1 && !secondWinningTurn) {
          console.log('wiining streak');
          let targetImgNum;
          newImgArry.forEach((img, i) => {
            if (i === 0) {
              targetImgNum = img.imgNum;
              CPUindex1 = i;
              return;
            }
            if (img.imgNum === targetImgNum) {
              CPUindex2 = i;
            }
          });
          secondWinningTurn = true;
          setCPUturnNum(1);
        } else {
          [CPUindex1, CPUindex2] = generateRandomNumArry(newImgArry.length, 2);
        }
        console.log(CPUindex1 + 'と' + CPUindex2);
        console.log('長さ：' + newImgArry.length);
        CPUWin = newImgArry[CPUindex1].imgNum === newImgArry[CPUindex2].imgNum;

        setTimeout(() => {
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
                setCPUWonCards((prevState) => [
                  ...prevState,
                  newImgArry[CPUindex1].imgNum,
                ]);
                newImgArry = newImgArry.filter(
                  (img, i) => !(i === CPUindex1 || i === CPUindex2)
                );
                setImgArry(newImgArry);

                CPUWin = newImgArry.length === 0 ? false : CPUWin;
              } else {
                console.log('CPU負け');
                newImgArry = newImgArry.map((img, i) =>
                  i === CPUindex1 || i === CPUindex2
                    ? { ...img, isDrawn: false }
                    : img
                );
                setImgArry(newImgArry);
                setisCPUTurn(false);
                setIsTouchDisabled(false);
                Toast.show({ text: 'あなたのターンです' });
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
  }, [isCPUTurn]);

  const resetState = () => {
    setImgArry(randomize(generateCards()));
    setUserWonCards([]);
    setCPUWonCards([]);
    setIsTouchDisabled(false);
    setIsReady(false);
    setisCPUTurn(false);
    setCPUturnNum(0);
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
    if (length <= 4) {
      array.forEach((img) => {
        console.log('値:' + img);
      });
    }
    return array;
  };

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
        setCurrentCard([]);
        setIsTouchDisabled(false);
      } else {
        // Toast.show({ text: '残念！' });

        newImgArry = newImgArry.map((img, i) =>
          i === index || i === currentCard[0].index
            ? { ...img, isDrawn: false }
            : img
        );
        setImgArry(newImgArry);
        setCurrentCard([]);
        setisCPUTurn(true);
        Toast.show({ text: 'CPUのターンです' });
      }
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
      <ImageBackground source={Images.cards.cardFail} style={styles.image2}>
        {/* // <CustomHeader /> */}
        <Content
          contentContainerStyle={{
            justifyContent: 'center',
            alignContent: 'center',
          }}
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
              alignItems: 'center',
              flexWrap: 'wrap',
              flexGrow: 10,
            }}
          >
            {imgArry &&
              imgArry.map((img, index) => (
                <View key={index} style={styles.imageBox}>
                  <TouchableOpacity
                    onPress={() => {
                      handleButtonPress(index);
                    }}
                  >
                    <Image
                      source={img.isDrawn ? images[img.imgNum] : cardBack}
                      style={styles.image}
                    />
                  </TouchableOpacity>
                </View>
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
      </ImageBackground>
    </Container>
  );
};
