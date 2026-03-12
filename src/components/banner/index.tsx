import { Flex, Stack, StackProps, Text } from 'bako-ui';
import { ReactNode } from 'react';

import BakoBanner from '@/assets/images/bako-banner-bg.png';

interface BannerProps extends Omit<StackProps, 'children'> {
  icon: ReactNode;
  title: string;
  description: string | ReactNode;
  href: string;
}

const Banner = (props: BannerProps) => {
  const { icon, title, description, href, ...rest } = props;

  const handleClick = () => {
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <Stack
      justifyContent="space-between"
      alignItems="flex-start"
      h="full"
      rounded="lg"
      flex={1}
      p={3}
      gap={1}
      _hover={{
        cursor: 'pointer',
      }}
      css={{
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${BakoBanner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      onClick={handleClick}
      {...rest}
    >
      {icon}
      <Flex gap={1} flexDir="column" mt="auto" w="full">
        <Text
          fontSize="xs"
          color="gray.50"
          whiteSpace="pretty"
          lineHeight="shorter"
        >
          {title}
        </Text>
        <Text
          lineHeight="shorter"
          fontSize="2xs"
          color="textSecondary"
          truncate
          lineClamp={2}
        >
          {description}
        </Text>
      </Flex>
    </Stack>
  );
};

export { Banner };
