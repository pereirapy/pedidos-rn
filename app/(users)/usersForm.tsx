import { Form, FormSubmitHandler, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/Button';
import TextInput from '~/components/TextInput';
import { UsersFormValues } from './schema';
import Select from '~/components/Select';

type UsersFormProps = {
  onSubmit: FormSubmitHandler<UsersFormValues>;
  form: UseFormReturn<UsersFormValues>;
  UsersTypeOptionsTranslated: { key: string; value: string }[];
};

export const UsersForm = ({ form, onSubmit, UsersTypeOptionsTranslated }: UsersFormProps) => {
  const { t } = useTranslation();

  return (
    <Form
      onSubmit={onSubmit}
      control={form.control}
      render={({ submit }) => {
        return (
          <>
            <TextInput form={form} label={t('usersPage.fieldName')} name="name" />
            <TextInput
              keyboardType="email-address"
              form={form}
              label={t('usersPage.fieldEmail')}
              name="email"
            />
            <Select
              form={form}
              data={UsersTypeOptionsTranslated}
              save="key"
              name="type"
              label={t('usersPage.fieldType')}
            />
            <Button
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
              isLoading={form.formState.isSubmitting}
              title={t('usersPage.buttonSubmit')}
              onPress={submit}
              className="mt-4"
            />
          </>
        );
      }}
    />
  );
};
