import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { View, Text } from 'react-native';
import { SelectList, SelectListProps } from 'react-native-dropdown-select-list';
import { SimpleKeyValue } from '~/types/generic';

type SelectProps = Omit<SelectListProps, 'setSelected' | 'data'> & {
  data: SimpleKeyValue[];
  backgroundColor?: string;
  form: UseFormReturn<any>;
  label?: string;
  description?: string;
  name: string;
};

const styles = {
  label: 'mr-2 my-4',
  description: 'text-muted-foreground text-[0.8rem]',
  error: 'text-red-700 text-[0.8rem] font-medium overflow-hidden opacity-100 h-5 mt-4',
};

const Select = ({ data, save = 'key', form, label, description, name }: SelectProps) => {
  return (
    <View className="my-5">
      <Controller
        control={form.control}
        name={name}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return (
            <>
              {label && (
                <Text className={`my-5 mr-2 ${error ? 'text-red-700' : 'text-slate-500'}`}>
                  {label}
                </Text>
              )}
              <SelectList
                onSelect={() => form.setValue(name, value)}
                setSelected={onChange}
                defaultOption={data.find((item) => item[save] === String(value))}
                data={data}
                save={save}
                dropdownStyles={{
                  borderColor: `${error ? 'rgb(185 28 28)' : 'rgb(107 114 128)'}`,
                  backgroundColor: 'white',
                }}
                boxStyles={{
                  borderColor: `${error ? 'rgb(185 28 28)' : 'rgb(107 114 128)'}`,
                  backgroundColor: 'white',
                  marginBottom: 20,
                  borderBottomWidth: 1,
                  padding: 4,
                }}
              />
              {error?.message && <Text className={styles.error}>{String(error?.message)}</Text>}
            </>
          );
        }}
      />
      {description && <Text className={styles.description}>{description}</Text>}
    </View>
  );
};

export default Select;
