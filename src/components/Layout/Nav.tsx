import React from 'react';
import { Flex, Container, Stack, Button } from '@chakra-ui/react';

import { Link } from 'react-router-dom';
import { AiFillRobot } from 'react-icons/ai';

import './Layout.scss';

export default function Nav() {
  return (
    <Flex
      position="sticky"
      top={0}
      bg="#ffffff"
      minH="4rem"
      w="100%"
      zIndex="99"
    >
      <Container
        maxW="100%"
        py={2}
        borderBottom={1}
        borderBottomColor="gray.300"
        borderStyle="solid"
      >
        <Flex direction="row" alignItems="center">
          <AiFillRobot fontSize={30} />
          <Stack direction={['column', 'row']} alignItems={['center']}>
            <Stack direction={['column', 'row']} style={{ marginLeft: '5rem' }}>
              <Link to="/">
                <Button colorScheme="navItem" variant="ghost">
                  Dashboard
                </Button>
              </Link>

              <Link to="/account">
                <Button colorScheme="navItem" variant="ghost">
                  Quản lý tài khoản
                </Button>
              </Link>
            </Stack>
          </Stack>
        </Flex>
      </Container>
    </Flex>
  );
}
