import Sidebar from '../../components/admin/Sidebar'
import { Navbar } from '../../components/admin/Navbar'
import { AddIcon, DeleteIcon, RepeatIcon } from '@chakra-ui/icons'
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Flex, FormControl, FormLabel, Grid, GridItem, HStack, Input, Table, TableContainer, Tbody, Td, Text, Textarea, Th, Thead, Tr, useToast } from '@chakra-ui/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import SkeletonTable from '../../components/global/Skeleton'

const Phase = () => {
  const toast = useToast();
  const [formMode, setFormMode] = useState('add');
  const [phaseIdUpdate,setPhaseIdUpdate] = useState(null);
  const [phaseIdDelete,setPhaseIdDelete] = useState(null);
  const [isAlertOpen,setIsAlertOpen] = useState(false);
  const [phaseFormSubmitted, setPhaseFormSubmitted] = useState(false);
  const [loading,setLoading] = useState(true);


  const cancelRef = useRef();
  const [phase,setPhase] = useState(null);

  const [phaseFormData, setPhaseFormData] = useState({
    name: "",
    description: "",
    scope: "",
    status: true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPhaseFormData((prevData)=> ({...prevData,[name]: value}));
  };

  const submitHandler = async ()=>{
    if (!phaseFormData.name || !phaseFormData.description || !phaseFormData.scope) {
      toast({
          title: 'Incomplete form.',
          description: "Please fill complete form.",
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
      return;
    }

    try {
      const {data} = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/master/project_phase`,phaseFormData);
      // setTableData((prevData)=>[...prevData,{name: data.name,description: data.description,scope: data.scope,id: data._id}])
      setPhase((prevData)=>[...prevData,{name: data.name,description: data.description,scope: data.scope,id: data._id}])
      setPhaseFormSubmitted(true);
      toast({
        title: "Phase Added",
        description: "The phase has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setPhaseIdUpdate(null);
      setPhaseIdDelete(null);
      setPhaseFormData({name: '',description: '',scope: '',status: true})
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Unable to Add phase",
        description: "Request Failed.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const updateInitializer = async (rowData)=>{
    setPhaseIdUpdate(rowData._id);
    setFormMode('update'); 
    setPhaseFormData({
      name: rowData.name,
      description: rowData.description,
      scope: rowData.scope,
      status: true
    })
  }

  const updateHandler = async()=>{
    if (!phaseFormData.name || !phaseFormData.description || !phaseFormData.scope) {
      toast({
          title: 'Incomplete form.',
          description: "Please fill complete form.",
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
      return;
    }
  
    try {
      console.log(phaseIdUpdate);
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/admin/master/project_phase/${phaseIdUpdate}`, phaseFormData);
      const updatedPhaseData = phase.map(row => {
        if (row._id === phaseIdUpdate) {
          return {
            ...row,
            name: phaseFormData.name,
            description: phaseFormData.description,
            scope: phaseFormData.scope
          };
        }
        return row;
      });
      
      setPhase(updatedPhaseData);
      toast({
          title: 'Phase Updated Successfully.',
          description: "See the changes on Selected phase table.",
          status: 'success',
          duration: 4000,
          isClosable: true,
        })

        setFormMode('add');
        setPhaseFormData({
          name: '',
          description: '',
          scope: '',
          status: true
        });
        setPhaseIdUpdate(null)

    } catch (error) {
      console.error("Error updating phase:", error);
    }
  }

  const deleteHandler = async (phaseid) => {
    try {
      // Open the confirmation dialog
      setIsAlertOpen(true);
      setPhaseIdDelete(phaseid);
      console.log(phaseid);
    } catch (error) {
      console.error("Error deleting phase:", error);
    }
  };

  const onAlertClose = () => {
    setIsAlertOpen(false);
  };

  const onConfirmDelete = async () => {
    try {
      setIsAlertOpen(false); // Close the confirmation dialog
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/master/project_phase/${phaseIdDelete}`);
      const updatedPhaseData = phase.filter(row => row._id !== phaseIdDelete);
      setPhase(updatedPhaseData);

      setFormMode('add');
      fetchDataEffect();
      toast({
        title: 'Phase deleted Successfully.',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      setPhaseIdDelete(null);
    } catch (error) {
      console.error("Error deleting phase:", error);
      toast({
        title: 'Phase deletion Failed.',
        status: 'erro',
        duration: 4000,
        isClosable: true,
      });
    }

  };

  const fetchDataEffect = useCallback(async () => {
    try {
      const phases = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/master/project_phase`);
      setPhase(phases.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching phase data:", error);
    }
  },[]);

  useEffect(() => {
    fetchDataEffect();
  }, [phaseFormSubmitted,fetchDataEffect]);

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
      <Text mb='10px' textAlign='center' p='5px' bg='#389785' color='white' borderRadius='5px' fontSize={{ base: '16px', sm: '18px',md: '25px', lg: '25px' }}>Create New Project Phase</Text>
          <Box p={4}>
            <form>
              <Flex gap={2} flexDirection='column'>
                <FormControl isRequired>
                <HStack align='start' spacing={12}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    name="name"
                    value={phaseFormData.name}
                    onChange={(e)=>handleInputChange(e)}
                    />
                    </HStack>
                </FormControl>

                <FormControl isRequired>
                <HStack align='start' spacing={2}>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={phaseFormData.description}
                    onChange={(e)=>handleInputChange(e)}
                    />
                    </HStack>
                </FormControl>

                <FormControl isRequired>
                <HStack align='start' spacing={12}>
                  <FormLabel>Scope</FormLabel>
                  <Input
                    type="text"
                    name="scope"
                    value={phaseFormData.scope}
                    onChange={(e)=>handleInputChange(e)}
                    />
                    </HStack>
                </FormControl>

                <Box>
                  <Button size='sm'
                    rightIcon={formMode === 'add' ? <AddIcon /> : <RepeatIcon />}
                    colorScheme={formMode === 'add' ? 'blue' : 'orange'}
                    onClick={formMode === 'add' ? submitHandler : updateHandler}
                  >
                    {formMode === 'add' ? 'Add' : 'Update'}
                  </Button>
                </Box>
                </Flex>
            </form>
        <Text mt='10px' p='5px' bg='gray.50' borderRadius='5px' fontSize={{ base: '18px', md: '22px', lg: '30px' }} color="#445069">Available Phases</Text>
        {loading ? <SkeletonTable/> : <TableContainer mt='10px' >
            <Table colorScheme='purple' size='sm'>
              <Thead>
                <Tr>
                  <Th>Phase</Th>
                  <Th>Description</Th>
                  <Th>Scope</Th> 
                  <Th>Operation</Th> 
                </Tr>
              </Thead>
                  {phase && phase.map((rowData, index) => (
                    <Tbody key={rowData._id}>
                      {rowData.name !== "" && <Tr key={rowData._id}>
                        <Td>{rowData.name}</Td>
                        <Td>{rowData.description}</Td>
                        <Td>{rowData.scope}</Td>
                        <Td>
                            <div>
                            <Button isDisabled= {formMode==='update'} rightIcon={<RepeatIcon />} size='sm' colorScheme='orange' mr={4} onClick={()=>updateInitializer(rowData)}>
                              Update
                            </Button>

                            <Button rightIcon={<DeleteIcon />} size='sm' colorScheme='red' onClick={()=>deleteHandler(rowData._id)}>
                              Delete
                            </Button>
                              </div>
                        </Td>
                      </Tr>
                      }
                      </Tbody>
                  ))}

            </Table>
          </TableContainer> }
          </Box>
    <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Phase
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this phase?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={onConfirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </GridItem>
    </Grid>
    </>
  )
}

export default Phase