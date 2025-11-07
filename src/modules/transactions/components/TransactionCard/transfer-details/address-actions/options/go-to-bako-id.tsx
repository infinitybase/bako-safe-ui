import { HStack, Text, VStack } from 'bako-ui';
import { useMemo } from 'react';

import { UpRightArrow } from '@/components/icons';
import { useScreenSize } from '@/modules/core/hooks';
import { HandleUtils } from '@/utils/handle';

const { VITE_BAKO_ID_URL } = import.meta.env;

interface GoToBakoIdProps {
  handle: string;
}

const GoToBakoId = ({ handle }: GoToBakoIdProps) => {
  const _handle = useMemo(() => HandleUtils.fromHandle(handle ?? ''), [handle]);

  const { isMobile } = useScreenSize();

  return (
    <HStack
      gap={4}
      px={4}
      py={3}
      cursor="pointer"
      onClick={() =>
        window.open(`${VITE_BAKO_ID_URL}/profile/${_handle}`, '_BLANK')
      }
    >
      <UpRightArrow color="gray.200" boxSize={3} />
      <VStack alignItems="flex-start" gap={0} fontSize="xs">
        <Text color="gray.200">Go to Bako ID</Text>
        <Text truncate maxW={isMobile ? '75vw' : '220px'} color="textSecondary">
          {handle}
        </Text>
      </VStack>
    </HStack>
  );
};

export { GoToBakoId };
