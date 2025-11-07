import { Text, VStack } from 'bako-ui';

import { useScreenSize } from '@/modules/core';

interface SignInHeaderProps {
  title: string;
  showDescription: boolean;
}

const SignInHeader = ({ title, showDescription }: SignInHeaderProps) => {
  const { isMobile } = useScreenSize();

  return (
    <VStack justifyContent="center" textAlign="center" w="full" gap={2}>
      <Text
        fontSize={isMobile ? '2xl' : '32'}
        fontWeight="bold"
        bgGradient="linear(to-br, brand.500, brand.800)"
        bgClip="text"
      >
        {title}
      </Text>
      {showDescription && (
        <Text
          color="grey.50"
          lineHeight="16.94px"
          fontWeight={400}
          fontSize="sm"
          aria-label="subtitle_login_page"
        >
          Choose your prefered login method
        </Text>
      )}
    </VStack>
  );
};

export { SignInHeader };
