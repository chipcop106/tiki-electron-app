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
  Flex,
  Image,
  Input,
  FormControl,
  FormLabel,
  Box,
  useToast,
  RadioGroup,
  Stack,
  Radio,
  TableCaption,
  HStack,
  useRadioGroup,
} from '@chakra-ui/react';
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoCartOutline } from 'react-icons/io5';
import CurrencyFormat from 'react-currency-format';
import { AiFillFilter } from 'react-icons/ai';
import instance from '../../../api/instance';
import { actions as AccountActions } from '../account/accountSlice';
import { RootState } from '../rootReducer';
import RadioCard from '../../../components/RadioCard';

const Deals = () => {
  const [tagId, setTagId] = useState<string | number>('1');
  const [timeId, setTimeId] = useState<string | number>('1');
  const [filterFields, setFilterFields] = useState<any>(null);
  const [deals, setDeals] = useState<any[]>([]);
  const [filterPrice, setFilterPrice] = useState(0);
  const [filterItems, setFilterItems] = useState<any[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setIsloading] = useState(false);
  const [isCustomDeal, setIsCustomDeal] = useState('0');
  const [apiUrl, setApiUrl] = useState(
    'https://tiki.vn/api/v2/widget/deals/collection'
  );
  const [salePrice, setSalePrice] = useState(0);
  const accounts = useSelector((state: RootState) => state.account.accounts);
  const dispatch = useDispatch();
  const toast = useToast();
  const {
    getRootProps: getTagRoot,
    getRadioProps: getTagRadio,
  } = useRadioGroup({
    name: 'tags',
    defaultValue: '',
    onChange: (nextvalue: string | number) => setTagId(nextvalue),
  });
  const {
    getRootProps: getTimeRoot,
    getRadioProps: getTimeRadio,
  } = useRadioGroup({
    name: 'tags',
    defaultValue: '1',
    onChange: (nextvalue: string | number) => setTimeId(nextvalue),
  });

  const tagGroup = getTagRoot();
  const timeGroup = getTimeRoot();

  const getDealAPI = async (page: number): Promise<any[]> => {
    let result = [];
    const url =
      isCustomDeal === '1'
        ? apiUrl
        : 'https://tiki.vn/api/v2/widget/deals/collection';
    try {
      const res = await instance.get(url, {
        params: {
          tag_id: tagId,
          time_id: timeId,
          page,
        },
      });
      if (res.data) {
        setTotalPage(
          res.data.paging.last_page > 0 ? res.data.paging.last_page : 1
        );
        setFilterFields(res.data.filters);
        result = res.data.data;
      }
    } catch (e) {
      console.log(e);
      result = [];
    }
    return result;
  };

  const buyMultipleAccount = (productId: number) => {
    const loggedAccounts = [...accounts].filter(
      (item) => item.isLogin === true
    );

    loggedAccounts.forEach((acc) => {
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

  const reloadDeal = async () => {
    let totalDeals: any[] = [];
    let page = 1;
    setIsloading(true);
    while (page <= totalPage) {
      // eslint-disable-next-line no-await-in-loop
      const data = await getDealAPI(page);
      totalDeals = [...totalDeals, ...data];
      page += 1;
    }
    setDeals(totalDeals as any);
    setIsloading(false);
  };

  const handlePercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterPrice(parseInt(e.target.value, 10));
  };

  const renderListDeals = useMemo(() => {
    return filterItems
      .sort(
        (prev, next) =>
          Math.ceil(next.discount_percent) - Math.ceil(prev.discount_percent)
      )
      .map((item) => (
        <Tr key={`${item.product.id}`}>
          <Td>
            <Image
              src={item.product.thumbnail_url}
              width={50}
              height={50}
              fit="cover"
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
              value={item.progress.qty}
              displayType="text"
              thousandSeparator
              renderText={(value: string | number) => <Text>{value}</Text>}
            />
          </Td>
          <Td>
            <CurrencyFormat
              value={
                item.deal_status === 'running'
                  ? item.product.price
                  : item.product.list_price
              }
              displayType="text"
              thousandSeparator
              renderText={(value: string | number) => <Text>{value}</Text>}
            />
          </Td>
          <Td>
            <CurrencyFormat
              value={item.special_price}
              displayType="text"
              thousandSeparator
              renderText={(value: string | number) => (
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
  }, [filterItems]);

  const handleFilterList = () => {
    let dataFilter;
    if (salePrice > 0) {
      dataFilter = deals.filter(
        (item) =>
          item.discount_percent >=
            Math.ceil(Number(filterPrice) > 0 ? Number(filterPrice) : 0) &&
          item.special_price === salePrice
      );
    } else {
      dataFilter = deals.filter(
        (item) =>
          item.discount_percent >=
          Math.ceil(Number(filterPrice) > 0 ? Number(filterPrice) : 0)
      );
    }
    setFilterItems(dataFilter);
  };

  useEffect(() => {
    reloadDeal();
  }, []);

  useEffect(() => {
    handleFilterList();
  }, [deals]);

  return (
    <>
      <RadioGroup
        value={isCustomDeal}
        onChange={(nextValue: string) => setIsCustomDeal(nextValue)}
      >
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

      {!!filterFields && !!filterFields.tags && (
        <HStack
          spacing={4}
          direction="row"
          /* eslint-disable-next-line react/jsx-props-no-spreading */
          {...tagGroup}
          my={4}
          alignItems="stretch"
        >
          {filterFields.tags.values.map((tag: any) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const radio = getTagRadio({ value: tag.query_value });
            return (
              /* eslint-disable-next-line react/jsx-props-no-spreading */
              <RadioCard key={tag.query_value} {...radio}>
                <Text fontSize="sm">{tag.name}</Text>
              </RadioCard>
            );
          })}
        </HStack>
      )}

      {filterFields && !!filterFields.times && (
        <HStack
          spacing={4}
          direction="row"
          /* eslint-disable-next-line react/jsx-props-no-spreading */
          {...timeGroup}
          alignItems="stretch"
          my={4}
        >
          {filterFields.times.values.map((tag: any) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const radio = getTimeRadio({ value: tag.query_value });
            return (
              /* eslint-disable-next-line react/jsx-props-no-spreading */
              <RadioCard key={tag.query_value} {...radio}>
                <Text fontSize="sm">{tag.display}</Text>
              </RadioCard>
            );
          })}
        </HStack>
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
            onClick={reloadDeal}
            size="md"
            isLoading={loading}
            loadingText="Đang cập nhật"
          >
            Reload deal
          </Button>
        </Box>
        <HStack spacing={4}>
          <FormControl id="percentage">
            <FormLabel>Giảm lớn hơn</FormLabel>
            <Input
              placeholder="0%"
              onChange={handlePercentChange}
              width={125}
            />
          </FormControl>
          <FormControl id="price">
            <FormLabel>Giá chính xác</FormLabel>
            <Input
              placeholder="0%"
              onChange={(e) => setSalePrice(parseInt(e.target.value, 10))}
              width={125}
              value={salePrice}
            />
          </FormControl>
          <FormControl id="action">
            <Button
              leftIcon={<AiFillFilter />}
              colorScheme="purple"
              onClick={handleFilterList}
              mt={8}
            >
              Lọc
            </Button>
          </FormControl>
        </HStack>
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
            <Th>SL sale</Th>
            <Th>Giá gốc</Th>
            <Th>Giá sale</Th>
            <Th>% sale</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>{deals && deals.length > 0 && renderListDeals}</Tbody>
      </Table>
    </>
  );
};

export default Deals;
