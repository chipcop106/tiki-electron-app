import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { dialog } from 'electron';
import { actions } from '../redux/features/account/accountSlice';

function PasswordInput({ onChange, value }) {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <InputGroup size="md">
      <Input
        pr="4.5rem"
        type={show ? 'text' : 'password'}
        placeholder="Enter password"
        onChange={onChange}
        value={value}
      />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
          {show ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}

const AccountModal = ({
  isOpen,
  onClose,
  type = 'create',
  initialValue = {
    username: null,
    password: null,
    id: null,
  },
}) => {
  const [username, setUsername] = useState(initialValue.username);
  const [password, setPassword] = useState(initialValue.password);
  const account = useSelector((state) => state.account, shallowEqual);

  const dispatch = useDispatch();

  const changePassword = (e) => {
    setPassword(e.target.value);
  };

  const changeUsername = (e) => {
    setUsername(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (type === 'create') {
      if (account.accounts.find((item) => item.username === username)) {
        alert('Tài khoản đã tồn tại trong hệ thống');
        return false;
      }
      dispatch(actions.addAccount({ username, password }));
    }
    type === 'edit' &&
      dispatch(
        actions.updateAccount({ id: initialValue.id, username, password })
      );
  };

  const initialRef = React.useRef();
  const finalRef = React.useRef();

  useEffect(() => {
    setUsername(initialValue.username);
    setPassword(initialValue.password);
  }, [initialValue]);

  useEffect(() => {
    dispatch(actions.clearError());
  }, []);

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {!type === 'edit' ? 'Thêm tài khoản mới' : 'Chỉnh sửa'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Tài khoản</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Email hoặc tên TK"
                value={username}
                onChange={changeUsername}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Mật khẩu</FormLabel>
              <PasswordInput value={password} onChange={changePassword} />
            </FormControl>
            {account.error && account.error !== null && (
              <Alert status={account.error ? 'error' : 'success'} mt={4}>
                <AlertIcon />
                <AlertTitle mr={2}>
                  {account.error ? 'Error !' : 'Success'}
                </AlertTitle>
                <AlertDescription>
                  {account.error ? account.error : 'Thêm thành công'}
                </AlertDescription>
                <CloseButton
                  position="absolute"
                  right="8px"
                  top="8px"
                  onClick={() => dispatch(actions.clearError())}
                />
              </Alert>
            )}
            {account.error === false && (
              <Alert status={account.error ? 'error' : 'success'} mt={4}>
                <AlertIcon />
                <AlertTitle mr={2}>
                  {account.error ? 'Error !' : 'Success'}
                </AlertTitle>
                <AlertDescription>
                  {account.error
                    ? account.error
                    : type === 'edit'
                    ? 'Cập nhật thành công '
                    : 'Thêm thành công'}
                </AlertDescription>
                <CloseButton
                  position="absolute"
                  right="8px"
                  top="8px"
                  onClick={() => dispatch(actions.clearError())}
                />
              </Alert>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={onSubmit}
              isLoading={account.loading}
              loadingText={type === 'edit' ? 'Saving...' : 'Creating...'}
            >
              {type === 'edit' ? 'Save' : 'Create'}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AccountModal;
