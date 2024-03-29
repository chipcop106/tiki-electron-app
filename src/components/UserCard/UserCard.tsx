/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Flex,
  Badge,
  Heading,
  Button,
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
  useToast,
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import { AiOutlineDelete } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { BsClockFill } from 'react-icons/bs';
import { GiShoppingCart } from 'react-icons/gi';
import CurrencyFormat from 'react-currency-format';
import { IoNewspaperOutline } from 'react-icons/io5';
import TokenRemain from '../TokenRemain';
import { actions, Account } from '../../redux/features/account/accountSlice';
import { getCartData } from '../../api/cart';

interface CardProps {
  account: Account;
  isFastSale: boolean;
}

const CardStyle = styled.div`
  p {
    margin-bottom: 0.5rem;
  }
`;

const UserCard = ({ account, isFastSale }: CardProps) => {
  const {
    id,
    access_token = '',
    expires_at = 0,
    isLogin = false,
    username,
    password,
    histories = [],
    cart = { cartItems: [], subTotal: 0 },
    isChecking,
  } = account;
  const [method, setMethod] = useState('cod');
  const [gift, setGift] = useState(false);
  const [priceCheck, setPriceCheck] = useState(0);
  const dispatch = useDispatch();
  const toast = useToast();

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

  const getOrders = () => {
    dispatch(
      actions.getOrders({
        id,
        username,
        access_token,
      })
    );
  };

  const handleCancelOrder = async (orderId: string) => {
    dispatch(actions.cancelOrder({ id, access_token, orderId }));
  };

  const handleGiftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGift(!e.target.checked);
  };

  const handleChangeMethod = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMethod(e.target.value);
  };

  const getCartByAccount = (): void => {
    dispatch(
      actions.getCart({
        access_token,
        id,
      })
    );
  };

  const deleteCartItem = (itemId: string) => {
    dispatch(
      actions.deleteCartItem({
        access_token,
        id,
        itemId,
        onSuccess: () =>
          toast({
            description: 'Delete successfully !',
            status: 'success',
            duration: 2500,
            isClosable: true,
          }),
        onError: () =>
          toast({
            description: 'Delete error !',
            status: 'error',
            duration: 2500,
            isClosable: true,
          }),
      })
    );
  };

  const deleteAllCart = () => {
    cart.cartItems.map(async (item) => {
      dispatch(
        actions.deleteCartItem({
          id,
          itemId: item.id,
          access_token,
        })
      );
    });
    toast({
      description: 'Delete completed !',
      status: 'success',
      duration: 2500,
      isClosable: true,
    });
  };

  const checkPrice = (status: boolean) => {
    dispatch(
      actions.toggleChecking({
        id,
        isChecking: status,
      })
    );
  };

  useEffect(() => {
    let interval: any = null;
    if (isChecking) {
      interval = setInterval(async () => {
        const cartData = await getCartData({
          access_token,
        });
        const { subtotal } = cartData.data;
        if (subtotal < priceCheck) {
          dispatch(
            actions.checkPriceBuy({
              access_token,
              id,
              gift,
              method,
            })
          );
          clearInterval(interval);
          checkPrice(false);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isChecking]);

  useEffect(() => {
    dispatch(
      actions.getCart({
        access_token,
        id,
      })
    );
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
                    onClick={deleteAllCart}
                    disabled
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
                    leftIcon={<IoNewspaperOutline />}
                    colorScheme="yellow"
                    size="sm"
                    onClick={getOrders}
                  >
                    Lấy lịch sử mua hàng
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
                        <Text align="right">Giá tiền</Text>
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
                              <a
                                href={item.product_url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {item.product_name}
                              </a>
                            </Text>
                          </Td>
                          <Td>
                            <Text align="center">{item.qty}</Text>
                          </Td>
                          <Td>
                            <Text align="right">
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
                                onClick={() => deleteCartItem(item.id)}
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
                      <Td colSpan={4}>
                        <Text align="right">
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
                        </Text>
                      </Td>
                      <Td />
                    </Tr>
                  </Tfoot>
                </Table>
              </Box>
              <HStack justif="space-between" align="center">
                <form>
                  <HStack>
                    <Box width={150} flexShrink={0}>
                      <Select
                        size="sm"
                        value={method}
                        onChange={handleChangeMethod}
                      >
                        <option value="cod">COD</option>
                        <option value="momo">Momo</option>
                        <option value="cybersource">Visa / Master card</option>
                      </Select>
                    </Box>
                    <Box mx={4} flexShrink={0}>
                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="email-alerts" mb="0" flexShrink={0}>
                          Nhận kèm quà?
                        </FormLabel>
                        <Tooltip
                          label="Một vài sản phẩm kèm theo nhận quà sẽ không mua được, nên test trước khi setup"
                          aria-label="A tooltip"
                          shouldWrapChildren
                        >
                          <Switch
                            id="gift-recieve"
                            onChange={handleGiftChange}
                            isChecked={gift}
                          />
                        </Tooltip>
                      </FormControl>
                    </Box>
                    <FormControl mr={2}>
                      <FormLabel>Giá tiền</FormLabel>
                      <NumberInput
                        min={0}
                        size="sm"
                        value={priceCheck}
                        onChange={(_valueAsString, valueAsNumber) =>
                          setPriceCheck(valueAsNumber)
                        }
                      >
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
                      colorScheme={isChecking ? 'red' : 'green'}
                      leftIcon={<BsClockFill />}
                      onClick={() => checkPrice(!isChecking)}
                      flexShrink={0}
                      size="sm"
                    >
                      {isChecking ? 'Cancel' : 'Check'}
                    </Button>
                  </HStack>
                </form>
              </HStack>
            </>
          ) : (
            <Table>
              <Thead>
                <Tr>
                  <Th>Id order</Th>
                  <Th>Sản phẩm</Th>
                  <Th>Tổng tiền</Th>
                  <Th>Trạng thái</Th>
                  <Th />
                </Tr>
              </Thead>
              <Tbody>
                {histories.length > 0 ? (
                  histories.map((item) => (
                    <Tr key={`${item.id}`}>
                      <Td>{item.id}</Td>
                      <Td>{item.description}</Td>
                      <Td>{item.grand_total}</Td>
                      <Td>
                        {/* eslint-disable-next-line no-nested-ternary */}
                        {item.status === 'canceled' ? (
                          <Badge colorScheme="red">Đã hủy</Badge>
                        ) : item.status === 'cho_in' ? (
                          <Badge colorScheme="green">Thành công</Badge>
                        ) : (
                          <Badge colorScheme="yellow">{item.status_text}</Badge>
                        )}
                      </Td>
                      <Td>
                        {item.status !== 'canceled' && (
                          <Button
                            size="xs"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => handleCancelOrder(item.id)}
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
