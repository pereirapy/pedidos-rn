import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Button } from './Button';

type OurModalProps = {
  title?: string | ReactNode;
  children: ReactNode;
  modalVisible: boolean;
  setModalVisible: (arg: boolean) => void;
};

const OurModal = ({ children, title, modalVisible, setModalVisible }: OurModalProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View className='' style={styles.modalView}>
            <View className="mb-4 mt-4 w-full border-slate-700 border-b pb-2">
              <View className=" flex flex-row">
                <Text className="ml-14 flex-1 self-center text-center">{title}</Text>
                <AntDesign
                  className="mr-2 flex-none"
                  name="close"
                  size={32}
                  color="black"
                  onPress={() => setModalVisible(!modalVisible)}
                />
              </View>
            </View>
            
            {children}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  modalView: {
    width: '100%',
    paddingLeft: 4,
    paddingRight:4,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default OurModal;
