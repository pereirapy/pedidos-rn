import { Text, View } from 'react-native';
import { Form, useForm } from 'react-hook-form';
import { LoginFormValues, loginFormSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import TextInput from '~/components/TextInput';
import { Button } from '~/components/Button';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '~/utils/firebase';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import LayoutGeneric from '~/components/LayoutGeneric';

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
      const errorMessage = errorFireBase.message;
      formReactHook.setValue('errorFirebase', errorMessage);
    }
  };

  const errorMessage = formReactHook.watch('errorFirebase');

  return (
    <LayoutGeneric title={t('loginPage.title')}>
      <View className="m-2">
        <Form
          onSubmit={onSubmit}
          control={formReactHook.control}
          render={({ submit }) => {
            return (
              <>
                <TextInput form={formReactHook} label={t('loginPage.fieldEmail')} name="email" />
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
