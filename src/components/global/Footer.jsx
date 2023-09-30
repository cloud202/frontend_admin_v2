import { Flex, Text } from '@chakra-ui/react'
import React from 'react'

const Footer = () => {
  return (
    <Flex color='whiteAlpha.800' as="footer" flexDirection='column' alignItems="center" justifyContent='center' textAlign='center'  h="55px" bg='gray.100'>
        <Text color='gray.800' fontSize={{base: '12px',sm: '13px',md: '14px',lg: '14px'}}>Design and Developed with ❤️ by Cloud202 Ltd.</Text>
        <Text color='gray.800' fontSize={{base: '12px',sm: '13px',md: '14px',lg: '14px'}}>© 2023. All Rights Reserved.</Text>
    </Flex>
  )
}

export default Footer