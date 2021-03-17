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
  Switch,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
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
  const [otp, setOtp] = useState('');
  const [isOtpAccount, setIsOtpAccount] = useState(false);
  const account = useSelector((state) => state.account, shallowEqual);

  const dispatch = useDispatch();

  const changePassword = (e) => {
    setPassword(e.target.value);
  };

  const changeUsername = (e) => {
    setUsername(e.target.value);
  };

  const changeOtp = (e) => {
    setOtp(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (type === 'create') {
      if (account.accounts.find((item) => item.username === username)) {
        alert('Tài khoản đã tồn tại trong hệ thống');
        return false;
      }
      dispatch(actions.addAccount({ username, password, otp_code: otp }));
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

  useEffect(() => {
    setOtp('');
  }, [isOtpAccount]);

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
          <form onSubmit={onSubmit}>
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
              <FormControl display="flex" alignItems="center" mt={4}>
                <FormLabel htmlFor="otp-code" mb="0">
                  Is OTP account ?
                </FormLabel>
                <Switch
                  id="otp-code"
                  size="lg"
                  onChange={(e) => setIsOtpAccount(e.target.checked)}
                />
              </FormControl>
              {isOtpAccount && (
                <FormControl mt={4}>
                  <Input
                    placeholder="Nhập mã OTP trên điện thoại"
                    value={otp}
                    onChange={changeOtp}
                  />
                </FormControl>
              )}

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
                type="submit"
                colorScheme="blue"
                mr={3}
                isLoading={account.loading}
                loadingText={type === 'edit' ? 'Saving...' : 'Creating...'}
              >
                {type === 'edit' ? 'Save' : 'Create'}
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AccountModal;
