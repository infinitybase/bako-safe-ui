import {
  Button,
  Drawer,
  DrawerRootProps,
  Field,
  Heading,
  HStack,
  Input,
  Portal,
  RadioGroup,
  Separator,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';

import { LineCloseIcon } from '@/components';
import { useWebAuthnInput } from '@/modules/auth/hooks/webAuthn';
import { AddressUtils } from '@/modules/core/utils/address';
import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';
import {
  ActionKeys,
  handleActionUsingKeys,
} from '@/utils/handle-action-using-keys';

import { useSettings } from '../../hooks';

interface SettingsDrawerProps extends Omit<DrawerRootProps, 'children'> {
  onOpen: () => void;
}

const SettingsDrawer = ({ ...props }: SettingsDrawerProps) => {
  const {
    form,
    handleSubmitSettings,
    updateSettingsRequest: { isPending: isLoading },
    onCloseDrawer,
    mySettingsRequest,
  } = useSettings({
    onOpen: props.onOpen,
    onClose: () => props.onOpenChange?.({ open: false }),
  });
  const {
    authDetails: { userInfos },
  } = useWorkspaceContext();
  const { checkNicknameRequest, inputValue, setInputValue, handleInputChange } =
    useWebAuthnInput(!form.formState.errors.name, userInfos.id);

  const isNameInputInvalid = (form.watch('name')?.length ?? 0) <= 2;

  const isNicknameInUse =
    !!checkNicknameRequest.data?.type && inputValue?.length > 0;

  const name = mySettingsRequest.data?.name ?? '';

  const disableUpdateButton =
    isLoading ||
    isNicknameInUse ||
    checkNicknameRequest.isLoading ||
    isNameInputInvalid ||
    !form.formState.isValid;

  useEffect(() => {
    const _search = AddressUtils.isValid(name) ? '' : name;
    setInputValue(_search);
  }, [name, props.open]);

  return (
    <Drawer.Root
      {...props}
      size="sm"
      // variant="solid-dark"
      placement="end"
      onOpenChange={onCloseDrawer}
      open={props.open}
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content maxW={456} p={9}>
            <Drawer.Header>
              <VStack alignItems="flex-start" gap={6}>
                <HStack
                  gap={2}
                  alignItems="center"
                  justifyContent="space-between"
                  w="full"
                >
                  <Heading fontSize="xl" fontWeight="bold" color="grey.50">
                    Settings
                  </Heading>
                  <LineCloseIcon
                    w="24px"
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
            </Drawer.Header>

            <Separator borderColor="#868079" my={10} />

            <Drawer.Body
              css={{
                '::-webkit-scrollbar': { width: 0 },
                scrollbarWidth: 'none',
              }}
            >
              <VStack alignItems="flex-start" p={1}>
                <VStack gap={3} w="full" mb={2}>
                  <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <Field.Root
                        invalid={fieldState.invalid || !!isNicknameInUse}
                      >
                        <Input
                          // variant="dark"
                          maxLength={19}
                          placeholder=" "
                          value={inputValue}
                          onChange={(e) => {
                            handleInputChange(e.target.value.toLowerCase());
                            field.onChange(e.target.value.toLowerCase());
                          }}
                          onKeyDown={(e) =>
                            handleActionUsingKeys({
                              pressedKey: e.key,
                              allowedKeys: [ActionKeys.Enter],
                              action: handleSubmitSettings,
                              enabled: !disableUpdateButton,
                            })
                          }
                        />
                        <Field.Label>Username</Field.Label>

                        <Field.HelperText
                          color={
                            checkNicknameRequest.data?.type ||
                            form.formState.errors.name?.message ||
                            isNameInputInvalid
                              ? 'error.500'
                              : 'grey.500'
                          }
                        >
                          {isNicknameInUse
                            ? 'Username already exists'
                            : form.formState.errors.name?.message
                              ? form.formState.errors.name?.message
                              : inputValue.length >= 3
                                ? 'This username is available'
                                : isNameInputInvalid
                                  ? 'Username must be at least 3 characters'
                                  : ''}
                        </Field.HelperText>
                      </Field.Root>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <Field.Root invalid={fieldState.invalid}>
                        <Input
                          // variant="dark"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder=" "
                        />
                        <Field.Label>Email Address</Field.Label>
                        <Field.HelperText color="error.500">
                          {fieldState.error?.message}
                        </Field.HelperText>
                      </Field.Root>
                    )}
                  />
                </VStack>
                <Separator borderColor="#868079" mb={5} mt={4} />
                <Text fontWeight="bold" color="grey.200" fontSize={15}>
                  Notifications Preferences
                </Text>
                <Text
                  fontSize="sm"
                  maxWidth={320}
                  color="grey.75"
                  fontWeight="light"
                  paddingBottom={'6px'}
                >
                  Get wallet and vault alerts by email for enhanced security.
                </Text>
                <Text fontWeight="bold" color="grey.200" fontSize={15}>
                  Do you wanna receive email notifications?
                </Text>

                <Controller
                  control={form.control}
                  name="notify"
                  render={({ field }) => (
                    <RadioGroup.Root
                      name={field.name}
                      value={field.value ?? 'no'}
                      onValueChange={(e) => field.onChange(e.value)}
                      size="md"
                    >
                      <VStack>
                        <RadioGroup.Item value="yes">
                          <RadioGroup.ItemHiddenInput />
                          <RadioGroup.ItemIndicator />
                          <RadioGroup.ItemText>Yes</RadioGroup.ItemText>
                        </RadioGroup.Item>
                        <RadioGroup.Item value="no">
                          <RadioGroup.ItemHiddenInput />
                          <RadioGroup.ItemIndicator />
                          <RadioGroup.ItemText>No</RadioGroup.ItemText>
                        </RadioGroup.Item>
                      </VStack>
                    </RadioGroup.Root>
                  )}
                />

                <Separator borderColor="dark.100" mb={5} mt={4} />

                <HStack w="full" justifyContent="center">
                  <Button
                    colorPalette="secondary"
                    bgColor="dark.100"
                    border="none"
                    onClick={onCloseDrawer}
                    w="full"
                  >
                    Cancel
                  </Button>
                  <Button
                    colorPalette="primary"
                    disabled={disableUpdateButton}
                    onClick={handleSubmitSettings}
                    loading={isLoading}
                    w="full"
                  >
                    Update
                  </Button>
                </HStack>
              </VStack>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export { SettingsDrawer };
