import React, { useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { View, TextInput as TextInputReactNative, Text, KeyboardTypeOptions } from 'react-native';

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
  keyboardType?: KeyboardTypeOptions;
  isPassword?: boolean;
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
  keyboardType,
  isPassword,
}: TextInputProps) => {
  return (
    <View className="my-4">
      <Controller
        control={form.control}
        name={name}
        render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
          <>
            {label && <Text className={`mr-2 my-4 ${error ? 'text-red-700' : 'text-slate-500' }`}>{label}</Text>}
            <TextInputReactNative
              secureTextEntry={isPassword}
              keyboardType={keyboardType}
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
