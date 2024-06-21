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
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

type ItemProps = {
  name: string;
  onPress: () => void;
  backgroundColor: string;
  icon: 'radio-button-on' | 'radio-button-off';
};

const Item = ({ name, onPress, backgroundColor, icon }: ItemProps) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
    <View className="flex flex-row">
      <View className="mr-2">
        <Ionicons className="" name={icon} size={24} color="white" />
      </View>
      <View className="mt-1 w-32">
        <Text className="" style={[styles.title, { color: 'white' }]}>
          {name}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

type RenderItemProps = {
  item: ListRenderItemInfo<SimpleKeyValue>;
  onPress: (code: string) => void;
  setSelectedItem: (code: string) => void;
  selectedItem: string;
  setModalVisible: (toggle: boolean) => void

};

const renderItem = ({ item, onPress, setSelectedItem, selectedItem, setModalVisible }: RenderItemProps) => {
  const isCurrent = item.item.key === selectedItem;
  const backgroundColor = isCurrent ? '#351cc3' : '#rgb(45, 41, 241)';
  const icon = isCurrent ? 'radio-button-on' : 'radio-button-off';

  const handleOnClickItem = (key: string) => {
    setSelectedItem(key);
    onPress(key);
    setModalVisible(false);
  }

  return (
    <Item
      name={item.item.value}
      onPress={() => handleOnClickItem(item.item.key)}
      backgroundColor={backgroundColor}
      icon={icon}
    />
  );
};

type OptionsOnClickItemProps = {
  onPress: () => void;
  setModalVisible: (toggle: boolean) => void
};

const OptionsOnClickItem = ({ onPress, setModalVisible }: OptionsOnClickItemProps) => {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState<string>('');

  const data: SimpleKeyValue[] = [
    { key: 'edit', value: t('optionsOnClickItem.edit') },
    { key: 'delete', value: t('optionsOnClickItem.delete') },
  ];

  return (
    <FlatList
      data={data}
      renderItem={(item) => renderItem({ item, onPress, setSelectedItem, selectedItem, setModalVisible })}
      keyExtractor={(item) => item.key}
      extraData={selectedItem}
    />
  );
};

const styles = {
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 9,
  },
  title: {
    fontSize: 14,
  },
};

export { OptionsOnClickItem };
