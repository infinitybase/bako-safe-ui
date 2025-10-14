import { Box, BoxProps, Button, Flex, Text } from 'bako-ui';
import { ReactNode } from 'react';

import { UpRightArrow } from '../icons';

interface BannerProps extends Omit<BoxProps, 'children'> {
  icon: ReactNode;
  title: string;
}

const Banner = (props: BannerProps) => {
  const { icon, title, ...rest } = props;

  return (
    <Box
      w="full"
      bgColor="grey.825"
      borderRadius="xl"
      display="flex"
      alignItems="center"
      justifyContent="center"
      h="full"
      p={4}
      gap={2}
      _hover={{
        cursor: 'pointer',
      }}
      {...rest}
    >
      <Flex gap={2} w="75%" flexDir="column">
        {icon}
        <Text w="full" fontSize="xs" color="grey.50" whiteSpace="pretty">
          {title}
        </Text>
      </Flex>
      <Button
        variant="outline"
        color="grey.75"
        fontSize={['xs', 'sm']}
        _hover={{
          bgColor: 'initial',
          color: 'white',
          borderColor: 'brand.500',
        }}
      >
        <UpRightArrow w={4} h={4} />
        Try now
      </Button>
    </Box>
  );
};

export { Banner };
