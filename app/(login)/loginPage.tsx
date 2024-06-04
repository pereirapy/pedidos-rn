import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider  } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Form, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { LoginFormValues, loginFormSchema } from './schema';

import { Button } from '~/components/Button';
import LayoutGeneric from '~/components/LayoutGeneric';
import TextInput from '~/components/TextInput';
import { auth } from '~/utils/firebase';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import {GoogleSignIn} from '../../utils/firebase';


const styles = {
  error: 'text-red-700 text-[0.8rem] font-medium opacity-100 mt-4',
};

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const [redirecting, setRedirecting] = useState(false);

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
        setRedirecting(true);
        router.replace('/dashboardPage');
      }
    } catch (error) {
      const errorFireBase = error as FirebaseError;
      const errorCode = errorFireBase.code;
      formReactHook.setValue('errorFirebase', t(errorCode));
    }
  };

  const signInWithGoogle = async () => {
    try {
      formReactHook.setValue('errorFirebase', '');
      await GoogleSignIn.hasPlayServices();
      const user = await GoogleSignIn.signIn();
      const googleAuthProvider = GoogleAuthProvider.credential(user.idToken);
      await signInWithCredential(auth,googleAuthProvider)
      setRedirecting(true);
      router.replace('/dashboardPage');
    } catch (e: any) {
      formReactHook.setValue('errorFirebase', e);
    }
  };

  const errorMessage = formReactHook.watch('errorFirebase');

  return (
    <LayoutGeneric title={t('loginPage.title')} showHeaderLanguage>
      <View className="m-2">
        <Form
          onSubmit={onSubmit}
          control={formReactHook.control}
          render={({ submit }) => {
            return (
              <>
                <TextInput
                  keyboardType="email-address"
                  form={formReactHook}
                  label={t('loginPage.fieldEmail')}
                  name="email"
                />
                <TextInput
                  isPassword
                  form={formReactHook}
                  label={t('loginPage.fieldPassword')}
                  name="password"
                />
                <Button
                  disabled={
                    redirecting ||
                    !formReactHook.formState.isDirty ||
                    formReactHook.formState.isSubmitting
                  }
                  isLoading={formReactHook.formState.isSubmitting}
                  title={t('loginPage.buttonSubmit')}
                  onPress={submit}
                  className="mt-4"
                />
                <GoogleSigninButton
                  size={GoogleSigninButton.Size.Icon}
                  color={GoogleSigninButton.Color.Dark}
                  onPress={signInWithGoogle}
                />
              </>
            );
          }}
        />
        {errorMessage && <Text className={styles.error}>{String(errorMessage)}</Text>}
      </View>
    </LayoutGeneric>
  );
}
