import { Center, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

interface TransactionCardCreationDateProps {
  children: ReactNode;
}

const CreationDate = ({ children }: TransactionCardCreationDateProps) => {
  const {
    screenSizes: { isMobile },
  } = useWorkspaceContext();
  return (
    <Center
      w={{ base: 'fit-content', sm: 100 }}
      justifyContent={{ base: 'flex-end', sm: 'flex-start' }}
    >
      <Text
        variant="subtitle"
        fontSize={isMobile ? 'xs' : 'sm'}
        color="grey.75"
      >
        {children}
      </Text>
    </Center>
  );
};

export { CreationDate };
