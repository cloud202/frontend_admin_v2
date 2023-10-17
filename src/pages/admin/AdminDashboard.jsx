import React, { useEffect } from 'react'
import {Box, Button, Grid, GridItem, HStack, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure} from '@chakra-ui/react'
import { Navbar } from '../../components/admin/Navbar'
import Sidebar from '../../components/admin/Sidebar'
import '../../css/admin/adminDashboard.css'
import step_one from '../../img/admin_steps/1.png'
import Footer from '../../components/global/Footer'
import { useState,useCallback} from 'react'
import axios from 'axios'
import SkeletonTable from '../../components/global/Skeleton'
import { EditIcon, RepeatIcon } from '@chakra-ui/icons'
import Summary from '../../components/admin/newProject/Summary'
import SummaryModal from '../../components/admin/newProject/SummaryModal'
import { Link } from 'react-router-dom'
import Cookies from "js-cookie";


const AdminDashboard = ({reviewData,setReviewData}) => {
  const [projectTemplate,setProjectTemplate] = useState([])
  const [isLoading,setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure()

  const fetchProject = async(projectId)=>{
    try {
      console.log(`${process.env.REACT_APP_API_URL}/api/admin/master/v2/project_template/${projectId}`);
      const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/master/v2/project_template/${projectId}`);
      
      const dataWithId = { ...data, _id: projectId };
      console.log('Data',data);
      
      setReviewData(dataWithId);
    } catch (error) {
      console.error("Error fetching task data:", error);
    }

  }
  const fetchTaskDataEffect = useCallback(async () => {
    try {
      const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/master/v2/project_template`);
      setProjectTemplate(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching task data:", error);
    }
  }, []);

  useEffect(() => {
    fetchTaskDataEffect();
  }, [fetchTaskDataEffect]);

  return (
    <>
    <Navbar/>
    <Grid templateColumns="repeat(6,1fr)">
        <GridItem colSpan={{lg: '1' }}>
          <Box w={{ base: 'none',sm: 'none', md: 'none', lg: '230px' }}>
            <Sidebar/>
          </Box>
        </GridItem>

        <GridItem colSpan={{base: '6', sm: '6', md: '6',lg: '5' }} className= "project-background" >
          <Box className='dashboard-shadow' display='flex' flexDirection='column' alignItems='center' justifyContent='center' textAlign='center' mt={{base: '14px',lg: '6px'}} mb={{base: '22px'}} mr={{base: '5px',sm: '8px',lg: '12px'}} ml={{base: '5px',sm: '8px',lg: '12px'}}>
          <Text className='sub-title' fontSize={{ base: '14px',sm: '20px', md: '24px', lg: '28px' }} fontWeight={400} >Welcome {Cookies.get("username")} ,Define Modernization Journey For Your Customer</Text>
          <Image src={step_one} w={{ base: '100%', lg: '80%' }}/>
          </Box>

          <Box className='dashboard-shadow' p={{ base: '6px',sm: '6px', md: '6px', lg: '2px' }}  mr={{base: '5px',sm: '8px',lg: '12px'}} ml={{base: '5px',sm: '8px',lg: '12px'}} mb='16px'>
            <Text className='sub-title' fontSize={{ base: '16px', md: '20px', lg: '22px' }}  mt={{ base: '6px',sm: '6px', md: '6px', lg: '12px' }} >Available Project Templates</Text>
            {isLoading? <SkeletonTable/> : <TableContainer>
              <Table variant='simple' size={{ base: 'sm', md: 'sm', lg: 'md' }} mt='6px'>
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Name</Th>
                    <Th>Type</Th> 
                    <Th>Segment</Th> 
                    <Th>Industry</Th>
                    <Th>Operation</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {projectTemplate && projectTemplate.map((project)=> 
                  <Tr key={project._id}>
                    <Td>{project.project_id}</Td>
                    <Td>{project.template_name}</Td>
                    <Td>{project.template_type_id.name}</Td>
                    <Td>{project.template_segments.map((segment)=>(
                      <span key={segment.segment_id._id}>
                      {segment.segment_id.name}
                      <br/>
                    </span>
                    ))}</Td>
                    <Td>
                      {project.template_industries.map((industry) => (
                        <span key={industry.industry_id._id}>
                          {industry.industry_id.name}
                          <br/>
                        </span>
                      ))}
                    </Td>

                    <Td>
                      <HStack>
                    <Box>
                    <Link to='/admin/updateproject'>
                      <Button size="sm" rightIcon={<RepeatIcon />} colorScheme="orange" onClick={async()=> await fetchProject(project._id)}>
                        Update
                      </Button>
                      </Link>

                    </Box>

                    <Box>
                      <Button size='sm'
                        rightIcon={<EditIcon/>}
                        colorScheme='blue'
                        onClick={async ()=> {
                          await fetchProject(project._id);
                          onOpen();
                        }}
                        >
                        Review
                      </Button>
                    </Box>
                        </HStack>
                    </Td>
                  </Tr>)}           
                </Tbody>
              </Table>
            </TableContainer>}
          </Box>
            <Footer/>    
        </GridItem>
      </Grid>

      <Modal isOpen={isOpen} onClose={onClose} size='5xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Review template</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SummaryModal summaryData={reviewData}/>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>
  )
}

export default AdminDashboard