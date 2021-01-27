import React, { useEffect, useState } from 'react';
import {
  Flex,
  Badge,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  HStack,
  StackDivider,
  Button,
  Heading,
  Stack,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  FormControl,
  Switch,
  FormLabel,
  Tooltip,
  Divider,
} from '@chakra-ui/react';

import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { AiOutlineDrag, AiOutlineExpandAlt } from 'react-icons/ai';
import UserCard from '../../../components/UserCard/UserCard';
import { actions as AccountActions } from '../account/accountSlice';
import { RootState } from '../rootReducer';
import TokenRemain from '../../../components/TokenRemain';

const FastSale: React.FC = () => {
  const [collapse, setCollapse] = useState(true);
  const [collapseItem, setCollapseItem] = useState([]);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [method, setMethod] = useState('cod');
  const [gift, setGift] = useState(false);
  const accounts = useSelector((state: RootState) => state.account.accounts);
  const dispatch = useDispatch();

  const _toggleCollapse = (): void => {
    if (collapse) {
      setCollapseItem(accounts.map((value, index: number) => index));
    } else {
      setCollapseItem([]);
    }
    setCollapse(!collapse);
  };

  const handleChangeCollapse = (items: never[]): void => {
    setCollapseItem(items);
  };

  const handleGiftChange = (e) => {
    setGift(!e.target.checked);
  };

  const reloginAllAccount = () => {
    accounts &&
      accounts.length > 0 &&
      [...accounts].map((acc) => {
        dispatch(
          AccountActions.loginAccount({
            id: acc.id,
            username: acc.username,
            password: acc.password,
          })
        );
      });
  };

  const handleChangeProductId = (e) => {
    setProductId(e.target.value);
  };
  const handleChangeMethod = (e) => {
    setMethod(e.target.value);
  };
  const handleChangeQuantity = (
    valueAsString: string,
    valueAsNumber: number
  ) => {
    setQuantity(valueAsNumber);
  };

  const addCartMultipleAccount = (e) => {
    e.preventDefault();
    accounts &&
      accounts.length > 0 &&
      [...accounts]
        .filter((item) => item.isLogin === true)
        .map((acc) => {
          dispatch(
            AccountActions.addCartProduct({
              id: acc.id,
              access_token: acc.access_token,
              product_id: productId,
              quantity,
            })
          );
        });
  };

  useEffect(() => {
    console.log({ accounts });
  }, [accounts]);

  return (
    <>
      <Stack direction={['row']} mb={8} justify="space-between">
        <Button colorScheme="teal" size="sm" onClick={reloginAllAccount}>
          Đăng nhập tất cả
        </Button>
        <Button
          leftIcon={collapse ? <AiOutlineExpandAlt /> : <AiOutlineDrag />}
          colorScheme="yellow"
          onClick={_toggleCollapse}
          size="sm"
        >
          {collapse ? 'Mở tất cả tab' : 'Đóng tất cả tab'}
        </Button>
      </Stack>

      <Box>
        <Heading size="sm">Thêm chung tất cả</Heading>
        <Stack
          direction={['column', 'row']}
          spacing="24px"
          alignItems="center"
          justify="space-between"
        >
          <form>
            <Flex alignItems="stretch" my={4}>
              <Box flexgrow={1}>
                <Input
                  placeholder="Nhập product ID"
                  size="sm"
                  value={productId}
                  onChange={handleChangeProductId}
                />
              </Box>
              <Box flexgrow={1} width={150} mx={4}>
                <NumberInput
                  size="sm"
                  value={quantity}
                  onChange={handleChangeQuantity}
                  defaultValue={1}
                  min={1}
                  allowMouseWheel
                >
                  <NumberInputField placeholder="Số lượng" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
              {/* <Box width={150}> */}
              {/*  <Select size="sm" value={method} onChange={handleChangeMethod}> */}
              {/*    <option value="cod">COD</option> */}
              {/*    <option value="momo">Momo</option> */}
              {/*    <option value="cybersource">Visa / Master card</option> */}
              {/*  </Select> */}
              {/* </Box> */}
              {/* <Box mx={4} flexShrink={0}> */}
              {/*  <FormControl display="flex" alignItems="center"> */}
              {/*    <FormLabel htmlFor="email-alerts" mb="0" flexShrink={0}> */}
              {/*      Nhận kèm quà? */}
              {/*    </FormLabel> */}
              {/*    <Tooltip */}
              {/*      label="Một vài sản phẩm kèm theo nhận quà sẽ không mua được, nên test trước khi setup" */}
              {/*      aria-label="A tooltip" */}
              {/*      shouldWrapChildren */}
              {/*    > */}
              {/*      <Switch */}
              {/*        id="gift-recieve" */}
              {/*        onChange={handleGiftChange} */}
              {/*        value={gift} */}
              {/*      /> */}
              {/*    </Tooltip> */}
              {/*  </FormControl> */}
              {/* </Box> */}
              <Box>
                <Button
                  colorScheme="blue"
                  size="sm"
                  onClick={addCartMultipleAccount}
                >
                  Thêm tất cả
                </Button>
              </Box>
            </Flex>
          </form>
        </Stack>
      </Box>
      <Divider />
      <Box mt={8} borderTopWidth={1} borderStyle="solid" borderColor="gray.100">
        <Accordion
          index={collapseItem}
          onChange={handleChangeCollapse}
          allowMultiple
          allowToggle
        >
          {accounts.map((account, index) => (
            <AccordionItem
              key={`${index}`}
              mb={6}
              borderBottom="1px solid #E2E8F0"
            >
              <AccordionButton
                backgroundColor="gray.100"
                _expanded={{ bg: 'gray.700', color: 'white' }}
              >
                <Flex
                  alignItems="center"
                  flexGrow={1}
                  justify-content="space-between"
                >
                  <HStack divider={<StackDivider />} flexGrow={1}>
                    <Box width="80px" textAlign="left">
                      <Badge
                        variant="solid"
                        colorScheme={account.isLogin ? 'green' : 'red'}
                      >
                        {account.isLogin ? 'Đăng nhập' : 'Đăng xuất'}
                      </Badge>
                    </Box>
                    <Box flex="1" textAlign="left">
                      {account.username}
                    </Box>
                    {account.isLogin && (
                      <Box width="250px" textAlign="left">
                        Token hết hạn sau:{' '}
                        <TokenRemain
                          time={account.expires_at}
                          id={account.id}
                        />
                      </Box>
                    )}
                  </HStack>
                  <AccordionIcon />
                </Flex>
              </AccordionButton>
              <AccordionPanel pb={4}>
                <UserCard data={account} isFastSale />
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>
    </>
  );
};

export default FastSale;
