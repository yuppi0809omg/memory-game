import React, { useState } from 'react';
import { CustomText } from './CustomText';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

export const CustomModal = ({ modalVisible, msg, closeModal }) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <CustomText style={styles.modalText}>{msg}</CustomText>

            <TouchableHighlight
              style={{ ...styles.openButton }}
              onPress={() => {
                closeModal('AGAIN');
              }}
            >
              <CustomText style={styles.textStyle}>もう一回</CustomText>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ ...styles.openButton }}
              onPress={() => {
                closeModal('DONE');
              }}
            >
              <CustomText style={styles.textStyle}>閉じる</CustomText>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '80%',

    backgroundColor: 'white',
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
  openButton: {
    backgroundColor: 'lightgrey',
    borderRadius: 15,
    width: '100%',
    padding: 20,
    marginBottom: 5,
    elevation: 2,
    color: 'black',
  },
});
