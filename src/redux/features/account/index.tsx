import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import { AiTwotoneEdit, AiTwotoneRest } from 'react-icons/ai';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import AccountModal from '../../../components/AccountModal';
import { actions } from './accountSlice';
import { RootState } from '../rootReducer';

const Account = () => {
  const accounts = useSelector(
    (state: RootState) => state.account.accounts,
    shallowEqual
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalState, setModalState] = useState({
    id: null,
    username: null,
    password: null,
  });

  const dispatch = useDispatch();

  const editAccount = (account) => {
    setModalState({
      id: account.id,
      username: account.username,
      password: account.password,
    });
    onOpen();
  };
  const deleteAccount = (account) => {
    dispatch(actions.deleteAccount(account.id));
  };

  const renderRow = useMemo(() => {
    return accounts.map((acc) => (
      <Tr key={`${acc.id}`}>
        <Td>{acc.username}</Td>
        <Td>{acc.password}</Td>
        <Td>
          {' '}
          <Heading
            as="p"
            size="xs"
            color={acc.isLogin ? 'green.500' : 'red.500'}
          >
            {acc.isLogin ? 'Đăng nhập' : 'Đăng xuất'}
          </Heading>
        </Td>
        <Td>
          <HStack spacing="1rem" alignItems="center">
            <Button
              variant="solid"
              size="md"
              colorScheme="yellow"
              onClick={() => editAccount(acc)}
            >
              <AiTwotoneEdit />
            </Button>
            <Button
              variant="solid"
              size="md"
              colorScheme="red"
              onClick={() => deleteAccount(acc)}
            >
              <AiTwotoneRest />
            </Button>
          </HStack>
        </Td>
      </Tr>
    ));
  }, [accounts]);

  return (
    <>
      <Table variant="striped" colorScheme="gray">
        <TableCaption placement="top">Danh sách tài khoản</TableCaption>
        <Thead>
          <Tr>
            <Th>Tài khoản</Th>
            <Th>Mật khẩu</Th>
            <Th>Trạng thái</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>{renderRow}</Tbody>
      </Table>
      <AccountModal
        type="edit"
        initialValue={modalState}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
};

export default Account;
