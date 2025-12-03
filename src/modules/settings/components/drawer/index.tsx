import {
  Box,
  Button,
  Drawer,
  DrawerRootProps,
  Field,
  floatingStyles,
  Heading,
  HStack,
  Input,
  Portal,
  Radio,
  RadioGroup,
  Separator,
  Text,
  VStack,
} from 'bako-ui';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';

import { LineCloseIcon } from '@/components';
import { useWebAuthnInput } from '@/modules/auth/hooks/webAuthn';
import { AddressUtils } from '@/modules/core/utils/address';
import { useWorkspaceContext } from '@/modules/workspace/hooks';
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
      placement="end"
      onOpenChange={onCloseDrawer}
      open={props.open}
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content maxW={456} p={6}>
            <Drawer.Header>
              <VStack alignItems="flex-start" gap={6}>
                <HStack
                  gap={2}
                  alignItems="center"
                  justifyContent="space-between"
                  w="full"
                >
                  <Heading fontSize="xl" fontWeight="bold" color="textPrimary">
                    Settings
                  </Heading>

                  <Drawer.CloseTrigger position="static">
                    <LineCloseIcon
                      w="24px"
                      aria-label="Close window"
                      cursor="pointer"
                      onClick={onCloseDrawer}
                    />
                  </Drawer.CloseTrigger>
                </HStack>
                <Text fontSize="sm" maxWidth={320} color="textSecondary">
                  Personalize Your Preferences: Set Your Name, Email, and Email
                  Notification Preferences.
                </Text>
              </VStack>
            </Drawer.Header>

            <Separator borderColor="gray.400" my={10} mx={1} />

            <Drawer.Body
              css={{
                '::-webkit-scrollbar': { width: 0 },
                scrollbarWidth: 'none',
              }}
              flex={1}
              display="flex"
              px={0}
            >
              <VStack alignItems="flex-start" p={1} flex={1}>
                <VStack gap={3} w="full" mb={2}>
                  <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <Field.Root
                        invalid={fieldState.invalid || !!isNicknameInUse}
                      >
                        <Box position="relative" w="full">
                          <Input
                            maxLength={19}
                            placeholder=" "
                            pt={2}
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
                          <Field.Label
                            css={floatingStyles({
                              hasValue: inputValue.length > 0,
                            })}
                          >
                            Username
                          </Field.Label>
                        </Box>

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
                        <Box position="relative" w="full">
                          <Input
                            value={field.value}
                            pt={2}
                            onChange={field.onChange}
                            placeholder=" "
                          />
                          <Field.Label
                            css={floatingStyles({ hasValue: !!field.value })}
                          >
                            Email Address
                          </Field.Label>
                        </Box>
                        <Field.HelperText color="error.500">
                          {fieldState.error?.message}
                        </Field.HelperText>
                      </Field.Root>
                    )}
                  />
                </VStack>

                <Separator borderColor="gray.400" mb={5} mt={4} w="full" />

                <Text fontWeight="bold" color="textPrimary" fontSize="md">
                  Notifications Preferences
                </Text>
                <Text
                  fontSize="sm"
                  maxWidth={320}
                  color="textSecondary"
                  paddingBottom={1.5}
                >
                  Get wallet and vault alerts by email for enhanced security.
                </Text>

                <Text fontWeight="bold" color="textPrimary" fontSize="md">
                  Do you wanna receive email notifications?
                </Text>

                <Controller
                  control={form.control}
                  name="notify"
                  defaultValue="false"
                  render={({ field: { value, onChange, ...rest } }) => (
                    <RadioGroup
                      colorPalette="primary"
                      value={value}
                      onValueChange={(e) => onChange(e.value)}
                      {...rest}
                      size="md"
                    >
                      <VStack alignItems="flex-start">
                        <Radio value="true">Yes</Radio>
                        <Radio value="false">No</Radio>
                      </VStack>
                    </RadioGroup>
                  )}
                />

                <HStack w="full" justifyContent="center" mt="auto">
                  <Button variant="subtle" flex={1} onClick={onCloseDrawer}>
                    Cancel
                  </Button>
                  <Button
                    disabled={disableUpdateButton}
                    onClick={handleSubmitSettings}
                    loading={isLoading}
                    flex={1}
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
