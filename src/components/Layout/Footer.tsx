import React from 'react';
import { Container, Stack, Link, Text, Box, Flex } from '@chakra-ui/react';

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
      <Flex
        flexDirection={['column', 'row']}
        alignItems="center"
        justifyContent="space-between"
        py={2}
        fontSize="xs"
      >
        <Box>
          <Text>Developer by heaven</Text>
        </Box>
        <Box mt={0}>
          <Text mt={0}>Email: vietdat106@gmail.com</Text>
        </Box>
      </Flex>
    </Container>
  );
}
