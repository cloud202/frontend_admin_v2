import { Box, Flex, HStack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useRadio, useRadioGroup } from "@chakra-ui/react"
import Upload from "./Upload"

const Playbook=({links,setLinks,fileName,setFileName})=> {

  return (
    <> 
    <Flex direction="column" maxW="680px">
    <Text mb='10px' p='5px' bg='gray.50' borderRadius='5px' fontSize={{ base: '15px', sm: '26px',md: '30px', lg: '30px' }} color="#445069">Upload Playbooks For Customer</Text>

    <Tabs variant='unstyled'>
      <TabList gap={2}>
        <Tab style={{border: '1px solid rgb(192, 192, 192)',borderRadius: '5px', p: '4px'}} _selected={{ color: 'white', bg: '#2C7A7B' }}>Sales</Tab>
        <Tab style={{border: '1px solid rgb(192, 192, 192)',borderRadius: '5px', p: '4px'}} _selected={{ color: 'white', bg: '#2C7A7B' }}>Funding</Tab>
        <Tab style={{border: '1px solid rgb(192, 192, 192)',borderRadius: '5px', p: '4px'}} _selected={{ color: 'white', bg: '#2C7A7B' }}>Delivery</Tab>
        <Tab style={{border: '1px solid rgb(192, 192, 192)',borderRadius: '5px', p: '4px'}} _selected={{ color: 'white', bg: '#2C7A7B' }}>Operations</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Upload setLinks={setLinks} type="sales" fileName={fileName} setFileName={setFileName}/>
        </TabPanel>

        <TabPanel>
          <Upload setLinks={setLinks} type="funding" fileName={fileName} setFileName={setFileName}/>
        </TabPanel>

        <TabPanel>
          <Upload setLinks={setLinks} type="delivery" fileName={fileName} setFileName={setFileName}/>
        </TabPanel>

        <TabPanel>
          <Upload setLinks={setLinks} type="operations" fileName={fileName} setFileName={setFileName}/>
        </TabPanel>

      </TabPanels>
    </Tabs>
    </Flex>
    </>
  )
}

export default Playbook