import {
  Avatar,
  createListCollection,
  Flex,
  floatingStyles,
  HStack,
  Select,
  Stack,
  Text,
  useSelectContext,
} from 'bako-ui';

interface AssetSelectOption {
  value: string;
  image: string | null;
  description?: string;
  name: string;
  symbol: string | null;
}

interface AssetSelectProps {
  value?: string;
  options: AssetSelectOption[];
  label?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  name?: string;
  readonly?: boolean;
  onChange: (value: string) => void;
}

const AssetSelectValue = ({ label }: { label: string | undefined }) => {
  const select = useSelectContext();
  const items = select.selectedItems as AssetSelectOption[];
  const image = items?.[0]?.image;
  const name = items?.[0]?.name;
  const description = items?.[0]?.description;

  return (
    <Select.ValueText placeholder=" " pt={label && name ? 2.5 : 0}>
      <HStack>
        <Avatar
          shape="rounded"
          bg="transparent"
          hidden={!name}
          boxSize={5}
          src={image!}
          name={name}
        />
        <Stack gap={0.5}>
          <Text
            fontSize="xs"
            color="textPrimary"
            lineHeight="shorter"
            truncate
            lineClamp={1}
          >
            {name}
          </Text>
          {description && (
            <Text
              fontSize="xs"
              color="textSecondary"
              lineHeight="shorter"
              truncate
              lineClamp={1}
            >
              {description}
            </Text>
          )}
        </Stack>
      </HStack>
    </Select.ValueText>
  );
};

const AssetSelect = ({
  value,
  options,
  label,
  isLoading,
  isDisabled,
  onChange,
  isInvalid,
  readonly,
  name,
}: AssetSelectProps) => {
  const collection = createListCollection({
    items: options || [],
    itemToValue: (item) => item.value,
    itemToString: (item) => item.name,
  });

  return (
    <Select.Root
      collection={collection}
      invalid={isInvalid}
      variant="subtle"
      disabled={isDisabled || isLoading}
      readOnly={readonly}
      name={name}
      w="full"
      value={[value || '']}
      onValueChange={(e) => onChange(e.value[0])}
      positioning={{ sameWidth: true }}
    >
      <Select.HiddenSelect />
      {label && (
        <Select.Label
          css={{ ...floatingStyles({ hasValue: !!value }), zIndex: 2 }}
        >
          {label}
        </Select.Label>
      )}
      <Select.Control>
        <Select.Trigger>
          <AssetSelectValue label={label} />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator color="textPrimary" />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Portal>
        {/* Open inside Dialog */}
        <Select.Positioner zIndex="2000 !important">
          <Select.Content>
            {collection.items.map((item) => (
              <Select.Item
                key={item.value}
                item={item}
                onClick={() => {
                  if (item.value === value) {
                    // force onChange when same value is selected
                    onChange(item.value);
                  }
                }}
              >
                <Flex gap={2} alignItems="center">
                  <Avatar
                    shape="rounded"
                    src={item.image!}
                    name={item.name}
                    bg="transparent"
                    size="2xs"
                  />
                  {item.name}
                </Flex>
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
};

export { AssetSelect, AssetSelectOption, AssetSelectProps };
