import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { FirebaseError } from 'firebase/app';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
} from 'firebase/auth';
import React, { useState } from 'react';
import { Form, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { LoginFormValues, loginFormSchema } from './schema';

import { Button } from '~/components/Button';
import LayoutGeneric from '~/components/LayoutGeneric';
import TextInput from '~/components/TextInput';
import { auth, db } from '~/utils/firebase';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { GoogleSignIn } from '../../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';

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

  const verifyIfEmailAlreadyExists = async (email: string) => {
    try {
      const docRef = doc(db, 'users', email);
      const docSnap = await getDoc(docRef);

      return docSnap.exists();
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const createNewUser = async(data: LoginFormValues) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      setRedirecting(true);
      formReactHook.reset();
      router.push('/dashboardPage');
    } catch (error) {
      const errorFireBase = error as FirebaseError;
      const errorCode = errorFireBase.code;
      formReactHook.setValue('errorFirebase', errorCode);
    }

  }

  const onSubmit = async ({ data }: { data: LoginFormValues }) => {
    formReactHook.setValue('errorFirebase', '');
    const userAlreadyExists = await verifyIfEmailAlreadyExists(data.email);
    try {
      if (userAlreadyExists) {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        setRedirecting(true);
        formReactHook.reset();
        router.push('/dashboardPage');
      } else formReactHook.setValue('errorFirebase', 'User not authorized to use this app');
    } catch (error) {
      const errorFireBase = error as FirebaseError;
      const errorCode = errorFireBase.code;
      if (errorCode === 'auth/user-not-found' && userAlreadyExists) {
        await createNewUser(data);
      }
      formReactHook.setValue('errorFirebase', t(errorCode));
    }
  };

  const signInWithGoogle = async () => {
    try {
      formReactHook.setValue('errorFirebase', '');
      await GoogleSignIn.hasPlayServices();
      let user;
      if (!GoogleSignIn.hasPreviousSignIn() || !GoogleSignIn.getCurrentUser()) {
        user = await GoogleSignIn.signIn();
      } else {
        user = GoogleSignIn.getCurrentUser();
      }
      if (user) {
        if (await verifyIfEmailAlreadyExists(user.user.email)) {
          const googleAuthProvider = GoogleAuthProvider.credential(user.idToken);

          await signInWithCredential(auth, googleAuthProvider);
          setRedirecting(true);
          formReactHook.reset();
          router.push('/dashboardPage');
        } else formReactHook.setValue('errorFirebase', 'User not authorized to use this app');
      } else formReactHook.setValue('errorFirebase', 'User not found');
    } catch (error: any) {
      const errorFireBase = error as FirebaseError;
      const errorCode = errorFireBase.code;
      GoogleSignIn.revokeAccess();
      GoogleSignIn.signOut();
      let errorTranslated;
      switch (errorCode) {
        case 'auth/admin-restricted-operation':
          errorTranslated = t(`firebaseErrors.auth_admin_restricted_operation`);
          break;
        case 'auth/invalid-credential':
          errorTranslated = t(`firebaseErrors.auth_invalid_credential`);
          break;

        default:
          break;
      }
      formReactHook.setValue('errorFirebase', errorTranslated);
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
                <Text className="my-5 text-center text-lg">{t('loginPage.descSocialMedia')}</Text>
                <GoogleSigninButton
                  size={GoogleSigninButton.Size.Wide}
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
