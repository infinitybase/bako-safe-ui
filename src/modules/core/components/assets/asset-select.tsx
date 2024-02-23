import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import React, { ChangeEvent } from 'react';
import { InViewHookResponse } from 'react-intersection-observer';

import { Asset } from '@/modules/core';

interface Props {
  assets?: Asset;
  value?: string;
  helperText?: React.ReactNode;
  onChange: (value: string) => void;
  inView?: InViewHookResponse;
  isInvalid: boolean;
  label: string;
  index?: number;
  isDisabled?: boolean;
  onInputChange?: (event: ChangeEvent<HTMLInputElement> | string) => void;
}

/*
 *
 * Example implement:
 *
 * <AssetSelect
 *     id="asset"
 *     name="asset"
 *     register={register} // Use form method
 * />
 *
 * */

function AssetSelect(props: Props) {
  // const [currentIndex, setCurrentIndex] = useState<number | undefined>();
  // const [inputValue, setInputValue] = useState(props.value ?? '');
  //todo: remove coment with fix bug send n diferent amounts
  // const assets = props.assets ?? assetsList; //!!_assets && _assets.length > 0 ? _assets : assetsList;
  // const isCurrent = currentIndex === props.index;

  // const showOptionsList = isCurrent && assets?.length > 0;
  return (
    <FormControl>
      <Input
        value={props.value}
        // onChange={(e) => {
        //   props.onChange(e.target.value);
        // }}
        // onBlur={() => setCurrentIndex(undefined)}
        // onFocus={() => {
        //   if (!inputValue) props.onInputChange?.('');
        //   setCurrentIndex(typeof props.index === 'number' ? props.index : 0);
        // }}
        onBlur={() => props.onChange(props.value!)}
        disabled
        isInvalid={props.isInvalid}
        autoComplete="off"
        placeholder=" "
        defaultValue={props.value}
      />
      <FormLabel color="gray">
        {props.assets?.slug} - {props.assets?.name}
      </FormLabel>
      {/* {props.helperText} */}

      {/* {showOptionsList && (
        <Box
          bg="dark.200"
          color="grey.200"
          fontSize="md"
          borderColor="dark.100"
          borderWidth={1}
          borderRadius={10}
          padding={2}
          position="absolute"
          zIndex={200}
          w="full"
          mt={2}
          pb={0}
        >
          <Flex display="flex" justifyContent="center" alignItems="center">
            <VStack
              w="full"
              maxH={194}
              overflowY="scroll"
              css={{
                '&::-webkit-scrollbar': { width: '0' },
                scrollbarWidth: 'none',
              }}
            >
              {assets.map(({ assetId, name, slug }) => (
                <Box
                  key={name}
                  w="full"
                  p={2}
                  borderRadius={10}
                  cursor="pointer"
                  _hover={{ background: 'dark.150' }}
                  onMouseDown={() => {
                    setInputValue(assetId);
                    props.onChange(name);
                  }}
                >
                  <Text
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    w="full"
                  >
                    {slug} - {name}
                  </Text>
                </Box>
              ))}
              <Box ref={props.inView?.ref} />
            </VStack>
          </Flex>
        </Box>
      )} */}
    </FormControl>
  );
}

export { AssetSelect };
