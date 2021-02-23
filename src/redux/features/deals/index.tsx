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
  useToast,
  RadioGroup,
  Stack,
  Radio,
  TableCaption,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoCartOutline } from 'react-icons/io5';
import CurrencyFormat from 'react-currency-format';
import instance from '../../../api/instance';
import { actions as AccountActions } from '../account/accountSlice';
import { RootState } from '../rootReducer';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [filterPrice, setFilterPrice] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setIsloading] = useState(false);
  const [isCustomDeal, setIsCustomDeal] = useState('0');
  const [apiUrl, setApiUrl] = useState(
    'https://tiki.vn/api/v2/widget/deals/mix?page=1&tag_id=1&time_id=2'
  );
  const [salePrice, setSalePrice] = useState(0);
  const accounts = useSelector((state: RootState) => state.account.accounts);
  const dispatch = useDispatch();
  const toast = useToast();

  const getDealAPI = async (page, tagId) => {
    const params = {};
    const url =
      isCustomDeal === '1'
        ? apiUrl
        : 'https://tiki.vn/api/v2/widget/deals/mix?page=1';
    const urlSearch = new URLSearchParams(url.replace(/^[^_]+(?=\?)/gm, ''));
    urlSearch.forEach((value, key) => {
      params[key] = value;
    });
    try {
      const res = await instance.get(url, {
        params: {
          ...params,
          page,
          tag_id: tagId,
        },
      });
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
    toast({
      description: 'Mua hàng hoàn tất',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const _reloadDeal = async () => {
    let tagId = 1;
    let totalDeals = [];
    setIsloading(true);
    while (tagId <= 10) {
      let page = 1;
      while (page <= totalPage) {
        const data = await getDealAPI(page, tagId);
        totalDeals = [...totalDeals, ...data];
        page++;
      }
      tagId++;
    }
    setDeals(totalDeals);
    setIsloading(false);
  };

  const _handlePercentChange = (e) => {
    setFilterPrice(e.target.value);
  };

  const renderListDeals = useCallback(() => {
    let filterItems = [];
    if (salePrice > 0) {
      filterItems = deals.filter(
        (item) =>
          item.discount_percent >=
            Math.ceil(Number(filterPrice) > 0 ? Number(filterPrice) : 0) &&
          item.special_price === parseInt(salePrice)
      );
    } else {
      filterItems = deals.filter(
        (item) =>
          item.discount_percent >=
          Math.ceil(Number(filterPrice) > 0 ? Number(filterPrice) : 0)
      );
    }
    return filterItems
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
              rel="noopener"
              mb={2}
            >
              <Text maxW={400} isTruncated>
                {item.product.name}
              </Text>
            </Link>
          </Td>
          <Td>
            <CurrencyFormat
              value={item.product.list_price}
              displayType="text"
              thousandSeparator
              renderText={(value) => <Text>{value}</Text>}
            />
          </Td>
          <Td>
            <CurrencyFormat
              value={item.special_price}
              displayType="text"
              thousandSeparator
              renderText={(value) => (
                <Text fontWeight="semibold" color="red.500">
                  {value}
                </Text>
              )}
            />
          </Td>
          <Td>{item.discount_percent}</Td>
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
  }, [deals, filterPrice, salePrice]);

  useEffect(() => {
    _reloadDeal();
  }, []);

  useEffect(() => {
    console.log({ deals });
  }, [deals]);

  return (
    <>
      <RadioGroup value={isCustomDeal} onChange={setIsCustomDeal}>
        <Stack spacing={4} direction="row">
          <Radio value="0">Hot deal</Radio>
          <Radio value="1">Custom deal</Radio>
        </Stack>
      </RadioGroup>
      {isCustomDeal === '1' && (
        <FormControl id="url" my={2}>
          <FormLabel>API endpoint:</FormLabel>
          <Input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="API url"
          />
        </FormControl>
      )}

      <Flex
        justify="space-between"
        alignItems="center"
        mb={4}
        pos="sticky"
        top={-4}
        bgColor="white"
        zIndex={4}
        pb={4}
        borderBottom={1}
        borderBottomColor="gray.300"
        borderBottomStyle="solid"
      >
        <Box mt={4}>
          <Button
            colorScheme="blue"
            onClick={_reloadDeal}
            size="md"
            isLoading={loading}
            loadingText="Đang cập nhật"
          >
            Reload deal
          </Button>
        </Box>
        <Flex>
          <FormControl id="percentage" mr={8}>
            <FormLabel>Giảm lớn hơn</FormLabel>
            <Input
              placeholder="0%"
              onChange={_handlePercentChange}
              width={125}
            />
          </FormControl>
          <FormControl id="email">
            <FormLabel>Giá chính xác</FormLabel>
            <Input
              placeholder="0%"
              onChange={(e) => setSalePrice(e.target.value)}
              width={125}
              value={salePrice}
            />
          </FormControl>
        </Flex>
      </Flex>
      <Table>
        <TableCaption placement="top">
          Tổng sản phẩm:{' '}
          <strong>
            <Text color="red.500" as="span">
              {deals.length}
            </Text>{' '}
            sản phẩm
          </strong>
        </TableCaption>
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
