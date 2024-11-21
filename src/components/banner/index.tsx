import { Box, BoxProps, Button, Flex, Text } from '@chakra-ui/react';
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
      h="auto"
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
        rightIcon={<UpRightArrow w={4} h={4} />}
        _hover={{
          bgColor: 'initial',
          color: 'white',
          borderColor: 'brand.500',
        }}
      >
        Try now
      </Button>
    </Box>
  );
};

export { Banner };
