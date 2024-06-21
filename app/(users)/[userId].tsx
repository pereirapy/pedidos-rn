import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native';
import LayoutGeneric from '~/components/LayoutGeneric';
import { UsersForm } from './usersForm';
import { useForm } from 'react-hook-form';
import { UsersFormValues, usersFormSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { UsersTypeOptions } from '~/utils/constants';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '~/utils/firebase';
import { useLocalSearchParams } from 'expo-router';
import { FirebaseError } from 'firebase/app';

export default function UserPage() {
  const { t } = useTranslation();
  const { userId } = useLocalSearchParams();

  const form = useForm<UsersFormValues>({
    resolver: zodResolver(usersFormSchema),
    mode: 'onChange',
  });

  const getOneUser = async () => {
    try {
      if (userId) {
        const userIdParsed = Array.isArray(userId) ? userId[0] : userId;
        const docRef = doc(db, 'users', userIdParsed);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log('Document data:', docSnap.data());
          form.reset(docSnap.data());
        } else {
          // docSnap.data() will be undefined in this case
          console.log('No such document!');
        }
      } else console.error('not found User ID');
    } catch (error) {
      const errorFireBase = error as FirebaseError;
      const errorCode = errorFireBase.code;
      console.error(errorCode);
    }
  };

  useEffect(() => {
    getOneUser();
  }, []);

  const onSubmit = async ({ data }: { data: UsersFormValues }) => {
    console.log(data);
  };

  const UsersTypeOptionsTranslated = useMemo(
    () =>
      UsersTypeOptions.map((item) => ({
        key: item.key,
        value: t(`usersPage.${item.value}`),
      })),
    [UsersTypeOptions]
  );

  return (
    <LayoutGeneric title={t('usersPage.title')}>
      <SafeAreaView className="mt-5 flex text-3xl">
        <UsersForm
          onSubmit={onSubmit}
          form={form}
          UsersTypeOptionsTranslated={UsersTypeOptionsTranslated}
        />
      </SafeAreaView>
    </LayoutGeneric>
  );
}
