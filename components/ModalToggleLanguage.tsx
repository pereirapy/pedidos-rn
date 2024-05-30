import OurModal from './OurModal';
import { FlatList, StatusBar, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { languagesEnabled, LanguagesEnabled } from '~/translation';
import { useCallback, useEffect, useState } from 'react';

type ModalToggleLanguageProps = {
  modalVisible: boolean;
  setModalVisible: (arg: boolean) => void;
};

type ItemProps = {
  nameTranslated: string;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
};

const Item = ({nameTranslated, onPress, backgroundColor, textColor}: ItemProps) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
    <Text style={[styles.title, {color: textColor}]}>{nameTranslated}</Text>
  </TouchableOpacity>
);


const ModalToggleLanguage = ({ modalVisible, setModalVisible }: ModalToggleLanguageProps) => {
  const { t, i18n } = useTranslation();
  const [selectedId, setSelectedId] = useState<string>();
  

  const renderItem = ({item}: {item: LanguagesEnabled}) => {
    const backgroundColor = item.code === selectedId ? '#351cc3' : '#rgb(45, 41, 241)';
    const color = item.code === selectedId ? 'white' : 'white';
  
    return (
      <Item
      nameTranslated={t(`languages.${item.name}`)}
        onPress={() => setSelectedId(item.code)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  useEffect(() => {
    i18n.changeLanguage(selectedId)
    console.log(selectedId)  
  },[selectedId])
  

  return (
    <OurModal modalVisible={modalVisible} setModalVisible={setModalVisible}>
      <Text>Elija un nuevo idioma abajo:</Text>
      <FlatList
        data={languagesEnabled}
        renderItem={renderItem}
        keyExtractor={item => item.code}
        extraData={selectedId}
      />
    </OurModal>
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
    
  },
  title: {
    fontSize: 32,
  },
};

export default ModalToggleLanguage;
