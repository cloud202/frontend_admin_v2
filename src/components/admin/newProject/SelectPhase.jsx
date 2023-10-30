import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { Checkbox,Box, Button, Flex, FormControl, FormLabel, HStack, Input, Menu, MenuButton, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, TableContainer, Tbody, Td, Text, Textarea, Th, Thead, Tr, VStack, useDisclosure, useToast, Stack } from '@chakra-ui/react';
import { ChevronDownIcon, SmallCloseIcon } from '@chakra-ui/icons';
import AddPhaseModal from './AddPhaseModal';

export const SelectPhase = ({setSummaryData,formData,setFormData,tableData,setTableData,reviewData,setReviewData,checkedPhases, setCheckedPhases}) => {
  const toast = useToast()
  const { isOpen, onClose } = useDisclosure()
  const [phase,setPhase] = useState([])

  const [phaseFormData, setPhaseFormData] = useState({
    name: "",
    description: "",
    scope: "",
    status: true,
  });
  
  const [phaseFormSubmitted, setPhaseFormSubmitted] = useState(false);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPhaseFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try{
      const {data} = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/master/project_phase`,phaseFormData);
      setPhaseFormSubmitted(true);
      setFormData((prevFormData) => ({
        ...prevFormData,
        phases: [...prevFormData.phases, data.name]
      }));

      setPhase((prevData)=>[...prevData,{name: data.name,description: data.description,scope: data.scope,id: data._id}])

      toast({
        title: "Phase Added",
        description: "The phase has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }catch (error) {
      console.error("Error sending phase form data:", error);
    }
  };

  const handlePhaseSelect = async (selectedPhaseId, selectedPhaseName, updateCheck = false) => {
    const newSummaryData = {
      phaseId: selectedPhaseId,
      phaseName: selectedPhaseName,
      modules: []
    }
  
    if (checkedPhases.includes(selectedPhaseId)) {
      setCheckedPhases(checkedPhases.filter(id => id !== selectedPhaseId));
  
      setTableData(prevTableData => prevTableData.filter(rowData => rowData.id !== selectedPhaseId));
  
      setFormData(prevFormData => ({
        ...prevFormData,
        phases: prevFormData.phases.filter(phaseName => phaseName !== selectedPhaseName)
      }));
  
      setSummaryData((prevData) => ({
        ...prevData,
        phases: prevData.phases.filter((phase) => phase.phaseId !== selectedPhaseId),
      }));
    } else {
      setCheckedPhases((prevCheckedPhases) => [
        ...prevCheckedPhases,
        selectedPhaseId,
      ]);
  
      if (selectedPhaseId) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/master/project_phase/${selectedPhaseId}`);
  
          setFormData((prevFormData) => ({
            ...prevFormData,
            phases: [...prevFormData.phases, selectedPhaseName]
          }));
  
          const newData = {
            name: response.data.name,
            description: response.data.description,
            scope: response.data.scope,
            id: response.data._id
          };
  
          setTableData((prevTableData) => [...prevTableData, newData]);
  
          if (!updateCheck) {
            setSummaryData((prevData) => ({
              ...prevData,
              phases: [...prevData.phases, newSummaryData]
            }));
          }
        } catch (error) {
          console.error("Error fetching selected phase data:", error);
        }
      } else {
        console.error("Selected phaseId is not valid.");
      }
    }
  };
  

  const handleRemovePhase =(index,phaseId,phase)=>{
    const updatedTableData = [...tableData];
    updatedTableData.splice(index, 1);

    setTableData(updatedTableData);
    setCheckedPhases((prevCheckedPhases) => prevCheckedPhases.filter((id) => id !== phaseId));

    const updatedPhases = formData.phases.filter((phaseName) => phaseName !== phase);
    setFormData((prevFormData) => ({
      ...prevFormData,
      phase: updatedPhases,
    }));

    
    setSummaryData((prevData) => ({
      ...prevData,
      phases: prevData.phases.filter((phase) => phase.phaseId !== phaseId),
    }));

    
    if(reviewData){
      const updatedReviewData = { ...reviewData };

      updatedReviewData.phases = updatedReviewData.phases.filter(
        (phaseItem) => phaseItem.phasesId._id !== phaseId
      );

    setReviewData(updatedReviewData);

    }
  }

  const fetchDataEffect = useCallback(async () => {
    try {
      const phases = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/master/project_phase`);
      setPhase(phases.data);
    } catch (error) {
      console.error("Error fetching phase data:", error);
    }
  },[]);

  useEffect(() => {
    fetchDataEffect();

    if (reviewData && reviewData.phases.length > 0) {
      reviewData.phases.forEach((phase) => {
        const phaseExistsInTable = tableData.some((rowData) => rowData.id === phase.phasesId._id);
        
        if (!phaseExistsInTable) {
          handlePhaseSelect(phase.phasesId._id, phase.phasesId.name, true);
        }
      });
    }
  }, [phaseFormSubmitted, fetchDataEffect]);

  const [searchText, setSearchText] = useState('');

  const filteredPhases = phase.filter((val) => {
    return val.name.toLowerCase().includes(searchText.toLowerCase());
  });
  
  return (
    <Flex direction="column" maxW="680px">
        <Flex align="center" mb="20px">
          <FormLabel flex="1">Select Phase:</FormLabel>
          <Menu >
            <MenuButton w="80%" as={Button} variant="outline" colorScheme="gray" rightIcon={<ChevronDownIcon />}>
              Select an option
            </MenuButton>
            <MenuList p='10px'>
            <Input
              mb='4px'
              placeholder="Search phases"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Stack spacing={1} maxH='250px' overflow='auto'>
              {filteredPhases.map((val, ind) => (
                  <Checkbox
                    key={ind}
                     pl='6px'
                     _hover={{backgroundColor: '#f5f3f4'}}
                    spacing={2}
                    size='md'
                    colorScheme='green'
                    isChecked={checkedPhases.includes(val._id)}
                    onChange={() => handlePhaseSelect(val._id, val.name)}
                  >
                    {val.name}
                  </Checkbox>
              ))}
            </Stack>
          </MenuList>

          </Menu>

        </Flex>
      <Flex justifyContent='space-between'>
        <AddPhaseModal phase={phase} setPhase={setPhase} tableData={tableData} setTableData={setTableData} phaseFormData={phaseFormData} setPhaseFormData={setPhaseFormData} handleSubmit={handleSubmit} setPhaseFormSubmitted={setPhaseFormSubmitted} fetchDataEffect={fetchDataEffect}/>

        <Modal isOpen={isOpen} onClose={onClose} size='lg'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Define phase</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Box p={4}>
            <form>
              <VStack spacing={4}>
                <FormControl isRequired>

                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    name="name"
                    value={phaseFormData.name}
                    onChange={handleInputChange}
                    />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={phaseFormData.description}
                    onChange={handleInputChange}
                    />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Scope</FormLabel>
                  <Input
                    type="text"
                    name="scope"
                    value={phaseFormData.scope}
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
            <Button colorScheme='purple' type='submit' onClick={handleSubmit}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      </Flex>
        <Text mt='20px' p='5px' bg='gray.50' borderRadius='5px' fontSize={{ base: '18px', md: '22px', lg: '30px' }} color="#445069">Selected Phases</Text>
        
        <Box m='20px'>
            <Table colorScheme='purple' size='sm'>
              <Thead>
                <Tr>
                  <Th>Phase</Th>
                  <Th>Description</Th>
                  <Th>Scope</Th> 
                  <Th>Operation</Th> 
                </Tr>
              </Thead>

                  {tableData.map((rowData, index) => (
                  <Tbody key={rowData.id}>
                     {rowData.name !== "" && <Tr key={rowData.id}>
                        <Td>{rowData.name}</Td>
                        <Td>
                        {rowData.description}
                          </Td>
                        <Td>{rowData.scope}</Td>
                        <Td>
                            <Button
                              rightIcon={<SmallCloseIcon />}
                              size='xs'
                              colorScheme='red'
                              variant='outline'
                              onClick={() => handleRemovePhase(index,rowData.id,rowData.name)}
                            >
                              Remove
                            </Button>
                        </Td>
                      </Tr>}
                </Tbody>
                  ))}
            </Table>
          </Box>      
      </Flex>
  )
}
