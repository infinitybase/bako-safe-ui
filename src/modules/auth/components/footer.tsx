import { Heading, HStack, Icon, Link, Text, VStack } from 'bako-ui';
import { FiArrowUpRight } from 'react-icons/fi';

import { FeedbackIcon } from '@/components/icons/feedback';
import { useScreenSize } from '@/modules/core/hooks';

const SignInFooter = () => {
  const { isMobile } = useScreenSize();

  const feedbackForm = () =>
    window.open(import.meta.env.VITE_FEEDBACK_FORM, '_BLANK');

  return (
    <VStack gap={1} textAlign="center" mt={isMobile ? 6 : 0}>
      <Heading fontSize="sm" color="grey.75">
        New to Fuel Network?
      </Heading>

      <Link
        fontSize="xs"
        color="grey.250"
        href="https://www.fuel.network/"
        target="_blank"
        display="flex"
        gap={1}
        textDecoration="none"
        fontWeight="medium"
        borderRadius={8}
        _hover={{
          textDecoration: 'none',
          color: 'grey.75',
        }}
      >
        <Text fontSize="xs" fontWeight="normal">
          Learn more
        </Text>
        <Icon as={FiArrowUpRight} fontSize="md" />
      </Link>

      <HStack cursor="pointer" onClick={feedbackForm} gap={3} mt={6}>
        <Text
          color="grey.250"
          fontWeight={400}
          lineHeight="13.58px"
          fontSize="xs"
        >
          Send feedback
        </Text>
        <Icon w={3} h={3} color="grey.250" fontSize={12} as={FeedbackIcon} />
      </HStack>
    </VStack>
  );
};

export { SignInFooter };
