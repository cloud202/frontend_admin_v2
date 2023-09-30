import { ChevronDownIcon, RepeatIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, FormLabel, Input, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, VStack, useDisclosure, useToast } from '@chakra-ui/react'

import React, { useState } from 'react'
import axios from 'axios'

const UpdatePhaseModal = ({phaseFormData,setPhaseFormData,phase}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast();
    const [phaseId,setPhaseId] = useState(null)
    const [selectedPhaseName, setSelectedPhaseName] = useState("Select a phase");
    const [formFields, setFormFields] = useState({
        name: "",
        description: "",
        scope: "",
      });

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormFields((prevFields) => ({ ...prevFields, [name]: value }));
      };
  
    const updateHandler = async()=>{
        if (!formFields.name || !formFields.description || !formFields.scope) {
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
            const { data } = await axios.patch(`${process.env.REACT_APP_API_URL}/api/admin/master/project_phase/${phaseId}`, formFields);
            toast({
                title: 'Phase Updated Successfully.',
                description: "Select the phase to see the updated phase.",
                status: 'success',
                duration: 4000,
                isClosable: true,
              })
            onClose();
          } catch (error) {
            console.error("Error updating phase:", error);
          }
    }

    const handleSelectPhase = (id,name)=>{
        setPhaseId(id)
        setSelectedPhaseName(name);
    }

  
    return (
      <div>
          <Button rightIcon={<RepeatIcon />} size='sm' colorScheme='orange' variant='outline' onClick={onOpen}>Update Phase</Button>
          <Modal isOpen={isOpen} onClose={onClose} size='lg'>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update phase</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <Box p={4}>
              <form>
                <VStack spacing={4}>
                <Menu >
                    <MenuButton as={Button} variant="outline" colorScheme="gray" rightIcon={<ChevronDownIcon />}>
                   {selectedPhaseName}
                    </MenuButton>
                    <MenuList p='20px'>
                        {
                        phase && phase.map((val,ind)=>(
                            <MenuItem onClick={()=>handleSelectPhase(val._id,val.name)}>
                                {val.name}
                            </MenuItem>
                        ))
                        }   
                        
                    </MenuList>
                </Menu>
  
                  <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      name="name"
                      value={formFields.name}
                      onChange={handleInputChange}
                      />
                  </FormControl>
  
                  <FormControl isRequired>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      name="description"
                      value={formFields.description}
                      onChange={handleInputChange}
                      />
                  </FormControl>
  
                  <FormControl isRequired>
                    <FormLabel>Scope</FormLabel>
                    <Input
                      type="text"
                      name="scope"
                      value={formFields.scope}
                      onChange={handleInputChange}
                      />
                  </FormControl>
                      </VStack>
              </form>
            </Box>
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='purple' variant='outline' mr={3} onClick={onClose}>Close
              </Button>
              <Button colorScheme='purple' type='submit' onClick={updateHandler}>Submit</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    )
}

export default UpdatePhaseModal