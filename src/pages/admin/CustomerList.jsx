import React from 'react'
import { Navbar } from '../../components/admin/Navbar'
import { Box, Grid, GridItem, Text } from '@chakra-ui/react'
import Sidebar from '../../components/admin/Sidebar'

const CustomerList = () => {
  return (
    <>
    <Navbar/>
    <Grid templateColumns="repeat(6,1fr)">
      <GridItem colSpan="1">
      <Box w={{ base: 'none',sm: 'none', md: 'none', lg: '230px' }}>
          <Sidebar/>
        </Box>
      </GridItem>

      <GridItem colSpan={{base: '6', sm: '6', md: '6',lg: '5' }} m="30px">
      <Text mb='10px' textAlign='center' p='5px' bg='#389785' color='white' borderRadius='5px' fontSize={{ base: '16px', sm: '18px',md: '25px', lg: '25px' }}>List of Customers</Text>

       
              
      </GridItem>
      </Grid>
    </> 
  )
}

export default CustomerList