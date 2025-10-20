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
      bgColor="bg.muted"
      borderRadius="lg"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      h="full"
      p={1}
      gap={1}
      _hover={{
        cursor: 'pointer',
      }}
      {...rest}
    >
      <Flex gap={1} w="75%" flexDir="column">
        {icon}
        <Text w="full" fontSize="8px" color="gray.50" whiteSpace="pretty">
          {title}
        </Text>
      </Flex>
      <Button
        variant="outline"
        size="2xs"
        py={4}
        _hover={{
          bgColor: 'initial',
          color: 'white',
          borderColor: 'primary.main',
        }}
      >
        <UpRightArrow w={4} h={4} />
        Try now
      </Button>
    </Box>
  );
};

export { Banner };
