import React, { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Loading from '~/components/Loading';
import { useAuth } from '~/hooks/useAuth';
import { collection, doc, getCountFromServer, deleteDoc } from 'firebase/firestore';
import { db } from '~/utils/firebase';
import { LIMIT_PER_PAGE } from '~/utils/constants';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  Pressable,
  TextInput,
  ScaledSize,
  Text,
  View,
} from 'react-native';
import OurModal from '~/components/OurModal';
import { StyleSheet } from 'react-native';
import { UserWithId } from '~/types/users';
import { AntDesign } from '@expo/vector-icons';
import { TFunction } from 'i18next';
import { router } from 'expo-router';
import { useFocus } from '~/hooks/useFocus';
import { Button } from '~/components/Button';
import { useAlertQuestion } from '~/hooks/useAlertQuestion';
import { Code, ContextMenu } from './ContextMenu';

type MyListHeaderProps = {
  screenDimensions: ScaledSize;
  columnsName: {key: string; value: string}[];
};

type MyListFooterProps = {
  handlePrevPage: () => void;
  handleNextPage: () => void;
  disablePrevButton: boolean;
  loadingMoreData: boolean;
  disableNextButton: boolean;
};

const MyRenderItem = ({
  item,
  index,
  t,
  handleDeleteItem,
  titleItemModal,
}: ListRenderItemInfo<UserWithId> & {
  t: TFunction<'translation', undefined>;
  handleDeleteItem: (id: string) => void;
  titleItemModal: string;
}) => {
  const bgColor = index % 2 !== 0 ? 'bg-slate-300' : '';
  const screenDimensions = Dimensions.get('screen');
  const [rowColor, setRowColor] = useState(bgColor);
  const [modalVisible, setModalVisible] = useState(false);
  const { ourAlert } = useAlertQuestion({ handleDeleteItem, idToDelete: item.id });

  const handleOnPress = () => {
    setModalVisible(true);
  };

  const handleOnPressIn = () => {
    setRowColor('bg-slate-600');
  };

  const handleOnPressOut = () => {
    setRowColor(bgColor);
  };

  const handleOnClickItem = (code: Code) => {
    if (code === 'edit') router.push(`/(users)/${item.id}`);
    else if (code === 'delete') ourAlert();
  };

  return (
    <>
      <OurModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title={titleItemModal}>
        <ContextMenu onPress={handleOnClickItem} setModalVisible={setModalVisible} />
      </OurModal>

      <Pressable onPressIn={handleOnPressIn} onPressOut={handleOnPressOut} onPress={handleOnPress}>
        <View className={`flex flex-row ${rowColor}`}>
          <Text
            className="py-4 pl-2"
            style={{
              width: screenDimensions.width / 2,
              textDecorationLine: 'underline',
            }}>
            {item.name}
          </Text>
          <Text
            className="py-4 pl-2"
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
      <Text className="p-4" style={styles.item}>
        No data found
      </Text>
    </View>
  );
};

const myItemSeparator = () => {
  return <View className="bg-slate-300" style={{ height: 1 }} />;
};

const MyListHeader = ({ screenDimensions, columnsName }: MyListHeaderProps) => (
  <>
    <View className="flex flex-row bg-slate-500 py-4 ">
      {columnsName.map((objColumn) => (
        <Text key={objColumn.key} className="pl-2 font-bold text-white " style={{ width: screenDimensions.width / 2 }}>
          {objColumn.value}
        </Text>
      ))}
    </View>
  </>
);

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

type OurFlatListProps = {
  getData: (page?: number) => Promise<void>;
  modalChildren: ReactNode | string;
  titleModal: string;
  collectionName: string;
  titleItemModal: string;
  data: any[];
  columnsName: {key: string; value: string}[];
};

export default function OurFlatList({
  getData,
  modalChildren,
  titleModal,
  collectionName,
  titleItemModal,
  data,
  columnsName,
}: OurFlatListProps) {
  const { t } = useTranslation();
  const { loading: loadingUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataFiltered, setDataFiltered] = useState<UserWithId[] | []>([]);
  const screenDimensions = Dimensions.get('screen');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loadingMoreData, setLoadingMoreData] = useState(false);
  const [search, setSearch] = useState('');
  const { focusCount, isFocused } = useFocus();

  useEffect(() => {
    if (focusCount > 1 && isFocused) {
      if (loading || loadingMoreData) return;
      getData();
      getTotalRecords();
    }
  }, [focusCount]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.length > 3) {
        const dataFiltered = data.filter((obj) =>
          obj[columnsName[0].key].toLowerCase().includes(search.trim().toLowerCase())
        );
        setDataFiltered(dataFiltered);
      } else if (search.length === 0) setDataFiltered(data);
    }, 1000);
    return () => clearTimeout(timer);
  }, [search]);

  const resetDataAndPage = () => {
    setCurrentPage(1);
    setModalVisible(false);
  };

  useEffect(() => {
    getTotalRecords();
  }, []);

  const getTotalRecords = async () => {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getCountFromServer(collectionRef);
    setTotalRecords(snapshot.data().count);
    setLoading(false);
  };

  const handlePrevPage = async () => {
    setLoadingMoreData(true);
    setCurrentPage((prev) => prev - 1);
    await getData(currentPage - 1);
    setLoadingMoreData(false);
  };

  const handleNextPage = async () => {
    setLoadingMoreData(true);
    setCurrentPage((prev) => prev + 1);
    await getData(currentPage + 1);
    setLoadingMoreData(false);
  };

  const handleDeleteItem = async (id: string) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, collectionName, id));
      resetDataAndPage();
      await getData();
      await getTotalRecords();
      setLoading(false);
    } catch (error) {
      Alert.alert(String(alert));
    }
  };

  const disableNextButton = totalRecords < currentPage * LIMIT_PER_PAGE;
  const disablePrevButton = currentPage === 1;
  const allData = dataFiltered.length > 0 ? dataFiltered : data;

  return (
    <>
      <OurModal modalVisible={modalVisible} setModalVisible={setModalVisible} title={titleModal}>
        {modalChildren}
      </OurModal>
      <View style={styles.container}>
        {loading || loadingUser ? (
          <Loading show={loading} />
        ) : (
          <View>
            <View className="mb-4 flex flex-row bg-slate-200">
              <Button
                onPress={() => setModalVisible(true)}
                title={<AntDesign name="plus" size={24} color="black" />}
                className="my-2 ml-2 w-12 rounded-[2px] p-1 m-2"
              />
              <TextInput
                inputMode="search"
                placeholder="Search"
                returnKeyType="search"
                focusable
                autoCapitalize={'none'}
                onChangeText={setSearch}
                value={search}
                className="align-self-end flex-1 p-4   pb-4 text-right shadow-lg"
              />
              <AntDesign
                className="mr-2 mt-3"
                onPress={() => setSearch(search)}
                name="search1"
                size={24}
                color="black"
              />
            </View>
            <FlatList
              data={allData}
              refreshing={loading}
              onRefresh={getData}
              style={{ width: screenDimensions.width, height: '100%' }}
              renderItem={(props) => (
                <MyRenderItem
                  {...props}
                  t={t}
                  handleDeleteItem={handleDeleteItem}
                  titleItemModal={titleItemModal}
                />
              )}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={myItemSeparator}
              ListEmptyComponent={myListEmpty}
              ListHeaderComponent={() => (
                <MyListHeader screenDimensions={screenDimensions} columnsName={columnsName} />
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
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    fontSize: 30,
  },
  item: {
    fontSize: 15,
  },
});
