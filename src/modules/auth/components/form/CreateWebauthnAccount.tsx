import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { ChangeEvent } from 'react';
import { Controller } from 'react-hook-form';

import { LineCloseIcon } from '@/components';

import { UseWebAuthn } from '../../hooks';

interface CreateWebAuthnFormProps {
  form: UseWebAuthn['form']['memberForm'];
  nickname: {
    search: string;
    setSearch: (value: string) => void;
    nicknamesData: UseWebAuthn['nicknamesData'];
    searchHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  };
  onSubmitUsingEnterKey: UseWebAuthn['form']['formState']['handlePrimaryActionUsingEnterKey'];
}
export const CreateWebAuthnForm = ({
  form,
  nickname,
  onSubmitUsingEnterKey,
}: CreateWebAuthnFormProps) => {
  const { search, setSearch, nicknamesData, searchHandler } = nickname;

  return (
    <Box w="full" mb={6} p="1px">
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Box position="relative">
            <FormControl isInvalid={fieldState.invalid}>
              <Input
                value={search}
                placeholder=""
                onChange={(e) => {
                  searchHandler(e);
                  field.onChange(e.target.value);
                }}
                onKeyDown={(e) => onSubmitUsingEnterKey(e)}
                isInvalid={
                  fieldState.invalid ||
                  (!!nicknamesData?.name && search.length > 0)
                }
              />
              <FormLabel color="gray">Username</FormLabel>
              <FormHelperText
                color={
                  nicknamesData?.name || form.formState.errors.name?.message
                    ? 'error.500'
                    : 'grey.500'
                }
              >
                {nicknamesData?.name && search.length > 0
                  ? 'Name already exists'
                  : form.formState.errors.name?.message
                    ? form.formState.errors.name?.message
                    : search.length > 0
                      ? 'This username is available'
                      : ''}
              </FormHelperText>
            </FormControl>
            <LineCloseIcon
              position="absolute"
              top={4}
              right={4}
              fontSize={16}
              color="grey.100"
              _hover={{
                cursor: 'pointer',
              }}
              onClick={() => {
                setSearch('');
                field.onChange('');
              }}
            />
          </Box>
        )}
      />
    </Box>
  );
};
