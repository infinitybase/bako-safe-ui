import { HStack, Icon, Link, Text } from 'bako-ui';
import { FiArrowUpRight } from 'react-icons/fi';

import { FeedbackIcon } from '@/components/icons/feedback';

const SignInFooter = () => {
  const feedbackForm = () =>
    window.open(import.meta.env.VITE_FEEDBACK_FORM, '_BLANK');

  return (
    <HStack
      gap={6}
      textAlign="center"
      position="fixed"
      bottom={4}
      left={0}
      right={0}
      justifyContent="center"
    >
      <Link
        fontSize="xs"
        color="textSecondary"
        href="https://www.fuel.network/"
        target="_blank"
        display="flex"
        gap={2}
        textDecoration="none"
        fontWeight="medium"
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text fontSize="sm" color="textSecondary">
          New to Fuel Network?
        </Text>
        <Icon as={FiArrowUpRight} boxSize="14px" />
      </Link>

      <HStack cursor="pointer" onClick={feedbackForm} gap={2}>
        <Icon boxSize="14px" color="textSecondary" as={FeedbackIcon} />
        <Text color="textSecondary" fontSize="sm">
          Send feedback
        </Text>
      </HStack>
    </HStack>
  );
};

export { SignInFooter };
