import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import LayoutGeneric from '~/components/LayoutGeneric';
import {
  DocumentData,
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  orderBy,
  limit,
  startAt,
} from 'firebase/firestore';
import { db } from '~/utils/firebase';
import { UsersFormValues, usersFormSchema } from './schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UsersForm } from './usersForm';
import { LIMIT_PER_PAGE, UsersTypeOptions } from '~/utils/constants';
import { Alert } from 'react-native';
import { StyleSheet } from 'react-native';
import { UserWithId } from '~/types/users';
import OurFlatList from '~/components/OurFlatList';

export default function UsersPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<UserWithId[] | []>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const form = useForm<UsersFormValues>({
    resolver: zodResolver(usersFormSchema),
    mode: 'onChange',
  });

  const getAllUsers = async (currentPageByParam?: number) => {
    setLoading(true);
    const mountData: DocumentData[] = [];
    const newCurrentPage = currentPageByParam || currentPage;
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        orderBy('name'),
        startAt(newCurrentPage),
        limit(LIMIT_PER_PAGE * newCurrentPage)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const dataUser = doc.data();
        mountData.push({ id: doc.id, ...dataUser });
      });
      const mountDataConverted = mountData as unknown as UserWithId[];
      setData(mountDataConverted);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      Alert.alert('Error getting document: ', String(e));
    }
  };

  const onSubmit = async ({ data }: { data: UsersFormValues }) => {
    try {
      await setDoc(doc(db, 'users', data.email), data);
      form.reset();
      resetDataAndPage();
      await getAllUsers(1);
      Alert.alert(t('common.dataSaved'));
    } catch (error: any) {
      const errorCode = error.code;
      Alert.alert(errorCode);
    }
  };

  const resetDataAndPage = () => {
    setCurrentPage(1);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const UsersTypeOptionsTranslated = useMemo(
    () =>
      UsersTypeOptions.map((item) => ({
        key: item.key,
        value: t(`usersPage.${item.value}`),
      })).sort((a, b) => {
        if (a.value.toLowerCase() < b.value.toLowerCase()) return -1;
        return 1;
      }),
    [UsersTypeOptions]
  );

  const columnsName = [
    { key: 'name', value: t('usersPage.nameColumn') },
    { key: 'email', value: t('usersPage.emailColumn') },
  ];

  return (
    <LayoutGeneric title={t('usersPage.titlePage')}>
      <OurFlatList
        columnsName={columnsName}
        getData={getAllUsers}
        data={data}
        collectionName="users"
        titleItemModal={t('usersPage.titleItemModal')}
        titleModal={t('usersPage.addModalTitle')}
        modalChildren={
          <UsersForm
            onSubmit={onSubmit}
            form={form}
            UsersTypeOptionsTranslated={UsersTypeOptionsTranslated}
          />
        }
      />
    </LayoutGeneric>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingLeft: 5,
    // paddingRight: 5,
    marginTop: 5,
    fontSize: 30,
  },
  item: {
    // padding: 20,
    // marginTop: 5,
    fontSize: 15,
  },
});
