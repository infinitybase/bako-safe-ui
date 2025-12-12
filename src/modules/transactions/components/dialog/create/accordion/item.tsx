import {
  Accordion,
  Box,
  Flex,
  Heading,
  Stack,
  useAccordionItemContext,
  VStack,
} from 'bako-ui';
import React, { useEffect, useRef, useState } from 'react';

interface AccordionItemProps {
  title: string;
  actions: React.ReactNode;
  resume: React.ReactNode;
  children: React.ReactNode;
  assetLogo?: React.ReactNode;
}

const AccordionItem = ({
  title,
  actions,
  children,
  resume,
  assetLogo,
}: AccordionItemProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const { expanded: isOpen } = useAccordionItemContext();

  const [allowOverflow, setAllowOverflow] = useState(false);

  // Prevent content overflow during accordion open/close animation
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (isOpen) {
      setAllowOverflow(false);

      const handleAnimationEnd = () => setAllowOverflow(true);
      const handleTransitionEnd = () => setAllowOverflow(true);

      el.addEventListener('animationend', handleAnimationEnd);
      el.addEventListener('transitionend', handleTransitionEnd);

      return () => {
        el.removeEventListener('animationend', handleAnimationEnd);
        el.removeEventListener('transitionend', handleTransitionEnd);
      };
    }

    setAllowOverflow(false);
  }, [isOpen]);

  return (
    <>
      <Box p={0} alignItems="center" justifyContent="space-between">
        <VStack w="full" p={4} alignItems="flex-start" gap={0}>
          <Box
            w="full"
            display="flex"
            flexDir="row"
            alignItems="center"
            rowGap={6}
          >
            <Flex w="full" flex={2} alignItems="center" gap={3}>
              {!isOpen && assetLogo && assetLogo}
              <Stack gap={0}>
                <Heading
                  fontSize="xs"
                  lineHeight="shorter"
                  color="textSecondary"
                >
                  {title}
                </Heading>
                {!isOpen && resume}
              </Stack>
            </Flex>
            {actions}
          </Box>
        </VStack>
      </Box>
      {isOpen && (
        <Accordion.ItemContent
          ref={contentRef}
          px={5}
          overflow={allowOverflow ? 'visible' : 'hidden'}
        >
          {children}
        </Accordion.ItemContent>
      )}
    </>
  );
};

export { AccordionItem };
