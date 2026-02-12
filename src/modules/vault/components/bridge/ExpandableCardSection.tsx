import { Card, CardBodyProps } from 'bako-ui';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const MotionCardBody = motion(Card.Body);
const MotionCardFooter = motion(Card.Footer);

interface ExpandableCardSectionProps {
  isExpanded: boolean;
  maxHeight?: string;
  children: ReactNode;
  type?: 'body' | 'footer';
  justifyContent?: CardBodyProps['justifyContent'];
  flexDirection?: CardBodyProps['flexDirection'];
  gap?: CardBodyProps['gap'];
  paddingTop?: string | number;
  paddingBottom?: string | number;
}

export function ExpandableCardSection({
  isExpanded,
  maxHeight = '200px',
  children,
  type = 'body',
  justifyContent,
  flexDirection,
  gap,
  paddingTop = '1rem',
  paddingBottom = '1rem',
}: ExpandableCardSectionProps) {
  const Component = type === 'body' ? MotionCardBody : MotionCardFooter;

  const baseProps = {
    initial: false,
    animate: {
      maxHeight: isExpanded ? maxHeight : 0,
      opacity: isExpanded ? 1 : 0,
      paddingTop: isExpanded ? paddingTop : 0,
      paddingBottom: isExpanded ? paddingBottom : 0,
    },
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
    overflow: 'hidden' as const,
  };

  if (type === 'body') {
    return (
      <Component {...baseProps} flex={1} justifyContent="center">
        {children}
      </Component>
    );
  }

  return (
    <Component
      {...baseProps}
      justifyContent={justifyContent}
      flexDirection={flexDirection}
      gap={gap}
    >
      {children}
    </Component>
  );
}
