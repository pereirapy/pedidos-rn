import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import Loading from './Loading';
import OurModal from './OurModal';

import { languagesEnabled, LanguagesEnabled } from '~/translation';
import { STORAGE_KEY_LANGUAGE_SELECTED } from '~/utils/constants';
import storage from '~/utils/storage';

type ModalToggleLanguageProps = {
  modalVisible: boolean;
  setModalVisible: (arg: boolean) => void;
};

type ItemProps = {
  nameTranslated: string;
  onPress: () => void;
  backgroundColor: string;
  icon: 'radio-button-on' | 'radio-button-off';
};

const Item = ({ nameTranslated, onPress, backgroundColor, icon }: ItemProps) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
    <View className="flex flex-row">
      <View className="mr-2">
        <Ionicons className="" name={icon} size={24} color="white" />
      </View>
      <View className="mt-1 w-32">
        <Text className="" style={[styles.title, { color: 'white' }]}>
          {nameTranslated}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const ModalToggleLanguage = ({ modalVisible, setModalVisible }: ModalToggleLanguageProps) => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>();
  const [loading, setLoading] = useState(true);

  const renderItem = ({ item }: { item: LanguagesEnabled }) => {
    const isCurrent = item.code === selectedLanguage;
    const backgroundColor = isCurrent ? '#351cc3' : '#rgb(45, 41, 241)';
    const icon = isCurrent ? 'radio-button-on' : 'radio-button-off';

    return (
      <Item
        nameTranslated={t(`languages.${item.name}`)}
        onPress={() => saveLanguagePreferred(item.code)}
        backgroundColor={backgroundColor}
        icon={icon}
      />
    );
  };

  useEffect(() => {
    async function getLanguageSaved() {
      try {
        const languageSaved = await storage.load({
          key: STORAGE_KEY_LANGUAGE_SELECTED,
          autoSync: true,
          syncInBackground: false,
        });
        if (languageSaved) setSelectedLanguage(languageSaved);
        setLoading(false);
      } catch (_) {
        setLoading(false);
      }
    }
    getLanguageSaved();
  }, []);

  const saveLanguagePreferred = (newLanguage: string) => {
    i18n.changeLanguage(newLanguage);
    storage.save({
      key: STORAGE_KEY_LANGUAGE_SELECTED,
      data: newLanguage,
    });
    setSelectedLanguage(newLanguage);
  };

  return (
    <OurModal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      title={t('languages.title')}>
      {!loading ? (
        <FlatList
          data={languagesEnabled}
          renderItem={renderItem}
          keyExtractor={(item) => item.code}
          extraData={selectedLanguage}
        />
      ) : (
        <Loading show={loading} />
      )}
    </OurModal>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 9,
  },
  title: {
    fontSize: 14,
  },
};

export default ModalToggleLanguage;
