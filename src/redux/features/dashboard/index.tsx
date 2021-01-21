import React from 'react';
import {
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Stack,
  Text,
  Flex,
  Icon,
  Badge,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  HStack,
  StackDivider,
} from '@chakra-ui/react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import fromUnixTime from 'date-fns/fromUnixTime';
import {
  PageContainer,
  PageContent,
  Nav,
  Footer,
  Card,
} from '../../../components/Layout';
import UserCard from '../../../components/UserCard/UserCard';
import './index.scss';

const accounts = [
  {
    id: '1',
    email: 'vietdat106@gmail.com',
    password: '42342343',
    token: 'gdfgdflgdfjjl3l4234ljkl4324234',
    expired: 32325622432234,
    isLogin: false,
    productIds: [],
  },
  {
    id: '2',
    email: 'heaven102@gmail.com',
    password: 'đf',
    token: 'gdfgdflgdfjjl3l4234ljkl4324234',
    expired: 32325622432234,
    isLogin: true,
    productIds: [],
  },
  {
    id: '3',
    email: 'vcnxcmvc@gmail.com',
    password: '4324234234',
    token: 'gdfgdflgdfjjl3l4234ljkl4324234',
    expired: 234234234,
    isLogin: false,
    productIds: [],
  },
];

const Dashboard: React.FC = () => {
  return (
    <PageContainer isFixedNav>
      <Nav />
      <Flex flexDirection="column" flexGrow={1} overflow="auto" py={8}>
        <Box>
          <Accordion defaultIndex={[0]} allowMultiple>
            {accounts.map((account) => (
              <AccordionItem mb={8} borderBottom="1px solid #E2E8F0">
                <AccordionButton backgroundColor="gray.100">
                  <Flex
                    alignItems="center"
                    flexGrow={1}
                    justify-content="space-between"
                  >
                    <HStack divider={<StackDivider />} flexGrow={1}>
                      <Box width="80px" textAlign="left">
                        <Badge colorScheme={account.isLogin ? 'green' : 'red'}>
                          {account.isLogin ? 'Đăng nhập' : 'Đăng xuất'}
                        </Badge>
                      </Box>
                      <Box flex="1" textAlign="left">
                        {account.email}
                      </Box>
                      {account.isLogin && (
                        <Box width="200px" textAlign="left">
                          Hết hạn: {account.expired}
                        </Box>
                      )}
                    </HStack>
                    <AccordionIcon />
                  </Flex>
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <UserCard data={account} />
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      </Flex>
      <Footer />
    </PageContainer>
  );
};

export default Dashboard;
