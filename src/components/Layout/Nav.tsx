import React from 'react';
import { Flex, Container, Stack, Button } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { AiFillRobot, AiOutlineUserAdd } from 'react-icons/ai';
import './Layout.scss';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import AccountModal from '../AccountModal';
import { actions } from '../../redux/features/account/accountSlice';
import { RootState } from '../../redux/features/rootReducer';

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
          py={2}
          borderBottom={1}
          borderBottomColor="gray.300"
          borderStyle="solid"
        >
          <Flex direction="row" alignItems="center">
            <AiFillRobot fontSize={30} flexShrink={0} />
            <Stack
              direction={['column', 'row']}
              alignItems={['center']}
              flexGrow={1}
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
                    <Button size="sm" colorScheme="navItem" variant="ghost">
                      Dashboard
                    </Button>
                  </NavLink>

                  <NavLink
                    to="/account"
                    activeStyle={activeStyles}
                    isActive={() =>
                      window.location.hash.indexOf('/account') > -1
                    }
                  >
                    <Button size="sm" colorScheme="navItem" variant="ghost">
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
            </Stack>
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
