import { Box, Flex, FlexProps, Icon, Text } from '@chakra-ui/react';
import { isB256 } from 'fuels';
import { ReactNode } from 'react';

import { CopyAddressButton } from '@/components';

import { AddressUtils } from '../../utils';
import { parseURI } from '../../utils/formatter';

const isUrl = (url: string) =>
  !!url?.startsWith?.('https') || !!url?.startsWith?.('ipfs://');

export const NftMetadataBlock = ({
  value,
  title,
  isCopy,
  icon,
  ...rest
}: {
  value: string;
  title: string;
  icon?: ReactNode;
  isCopy?: boolean;
} & FlexProps) => {
  return (
    <Flex
      flex={1}
      minW="fit-content"
      p={2}
      gap={2}
      alignItems="center"
      borderRadius="md"
      bg="grey.925"
      position="relative"
      _before={
        isUrl(value) && ['image', 'avatar'].includes(title.toLowerCase())
          ? {
              content: '""',
              display: 'block',
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              opacity: 0.2,
              backgroundImage: `url('${parseURI(value)}')`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              borderRadius: 'md',
            }
          : {}
      }
      {...rest}
    >
      {icon && <Icon fontSize={25}>{icon}</Icon>}
      <Box>
        <Text fontSize="xs" color="section.500">
          {title}
        </Text>
        <Flex gap={2}>
          <Text fontSize="xs" overflowWrap="anywhere">
            {isB256(value!) ? AddressUtils.format(value!, 9) : value}
          </Text>
          {isCopy && (
            <CopyAddressButton
              addressToCopy={value!}
              aria-label="Copy address"
            />
          )}
        </Flex>
      </Box>
    </Flex>
  );
};
