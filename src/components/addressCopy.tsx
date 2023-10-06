import { Grid, GridItem, Icon, IconButton } from '@chakra-ui/react';
import React from 'react';
import { FaRegClone } from 'react-icons/fa';

import { AddressUtils } from '../modules/core/utils/address';

interface Props {
  address: string;
}

function AddressCopy({ address }: Props) {
  return (
    <Grid
      height="5vh"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      my={3}
      px={1}
      borderRadius={10}
      color="grey.500"
      backgroundColor="grey.300"
      onClick={() => navigator.clipboard.writeText('guilherme')}
    >
      <GridItem width="15%" mr={3}>
        <IconButton
          aria-label="Copy"
          variant="icon"
          icon={<Icon as={FaRegClone} />}
        />
      </GridItem>
      <GridItem ml={3} width="80%">
        {AddressUtils.format(address)}
      </GridItem>
    </Grid>
  );
}

export { AddressCopy };
