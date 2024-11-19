import { Dialog } from '@bako-safe/ui/components';
import {
  Badge,
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import type { UseChangeMember } from '../../hooks';
import { WorkspacePermissionUtils } from '../../utils/permission';
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
    <Center>
      <Box w="full" maxW={480}>
        <Divider mb={5} />
        <Dialog.Section
          title={
            <Heading fontSize="md" color="grey.200">
              {formState.title}
            </Heading>
          }
          description="Select the new role for the member."
          mb={4}
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
                {WorkspacePermissionUtils.permissionsValues.map(
                  (permission) => (
                    <RadioCard
                      border="1px"
                      bgColor="grey.825"
                      px={3}
                      py={3}
                      my={1}
                      borderRadius="xl"
                      borderColor={
                        field.value === permission.title
                          ? 'brand.500'
                          : 'grey.400'
                      }
                      key={permission.title}
                    >
                      <Radio
                        my={1}
                        border="none"
                        display="flow"
                        borderColor="grey.500"
                        value={permission.title}
                        _checked={{
                          borderColor: 'none',
                          display: 'none',
                        }}
                      >
                        <Box w="full">
                          <Badge
                            top={-0.5}
                            maxW={20}
                            py={{ base: 0, sm: 0.5 }}
                            position="absolute"
                            justifyContent="center"
                            px={6}
                            variant={permission.variant}
                          >
                            {permission.title}
                          </Badge>
                          <Flex
                            mt={{ base: 0, xs: 2 }}
                            align="start"
                            direction="column"
                            justify="space-between"
                          >
                            <Text
                              fontWeight="medium"
                              fontSize="sm"
                              variant="subtitle"
                            >
                              {permission.description}
                            </Text>
                          </Flex>
                        </Box>
                      </Radio>
                    </RadioCard>
                  ),
                )}
              </Stack>
            </RadioGroup>
          )}
        />
      </Box>
    </Center>
  );
};
