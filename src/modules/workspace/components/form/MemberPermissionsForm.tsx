import {
  Badge,
  Box,
  Divider,
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
      <Divider mb={5} mt={1} />
      <Dialog.Section
        title={
          <Heading fontSize="md" color="grey.200">
            {formState.title}
          </Heading>
        }
        description="Select the role for this user"
        mb={[8, 4]}
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
                  bgColor="grey.850"
                  p={3}
                  my={1}
                  borderRadius="xl"
                  borderColor={
                    field.value === permission.value ? 'brand.500' : 'grey.400'
                  }
                  key={permission.value}
                >
                  <Radio
                    my={1}
                    border="none"
                    display="flow"
                    borderColor="grey.500"
                    value={permission.value}
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
                        mt={2}
                        align="start"
                        direction="column"
                        justify="space-between"
                      >
                        <Text
                          fontWeight="medium"
                          fontSize={{ base: 'sm' }}
                          variant="subtitle"
                        >
                          {permission.description}
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
