import { ReactElement, ReactNode } from 'react';
import { Container } from './Container';
import { Stack } from 'expo-router';

type LayoutGenericProps = {
  title: string;
  children: ReactElement;
  headerRight?: ReactNode;
};

const LayoutGeneric = ({ children, title, headerRight }: LayoutGenericProps) => {
  return (
    <>
      <Stack.Screen options={{ title, headerRight: () => headerRight }} />
      <Container>{children}</Container>
    </>
  );
};


export default LayoutGeneric;
