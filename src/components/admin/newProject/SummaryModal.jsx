import { Box, Table, Thead, Tbody, Tr, Th, Td, Text, Divider, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, VStack, Flex, TableContainer } from "@chakra-ui/react";
import React, { useState } from "react";

const SummaryModal = ({summaryData}) => {
  return (
    <>
    <Accordion allowMultiple>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box as="span" flex='1' textAlign='left' >
              <Text p='8px' bg='gray.50' borderRadius='5px' fontSize={{ base: '15px', sm: '18px',md: '20px', lg: '25px' }} color="#445069">Template Name : {summaryData.template_name}</Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
            <Flex flexDirection='column'>

            <Box as="span" flex='1' textAlign='left'>
            <Text p='2px' fontSize={{ base: '15px', sm: '18px',md: '18px', lg: '20px' }} color="#445069">Template Type : {summaryData.template_type_id.name}</Text>      
            </Box>

            <Box as="span" flex='1' textAlign='left'>
            <Text p='2px' fontSize={{ base: '15px', sm: '18px',md: '18px', lg: '20px' }} color="#445069">Segment : {summaryData.template_segments.map((segment,index)=> 
            <span key={segment.segment_id._id}>
                {segment.segment_id.name}
                {index !== summaryData.template_segments.length - 1 && ', '}
              </span>)}</Text>      
            </Box>
            <Box as="span" flex='1' textAlign='left'>
            <Text p='2px' fontSize={{ base: '15px', sm: '18px',md: '18px', lg: '20px' }} color="#445069">Industry : {summaryData.template_industries.map((inds,index)=> 
            <span key={inds.industry_id._id}>
              {inds.industry_id.name} 
              {index !== summaryData.template_industries.length -1 && ","} 
              </span>)}</Text>      
           
            </Box>
            </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>

<Box>
      <Table variant="simple" maxW='680px' >
        <Thead>
          <Tr>
            <Th>Phases</Th>
            <Tr>
              <Th w={{base: '50px',sm: '50px',lg:'100px'}}>Modules</Th>
              <Th w={{base: '100px',sm: '50px', lg: '200px'}}>Tasks</Th>
              <Th w={{base: '100px',sm: '50px', lg: '200px'}}>Type</Th>
              <Th w={{base: '100px',sm: '50px', lg: '200px'}}>Solution / Action</Th>
            
            </Tr>
          </Tr>
        </Thead>
        
        <Tbody>
          {summaryData && summaryData.phases.map((phase) => (
            <Tr>
            <Td>
             {phase.phasesId.name}
            </Td>
            
            <Td>
            {phase.modules.map((module) => (
                <Table>     
                <Td w='200px' p='8px'>{module.moduleId.name}</Td>
                <Td>
                  <ol>
                  {module.tasks.map((task) => (
                    <Box w='150px'>
                    <li >{task.taskId.name}</li>
                    </Box>
                    ))}
                    </ol>
                  </Td>

                  <Td>
                    <Box w='150px'>
                  {module.tasks.map((task) => (
                    <Box w='150px'>
                    <li >{task.taskId.task_type}</li>
                    </Box>
                    ))}
                    </Box>
                  </Td>

                  <Td>
                {module.tasks.map((task) => (
                  <Box w='200px'>
                    {task.taskId.task_solutionid?  <ul>
                    <li>{task.taskId.task_solutionid.name}</li>
                  </ul>:  <ul>
                    <li>{task.taskId.task_actionName}</li>
                  </ul>}
                 
                  </Box>
                  ))}
                  </Td>
                </Table>
              ))}
              </Td>
          </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
    </>
  )
}

export default SummaryModal