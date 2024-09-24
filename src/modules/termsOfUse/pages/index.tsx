import { Box, Divider, Icon, Text, VStack } from '@chakra-ui/react';

import { LogoIcon } from '@/components/icons/logo';
import { privacyPolicy, termsOfUse } from '@/utils/constants';

const TermsOfUsePage = () => {
  return (
    <VStack
      bg={'rgba(0, 0, 0, 0.15)'}
      w="full"
      px={{ base: 10, sm: 16 }}
      spacing={0}
    >
      <Icon as={LogoIcon} w={200} h={100} mt={10} mb={6} />

      <Text fontSize={'lg'} fontWeight={'bold'} mb={1}>
        Bako Safe Terms Of Use Agreement
      </Text>

      <VStack w="full" alignItems={'flex-start'} maxW={'1032px'}>
        {termsOfUse.map(({ title, paragraphs }) => (
          <Box key={title}>
            <Text fontSize={'sm'} color={'grey.75'} fontWeight={'bold'} my={4}>
              {title}
            </Text>

            <VStack alignItems={'flex-start'}>
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

      <Divider my={10} maxW={'1032px'} />

      <Text fontSize={'lg'} fontWeight={'bold'}>
        Bako Safe Privacy Policy
      </Text>

      <VStack w="full" alignItems={'flex-start'} maxW={'1032px'} mb={16}>
        {privacyPolicy.map(({ title, paragraphs }) => (
          <Box key={title}>
            <Text fontSize={'sm'} color={'grey.75'} fontWeight={'bold'} my={4}>
              {title}
            </Text>

            <VStack alignItems={'flex-start'}>
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
