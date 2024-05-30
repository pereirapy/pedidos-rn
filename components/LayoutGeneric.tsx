import { ReactElement, ReactNode, useState } from 'react';
import { Container } from './Container';
import { Stack } from 'expo-router';
import ModalToggleLanguage from './ModalToggleLanguage';
import { FontAwesome } from '@expo/vector-icons';

type LayoutGenericProps = {
  title: string;
  children: ReactNode;
  headerRight?: ReactNode;
  showHeaderLanguage?: boolean;
};

const LayoutGeneric = ({ children, title, headerRight, showHeaderLanguage }: LayoutGenericProps) => {

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Stack.Screen
        options={{
          title,
          headerRight: () => [
            headerRight,
            <FontAwesome
              key='language'
              name="language"
              size={24}
              color="black"
              onPress={() => setModalVisible(!modalVisible)}
            />,
          ],
        }}
      />
      {showHeaderLanguage && (
        <ModalToggleLanguage
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      )}
      <Container>{children}</Container>
    </>
  );
};

export default LayoutGeneric;
