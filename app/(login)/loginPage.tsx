import { Stack } from 'expo-router';
import { Text, StyleSheet, View } from 'react-native';
import { Form, useForm } from 'react-hook-form';
import { LoginFormValues, loginFormSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import TextInput from '~/components/TextInput';
import { Button } from '~/components/Button';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '~/utils/firebase';
import React from 'react';
import { Container } from '~/components/Container';
import { useRouter } from 'expo-router';

const styles = {
  error: 'text-red-700 text-[0.8rem] font-medium opacity-100 mt-4',
};

export default function LoginPage() {
  const router = useRouter();

  const formReactHook = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onChange',
  });

  const onSubmit = async () => {
    formReactHook.setValue('errorFirebase', '');
    const data: LoginFormValues = formReactHook.getValues();
    try {
      const result = await signInWithEmailAndPassword(auth, data.email, data.password);
      if (result?.user) {
        router.replace('/dashboardPage');
      }
    } catch (error) {
      const errorFireBase = error as FirebaseError;
      const errorMessage = errorFireBase.message;
      formReactHook.setValue('errorFirebase', errorMessage);
    }
  };

  const errorMessage = formReactHook.watch('errorFirebase');

  return (
    <>
      <Stack.Screen options={{ title: 'Login' }} />
      <Container>
        <View className="m-2">
          <Form
            onSubmit={onSubmit}
            control={formReactHook.control}
            render={({ submit }) => {
              return (
                <>
                  <TextInput form={formReactHook} label="Email" name="email" />
                  <TextInput form={formReactHook} label="Password" name="password" />
                  <Button title="Submit" onPress={() => submit()} />
                </>
              );
            }}
          />
          {errorMessage && <Text className={styles.error}>{String(errorMessage)}</Text>}
        </View>
      </Container>
    </>
  );
}