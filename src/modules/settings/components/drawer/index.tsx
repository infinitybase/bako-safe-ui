import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
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
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';

import { LineCloseIcon } from '@/components';
import { useWebAuthnSignIn } from '@/modules/auth';
import { AddressUtils } from '@/modules/core/utils/address';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import {
  ActionKeys,
  handleActionUsingKeys,
} from '@/utils/handle-action-using-keys';

import { useSettings } from '../../hooks';

interface SettingsDrawerProps extends Omit<DrawerProps, 'children'> {
  onOpen: () => void;
}

const SettingsDrawer = ({ ...props }: SettingsDrawerProps) => {
  const {
    form,
    handleSubmitSettings,
    updateSettingsRequest: { isPending: isLoading },
    onCloseDrawer,
    mySettingsRequest,
  } = useSettings({ onOpen: props.onOpen, onClose: props.onClose });
  const { checkNicknameRequest, inputValue, setInputValue, handleInputChange } =
    useWebAuthnSignIn();
  const {
    authDetails: { userInfos },
  } = useWorkspaceContext();

  const isNameInputInvalid = (form.watch('name')?.length ?? 0) <= 2;

  const isNicknameInUse =
    !!checkNicknameRequest.data?.name &&
    checkNicknameRequest.data?.id !== userInfos.id &&
    inputValue?.length > 0;

  const name = mySettingsRequest.data?.name ?? '';

  const disableUpdateButton =
    isLoading ||
    isNicknameInUse ||
    checkNicknameRequest.isLoading ||
    isNameInputInvalid;

  useEffect(() => {
    const _search = AddressUtils.isValid(name) ? '' : name;
    setInputValue(_search);
  }, [name, props.isOpen]);

  return (
    <Drawer
      {...props}
      size="sm"
      variant="solid-dark"
      placement="right"
      onClose={onCloseDrawer}
      isOpen={props.isOpen}
    >
      <DrawerOverlay />
      <DrawerContent maxW={456} p={9}>
        <DrawerHeader>
          <VStack alignItems="flex-start" spacing={6}>
            <HStack
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
              w="full"
            >
              <Heading fontSize="xl" fontWeight="bold" color="grey.50">
                Settings
              </Heading>
              <LineCloseIcon
                fontSize="24px"
                aria-label="Close window"
                cursor="pointer"
                onClick={onCloseDrawer}
              />
            </HStack>
            <Text
              fontSize="sm"
              maxWidth={320}
              color="grey.75"
              fontWeight="light"
            >
              Personalize Your Preferences: Set Your Name, Email, and Email
              Notification Preferences.
            </Text>
          </VStack>
        </DrawerHeader>

        <Divider borderColor="#868079" my={10} />

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
                      variant="dark"
                      maxLength={19}
                      placeholder=" "
                      value={inputValue}
                      onChange={(e) => {
                        handleInputChange(e.target.value);
                        field.onChange(e.target.value);
                      }}
                      onKeyDown={(e) =>
                        handleActionUsingKeys({
                          pressedKey: e.key,
                          allowedKeys: [ActionKeys.Enter],
                          action: handleSubmitSettings,
                          enabled: !disableUpdateButton,
                        })
                      }
                      isInvalid={fieldState.invalid || !!isNicknameInUse}
                    />
                    <FormLabel>Name</FormLabel>

                    <FormHelperText
                      color={
                        (checkNicknameRequest.data?.name &&
                          checkNicknameRequest.data?.id !== userInfos.id) ||
                        form.formState.errors.name?.message ||
                        isNameInputInvalid
                          ? 'error.500'
                          : 'grey.500'
                      }
                    >
                      {isNicknameInUse
                        ? 'Name already exists'
                        : form.formState.errors.name?.message
                          ? form.formState.errors.name?.message
                          : inputValue.length >= 3
                            ? 'This name is available'
                            : isNameInputInvalid
                              ? 'Name must be at least 3 characters'
                              : ''}
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
                      variant="dark"
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
                w="full"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                isDisabled={disableUpdateButton}
                onClick={handleSubmitSettings}
                isLoading={isLoading}
                w="full"
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
