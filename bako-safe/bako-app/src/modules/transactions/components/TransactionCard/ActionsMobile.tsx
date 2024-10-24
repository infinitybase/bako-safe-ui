import { Button, HStack, Icon } from '@chakra-ui/react';
import { ITransactionWithType } from '@services/modules/transaction';
import { IoIosArrowForward } from 'react-icons/io';

import { useWorkspaceContext } from '@/modules/workspace/WorkspaceProvider';

interface ActionsMobileProps {
  awaitingAnswer?: boolean | ITransactionWithType;
}

const ActionsMobile = ({ awaitingAnswer }: ActionsMobileProps) => {
  const {
    screenSizes: { isSmall, isExtraSmall },
  } = useWorkspaceContext();
  return (
    <HStack w="full" justifyContent="end" spacing={1}>
      <Button
        color={awaitingAnswer ? 'black' : 'grey.75'}
        bgColor={awaitingAnswer ? 'brand.500' : '#F5F5F50D'}
        fontWeight={awaitingAnswer ? 'bold' : 'normal'}
        border="none"
        fontSize="xs"
        letterSpacing=".5px"
        alignSelf={{ base: 'stretch', sm: 'flex-end' }}
        variant="secondary"
        rightIcon={
          <Icon as={IoIosArrowForward} fontSize="md" ml={isSmall ? -1 : 0} />
        }
        px={isExtraSmall ? 3 : 4}
      >
        {awaitingAnswer ? 'Sign' : isSmall ? 'Details' : 'View Details'}
      </Button>
    </HStack>
  );
};

export { ActionsMobile };
