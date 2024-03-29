import React, { useState } from 'react';
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
  Divider,
  useToast,
} from '@chakra-ui/react';

import { useSelector, useDispatch } from 'react-redux';
import { AiOutlineDrag, AiOutlineExpandAlt } from 'react-icons/ai';
import { ExpandedIndex } from '@chakra-ui/accordion';
import UserCard from '../../../components/UserCard/UserCard';
import { actions as AccountActions } from '../account/accountSlice';
import { RootState } from '../rootReducer';
import TokenRemain from '../../../components/TokenRemain';

const FastSale: React.FC = () => {
  const [collapse, setCollapse] = useState(true);
  const [collapseItem, setCollapseItem] = useState<ExpandedIndex>([]);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const accounts = useSelector((state: RootState) => state.account.accounts);
  const dispatch = useDispatch();
  const toast = useToast();

  const toggleCollapse = (): void => {
    if (collapse) {
      setCollapseItem(accounts.map((_value, index: number) => index));
    } else {
      setCollapseItem([]);
    }
    setCollapse(!collapse);
  };

  const handleChangeCollapse = (items: ExpandedIndex): void => {
    setCollapseItem(items);
  };

  const reloginAllAccount = () => {
    accounts.forEach((acc) => {
      dispatch(
        AccountActions.loginAccount({
          id: acc.id,
          username: acc.username,
          password: acc.password,
        })
      );
    });
    toast({
      description: 'Login all success !',
      status: 'success',
      duration: 2500,
      isClosable: true,
    });
  };

  const handleChangeProductId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductId(e.target.value);
  };

  const handleChangeQuantity = (
    _valueAsString: string,
    valueAsNumber: number
  ) => {
    setQuantity(valueAsNumber);
  };

  const addCartMultipleAccount = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const loggedAccounts = accounts.filter((item) => item.isLogin === true);

    loggedAccounts.forEach((acc) => {
      dispatch(
        AccountActions.addCartProduct({
          id: acc.id,
          access_token: acc.access_token,
          product_id: productId,
          quantity,
        })
      );
    });
    toast({
      description: 'Add cart success all account !',
      status: 'success',
      duration: 2500,
      isClosable: true,
    });
  };

  const getCartMultipleAccount = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const loggedAccounts = accounts.filter((item) => item.isLogin === true);
    loggedAccounts.forEach((acc) => {
      dispatch(
        AccountActions.getCart({
          access_token: acc.access_token,
          id: acc.id,
        })
      );
    });
    toast({
      description: 'Update cart success !',
      status: 'success',
      duration: 2500,
      isClosable: true,
    });
  };

  return (
    <>
      <Stack direction={['row']} mb={8} justify="space-between">
        <Button colorScheme="teal" size="sm" onClick={reloginAllAccount}>
          Đăng nhập tất cả
        </Button>
        <Button
          leftIcon={collapse ? <AiOutlineExpandAlt /> : <AiOutlineDrag />}
          colorScheme="yellow"
          onClick={toggleCollapse}
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
          <Button
            colorScheme="purple"
            onClick={getCartMultipleAccount}
            size="sm"
          >
            Cập nhật giỏ hàng
          </Button>
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
          {accounts.map((account) => (
            <AccordionItem
              key={account.id}
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
                <UserCard account={account} isFastSale />
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>
    </>
  );
};

export default FastSale;
