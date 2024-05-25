import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { useAuth } from '~/hooks/useAuth';
import { Container } from '~/components/Container';
import Spinner from 'react-native-loading-spinner-overlay';

type LoadingProps = {
  show: boolean;
}

export default function Loading({show}: LoadingProps) {

  return (
    <Container>
      <Spinner
          visible={show}
          color={'blue'}
          textStyle={{color: '#000'}}
        />
    </Container>
  );
}
