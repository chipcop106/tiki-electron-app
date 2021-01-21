import React from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Text,
  HStack,
  StackDivider,
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
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import { AiOutlineFileAdd } from 'react-icons/ai';

const CardStyle = styled.div`
  p {
    margin-bottom: 0.5rem;
  }
`;

const UserCard = ({
  data: {
    email = 'Tên nè',
    token = '',
    expired = 0,
    isLogin = false,
    productIds = [],
  },
}) => {
  return (
    <>
      <CardStyle>
        <Box>
          <Flex flex={1}>
            <Text width="120px" mr={4}>
              Tài khoản:
            </Text>
            <strong>{email}</strong>
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
          </Flex>
          <Flex>
            <Text mr={4} width="120px">
              Token:
            </Text>

            <strong>{token}</strong>
          </Flex>
          <Flex>
            <Text mr={4} width="120px">
              Hết hạn token:{' '}
            </Text>
            <strong>{expired}</strong>
          </Flex>
        </Box>
        <Divider my={2} />
        <Box>
          <Heading size="sm">Sản phẩm</Heading>
          <Flex alignItems="stretch" width="400px" my={4}>
            <Box flexgrow={1}>
              <Input placeholder="Nhập product ID" />
            </Box>
            <Box>
              <Button leftIcon={<AiOutlineFileAdd />} ml={4} colorScheme="blue">
                Thêm product
              </Button>
            </Box>
          </Flex>
          <Table>
            <Thead>
              <Tr>
                <Th>Id sản phẩm</Th>
                <Th>Số lượng mua</Th>
                <Th>Thao tác</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>54353412</Td>
                <Td>1</Td>
                <Td>25.4</Td>
              </Tr>
              <Tr>
                <Td>54353412</Td>
                <Td>1</Td>
                <Td>30.48</Td>
              </Tr>
              <Tr>
                <Td>54353412</Td>
                <Td>1</Td>
                <Td>0.91444</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </CardStyle>
    </>
  );
};

export default UserCard;
