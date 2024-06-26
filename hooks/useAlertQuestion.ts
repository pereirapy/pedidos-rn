import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

type AlertQuestionProps = {
  handleDeleteItem: (id: string) => void;
  idToDelete: string;
};

export const useAlertQuestion = ({ handleDeleteItem, idToDelete }: AlertQuestionProps) => {
  const { t } = useTranslation();

  const ourAlert = () =>
    Alert.alert(t('common.areYouSure'), t('common.actionCannotUndone'), [
      {
        text: t('common.no'),
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: t('common.yes'), onPress: () => handleDeleteItem(idToDelete) },
    ]);

  return { ourAlert };
};
