import { AddIcon, DeleteIcon, RepeatIcon } from '@chakra-ui/icons'
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Flex, FormControl, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, TableContainer, Tbody, Td, Text, Textarea, Th, Thead, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import axios from 'axios'

const AddModuleModal = ({module,setModule,moduleFormData,setModuleFormData, handleRemoveButton}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
  const [formMode, setFormMode] = useState('add');
  const toast = useToast();
  const [moduleIdUpdate,setModuleIdUpdate] = useState(null);
  const [moduleIdDelete,setModuleIdDelete] = useState(null);
  const [isAlertOpen,setIsAlertOpen] = useState(false);
  const cancelRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModuleFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const submitHandler = async ()=>{
    try {
      const {data} = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/master/project_module`,moduleFormData);
      console.log(data)

      setModule((prevData)=>[...prevData,{name: data.name,description: data.description,scope: data.scope,_id: data._id}])

      toast({
        title: "Module Added",
        description: "The module has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setModuleFormData({
        name: '',
        description: '',
        scope: '',
        status: true
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  const deleteHandler = async (moduleId) => {
    try {
      // Open the confirmation dialog
      setIsAlertOpen(true);
      setModuleIdDelete(moduleId);
      console.log(moduleId)
    } catch (error) {
      console.error("Error deleting phase:", error);
    }
  };

  const updateHandler = async()=>{
    if (!moduleFormData.name || !moduleFormData.description || !moduleFormData.scope) {
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
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/admin/master/project_module/${moduleIdUpdate}`, moduleFormData);
      const updatedModuleData = module.map(row => {
        if (row._id === moduleIdUpdate) {
          return {
            ...row,
            name: moduleFormData.name,
            description: moduleFormData.description,
            scope: moduleFormData.scope
          };
        }
        return row;
      });      
      setModule(updatedModuleData);
      toast({
          title: 'Module Updated Successfully.',
          description: "See the changes on module table.",
          status: 'success',
          duration: 4000,
          isClosable: true,
        })

        setFormMode('add');
        setModuleFormData({
          name: '',
          description: '',
          scope: '',
          status: true,
        });

    } catch (error) {
      console.error("Error updating phase:", error);
    }
  }

  const onAlertClose = () => {
    setIsAlertOpen(false);
  };

  const onConfirmDelete = async () => {
    try {
      setIsAlertOpen(false); // Close the confirmation dialog
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/master/project_module/${moduleIdDelete}`);

      const updatedModule = module.filter(row => row._id !== moduleIdDelete);
      setModule(updatedModule);
      handleRemoveButton(moduleIdDelete);

      // const updatedTableData = tableData.filter(row => row.id !== phaseIdDelete);
      // setTableData(updatedTableData);
      setFormMode('add');
      toast({
        title: 'Module deleted Successfully.',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      
    } catch (error) {
      console.error("Error deleting Module:", error);
    }
  };

  const updateInitializer = async (rowData)=>{
    setModuleFormData({
      name: rowData.name,
      description: rowData.description,
      scope: rowData.scope,
      status: true
    })
    setModuleIdUpdate(rowData._id);
    setFormMode('update'); 
  }
  
  return (
    <div>
      <Button rightIcon={<AddIcon />} size='sm' colorScheme='teal' variant='outline' onClick={onOpen}>Add Module</Button>
      <Modal isOpen={isOpen} onClose={onClose} size='6xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Define Module</ModalHeader>
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
                    value={moduleFormData.name}
                    onChange={handleInputChange}
                    />
                    </HStack>
                </FormControl>

                <FormControl isRequired>
                <HStack align='start' spacing={0}>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={moduleFormData.description}
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
                    value={moduleFormData.scope}
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

            <Text mt='10px' p='5px' bg='gray.50' borderRadius='5px' fontSize={{ base: '18px', md: '22px', lg: '30px' }} color="#445069">Available Modules</Text>
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
                  {module.map((rowData, index) => (
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
          </TableContainer> 
          </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='purple' variant='outline' mr={3} onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
    </div>
  )
}

export default AddModuleModal;
