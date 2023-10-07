import React, { useState } from 'react'
import { Navbar } from '../../components/admin/Navbar'
import Sidebar from '../../components/admin/Sidebar'
import { Grid, GridItem, Button, Flex, Progress, Box, Text, useToast, Spinner } from '@chakra-ui/react'
import { ArrowBackIcon, ArrowForwardIcon, CheckIcon } from '@chakra-ui/icons'
import DefineProject from '../../components/admin/newProject/DefineProject';
import { SelectPhase } from '../../components/admin/newProject/SelectPhase'
import AttachModule from '../../components/admin/newProject/AttachModule'
import AttachTask from '../../components/admin/newProject/AttachTask'
import axios from 'axios'
import Summary from '../../components/admin/newProject/Summary'
import { useNavigate } from 'react-router-dom';
import Playbook from '../../components/admin/newProject/Playbook'

const NewProject = () => {
  const [currPage,setCurrPage] = useState(1);
  const toast = useToast();
  const navigate = useNavigate();
  const [isLoading,setIsLoading] = useState(false);
  const [fileName,setFileName] = useState({
    sales: [],
    funding: [],
    delivery: [],
    operations: []
  });
  
  const [formData, setFormData] = useState({
    templateName: "",
    projectType: "Select an option",
    segment: [],
    industry: [],
    useCase: "",
    phases: [],
    modules: [],
    task: [],
  });

  const [tableData, setTableData] = useState([{
    name: "",
    description: "",
    scope: "",
    id: ""
  }]);

  const [links,setLinks] = useState({
    sales: [],
    funding: [],
    delivery: [],
    operations: []
  })

  const [summaryData,setSummaryData] = useState({
    template_name: "",
    template_type_id: "",
    template_segment_id: [],
    template_industry_id: [],
    template_usecase: "",
    phases: [],
  })

  const [checkedPhases, setCheckedPhases] = useState([]);
  const [attachedModules, setAttachedModules] = useState({});
  const [attachedTasks, setAttachedTasks] = useState({});
  const [selectedSegments, setSelectedSegments] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);

  const handlePrevious = ()=>{
    setCurrPage(currPage-1);
  }

  const handleNext =()=>{
    if(currPage!==6){
      setCurrPage(currPage+1);
    }   
  }

  const handleSubmit=async()=>{
    setIsLoading(true);

    if (!summaryData || !summaryData.phases) {
      console.error("Summary data is not populated as expected.");
      return;
    }

    function transformData(inputData) {
      if (!inputData || !inputData.phases) {
        return null;
      }
    
      return {
        template_name: inputData.template_name || "",
        template_type_id: inputData.template_type_id || "",
        template_segments: inputData.template_segment_id || [],
        template_industries: inputData.template_industry_id || [],
        template_usecase: inputData.template_usecase || "",
        phases: inputData.phases.map((phase) => {
          if (!phase || !phase.modules) {
            return null;
          }
    
          return {
            phasesId: phase.phaseId || "",
            modules: phase.modules.reduce((moduleArray, module) => {
              if (!module || !module.tasks) {
                return moduleArray;
              }
    
              const tasks = module.tasks.map((task) => {
                return {
                  taskId: task.taskId || ""
                };
              });
    
              if (tasks.length > 0) {
                moduleArray.push({
                  moduleId: module.moduleId || "",
                  tasks: tasks,
                });
              }
    
              return moduleArray;
            }, []),
          };
        }).filter((phase) => phase !== null),
      };
    }
       
    const transformedData = transformData(summaryData);
    const updatedTransformedData = {...transformedData, links: links};

    
    try{
      const {data} = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/master/v2/project_template`,updatedTransformedData);
      setIsLoading(false);
      toast({
        title: "Project Template Submitted Successfully",
        description: "Thank you for your submission.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    }catch(e){
      console.log(e);
      toast({
        title: "Error submitting the form",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  }

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
      <Text mb='20px' textAlign='center' p='5px' bg='#389785' color='white' borderRadius='5px' fontSize={{ base: '16px', sm: '18px',md: '25px', lg: '25px' }}>Create New Modernization-Journey Project Template</Text>
        <Progress value={100/6 * currPage} size='md' colorScheme='green' mb='10px' maxW='680px'/>

        { currPage===1 && <DefineProject selectedSegments={selectedSegments} setSelectedSegments={setSelectedSegments} selectedIndustries={selectedIndustries} setSelectedIndustries={setSelectedIndustries} summaryData={summaryData} setSummaryData={setSummaryData} formData={formData} setFormData={setFormData} />}
        { currPage===2 && <SelectPhase setSummaryData={setSummaryData} formData={formData} setFormData={setFormData} tableData={tableData} setTableData={setTableData} checkedPhases={checkedPhases} setCheckedPhases={setCheckedPhases}/>}
        { currPage===3 && <AttachModule summaryData={summaryData} setSummaryData={setSummaryData} formData={formData} setFormData={setFormData} tableData={tableData} attachedModules={attachedModules} setAttachedModules={setAttachedModules}/>}

        { currPage===4 && <AttachTask summaryData={summaryData} setSummaryData={setSummaryData} formData={formData} setFormData={setFormData} attachedTasks={attachedTasks} setAttachedTasks={setAttachedTasks}/>}

        {currPage ===5 && <Playbook links={links} setLinks={setLinks} fileName={fileName} setFileName={setFileName}/>}

        { currPage===6 && <Summary summaryData={summaryData} formData={formData} />}

        <Flex maxW="680px" justifyContent="space-between" alignItems="center" mt='10px'>
          <Button isDisabled={currPage===1} leftIcon={<ArrowBackIcon />} onClick={handlePrevious} colorScheme='purple' variant='outline' >Previous</Button>
          <Button rightIcon={currPage!==6?<ArrowForwardIcon/>: (isLoading? <Spinner/> :<CheckIcon/>)} onClick={currPage!==6 ? handleNext: handleSubmit} colorScheme='purple' variant='outline' >{
            currPage===5? "Review" : (currPage!==6?"Next":"Submit")
          }</Button>
        </Flex>

    </GridItem>
    </Grid>
    </>
  )
}

export default NewProject