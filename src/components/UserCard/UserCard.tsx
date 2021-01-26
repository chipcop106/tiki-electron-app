import React, { useEffect, useState } from 'react';
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
  Select,
  FormControl,
  FormLabel,
  Tooltip,
  Switch,
  HStack,
  FormHelperText,
  Tfoot,
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import { AiOutlineDelete, AiOutlineFileAdd } from 'react-icons/ai';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { BsClockFill } from 'react-icons/bs';
import { GiShoppingCart } from 'react-icons/gi';
import alertify from 'alertifyjs';
import CurrencyFormat from 'react-currency-format';
import TokenRemain from '../TokenRemain';
import {
  actions as AccountActions,
  actions,
} from '../../redux/features/account/accountSlice';
import AccountModal from '../AccountModal';

const alertSettings = {
  movable: false,
};

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
    cart = {
      cartItems: [],
      subTotal: 0,
    },
  },
  isFastSale = false,
}) => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [method, setMethod] = useState('cod');
  const [gift, setGift] = useState(false);
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

  const handleCancelOrder = (orderId) => {
    dispatch(actions.cancelOrder({ id, access_token, orderId }));
  };

  // const handleGiftChange = (e) => {
  //   setGift(!e.target.checked);
  // };
  //
  // const handleChangeProductId = (e) => {
  //   setProductId(e.target.value);
  // };
  // const handleChangeMethod = (e) => {
  //   setMethod(e.target.value);
  // };
  // const handleChangeQuantity = (
  //   valueAsString: string,
  //   valueAsNumber: number
  // ) => {
  //   setQuantity(valueAsNumber);
  // };

  const getCartByAccount = (): void => {
    dispatch(
      actions.getCart({
        access_token,
        id,
      })
    );
  };

  const deleteCartItem = (itemId) => {
    dispatch(
      actions.deleteCartItem({
        access_token,
        id,
        itemId,
      })
    );
  };

  const addItemToCart = () => {};

  const deleteAllCart = () => {};

  useEffect(() => {
    getCartByAccount();
  }, []);

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
            mb={4}
          >
            {isFastSale ? (
              <>
                <Box flexShrink={0}>
                  <Button
                    leftIcon={<GiShoppingCart />}
                    colorScheme="yellow"
                    size="sm"
                    onClick={getCartByAccount}
                  >
                    Lấy giỏ hàng
                  </Button>
                </Box>
                <Box mb={4} ml={4} flexShrink={0}>
                  <Button
                    leftIcon={<AiOutlineDelete />}
                    colorScheme="red"
                    size="sm"
                    onClick={() => {}}
                  >
                    Xóa giỏ hàng
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Heading size="sm" mb={4}>
                  Lịch sử mua
                </Heading>
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
              </>
            )}
          </Stack>
          {isFastSale ? (
            <>
              <Box my={4}>
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>
                        <Text align="center">Id product</Text>
                      </Th>
                      <Th>Tên sản phẩm</Th>
                      <Th>
                        <Text align="center">Số lượng</Text>
                      </Th>
                      <Th>
                        <Text align="center">Giá tiền</Text>
                      </Th>
                      <Th>
                        {' '}
                        <Text align="center">Trạng thái</Text>
                      </Th>
                      <Th />
                    </Tr>
                  </Thead>
                  <Tbody>
                    {cart.cartItems.length > 0 ? (
                      cart.cartItems.map((item) => (
                        <Tr key={`${item.id}`}>
                          <Td>
                            <Text align="center">{item.product_id}</Text>
                          </Td>
                          <Td>
                            <Text isTruncated width={250}>
                              <a href={item.product_url} target="_blank">
                                {item.product_name}
                              </a>
                            </Text>
                          </Td>
                          <Td>
                            <Text align="center">{item.qty}</Text>
                          </Td>
                          <Td>
                            <Text align="center">
                              <strong>
                                <CurrencyFormat
                                  displayType="text"
                                  thousandSeparator
                                  value={item.subtotal}
                                />
                              </strong>
                            </Text>
                          </Td>
                          <Td>
                            <Text align="center">
                              <Button
                                size="xs"
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => {
                                  alertify.confirm(
                                    'Xác nhận xóa ?',
                                    `Bạn có chắc muốn xóa ${item.product_name} ?`,
                                    () => deleteCartItem(item.id),
                                    () => {}
                                  );
                                }}
                              >
                                Xóa
                              </Button>
                            </Text>
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td py={8} colSpan={5}>
                          <Text color="red.600" textAlign="center">
                            <strong>
                              Không có sản phẩm nào trong giỏ hàng
                            </strong>
                          </Text>
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                  <Tfoot>
                    <Tr>
                      <Td colSpan={5}>
                        <strong>Tổng tiền giỏ hàng:</strong>
                        <Text as="span" color="red.500" ml={4}>
                          <strong>
                            <CurrencyFormat
                              displayType="text"
                              thousandSeparator
                              value={cart.subTotal}
                            />
                          </strong>
                        </Text>
                      </Td>
                    </Tr>
                  </Tfoot>
                </Table>
              </Box>
              <HStack justif="space-between" align="center">
                <form>
                  <HStack>
                    <FormControl mr={2}>
                      <FormLabel>Giá tiền</FormLabel>
                      <NumberInput min={10} size="sm">
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormHelperText>
                        Nhập giá giỏ hàng muốn check
                      </FormHelperText>
                    </FormControl>
                    <Button
                      colorScheme="green"
                      leftIcon={<BsClockFill />}
                      onClick={() => {}}
                      flexShrink={0}
                      size="sm"
                    >
                      Check
                    </Button>
                  </HStack>
                </form>
              </HStack>
            </>
          ) : (
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
                    <Td colSpan={5} py={8}>
                      <Text color="red.600" textAlign="center">
                        <strong>Chưa có lịch sử nào</strong>
                      </Text>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          )}
        </Box>
      </CardStyle>
    </>
  );
};

export default UserCard;
