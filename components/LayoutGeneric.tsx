import { FontAwesome } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { ReactNode, useState } from 'react';

import { Container } from './Container';
import ModalToggleLanguage from './ModalToggleLanguage';

type LayoutGenericProps = {
  title: string;
  children: ReactNode;
  headerRight?: ReactNode;
  showHeaderLanguage?: boolean;
};

const LayoutGeneric = ({
  children,
  title,
  headerRight,
  showHeaderLanguage,
}: LayoutGenericProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Stack.Screen
        options={{
          title,
          headerRight: () => [
            headerRight,
            <FontAwesome
              key="language"
              className='ml-2'
              name="language"
              size={24}
              color="black"
              onPress={() => setModalVisible(!modalVisible)}
            />,
          ],
        }}
      />
      {showHeaderLanguage && (
        <ModalToggleLanguage modalVisible={modalVisible} setModalVisible={setModalVisible} />
      )}
      <Container>{children}</Container>
    </>
  );
};

export default LayoutGeneric;
