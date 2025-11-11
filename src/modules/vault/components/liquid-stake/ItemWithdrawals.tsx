import { Box, Text } from 'bako-ui';
import { memo, ReactElement } from 'react';

interface WithdrawlItemProps {
  title: string;
  description: string;
  iconItem: ReactElement;
}

export const ItemWithdrawals = memo(
  ({ title, description, iconItem }: WithdrawlItemProps) => {
    return (
      <Box
        width={{ base: 'full', md: 300 }}
        marginY={4}
        marginX={{ base: 4, md: 0 }}
        display="flex"
        flexDirection={{ base: 'row', md: 'column' }}
        justifyContent={{ base: 'flex-start', md: 'center' }}
        alignItems={{ base: 'flex-start', md: 'center' }}
      >
        {iconItem}
        <Box
          display={{ base: 'row' }}
          marginTop={{ base: 0, md: 6 }}
          marginLeft={{ base: 4, md: 0 }}
        >
          <Text
            fontSize={16}
            fontWeight={700}
            marginBottom={{ base: 0, md: 6 }}
            align={{ base: 'left', md: 'center' }}
          >
            {title}
          </Text>
          <Text
            fontWeight={{ base: 'normal', md: 600 }}
            fontSize={12}
            color={'grey.425'}
            align={{ base: 'left', md: 'center' }}
          >
            {description}
          </Text>
        </Box>
      </Box>
    );
  },
);

ItemWithdrawals.displayName = 'ItemWithdrawals';
