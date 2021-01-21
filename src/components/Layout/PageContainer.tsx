import React from 'react';
import { Flex } from '@chakra-ui/react';

import './Layout.scss';

export default function PageContainer(props) {
  return (
    <Flex
      bg="secondary.background"
      height="100vh"
      width="100%"
      justifyContent="top"
      flexDirection="column"
    >
      {props.children}
    </Flex>
  );
}
