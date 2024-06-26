import { useTranslation } from 'react-i18next';
import { Alert, View } from 'react-native';
import LayoutGeneric from '~/components/LayoutGeneric';
import { UsersForm } from './usersForm';
import { useForm } from 'react-hook-form';
import { UsersFormValues, usersFormSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { UsersTypeOptions } from '~/utils/constants';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '~/utils/firebase';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FirebaseError } from 'firebase/app';
import Loading from '~/components/Loading';
import BreadCrumbs, { CrumbProps } from '~/components/BreadCrumbs';
import { useAuth } from '~/hooks/useAuth';
import { updateProfile } from 'firebase/auth';


export default function UserPage() {
  const { t } = useTranslation();
  const { userId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const {user, setUser} = useAuth()
  const router = useRouter();

  const crumbs: CrumbProps[] = [
    { title: t('usersPage.titlePage'), href: '/usersPage' },
    { title: t('usersPage.editTitle'), href: '#', isSelected: true },
  ];
  

  const form = useForm<UsersFormValues>({
    resolver: zodResolver(usersFormSchema),
    mode: 'onChange',
  });

  const getOneUser = async () => {
    setLoading(true);

    try {
      if (userId) {
        const userIdParsed = Array.isArray(userId) ? userId[0] : userId;
        const docRef = doc(db, 'users', userIdParsed);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          form.reset(docSnap.data());
          setLoading(false);
        } else {
          setLoading(false);
          Alert.alert('No such document!');
        }
      } else {
        setLoading(false);
        Alert.alert('not found User ID');
      }
    } catch (error) {
      setLoading(false);
      const errorFireBase = error as FirebaseError;
      const errorCode = errorFireBase.code;
      Alert.alert(errorCode);
    }
  };

  useEffect(() => {
    getOneUser();
  }, []);

  const onSubmit = async ({ data }: { data: UsersFormValues }) => {
    try {
      const userRef = doc(db, 'users', data.email);
      await setDoc(userRef, data, { merge: true });
      if(user)
      await updateProfile(user, { displayName: data.name });
      setUser(user)

      Alert.alert(t('common.dataSaved'));
      router.push('/usersPage');

      
    } catch (error) {
      const errorFireBase = error as FirebaseError;
      const errorCode = errorFireBase.code;
      Alert.alert(errorCode)
      
    }
  };

  const UsersTypeOptionsTranslated = useMemo(
    () =>
      UsersTypeOptions.map((item) => ({
        key: item.key,
        value: t(`usersPage.${item.value}`),
      })).sort((a,b) => {
        if(a.value.toLowerCase() < b.value.toLowerCase()) return -1
        return 1;
      }),
    [UsersTypeOptions]
  );

  return (
    <LayoutGeneric title={t('usersPage.editTitle')}>
      <View className="mt-5 flex text-3xl">
        {loading ? (
          <Loading show={loading} />
        ) : (
          <>
            <BreadCrumbs crumbs={crumbs} />
            <View className='mx-4'>

            <UsersForm
              onSubmit={onSubmit}
              form={form}
              UsersTypeOptionsTranslated={UsersTypeOptionsTranslated}
              />
              </View>
          </>
        )}
      </View>
    </LayoutGeneric>
  );
}
