import React from 'react';
import {
  Box,
  Text,
  Flex,
  Badge,
  Heading,
  Button,
  Input,
  Table,
  Tbody,
  Tr,
  Td,
  Th,
  Thead,
  Divider,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import { AiOutlineDelete, AiOutlineFileAdd } from 'react-icons/ai';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import TokenRemain from '../TokenRemain';
import { actions } from '../../redux/features/account/accountSlice';
import AccountModal from '../AccountModal';

const CardStyle = styled.div`
  p {
    margin-bottom: 0.5rem;
  }
`;

const UserCard = ({
  data: {
    id,
    access_token = '',
    expires_at = 0,
    isLogin = false,
    username,
    password,
    histories = [],
  },
}) => {
  const dispatch = useDispatch();

  const loginAccount = () => {
    dispatch(
      actions.loginAccount({
        id,
        username,
        password,
      })
    );
  };

  const logoutAccount = () => {
    dispatch(actions.setExpiredToken(id));
  };

  const deleteHistories = () => {
    dispatch(actions.deleteHistories(id));
  };

  const handleCancelOrder = (id, access_token, orderId) => {
    dispatch(actions.cancelOrder({ id, access_token, orderId }));
  };

  return (
    <>
      <CardStyle>
        <Box>
          <Flex flex={1}>
            <Text width="120px" mr={4} flexShrink={0}>
              Tài khoản:
            </Text>
            <strong>{username}</strong>
          </Flex>
          <Flex flex={1} alignItems="center">
            <Text mr={4} width="120px">
              Login status:
            </Text>
            {isLogin ? (
              <Text color="green.500">Đã đăng nhập</Text>
            ) : (
              <Text color="red.500">Chưa đăng nhập</Text>
            )}
            {!isLogin ? (
              <Button
                size="xs"
                colorScheme="teal"
                onClick={loginAccount}
                ml={4}
                mb={2}
              >
                Đăng nhập lại
              </Button>
            ) : (
              <Button
                size="xs"
                colorScheme="red"
                onClick={logoutAccount}
                ml={4}
                mb={2}
              >
                Đăng xuất
              </Button>
            )}
          </Flex>
          <Flex>
            <Text mr={4} width="120px" flexShrink={0}>
              Token:
            </Text>

            <Text isTruncated>
              <strong>{access_token}</strong>
            </Text>
          </Flex>
          <Flex>
            <Text mr={4} width="120px" flexShrink={0}>
              Thời hạn :{' '}
            </Text>
            {isLogin && <TokenRemain time={expires_at} id={id} />}
          </Flex>
        </Box>
        <Divider my={2} />
        <Box py={4}>
          <Stack
            direction={['column', 'row']}
            spacing="24px"
            alignItems="center"
            justify="space-between"
          >
            <Heading size="sm" mb={4}>
              Lịch sử mua
            </Heading>
            {/* <form> */}
            {/*  <Flex alignItems="stretch" width="500px" my={4}> */}
            {/*    <Box flexgrow={1}> */}
            {/*      <Input placeholder="Nhập product ID" size="sm" /> */}
            {/*    </Box> */}
            {/*    <Box flexgrow={1} width={150} mx={4}> */}
            {/*      <NumberInput */}
            {/*        size="sm" */}
            {/*        defaultValue={1} */}
            {/*        min={1} */}
            {/*        allowMouseWheel */}
            {/*      > */}
            {/*        <NumberInputField placeholder="Số lượng" /> */}
            {/*        <NumberInputStepper> */}
            {/*          <NumberIncrementStepper /> */}
            {/*          <NumberDecrementStepper /> */}
            {/*        </NumberInputStepper> */}
            {/*      </NumberInput> */}
            {/*    </Box> */}
            {/*    <Box> */}
            {/*      <Button */}
            {/*        leftIcon={<AiOutlineFileAdd />} */}
            {/*        colorScheme="blue" */}
            {/*        size="sm" */}
            {/*        onClick={submitForm} */}
            {/*      > */}
            {/*        Thêm product */}
            {/*      </Button> */}
            {/*    </Box> */}
            {/*  </Flex> */}
            {/* </form> */}
            <Box ml={4} flexShrink={0}>
              <Button
                leftIcon={<AiOutlineDelete />}
                colorScheme="red"
                size="sm"
                onClick={deleteHistories}
              >
                Xóa lịch sử
              </Button>
            </Box>
          </Stack>

          <Table>
            <Thead>
              <Tr>
                <Th>Id sản phẩm</Th>
                <Th>Link</Th>
                <Th>SL Mua</Th>
                <Th>Trạng thái</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {histories.length > 0 ? (
                histories.map((item) => (
                  <Tr key={`${item.id}`}>
                    <Td>{item.productId}</Td>
                    <Td>{item.link}</Td>
                    <Td>{item.quantity}</Td>
                    <Td>
                      {item.status ? (
                        <Badge colorScheme="green">Thành công</Badge>
                      ) : (
                        <Badge colorScheme="red">Thất bại</Badge>
                      )}
                    </Td>
                    <Td>
                      {item.status && (
                        <Button
                          size="xs"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() =>
                            handleCancelOrder(id, access_token, item.orderId)
                          }
                        >
                          Cancel
                        </Button>
                      )}
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={5}>
                    <Text color="red.600" textAlign="center">
                      Chưa có lịch sử nào
                    </Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </CardStyle>
    </>
  );
};

export default UserCard;
