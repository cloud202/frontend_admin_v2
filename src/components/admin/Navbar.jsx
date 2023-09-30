import { Box, Button, Flex, Heading, Image, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, Spacer, Text } from '@chakra-ui/react'
import modx from '../../img/modx.png'
import React, { useState } from 'react';
import '../../css/admin/navbar.css'
import { ChevronDownIcon, EmailIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import Cookies from "js-cookie";
export const Navbar = () => {
  const RemoveCookie = () => {
    Cookies.remove("token");
    Cookies.remove("email");
    Cookies.remove("username");
  };
  return (
    <Flex  className='header' color='whiteAlpha.800' as="nav" p="10px" alignItems="center" gap="8px" h="55px" position="sticky" top="0" zIndex={3}>
        <Box ml={{base: '20px',lg: '10px'}} h={{base: "35px",lg: "45px"}} w={{base: "100px",lg: '120px'}} p={0}>
        <Link to='/admin'>
          <Image m={0} objectFit='cover' src={modx}/>
          </Link>
        </Box>

        {/* <Link to='/admin'>
          <Heading ml={{base: '35px',lg: '15px'}} size='lg' as='h3' color='#f7f7f7'>Qubitz</Heading> 
        </Link> */}
        <Spacer/>

        <Menu bg='gray.400'>
            <MenuButton
              as={Button}
              colorScheme='#04373A'
              rightIcon={<ChevronDownIcon />}
            >
              {Cookies.get("username")}
            </MenuButton>
              <MenuList>
                <MenuItem color='gray.800'>{Cookies.get("email")}</MenuItem>
                <MenuItem color='gray.800'>My Profile</MenuItem>
                <MenuDivider />
                <MenuItem color='gray.800'>
                <a onClick={RemoveCookie} href={`${process.env.REACT_APP_COGNITO}logout?client_id=${process.env.REACT_APP_CLIENT_ID}&logout_uri=${process.env.REACT_APP_COGNITO}login?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}`}>
                  Log Out
                  </a>
                  </MenuItem>
              </MenuList>
          </Menu>
    </Flex>
  )
}
