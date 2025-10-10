import { Button, Flex, Icon, Text, VStack } from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { DoneIcon } from '@/components/icons/done-icon';
import { Container } from '@/layouts/dapp/container';

interface DappTransactionSuccessProps {
  title: string;
  description: string;
}

const DappTransactionSuccess = (props: DappTransactionSuccessProps) => {
  const { title, description } = props;

  const titleRef = useRef<HTMLParagraphElement>(null);
  const [titleWidth, setTitleWidth] = useState('auto');

  const handleRedirectToBakoSafe = useCallback(() => {
    window.close();
    window.open(window.location.origin, '_BLANK');
  }, []);

  useEffect(() => {
    if (titleRef.current) {
      setTitleWidth(`${titleRef.current.offsetWidth}px`);
    }
  }, [title]);

  return (
    <Container flex={1}>
      <VStack h="full" justifyContent="center" w="full" px={6} py={8}>
        <VStack mt="auto" textAlign="center" gap={4}>
          <Icon fontSize={98} as={DoneIcon} />
          <Text ref={titleRef} fontWeight={700} fontSize="20px" color="grey.75">
            {title}
          </Text>
          <Text
            color="grey.250"
            fontSize="xs"
            fontWeight={400}
            lineHeight="16.8px"
            maxWidth={titleWidth}
          >
            {description}
          </Text>
        </VStack>
        <Flex w="full" mt="auto" justifyContent="center">
          <Button
            variant="outline"
            onClick={() => handleRedirectToBakoSafe()}
            w="full"
            maxW={356}
            borderColor="grey.75"
            fontWeight={500}
            fontSize="sm"
            letterSpacing=".5px"
            color="grey.75"
            _hover={{}}
            _active={{}}
          >
            Go to Bako Safe
          </Button>
        </Flex>
      </VStack>
    </Container>
  );
};

export { DappTransactionSuccess };
