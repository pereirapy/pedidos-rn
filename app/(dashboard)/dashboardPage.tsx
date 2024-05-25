import { Stack, useRouter } from 'expo-router';
import { Text, StyleSheet, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TextInput from '~/components/TextInput';
import { Button } from '~/components/Button';
import { signOut } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '~/utils/firebase';
import { delay } from '~/utils/general';
import React from 'react';
import { Container } from '~/components/Container';

const stylesT = {
  error: 'text-red-700 text-[0.8rem] font-medium overflow-hidden opacity-100 h-5 mb-2',
};

export default function DashboardPage() {

  const router = useRouter()

  const handleSignOut = () => {
    signOut(auth);
    router.replace('/')
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'DashboardPage',
          headerRight: () => <Button onPress={handleSignOut} title="Sign out" />,
        }}
      />
      <Container>
        <Text>{auth.currentUser?.email}</Text>
      </Container>
    </>
  );
}
