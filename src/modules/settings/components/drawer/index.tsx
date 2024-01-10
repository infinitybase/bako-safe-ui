import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { ErrorIcon } from '@/components';

import { useSettings } from '../../hooks';

interface SettingsDrawerProps extends Omit<DrawerProps, 'children'> {
  onOpen: () => void;
}

const SettingsDrawer = ({ ...props }: SettingsDrawerProps) => {
  const {
    form,
    handleSubmitSettings,
    updateSettingsRequest: { isLoading },
    onCloseDrawer,
  } = useSettings({ onOpen: props.onOpen, onClose: props.onClose });

  return (
    <Drawer
      {...props}
      size="sm"
      variant="glassmorphic"
      placement="right"
      onClose={onCloseDrawer}
      isOpen={props.isOpen}
    >
      <DrawerOverlay />
      <DrawerContent>
        <Flex mb={5} w="full" justifyContent="flex-end">
          <HStack cursor="pointer" onClick={onCloseDrawer} spacing={2}>
            <ErrorIcon />
            <Text fontWeight="semibold" color="white">
              Close
            </Text>
          </HStack>
        </Flex>

        <DrawerHeader mb={6}>
          <VStack alignItems="flex-start" spacing={2}>
            <HStack spacing={2} alignItems="center">
              <Heading fontSize="xl" fontWeight="bold" color="grey.200">
                Settings
              </Heading>
            </HStack>
            <Text
              fontSize="sm"
              maxWidth={320}
              color="grey.500"
              fontWeight="light"
            >
              Personalize Your Preferences: Set Your Name, Email, and Email
              Notification Preferences.
            </Text>
          </VStack>
        </DrawerHeader>

        <DrawerBody
          css={{
            '::-webkit-scrollbar': { width: 0 },
            scrollbarWidth: 'none',
          }}
        >
          <VStack alignItems="flex-start" p={1}>
            <VStack spacing={3} w="full" mb={2}>
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormControl isInvalid={fieldState.invalid}>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      placeholder=" "
                    />
                    <FormLabel>Name</FormLabel>
                    <FormHelperText color="error.500">
                      {fieldState.error?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />

              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormControl isInvalid={fieldState.invalid}>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      placeholder=" "
                    />
                    <FormLabel>Email Address</FormLabel>
                    <FormHelperText color="error.500">
                      {fieldState.error?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </VStack>

            <Text fontWeight="bold" color="grey.200" fontSize={15}>
              Do you wanna receive email notifications?
            </Text>

            <Controller
              control={form.control}
              name="notify"
              render={({ field }) => (
                <RadioGroup
                  name={field.name}
                  value={field.value ?? 'false'}
                  onChange={field.onChange}
                >
                  <VStack>
                    <Radio value="true" size="md">
                      Sounds good
                    </Radio>
                    <Radio value="false" size="md">
                      Nope, thanks
                    </Radio>
                  </VStack>
                </RadioGroup>
              )}
            />

            <Divider borderColor="dark.100" mb={5} mt={4} />

            <HStack w="full" justifyContent="center">
              <Button
                variant="secondary"
                bgColor="dark.100"
                border="none"
                onClick={onCloseDrawer}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                isDisabled={isLoading}
                onClick={handleSubmitSettings}
                isLoading={isLoading}
              >
                Update
              </Button>
            </HStack>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export { SettingsDrawer };
