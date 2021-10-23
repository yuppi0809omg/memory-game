import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { CustomFooter } from './CustomFooter';
import { CustomModal } from './CustomModal';
import { Instruction } from './Instruction';
import Images from '../Images/Images';
import { generateRandomNum } from '../Help';
import { Container, Button, Icon, Toast, Content } from 'native-base';

// カードのが画面配置（仮：良い方法を調べる）
const { width, height } = Dimensions.get('window');
const numHorizontal = 4;
const paddingBottom = 5;
const paddingSide = 3;
let sideLength = width / 4 - (numHorizontal - 1) * paddingSide;

const styles = StyleSheet.create({
  image: {
    width: sideLength,
    height: sideLength,
  },
  imageBox: {
    paddingBottom: paddingBottom,
  },
});

export const Game = (({ navigation, route }) => {
  console.log("Rendered...")
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
  const [prevCard, setPrevCard] = useState([]);
  const interval = 2000;

  // カード初期化
  const generateCards = () => {
    let array = [];
    for (let i = 0; i < 11; i++) {
      array.push({
        imgNum: i,
        isDrawn: false,
        isDisabled: false,
      });
      array.push({
        imgNum: i,
        isDrawn: false,
        isDisabled: false,
      });
    }

    // カードをシャッフル
    randomize(array);

    // arrayに表示のindexを追加（undrawnCards参照用）
    array = array.map((item, i) => {
      return { ...item, index: i };
    });

    return array;
  };

  // まだ引かれていないカードの配列を返す（CPUが引くときに使う）
  const getUndrawnCards = () => {
    const array = imgArry.filter((img) => {
      return !userWonCards.concat(CPUWonCards).includes(img.imgNum);
    });
    return array;
  };

  // 画像カード配列の順番をシャッフルする
  const randomize = (array)=>{
      for (let i = array.length; i > 0; i--) {
      const r = Math.floor(Math.random() * i);
      const temp = array[i - 1];
      array[i - 1] = array[r];
      array[r] = temp;
    }
  }

  // 初回の画像配列をセット
  useEffect(() => {
    setImgArry(generateCards());
  }, []);

  // 全カードが引かれたらモーダルを出す
  useEffect(() => {
    if (userWonCards.length + CPUWonCards.length === 22 / 2) {
      console.log('モーダル');
      const winner =
        userWonCards.length > CPUWonCards.length ? 'あなた' : 'CPU';
      setMsg(
        `${userWonCards.length}対${CPUWonCards.length}\n${winner}の勝ち！`
      );
      setModalVisible(true);
    }
  }, [userWonCards, CPUWonCards]);

  // UserもしくはCPUが当たったら以下を発動
  useEffect(() => {
    if (userWonCards.length > 0 && imgArry.length > 0) {
      Toast.show({ text: '正解！' });
    }
  }, [userWonCards, CPUWonCards]);

  // PCのターンになったら以下を発動
  useEffect(() => {
    if (isCPUTurn) {
      console.log('PCのターン');
      let CPUWin = false;
      setCPUturnNum((prevState) => prevState + 1);
      let newImgArry = [...imgArry];
      let notYetWon = true;

      // まだ引かれていないカード取得
      let undrawnCards = getUndrawnCards();

      const doCPUTurn = () => {
        console.log('CPUのuntil勝ちターン：' + CPUturnNum);
        console.log('undrawn cardsの長さ' + undrawnCards.length);
        let CPUindex1, CPUindex2;

        // 自動当たりモードの場合
        // ターンが3以上かつ自動当たりモード2回目ではない
        if (CPUturnNum > 2 && notYetWon) {
          console.log('自動当たりモード');
          // 引かれていないカードからindex[0]のカードを取り出し、imgNumが同じカードのindexを取り出す

          const targetCardNum = Math.floor(Math.random() * undrawnCards.length);
          const targetImgNum = undrawnCards[targetCardNum].imgNum;
          CPUindex1 = undrawnCards[targetCardNum].index;
          console.log(targetImgNum)

          // 同じ画像の2つ目のindexを探す
          undrawnCards.forEach((img, i) => {
            if (img.imgNum === targetImgNum && CPUindex1 !== img.index) {
              CPUindex2 = img.index;
            }
          });

          // notYetWonとターンのリセット
          notYetWon = false;
          setCPUturnNum(1);

          // 自動当たりモードではない場合
          // 引かれていないカード配列をシャッフルして1番目と2番目のカード引く
        } else {
          randomize(undrawnCards);
          CPUindex1 = undrawnCards[0].index;
          CPUindex2 = undrawnCards[1].index;
        }

        // console.log(
        //   'CPUが引くカードのポジション：' + CPUindex1 + 'と' + CPUindex2
        // );
        // console.log('長さ：' + newImgArry.length);
        // console.log('CPUカード1の画像種類：' + newImgArry[CPUindex1].imgNum);
        // console.log('CPUカード2の画像種類：' + newImgArry[CPUindex2].imgNum);
        CPUWin = newImgArry[CPUindex1].imgNum === newImgArry[CPUindex2].imgNum;

        // CPUが当たった場合、これから引かれるカードはundarwncardsから除外
        if (CPUWin) {
          undrawnCards = undrawnCards.filter((img) => {
            // console.log('undrawnCradsのindex:' + img.index);
            return !(img.index === CPUindex1 || img.index === CPUindex2);
          });
        }

        setTimeout(() => {
          // 一枚目引く
          console.log("CPUindex1は" +CPUindex1)
          newImgArry = newImgArry.map((img, i) =>
             i === CPUindex1 ? { ...img, isDrawn: true } : img
          );

          setImgArry(newImgArry);

          // 二枚目引く
          console.log("CPUindex2は" +CPUindex2)
          setTimeout(() => {
            newImgArry = newImgArry.map((img, i) =>
              i === CPUindex2 ? { ...img, isDrawn: true } : img
            );
            console.log(newImgArry)
            setImgArry(newImgArry);

            // CPUの勝ちなら、CPUのとったカードに引いたimgNUmを追加、imgARy更新（isDisabled更新）、
            setTimeout(() => {
              if (CPUWin) {
                console.log('CPU勝ち');
                setCPUWonCards((prevState) => [
                  ...prevState,
                  newImgArry[CPUindex1].imgNum,
                ]);
                newImgArry = newImgArry.map((img, i) =>
                  i === CPUindex1 || i === CPUindex2
                    ? { ...img, isDisabled: true }
                    : img
                );
                setImgArry(newImgArry);
                // もう1ターン引く
                // ただし、残りカードが1枚以上の時のみ
                const isNotGameOver = undrawnCards.length > 0;
                if (isNotGameOver) {
                  console.log(
                    '連続CPUターンに入る前のundrawnCards：' +
                      undrawnCards.length
                  );
                  doCPUTurn();
                }
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
            }, interval);
          }, interval);
        }, interval);
      };
      doCPUTurn();
    }
  }, [isCPUTurn]);

  const resetState = () => {
    setImgArry(generateCards());
    setUserWonCards([]);
    setCPUWonCards([]);
    setIsTouchDisabled(false);
    setisCPUTurn(false);
    setCPUturnNum(1);
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

    // 1枚目なら、prevCardにカード情報追加し抜ける
    const imgNum = imgArry[index].imgNum;
    if (prevCard.length === 0) {
      setPrevCard((prevState) => [
        ...prevState,
        { index: index, imgNum: imgNum },
      ]);
      setIsTouchDisabled(false);
      return;
    }

    // 1回目と同じカードなら、disbaledを解除して抜ける
    if (prevCard[0].index === index) {
      setIsTouchDisabled(false);
      return;
    }

    // 当たり OR 外れ
    const userWin = prevCard[0].imgNum === imgNum;

    setTimeout(() => {
      // 当たったら、imgArryのisDisabledをtrueにして、prevCardを空にして、touchをdisabledにする
      if (userWin) {
        setUserWonCards((prevState) => [...prevState, imgNum]);

        newImgArry = newImgArry.map((img, i) =>
          i === index || i === prevCard[0].index
            ? { ...img, isDisabled: true }
            : img
        );
        setImgArry(newImgArry);
        setPrevCard([]);
        setIsTouchDisabled(false);
      } else {
        // 外れたら、imgArryのisDrawnをfalseにして、prevCardを空にして、PCにturnを渡す（useEffectでCPUの処理）
        newImgArry = newImgArry.map((img, i) =>
          i === index || i === prevCard[0].index
            ? { ...img, isDrawn: false }
            : img
        );
        setImgArry(newImgArry);
        setPrevCard([]);
        setisCPUTurn(true);
        Toast.show({ text: 'CPUのターンです' });
      }
    }, interval);
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
      <Content
        contentContainerStyle={{
          justifyContent: 'center',
          alignContent: 'center',
        }}
        style={{
          paddingTop: 30,
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
          }}
        >
          {imgArry &&
            imgArry.map((img, index) => (
              <View key={index} style={styles.imageBox}>
                <TouchableOpacity
                  disabled={img.isDisabled}
                  onPress={() => {
                    handleButtonPress(index);
                  }}
                  style={{ backgroundColor: img.isDisabled ? 'black' : 'none' }}
                >
                  <Image
                    source={img.isDrawn ? images[img.imgNum] : cardBack}
                    style={{
                      width: 130,
                      height: 130,
                      opacity: img.isDisabled ? 0.5 : 1,
                      ...styles.image,
                    }}
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
    </Container>
  );
});



