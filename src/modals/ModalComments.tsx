import { EvilIcons, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import KeyboardSimpleWrapper from '../components/KeyboardSimpleWrapper';
import Colors from '../utils/Colors';
import Icons from '../utils/Icons';

type FakeModalProps = {
  setShowModal: (show: boolean) => void;
  showModal: boolean;
  title: string;
  children: React.ReactNode;
};

export function ModalComments({
  setShowModal,
  showModal,
  title,
  children,
}: FakeModalProps) {
  return (
    <Modal
      animationType='slide'
      transparent
      visible={showModal}
      onRequestClose={() => setShowModal(false)}>
      <TouchableOpacity
        style={styles().overFlow}
        activeOpacity={1}
        onPress={() => setShowModal(false)}>
        <View style={styles().centeredView}>
          <KeyboardSimpleWrapper>
            <View
              style={[
                styles().modalView,
                {
                  backgroundColor: Colors().backgroundCommentsModal,
                },
              ]}>
              <View style={styles().modalTop}>
                <Icons
                  IconFamily={EvilIcons}
                  name='comment'
                  size={30}
                  color={Colors().iconCommentsModal}
                />
                <View style={[styles().titleContaner]}>
                  <Text
                    style={[
                      styles().modalTitle,
                      {
                        color: Colors().textColorModal,
                      },
                    ]}>
                    {title}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Icons
                    IconFamily={Ionicons}
                    name='close'
                    size={30}
                    color={Colors().iconCloseModal}
                  />
                </TouchableOpacity>
              </View>
              {children}
            </View>
          </KeyboardSimpleWrapper>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = () => 
StyleSheet.create({
  centeredView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 22,
  },
  overFlow: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  modalView: {
    borderRadius: 10,
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 40,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalTop: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 25,
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 15,
  },
  titleContaner: {
    justifyContent: 'center',
  },
  modalTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 15,
    letterSpacing: 0.01,
  },
});
