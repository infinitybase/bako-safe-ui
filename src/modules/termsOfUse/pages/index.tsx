import { Box, Icon, Text, VStack } from '@chakra-ui/react';

import { LogoIcon } from '@/components/icons/logo';
import { termsOfUse } from '@/utils/constants';

const TermsOfUsePage = () => {
  return (
    <VStack
      bg={'rgba(0, 0, 0, 0.15)'}
      w="full"
      alignItems={'center'}
      px={{ base: 10, sm: 16 }}
    >
      <Icon as={LogoIcon} w={200} h={100} my={10} />

      <Text fontSize={'lg'} fontWeight={'bold'}>
        Terms of use
      </Text>

      <VStack w="full" alignItems={'flex-start'} maxW={'1032px'} mb={10}>
        {termsOfUse.map(({ title, paragraphs }) => (
          <Box key={title}>
            <Text fontSize={'sm'} color={'grey.75'} fontWeight={'bold'} my={4}>
              {title}
            </Text>

            <VStack>
              {paragraphs.map((paragraph) => (
                <Text
                  key={paragraph}
                  textIndent={'32px'}
                  fontSize={'sm'}
                  color={'grey.75'}
                  fontWeight={400}
                >
                  {paragraph}
                </Text>
              ))}
            </VStack>
          </Box>
        ))}
      </VStack>
    </VStack>
  );
};

export { TermsOfUsePage };
