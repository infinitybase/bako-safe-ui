import { Separator, Flex, IconButton } from 'bako-ui';

import { SwapIcon } from '@/components';

export const SwapDivider = ({ onSwap }: { onSwap: () => void }) => {
  return (
    <Flex alignItems="center" gap={2}>
      <Separator borderColor="grey.950" />
      <IconButton
        icon={<SwapIcon />}
        variant="unstyled"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="grey.550"
        fontSize="xl"
        boxSize="24px"
        minW="24px"
        px={0}
        aria-label="Invert Assets"
        onClick={onSwap}
      />
      <Separator borderColor="grey.950" />
    </Flex>
  );
};
