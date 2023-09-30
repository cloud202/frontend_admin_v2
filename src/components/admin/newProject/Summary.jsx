import { Box, Table, Thead, Tbody, Tr, Th, Td, Text, Divider, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, VStack, Flex } from "@chakra-ui/react";
import React, { useState } from "react";

const Summary = ({summaryData,formData}) => {
  return (
    <>
    <Accordion maxW='680px' allowMultiple>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box as="span" flex='1' textAlign='left' >
              <Text p='8px' bg='gray.50' maxW='680px' borderRadius='5px' fontSize={{ base: '15px', sm: '18px',md: '20px', lg: '25px' }} color="#445069">Template Name : {summaryData.template_name}</Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
            <Flex flexDirection='column'>

            <Box as="span" flex='1' textAlign='left'>
            <Text p='2px' fontSize={{ base: '15px', sm: '18px',md: '18px', lg: '20px' }} color="#445069">Template Type : {formData.projectType}</Text>      
            </Box>

            <Box as="span" flex='1' textAlign='left'>
            <Text p='2px' fontSize={{ base: '15px', sm: '18px',md: '18px', lg: '20px' }} color="#445069">Segment : {formData.segment.map((segment,index)=> <span key={segment}>
                {segment}
                {index !== formData.segment.length - 1 && ', '}
              </span>)}</Text>      
            </Box>
            <Box as="span" flex='1' textAlign='left'>
            <Text p='2px' fontSize={{ base: '15px', sm: '18px',md: '18px', lg: '20px' }} color="#445069">Industry : {formData.industry.map((inds,index)=> <span key={inds}>{inds} {index !== formData.industry.length -1 && ","} </span>)}</Text>      

              
            </Box>
            </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
    
    {/* <Text mb='10px' p='5px' bg='gray.50' maxW='680px' borderRadius='5px' fontSize={{ base: '15px', sm: '26px',md: '30px', lg: '30px' }} color="#445069">Template Name : {summaryData.template_name}</Text>
    <Text mb='10px' p='5px' bg='gray.50' maxW='680px' borderRadius='5px' fontSize={{ base: '12px', sm: '15px',md: '15px', lg: '20px' }} color="#445069">Template Type : {formData.projectType}</Text>

    <Text mb='10px' p='5px' bg='gray.50' maxW='680px' borderRadius='5px' fontSize={{ base: '12px', sm: '15px',md: '15px', lg: '20px' }} color="#445069">Segment : {formData.segment.map((segment,index)=> <span key={segment}>
                {segment}
                {index !== formData.segment.length - 1 && ', '}
              </span>) }</Text>

    <Text mb='10px' p='5px' bg='gray.50' maxW='680px' borderRadius='5px' fontSize={{ base: '12px', sm: '15px',md: '15px', lg: '20px' }} color="#445069">Industry : {formData.industry.map((inds,index)=> <span key={inds}>{inds} {index !== formData.industry.length -1 && ","}</span>)}</Text> */}

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
             {phase.phaseName}
            </Td>
            
            <Td>
            {phase.modules.map((module) => (
              // <table>
              //     <Td w='250px' >{module.moduleName}</Td>
              //     <ol>
              //     {module.tasks.map((task) => (
              //       <Box w='200px'>
              //       <li >{task.taskName}</li>
              //       <ul>
              //         <li style={{marginLeft: '18px'}}>{task.solName}</li>
              //       </ul>
              //       </Box>
              //       ))}
              //       </ol>
              // </table>
                <Table>     
                <Td w='200px' p='8px'>{module.moduleName}</Td>
                <Td>
                  <ol>
                  {module.tasks.map((task) => (
                    <Box w='150px'>
                    <li >{task.taskName}</li>
                    </Box>
                    ))}
                    </ol>
                  </Td>

                  <Td>
                    <Box w='150px'>
                  {module.tasks.map((task) => (
                    <Box w='150px'>
                    <li >{task.solType}</li>
                    </Box>
                    ))}
                    </Box>
                  </Td>

                  <Td>
                {module.tasks.map((task) => (
                  <Box w='200px'>
                  <ul>
                    <li>{task.solName}</li>
                  </ul>
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
  );

};

export default Summary;
