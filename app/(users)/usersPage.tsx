import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import LayoutGeneric from '~/components/LayoutGeneric';
import Loading from '~/components/Loading';
import { useAuth } from '~/hooks/useAuth';
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
  getCountFromServer,
} from 'firebase/firestore';
import { db } from '~/utils/firebase';
import { UsersFormValues, usersFormSchema } from './schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UsersForm } from './usersForm';
import { LIMIT_PER_PAGE, UsersTypeOptions } from '~/utils/constants';
import {
  Alert,
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import OurModal from '~/components/OurModal';
import { StyleSheet } from 'react-native';
import { UserWithId } from '~/types/users';
import { AntDesign } from '@expo/vector-icons';

const MyRenderItem = ({ item, index }: ListRenderItemInfo<UserWithId>) => {
  const bgColor = index % 2 !== 0 ? 'bg-slate-300' : '';
  const screenDimensions = Dimensions.get('screen');
  const [rowColor, setRowColor] = useState(bgColor);

  const handleOnPress = (item: UserWithId) => {
    Alert.alert('title', JSON.stringify(item));
  };

  const handleOnPressIn = () => {
    setRowColor('bg-slate-600');
  };

  const handleOnPressOut = () => {
    setRowColor(bgColor);
  };

  return (
    <Pressable
      onPressIn={handleOnPressIn}
      onPressOut={handleOnPressOut}
      onPress={() => handleOnPress(item)}>
      <View className={`flex flex-row flex-nowrap ${rowColor} `}>
        <Text className="ml-2  py-4" style={{ width: screenDimensions.width / 2 }}>
          {item.name}
        </Text>
        <Text className="ml-2 py-4" style={{ width: screenDimensions.width / 2 }}>
          {item.email}
        </Text>
      </View>
    </Pressable>
  );
};

const myListEmpty = () => {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={styles.item}>No data found</Text>
    </View>
  );
};

const myItemSeparator = () => {
  return <View className="bg-slate-300" style={{ height: 1 }} />;
};


export default function UsersPage() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<UserWithId[] | []>([]);
  const screenDimensions = Dimensions.get('screen');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loadingMoreData, setLoadingMoreData] = useState(false);

  const form = useForm<UsersFormValues>({
    resolver: zodResolver(usersFormSchema),
    mode: 'onChange',
  });

  const getAllUsers = async (currentPageByParam?: number) => {
    const mountData: DocumentData[] = [];
    const newCurrentPage = currentPageByParam || currentPage;
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getCountFromServer(usersRef);
      setTotalRecords(snapshot.data().count);
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
    } catch (e) {
      console.error('Error getting document: ', e);
    }
    const mountDataConverted = mountData as unknown as UserWithId[];
    setData(mountDataConverted);
  };

  const onSubmit = async ({ data }: { data: UsersFormValues }) => {
    try {
      await setDoc(doc(db, 'users', data.email), data);
      Alert.alert(
        t('usersPage.information'),
        t('usersPage.data_saved_successfully'),
        [
          {
            text: t('usersPage.close'),
            style: 'cancel',
          },
        ],
        {
          cancelable: true,
        }
      );
      form.reset();
    } catch (error: any) {
      const errorCode = error.code;
      console.error(errorCode);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const UsersTypeOptionsTranslated = useMemo(
    () =>
      UsersTypeOptions.map((item) => ({
        key: item.key,
        value: t(`usersPage.${item.value}`),
      })),
    [UsersTypeOptions]
  );

  const handlePrevPage = async () => {
    setLoadingMoreData(true);
    setCurrentPage((prev) => prev - 1);
    await getAllUsers(currentPage - 1);
    setLoadingMoreData(false);
  };

  const handleNextPage = async () => {
    setLoadingMoreData(true);
    setCurrentPage((prev) => prev + 1);
    await getAllUsers(currentPage + 1);
    setLoadingMoreData(false);
  };

  const disableNextButton = totalRecords < currentPage * LIMIT_PER_PAGE;
  const disablePrevButton = currentPage === 1;

  return (
    <LayoutGeneric title={t('usersPage.title')}>
      <OurModal modalVisible={modalVisible} setModalVisible={setModalVisible}>
        <Text>{t('usersPage.modalTitle')}</Text>
        <UsersForm
          onSubmit={onSubmit}
          form={form}
          UsersTypeOptionsTranslated={UsersTypeOptionsTranslated}
        />
      </OurModal>
      <SafeAreaView style={styles.container}>
        {loading ? (
          <Loading show={loading} />
        ) : (
          <FlatList
            data={data}
            style={{ width: screenDimensions.width, height: '100%' }}
            renderItem={(props) => <MyRenderItem {...props} />}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={myItemSeparator}
            ListEmptyComponent={myListEmpty}
            ListHeaderComponent={() => (
              <>
                <Text
                  className=""
                  style={{
                    width: screenDimensions.width,
                    fontSize: 30,
                    textAlign: 'center',
                    marginTop: 20,
                    fontWeight: 'bold',
                    textDecorationLine: 'underline',
                  }}>
                  {t('usersPage.titlePage')}
                </Text>
                <View className="mt-4 flex flex-row bg-slate-500">
                  <Text
                    className="ml-2 py-4 font-bold text-white"
                    style={{ width: screenDimensions.width / 2 }}>
                    {t('usersPage.nameColumn')}
                  </Text>
                  <Text
                    className="ml-2 py-4 font-bold text-white"
                    style={{ width: screenDimensions.width / 2 }}>
                    {t('usersPage.emailColumn')}
                  </Text>
                </View>
              </>
            )}
            ListFooterComponent={() => (
              <View className="mt-8 flex flex-row justify-center">
                <Pressable onPress={handlePrevPage} className="mr-8" disabled={disablePrevButton}>
                  <AntDesign
                    name={loadingMoreData ? 'loading1' : 'leftcircleo'}
                    size={32}
                    color={`${disablePrevButton ? 'rgba(0,0,0,0.3);' : 'black'}`}
                  />
                </Pressable>
                <Pressable onPress={handleNextPage} disabled={disableNextButton}>
                  <AntDesign
                    name={loadingMoreData ? 'loading1' : 'rightcircleo'}
                    size={32}
                    color={`${disableNextButton ? 'rgba(0,0,0,0.3);' : 'black'}`}
                  />
                </Pressable>
              </View>
            )}
          />
        )}
      </SafeAreaView>
    </LayoutGeneric>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    fontSize: 30,
  },
  item: {
    // padding: 20,
    // marginTop: 5,
    fontSize: 15,
  },
});
