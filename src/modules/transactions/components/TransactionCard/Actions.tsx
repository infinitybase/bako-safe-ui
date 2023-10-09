import { Badge, Button, HStack, Icon, Spacer } from '@chakra-ui/react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

import { ErrorIcon, SuccessIcon } from '@/components';

interface TransactionActionsProps {
  isSigned?: boolean;
  isDeclined?: boolean;
  isPending?: boolean;
  isExpanded?: boolean;
  collapse: () => void;
}

const Actions = ({
  isSigned,
  isDeclined,
  isPending,
  isExpanded,
  collapse,
}: TransactionActionsProps) => (
  <>
    <Spacer />
    {isSigned && (
      <Badge h={6} variant="success">
        You signed
        <Icon as={SuccessIcon} />
      </Badge>
    )}
    {isDeclined && (
      <Badge h={6} variant="error">
        You declined
        <Icon as={ErrorIcon} />
      </Badge>
    )}
    {isPending && (
      <HStack>
        <Button variant="primary">Sign</Button>
        <Button variant="secondary">Decline</Button>
      </HStack>
    )}

    <Icon
      as={isExpanded ? IoIosArrowUp : IoIosArrowDown}
      fontSize="xl"
      color="grey.200"
      cursor="pointer"
      onClick={collapse}
      ml={-5}
    />
  </>
);

export { Actions };
