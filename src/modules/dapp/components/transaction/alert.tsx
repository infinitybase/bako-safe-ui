import { Warning2Icon } from "@/components";
import { HStack, HStackProps, Icon, Text } from "bako-ui";

interface Props extends HStackProps {
  type: "red" | "yellow";
  text: string;
}

export const TransactionAlert = (props: Props) => {
  const { type, text } = props;

  // TODO ASDF > AJUSTAR AS CORES
  const bgColor = type === "red" ? "#F05D4814" : "#FFC01014";
  const textColor = type === "red" ? "red.100" : "yellow.100";

  return (
    <HStack
      gap={3}
      align="center"
      bg={bgColor}
      borderRadius="8px"
      p={3}
      w="full"
      {...props}
    >
      <Icon
        color={textColor}
        h="16px"
        w="36px"
        as={Warning2Icon}
        px={2}
      /> {/* TODO ASDF > ALTERAR ICONE DO WARNING */}
      <Text
        color={textColor}
        fontSize={12}
        fontWeight={400}
        lineHeight="12px">
        {text}
      </Text>
    </HStack>
  );
};