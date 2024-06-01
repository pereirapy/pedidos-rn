import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';

import { Container } from '~/components/Container';

type LoadingProps = {
  show: boolean;
};

export default function Loading({ show }: LoadingProps) {
  return (
    <Container>
      <Spinner visible={show} color="blue" textStyle={{ color: '#000' }} />
    </Container>
  );
}
