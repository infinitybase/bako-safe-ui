import { Badge, type BadgeProps } from '@chakra-ui/react';

interface EditionBadgeProps extends BadgeProps {
  edition: string;
}

export const EditionBadge = ({ edition, ...props }: EditionBadgeProps) => {
  return (
    <Badge
      position="absolute"
      top={2}
      left={2}
      color="background.900"
      borderRadius="4px"
      bg="rgba(245, 245, 245, 0.3)"
      backgroundBlendMode="multiply"
      border="none"
      variant="solid"
      fontWeight="semibold"
      letterSpacing="0.5px"
      fontSize="sm"
      {...props}
    >
      {edition}
    </Badge>
  );
};
