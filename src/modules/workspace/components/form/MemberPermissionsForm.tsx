import {
  Badge,
  Box,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { Dialog } from '@/components';

import { UseChangeMember } from '../../hooks';
import { WorkspacePermissionUtils } from '../../utils';
import { RadioCard } from '../card';

interface MemberPermissionForm {
  form: UseChangeMember['form']['permissionForm'];
  formState: {
    isValid: boolean;
    primaryAction: string;
    secondaryAction: string;
    handlePrimaryAction: () => void;
    handleSecondaryAction: () => void;
    isLoading: boolean;
    title: string;
    tertiaryAction?: string;
    handleTertiaryAction?: () => void;
    isEditMember: boolean;
  };
}

/* TODO: Move to components folder */
export const MemberPermissionForm = ({
  form,
  formState,
}: MemberPermissionForm) => {
  return (
    <Box w="full">
      <Dialog.Section
        title={
          <Heading fontSize="md" color="grey.200">
            {formState.title}
          </Heading>
        }
        description="Select the role for this user"
        mb={8}
      />
      <Controller
        name="permission"
        control={form.control}
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            onChange={field.onChange}
            defaultValue={field.value}
          >
            <Stack>
              {WorkspacePermissionUtils.permissionsValues.map((permission) => (
                <RadioCard
                  border="1px"
                  p={3}
                  borderRadius="lg"
                  borderColor={
                    field.value === permission.value ? 'green.500' : 'dark.100'
                  }
                  key={permission.value}
                  position="relative"
                >
                  <Radio
                    my={2}
                    border="1px"
                    display="flow"
                    borderColor="grey.500"
                    value={permission.value}
                  >
                    <Box w="full">
                      <Badge
                        top={-1.5}
                        left={6}
                        position="absolute"
                        variant={permission.variant}
                      >
                        {permission.title}
                      </Badge>
                      <Flex
                        mt={3}
                        align="start"
                        direction="column"
                        justify="space-between"
                      >
                        <Text>
                          {permission.title === 'Viewer' && (
                            <Text variant="description">
                              Can{' '}
                              <Text
                                as="span"
                                fontWeight="semibold"
                                color="grey.200"
                              >
                                only access and view
                              </Text>{' '}
                              the contents of all vaults in the workspace.
                            </Text>
                          )}
                          {permission.title === 'Manager' && (
                            <Text variant="description">
                              <Text
                                as="span"
                                fontWeight="semibold"
                                color="grey.200"
                              >
                                Can create new vaults, create transaction and
                                access all vaults
                              </Text>{' '}
                              and manage members in the workspace.
                            </Text>
                          )}
                          {permission.title === 'Admin' && (
                            <Text variant="description">
                              <Text
                                as="span"
                                fontWeight="semibold"
                                color="grey.200"
                              >
                                Manage members, create new vaults, create
                                transaction
                              </Text>{' '}
                              and access everything.
                            </Text>
                          )}
                        </Text>
                      </Flex>
                    </Box>
                  </Radio>
                </RadioCard>
              ))}
            </Stack>
          </RadioGroup>
        )}
      />
    </Box>
  );
};
