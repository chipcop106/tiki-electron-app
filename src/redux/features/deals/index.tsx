import {
  Button,
  Link,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Select,
  Flex,
  Image,
  InputGroup,
  InputRightElement,
  Input,
  InputLeftElement,
  FormControl,
  FormHelperText,
  FormLabel,
  Box,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoCartOutline } from 'react-icons/io5';
import instance from '../../../api/instance';
import { actions as AccountActions } from '../account/accountSlice';
import { RootState } from '../rootReducer';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [filterPrice, setFilterPrice] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setIsloading] = useState(false);
  const accounts = useSelector((state: RootState) => state.account.accounts);
  const dispatch = useDispatch();

  const getDealAPI = async (page) => {
    try {
      const res = await instance.get(
        'https://tiki.vn/api/v2/widget/deals/mix',
        {
          params: {
            page,
          },
        }
      );
      if (res.data) {
        setTotalPage(res.data.paging.last_page);
        return res.data.data;
      }
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  const buyMultipleAccount = (productId) => {
    accounts &&
      accounts.length > 0 &&
      [...accounts]
        .filter((item) => item.isLogin === true)
        .map((acc) => {
          dispatch(
            AccountActions.processBuyProduct({
              id: acc.id,
              access_token: acc.access_token,
              productId,
              quantity: 1,
              payment_method: 'cod',
              gift: false,
            })
          );
        });
  };

  const _reloadDeal = async () => {
    let page = 1;
    let totalDeals = [];
    setIsloading(true);
    while (page <= totalPage) {
      const data = await getDealAPI(page);
      totalDeals = [...totalDeals, ...data];
      page++;
    }
    setDeals(totalDeals);
    setIsloading(false);
  };

  const _handlePercentChange = (e) => {
    setFilterPrice(e.target.value);
  };

  const renderListDeals = useCallback(() => {
    return deals
      .filter(
        (item) =>
          item.deal_status === 'running' &&
          Math.ceil((item.product.discount * 100) / item.product.list_price) >=
            Math.ceil(Number(filterPrice) > 0 ? Number(filterPrice) : 0)
      )
      .sort(
        (prev, next) =>
          Math.ceil((next.product.discount * 100) / next.product.list_price) -
          Math.ceil((prev.product.discount * 100) / prev.product.list_price)
      )
      .map((item) => (
        <Tr>
          <Td>
            <Image
              src={item.product.thumbnail_url}
              width={50}
              height={50}
              fit="object-fit"
            />
          </Td>
          <Td>
            <Link
              href={`https://tiki.vn/${item.product.url_path}`}
              target="_blank"
              mb={2}
            >
              <Text maxW={400} isTruncated>
                {item.product.name}
              </Text>
            </Link>
          </Td>
          <Td>{item.product.list_price}</Td>
          <Td>{item.special_price}</Td>
          <Td>
            {Math.ceil((item.product.discount * 100) / item.product.list_price)}
          </Td>
          <Td>
            <Button
              leftIcon={<IoCartOutline />}
              onClick={() => buyMultipleAccount(item.product.id)}
              size="sm"
            >
              Mua
            </Button>
          </Td>
        </Tr>
      ));
  }, [deals, filterPrice]);

  useEffect(() => {
    _reloadDeal();
  }, []);

  useEffect(() => {
    console.log({ deals });
  }, [deals]);

  return (
    <>
      <Flex
        justify="space-between"
        alignItems="center"
        mb={4}
        pos="sticky"
        top={-4}
        bgColor="white"
        py={4}
        zIndex={4}
      >
        <Button
          colorScheme="blue"
          onClick={_reloadDeal}
          size="md"
          isLoading={loading}
          loadingText="Đang cập nhật"
        >
          Reload deal
        </Button>
        <InputGroup width={125}>
          <InputLeftElement
            pointerEvents="none"
            color="black"
            fontSize="0.85rem"
            children="Tỉ lệ:"
          />
          <InputRightElement
            pointerEvents="none"
            color="gray.300"
            fontSize="1.2em"
            children="%"
          />
          <Input placeholder="0" onChange={_handlePercentChange} />
        </InputGroup>
      </Flex>

      <Table>
        <Thead>
          <Tr>
            <Th>Image</Th>
            <Th>Product name</Th>
            <Th>Giá gốc</Th>
            <Th>Giá sale</Th>
            <Th>% sale</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>{deals && deals.length > 0 && renderListDeals()}</Tbody>
      </Table>
    </>
  );
};

export default Deals;
