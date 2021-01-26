import React from 'react';
import {
  Flex,
  Container,
  Stack,
  Button,
  Image,
  StackDivider,
  HStack,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { AiFillRobot, AiOutlineUserAdd } from 'react-icons/ai';
import './Layout.scss';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  FcManager,
  FcPodiumWithAudience,
  FcSalesPerformance,
} from 'react-icons/fc';
import fs from 'fs';
import path from 'path';
import AccountModal from '../AccountModal';
import { actions } from '../../redux/features/account/accountSlice';
import { RootState } from '../../redux/features/rootReducer';
import logo from '../../../assets/images/logo-tiki-png.png';

const activeStyles = {
  color: 'red',
};

export default function Nav() {
  const openModal = useSelector((state: RootState) => {
    return state.account.openModal;
  }, shallowEqual);
  const dispatch = useDispatch();
  return (
    <>
      <Flex position="sticky" top={0} bg="#ffffff" w="100%" zIndex="99">
        <Container
          maxW="100%"
          py={1}
          borderBottom={1}
          borderTop={1}
          borderColor="gray.100"
          borderStyle="solid"
        >
          <Flex direction="row" alignItems="center">
            {/* <AiFillRobot fontSize={30} flexShrink={0} /> */}
            <Image src={logo} width={100} />
            <HStack
              // direction={['column', 'row']}
              // alignItems={['center']}
              flexGrow={1}
              align="stretch"
              spacing={2}
              divider={<StackDivider borderColor="gray.200" />}
            >
              <Stack
                justify="space-between"
                direction={['column', 'row']}
                style={{ marginLeft: '5rem' }}
                flexGrow={1}
              >
                <Stack flexGrow={1} direction={['column', 'row']}>
                  <NavLink
                    to="/dashboard"
                    activeStyle={activeStyles}
                    exact
                    isActive={() =>
                      window.location.hash.indexOf('/dashboard') > -1
                    }
                  >
                    <Button
                      size="sm"
                      colorScheme="navItem"
                      variant="ghost"
                      leftIcon={<FcPodiumWithAudience />}
                    >
                      Mua sale hàng loạt
                    </Button>
                  </NavLink>
                  <NavLink
                    to="/fast-sale"
                    activeStyle={activeStyles}
                    isActive={() =>
                      window.location.hash.indexOf('/fast-sale') > -1
                    }
                  >
                    <Button
                      size="sm"
                      colorScheme="navItem"
                      variant="ghost"
                      leftIcon={<FcSalesPerformance />}
                    >
                      Săn sale siêu cấp
                    </Button>
                  </NavLink>
                  <NavLink
                    to="/account"
                    activeStyle={activeStyles}
                    isActive={() =>
                      window.location.hash.indexOf('/account') > -1
                    }
                  >
                    <Button
                      leftIcon={<FcManager />}
                      size="sm"
                      colorScheme="navItem"
                      variant="ghost"
                    >
                      Quản lý tài khoản
                    </Button>
                  </NavLink>
                </Stack>
                <Button
                  flexShrink={0}
                  leftIcon={<AiOutlineUserAdd />}
                  colorScheme="green"
                  size="sm"
                  onClick={() => dispatch(actions.openModalAccount())}
                >
                  Thêm tài khoản
                </Button>
              </Stack>
            </HStack>
          </Flex>
        </Container>
        <AccountModal
          type="create"
          isOpen={openModal}
          onClose={() => dispatch(actions.closeModalAccount())}
          initialValue={{
            username: null,
            password: null,
            id: null,
          }}
        />
      </Flex>
    </>
  );
}
