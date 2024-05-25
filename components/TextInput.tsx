import React, { useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { View, TextInput as TextInputReactNative, Text } from 'react-native';

type TextInputProps = {
  isMultiLine?: boolean;
  isEditable?: boolean;
  backgroundColor?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  numberOfLines?: number;
  maxLength?: number;
  form: UseFormReturn<any>;
  label?: string;
  description?: string;
  name: string;
};

const styles = {
  label: 'mr-2 my-4',
  description: 'text-muted-foreground text-[0.8rem]',
  error: 'text-red-700 text-[0.8rem] font-medium overflow-hidden opacity-100 h-5',
};

const TextInput = ({
  isMultiLine,
  autoCapitalize,
  isEditable,
  backgroundColor,
  numberOfLines,
  maxLength,
  form,
  label,
  description,
  name,
}: TextInputProps) => {
  return (
    <View className='my-4'>
      {label && <Text className={styles.label}>{label}</Text>}
      <Controller
        control={form.control}
        name={name}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
          <>
            <TextInputReactNative
              focusable
              editable={isEditable || true}
              autoCapitalize={autoCapitalize || 'none'}
              multiline={Boolean(isMultiLine)}
              numberOfLines={numberOfLines || 1}
              maxLength={maxLength || 40}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              className={`${error ? 'border-b-red-700' : 'border-b-gray-500'} ${backgroundColor ?? 'bg-white'} mb-4 border-b p-4`}
            />
            {error?.message && <Text className={styles.error}>{String(error?.message)}</Text>}
          </>
        )}
      />
      {description && <Text className={styles.description}>{description}</Text>}
    </View>
  );
};

export default TextInput;
