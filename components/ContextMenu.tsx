import { useTranslation } from 'react-i18next';
import {
  FlatList,
  StatusBar,
  TouchableOpacity,
  View,
  Text,
  ListRenderItemInfo,
} from 'react-native';
import { SimpleKeyValue } from '~/types/generic';

export type Code = 'edit' | 'delete';

type ItemProps = {
  item: ListRenderItemInfo<SimpleKeyValue>;
  onPress: (code: Code) => void;
};

const Item = ({ item, onPress }: ItemProps) => (
    <TouchableOpacity
      className="self-center w-screen"
      onPress={() => onPress(item.item.key)}
      style={styles.item}>
      <View className={`w-full px-2 mt-1 py-4 ${item.index % 2 === 0 ? 'bg-slate-300' : ''}`}>
        <Text className="text-center underline " style={[styles.title, { color: 'black' }]}>
          {item.item.value}
        </Text>
      </View>
    </TouchableOpacity>
);

type RenderItemProps = {
  item: ListRenderItemInfo<SimpleKeyValue>;
  onPress: (code: Code) => void;
  setModalVisible: (toggle: boolean) => void;
};

const renderItem = ({ item, onPress, setModalVisible }: RenderItemProps) => {
  const handleOnClickItem = (key: Code) => {
    onPress(key);
    setTimeout(() => {
      setModalVisible(false);
    }, 100);
  };

  return <Item item={item} onPress={() => handleOnClickItem(item.item.key)} />;
};

type ContextMenuProps = {
  onPress: (code: Code) => void;
  setModalVisible: (toggle: boolean) => void;
};

const ContextMenu = ({ onPress, setModalVisible }: ContextMenuProps) => {
  const { t } = useTranslation();

  const data: SimpleKeyValue[] = [
    { key: 'edit', value: t('common.edit') },
    { key: 'delete', value: t('common.delete') },
  ];

  return (
    <View className="w-full">
      <FlatList
        data={data}
        renderItem={(item) => renderItem({ item, onPress, setModalVisible })}
        keyExtractor={(item) => item.key}
      />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 10,
  },
  title: {
    fontSize: 14,
  },
};

export { ContextMenu };
