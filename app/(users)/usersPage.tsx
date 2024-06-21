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
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  Pressable,
  SafeAreaView,
  ScaledSize,
  Text,
  View,
} from 'react-native';
import OurModal from '~/components/OurModal';
import { StyleSheet } from 'react-native';
import { UserWithId } from '~/types/users';
import { AntDesign } from '@expo/vector-icons';
import { TFunction } from 'i18next';
import { OptionsOnClickItem } from './optionsOnClickItem';
import { router } from 'expo-router';

const MyRenderItem = ({
  item,
  index,
  t,
}: ListRenderItemInfo<UserWithId> & { t: TFunction<'translation', undefined> }) => {
  const bgColor = index % 2 !== 0 ? 'bg-slate-300' : '';
  const screenDimensions = Dimensions.get('screen');
  const [rowColor, setRowColor] = useState(bgColor);
  const [modalVisible, setModalVisible] = useState(false);

  const handleOnPress = (item: UserWithId) => {
    setModalVisible(true);
  };

  const handleOnPressIn = () => {
    setRowColor('bg-slate-600');

  };

  const handleOnPressOut = () => {
    setRowColor(bgColor);
  };

  const handleOnClickItem = () => {
    router.push(`/(users)/${item.id}`)
    //Alert.alert('title', JSON.stringify(item));

  }

  return (
    <>
      <OurModal modalVisible={modalVisible} setModalVisible={setModalVisible}>
        <Text>{t('usersPage.titleItemModal')}</Text>
        <OptionsOnClickItem onPress={handleOnClickItem} setModalVisible={setModalVisible}/>
      </OurModal>

      <Pressable
        onPressIn={handleOnPressIn}
        onPressOut={handleOnPressOut}
        onPress={() => handleOnPress(item)}>
        <View className={`flex flex-row flex-nowrap ${rowColor}`}>
          <Text
            className="ml-2 cursor-pointer py-4"
            style={{
              width: screenDimensions.width / 2,
              textDecorationLine: 'underline',
            }}>
            {item.name}
          </Text>
          <Text
            className="ml-2 cursor-pointer py-4"
            style={{
              width: screenDimensions.width / 2,
              textDecorationLine: 'underline',
            }}>
            {item.email}
          </Text>
        </View>
      </Pressable>
    </>
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

type MyListHeaderProps = {
  screenDimensions: ScaledSize;
  t: TFunction<'translation', undefined>;
};

const MyListHeader = ({ screenDimensions, t }: MyListHeaderProps) => (
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
);

type MyListFooterProps = {
  handlePrevPage: () => void;
  handleNextPage: () => void;
  disablePrevButton: boolean;
  loadingMoreData: boolean;
  disableNextButton: boolean;
};

const MyListFooter = ({
  handlePrevPage,
  handleNextPage,
  disablePrevButton,
  loadingMoreData,
  disableNextButton,
}: MyListFooterProps) => (
  <View className={`mt-8 flex flex-row justify-center`}>
    <>
      <Pressable onPress={handlePrevPage} className={`mr-8`} disabled={disablePrevButton}>
        {loadingMoreData ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <AntDesign
            name="leftcircleo"
            size={32}
            color={`${disablePrevButton ? 'rgba(0,0,0,0.3);' : 'black'}`}
          />
        )}
      </Pressable>

      <Pressable onPress={handleNextPage} disabled={disableNextButton}>
        {loadingMoreData ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <AntDesign
            name="rightcircleo"
            size={32}
            color={`${disableNextButton ? 'rgba(0,0,0,0.3);' : 'black'}`}
          />
        )}
      </Pressable>
    </>
  </View>
);

export default function UsersPage() {
  const { t } = useTranslation();
  const { loading: loadingUser } = useAuth();
  const [loading, setLoading] = useState(true);
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
    setLoading(true)
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
      setLoading(false);
      console.error('Error getting document: ', e);
    }
    const mountDataConverted = mountData as unknown as UserWithId[];
    setData(mountDataConverted);
    setLoading(false)
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
        {loading || loadingUser ? (
          <Loading show={loading} />
        ) : (
          <FlatList
            data={data}
            style={{ width: screenDimensions.width, height: '100%' }}
            renderItem={(props) => <MyRenderItem {...props} t={t}  />}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={myItemSeparator}
            ListEmptyComponent={myListEmpty}
            ListHeaderComponent={() => (
              <MyListHeader t={t} screenDimensions={screenDimensions} />
            )}
            ListFooterComponent={() => (
              <MyListFooter
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
                loadingMoreData={loadingMoreData}
                disableNextButton={disableNextButton}
                disablePrevButton={disablePrevButton}
              />
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
