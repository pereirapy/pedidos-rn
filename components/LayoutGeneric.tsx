import { FontAwesome } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { ReactNode, useState } from 'react';

import { Container } from './Container';
import ModalToggleLanguage from './ModalToggleLanguage';

type LayoutGenericProps = {
  title: string;
  children: ReactNode;
};

const LayoutGeneric = ({ children, title }: LayoutGenericProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Stack.Screen
        options={{
          title,
          headerRight: () => (
            <FontAwesome
              key="language"
              className="mr-2"
              name="language"
              size={24}
              color="black"
              onPress={() => setModalVisible(!modalVisible)}
            />
          ),
        }}
      />
      <ModalToggleLanguage modalVisible={modalVisible} setModalVisible={setModalVisible} />
      <Container>{children}</Container>
    </>
  );
};

export default LayoutGeneric;
