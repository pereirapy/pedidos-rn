import { forwardRef } from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ActivityIndicator,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  onPress?: () => void;
  title: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export const Button = forwardRef<TouchableOpacity, ButtonProps>(
  ({ onPress, title, isLoading, disabled }, ref) => {
    return (
      <TouchableOpacity
        ref={ref}
        className={styles.button}
        onPress={onPress}
        disabled={disabled || isLoading}>
        {isLoading && (
          <View className="mr-2">
            <ActivityIndicator color="white" size="small" />
          </View>
        )}
        <Text className={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    );
  }
);

const styles = {
  button:
    'bg-indigo-500 active:bg-indigo-700 rounded-[28px] shadow-md p-4 flex flex-row justify-center items-center disabled:opacity-65',
  buttonText: 'text-white text-lg font-semibold text-center',
};
