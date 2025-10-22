import {
  Avatar,
  BoxProps,
  createListCollection,
  Flex,
  floatingStyles,
  HStack,
  Select,
  TextProps,
  useSelectContext,
} from 'bako-ui';

interface AssetSelectOption {
  value: string;
  image: string | null;
  name: string;
  symbol: string | null;
}

interface BoxSelectProps extends BoxProps {}

interface AssetSelectProps {
  value?: string;
  options?: AssetSelectOption[];
  label?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  name?: string;
  readonly?: boolean;
  onChange: (value: string) => void;
  needShowOptionsAbove?: boolean;
  maxOptionsHeight?: number;
  boxProps?: BoxSelectProps;
  textLabelProps?: TextProps;
  textValueProps?: TextProps;
}

const AssetSelectValue = () => {
  const select = useSelectContext();
  const items = select.selectedItems as AssetSelectOption[];
  const image = items?.[0]?.image;
  const name = items?.[0]?.name;

  return (
    <Select.ValueText placeholder=" ">
      <HStack>
        <Avatar
          shape="rounded"
          bg="transparent"
          hidden={!name}
          size="2xs"
          src={image!}
          name={name}
        />
        {name}
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
  // needShowOptionsAbove,
  // maxOptionsHeight,
  name,
  // boxProps,
  // textLabelProps,
  // textValueProps,
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
          <AssetSelectValue />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator color="textPrimary" />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          {collection.items.map((item) => (
            <Select.Item key={item.value} item={item}>
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
    </Select.Root>
  );
};

export { AssetSelect, AssetSelectOption, AssetSelectProps };
