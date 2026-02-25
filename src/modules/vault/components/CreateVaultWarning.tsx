import { Alert, Icon } from 'bako-ui';
import React from 'react';

import { TriangleWarning } from '@/components';

type AlertRootProps = React.ComponentProps<typeof Alert.Root>;
interface ICreateVaultWarningProps extends AlertRootProps {
  message: string;
}

const CreateVaultWarning = (props: ICreateVaultWarningProps) => {
  const { message, ...rest } = props;
  return (
    <Alert.Root
      w="full"
      borderRadius="lg"
      status="warning"
      variant="solid"
      bgColor="primary.main/8"
      padding={3}
      gap={3}
      alignItems="center"
      {...rest}
    >
      <Alert.Indicator>
        <Icon as={TriangleWarning} w={4} />
      </Alert.Indicator>
      <Alert.Content>
        <Alert.Description
          fontWeight={400}
          fontSize="xs"
          lineHeight="shorter"
          color="primary.main"
        >
          {message}
        </Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );
};

export default CreateVaultWarning;
