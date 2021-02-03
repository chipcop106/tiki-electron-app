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
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoCartOutline } from 'react-icons/io5';
import instance from '../../../api/instance';
import { actions as AccountActions } from '../account/accountSlice';
import { RootState } from '../rootReducer';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [filterPrice, setFilterPrice] = useState(88000);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setIsloading] = useState(false);
  const accounts = useSelector((state: RootState) => state.account.accounts);
  const dispatch = useDispatch();

  const getDealAPI = async (page) => {
    try {
      const res = await instance.get('https://tiki.vn/api/v2/events/deals', {
        params: {
          slug: 'tiki-sale-tet-2021',
          tags: 'tet21_shocking_gayhr',
          page,
          type: 'normal_deal',
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

  const renderListDeals = useCallback(() => {
    return deals
      .filter(
        (item) =>
          item.deal_status === 'running' &&
          item.special_price === parseInt(filterPrice, 10)
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
          <Td>{item.special_price}</Td>
          <Td>{item.progress.qty_remain}</Td>
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
        <Select
          value={filterPrice}
          onChange={(e) => setFilterPrice(e.target.value)}
          width={150}
        >
          <option value="8000">8000</option>
          <option value="88000">88000</option>
        </Select>
      </Flex>

      <Table>
        <Thead>
          <Tr>
            <Th>Image</Th>
            <Th>Product name</Th>
            <Th>Price sale</Th>
            <Th>Còn lại</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {loading ? (
            <Tr>
              <Td colSpan={5}>
                <Text color="red.500" align="center">
                  Đang tải dữ liệu
                </Text>
              </Td>
            </Tr>
          ) : (
            deals && deals.length > 0 && renderListDeals()
          )}
        </Tbody>
      </Table>
    </>
  );
};

export default Deals;
