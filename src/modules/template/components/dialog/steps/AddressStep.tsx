import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  TabPanel,
  VStack,
} from '@chakra-ui/react';
import { Controller, UseFormReturn } from 'react-hook-form';

import { Dialog, RemoveIcon, UserAddIcon } from '@/components';
import { ITemplatePayload } from '@/modules/core';
import { useSteps } from '@/modules/template/hooks';

const AddressStep = ({ form }: { form: UseFormReturn<ITemplatePayload> }) => {
  const { addresses } = useSteps();

  return (
    <TabPanel p={0}>
      <Divider borderColor="dark.100" my={9} />

      <Dialog.Section
        title={
          <Heading fontSize="md" color="grey.200">
            Vault signers
          </Heading>
        }
        description="Who is going to sign this vault?"
        mb={8}
      />

      <VStack spacing={6}>
        {addresses.fields.map(({ id }, index) => (
          <Controller
            key={id}
            name={`addresses.${index}.value`}
            render={({ field, fieldState }) => {
              return (
                <FormControl isInvalid={fieldState.invalid}>
                  <InputGroup>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      placeholder=" "
                    />
                    <FormLabel color="grey.500">
                      {`Address ${index + 1}`}
                    </FormLabel>

                    <InputRightElement
                      px={2}
                      top="1px"
                      right="1px"
                      borderRadius={10}
                      bgColor="dark.200"
                      h="calc(100% - 2px)"
                    >
                      <Icon
                        as={RemoveIcon}
                        fontSize="md"
                        cursor="pointer"
                        onClick={() => {
                          if (index > 0) {
                            addresses.remove(index);
                            form.unregister(`addresses.${index}`);
                          }
                        }}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormHelperText color="error.500">
                    {fieldState.error?.message}
                  </FormHelperText>
                </FormControl>
              );
            }}
            control={form.control}
          />
        ))}
        <Button
          border="none"
          bgColor="dark.100"
          variant="secondary"
          onClick={() => {
            addresses.append({
              value: '',
            });
          }}
          leftIcon={<UserAddIcon />}
        >
          Add address
        </Button>
      </VStack>

      <Divider borderColor="dark.100" my={9} />

      <HStack>
        <Dialog.Section
          w="full"
          maxW={300}
          mb={5}
          title="Min signatures required?"
          description="Set the minimum number of signatures to approve a transfer."
        />

        <Box w="full" maxW={90} mb={3}>
          <Controller
            name="minSigners"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormControl>
                <Select
                  pt={2}
                  pb={2}
                  value={field.value}
                  defaultValue={1}
                  onChange={field.onChange}
                  placeholder=" "
                >
                  {Array(10)
                    .fill('')
                    .map((_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                </Select>
                <FormHelperText
                  color="error.500"
                  style={{
                    display: 'flex',
                    position: 'absolute',
                    left: '-309px',
                    minWidth: '400px',
                    marginBottom: '20px',
                  }}
                >
                  {fieldState.error?.message}
                </FormHelperText>
              </FormControl>
            )}
          />
        </Box>
      </HStack>
    </TabPanel>
  );
};

export { AddressStep };
