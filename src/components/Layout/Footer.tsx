import React from 'react';
import { Container, Stack, Link, Text } from '@chakra-ui/react';

import './Layout.scss';

export default function Footer() {
  return (
    <Container
      maxW="100%"
      borderTop={1}
      borderTopColor="gray.200"
      borderTopWidth={1}
      borderStyle="solid"
    >
      <Stack
        flexDirection={['column', 'row']}
        alignItems="center"
        justifyContent="center"
      >
        <Stack isInline fontSize="xs">
          <Text>Hello</Text>
        </Stack>
      </Stack>
    </Container>
  );
}
