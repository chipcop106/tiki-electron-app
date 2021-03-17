import React from 'react';
import { useRadio, Box } from '@chakra-ui/react';

export default function RadioCard(props) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        height="100%"
        _checked={{
          bg: 'gray.600',
          color: 'white',
          borderColor: 'gray.600',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        p={3}
        d="flex"
        alignItems="center"
        justifyContent="center"
      >
        {props.children}
      </Box>
    </Box>
  );
}
