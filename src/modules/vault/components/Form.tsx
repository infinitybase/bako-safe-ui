import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import { MdAdd as AddIcon, MdChevronLeft as LeftIcon } from 'react-icons/md';
import { TbTrash as RemoveIcon } from 'react-icons/tb';

import { TabState, UseCreateVaultReturn } from '@/modules';

export interface CreateVaultFormProps {
  tabs: UseCreateVaultReturn['tabs'];
  form: UseCreateVaultReturn['form'];
  addresses: UseCreateVaultReturn['addresses'];
}

const CreateVaultForm = ({ form, tabs, addresses }: CreateVaultFormProps) => {
  console.log(form.formState.errors);
  return (
    <form onSubmit={form.handleCreateVault}>
      <Tabs index={tabs.tab} colorScheme="green">
        <TabPanels>
          <TabPanel p={0}>
            <Box mb={6} maxW={400}>
              <Text fontSize="sm" color="gray">
                Select a Name and a Description to recognize your predicate.
              </Text>
            </Box>
            <Box mb={2}>
              <Controller
                name="name"
                render={({ field, fieldState }) => {
                  return (
                    <FormControl isInvalid={fieldState.invalid}>
                      <FormLabel color="gray">Name</FormLabel>
                      <Input
                        value={field.value}
                        onChange={field.onChange}
                        variant="filled"
                        bg="dark.100"
                        color="gray"
                        _hover={{}}
                      />
                      <FormHelperText>
                        <Text color="error">{fieldState.error?.message}</Text>
                      </FormHelperText>
                    </FormControl>
                  );
                }}
                control={form.control}
              />
            </Box>
            <Box mb={8}>
              <FormControl>
                <FormLabel color="gray">Description</FormLabel>
                <Input
                  variant="filled"
                  bg="dark.100"
                  color="gray"
                  _hover={{}}
                  {...form.register('description')}
                />
              </FormControl>
            </Box>
          </TabPanel>
          <TabPanel p={0}>
            <Box mb={6} maxW={400}>
              <Text fontSize="sm" color="gray">
                Add member addresses and select the minimum signatures required
                to execute a transaction.
              </Text>
            </Box>
            <Box mb={4}>
              <Button
                width="100%"
                color="grey"
                bgColor="dark.100"
                leftIcon={<Icon as={AddIcon} />}
                _hover={{}}
                _active={{}}
                onClick={() => addresses.append()}
              >
                Add address
              </Button>
            </Box>
            <Box mb={8}>
              {addresses.fields.map(({ id }, index) => {
                return (
                  <Box key={id} mb={2}>
                    <Controller
                      name={`addresses.${index}.value`}
                      render={({ field, fieldState }) => {
                        return (
                          <FormControl isInvalid={fieldState.invalid}>
                            <FormLabel color="gray">
                              {index === 0
                                ? 'Your address'
                                : `Address ${index + 1}`}
                            </FormLabel>
                            <InputGroup>
                              <Input
                                value={field.value}
                                onChange={(event) => {
                                  field.onChange(event);
                                  form.trigger('addresses');
                                }}
                                variant="filled"
                                bg="dark.100"
                                borderColor={
                                  fieldState.invalid ? 'error' : undefined
                                }
                                color="gray"
                                isDisabled={index === 0}
                                _hover={{}}
                              />
                              {index > 0 && (
                                <InputRightAddon
                                  borderColor="dark.100"
                                  bg="dark.100"
                                >
                                  <Icon
                                    as={RemoveIcon}
                                    fontSize="md"
                                    color="red.400"
                                    cursor="pointer"
                                    onClick={() => {
                                      if (index > 0) {
                                        addresses.remove(index);
                                      }
                                    }}
                                  />
                                </InputRightAddon>
                              )}
                            </InputGroup>
                            <FormHelperText>
                              <Text color="error">
                                {fieldState.error?.message}
                              </Text>
                            </FormHelperText>
                          </FormControl>
                        );
                      }}
                      control={form.control}
                    />
                  </Box>
                );
              })}
              <Box mb={2}>
                <Controller
                  name="minSigners"
                  render={({ field, fieldState }) => {
                    return (
                      <FormControl isInvalid={fieldState.invalid}>
                        <FormLabel color="gray">Signatures Required</FormLabel>
                        <Input
                          value={field.value}
                          onChange={field.onChange}
                          variant="filled"
                          bg="dark.100"
                          color="gray"
                          type="number"
                          _hover={{}}
                        />
                        <FormHelperText>
                          <Text color="error">{fieldState.error?.message}</Text>
                        </FormHelperText>
                      </FormControl>
                    );
                  }}
                  control={form.control}
                />
              </Box>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {tabs.isLast ? (
        <Flex>
          <Flex flex={1} mr={4}>
            <IconButton
              w="100%"
              variant="solid"
              color="gray"
              bgColor="dark.100"
              type="submit"
              onClick={() => tabs.set(TabState.INFO)}
              icon={<Icon fontSize="2xl" as={LeftIcon} />}
              _hover={{}}
              aria-label="Back tab"
            />
          </Flex>
          <Flex flex={4}>
            <Button
              w="100%"
              color="brand.900"
              variant="solid"
              colorScheme="brand"
              type="submit"
              isLoading={false}
              isDisabled={!form.formState.isValid}
            >
              Create
            </Button>
          </Flex>
        </Flex>
      ) : (
        <Button
          w="100%"
          color="brand.900"
          variant="solid"
          colorScheme="brand"
          onClick={(e) => {
            e.preventDefault();
            tabs.set(TabState.ADDRESSES);
          }}
        >
          Continue
        </Button>
      )}
    </form>
  );
};

export { CreateVaultForm };
