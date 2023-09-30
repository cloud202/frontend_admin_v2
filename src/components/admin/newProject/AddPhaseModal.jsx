import { AddIcon, DeleteIcon, RepeatIcon } from '@chakra-ui/icons'
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Flex, FormControl, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, TableContainer, Tbody, Td, Text, Textarea, Th, Thead, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import axios from 'axios'

const AddPhaseModal = ({phase,setPhase,tableData,setTableData,phaseFormData,setPhaseFormData,handleSubmit,fetchDataEffect}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast();
  const [formMode, setFormMode] = useState('add');
  const [phaseIdUpdate,setPhaseIdUpdate] = useState(null);
  const [phaseIdDelete,setPhaseIdDelete] = useState(null);
  const [isAlertOpen,setIsAlertOpen] = useState(false);
  const cancelRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPhaseFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const submitHandler = async ()=>{
    try {
      await handleSubmit();
      setPhaseFormData({
        name: '',
        description: '',
        scope: '',
        status: true
      });
      setPhaseIdUpdate(null);
      setPhaseIdDelete(null);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  const updateInitializer = async (rowData)=>{
    setPhaseFormData({
      name: rowData.name,
      description: rowData.description,
      scope: rowData.scope,
      status: true
    })
    setPhaseIdUpdate(rowData._id);
    setFormMode('update'); 
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

        const updatedTableData = tableData.map(row => {
          if (row.id === phaseIdUpdate) {
            return {
              ...row,
              name: phaseFormData.name,
              description: phaseFormData.description,
              scope: phaseFormData.scope
            };
          }
          return row;
        });
        setTableData(updatedTableData);

        setFormMode('add');
        setPhaseFormData({
          name: '',
          description: '',
          scope: '',
          status: true
        });

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

      const updatedTableData = tableData.filter(row => row.id !== phaseIdDelete);
      setTableData(updatedTableData);

      setFormMode('add');
      fetchDataEffect();
      toast({
        title: 'Phase deleted Successfully.',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      
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

  return (
    <div>
        <Button rightIcon={<AddIcon />} size='sm' colorScheme='teal' variant='outline' onClick={onOpen}>Add Phase</Button>
        <Modal isOpen={isOpen} onClose={onClose} size='6xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Define phase</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Box p={4}>
            <form>
              <Flex gap={2}>

                <FormControl isRequired>
                <HStack align='start' spacing={0}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    name="name"
                    value={phaseFormData.name}
                    onChange={handleInputChange}
                    />
                    </HStack>
                </FormControl>

                <FormControl isRequired>
                <HStack align='start' spacing={0}>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={phaseFormData.description}
                    onChange={handleInputChange}
                    />
                    </HStack>
                </FormControl>

                <FormControl isRequired>
                <HStack align='start' spacing={0}>
                  <FormLabel>Scope</FormLabel>
                  <Input
                    type="text"
                    name="scope"
                    value={phaseFormData.scope}
                    onChange={handleInputChange}
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
            <TableContainer mt='10px' >
            <Table colorScheme='purple' size='sm'>
              <Thead>
                <Tr>
                  <Th>Phase</Th>
                  <Th>Description</Th>
                  <Th>Scope</Th> 
                  <Th>Operation</Th> 
                </Tr>
              </Thead>
                  {phase.map((rowData, ind) => (
                    <Tbody key={rowData._id}>
                      {rowData.name !== "" && <Tr key={`${rowData._id}-${ind}`}>
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
          </TableContainer>  

          </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='purple' variant='outline' mr={3} onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

{/* Alert dialog for confirming phase deletion */}
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
              <Button colorScheme='red' onClick={onConfirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  )
}

export default AddPhaseModal