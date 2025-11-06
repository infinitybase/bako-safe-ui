import { LineCloseIcon } from '@/components';
import { useVerifyBrowserType } from '@/modules/dapp/hooks';
import { Box, Heading, HStack, StackProps, Text, VStack } from 'bako-ui';
import React from 'react';
import { useHeader } from './hooks/useHeader';
import { Dapp } from '.';

interface HeaderProps {
  title: string;
  description?: string;
  onClose?: () => void;
}

const Header = ({
  title,
  description,
  onClose = window.close,
}: HeaderProps) => {
  const { renderCloseIcon } = useHeader();

  return (
    <>
      <Dapp.Profile />

      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        py={4}
      >
        <VStack gap={4} align="flex-start">
          <Heading
            fontSize={14}
            fontWeight={600}
            lineHeight="10px"
            color="gray.100"
          >
            {title}
          </Heading>
          {description &&
            <Text
              fontWeight={400}
              truncate
              color="gray.300"
              fontSize="xs"
              lineHeight="12px"
            >
              {description}
            </Text>
          }
        </VStack>
        {renderCloseIcon &&
          <LineCloseIcon
            mr={2}
            onClick={onClose}
            cursor="pointer"
            fontSize="24px"
            aria-label="Close window"
          />
        }
      </HStack>
    </>
  );
};

export { Header };
