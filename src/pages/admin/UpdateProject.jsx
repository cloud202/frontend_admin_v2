import React, { useEffect, useState } from 'react'
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

const UpdateProject = ({reviewData, setReviewData}) => {
  const [currPage,setCurrPage] = useState(1);
  const toast = useToast();
  const navigate = useNavigate();
  const [isLoading,setIsLoading] = useState(false);
  
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

  const [summaryData,setSummaryData] = useState({
    template_name: "",
    template_type_id: "",
    template_segment_id: [],
    template_industry_id: [],
    template_usecase: "",
    phases: []
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
    if(currPage!==5){
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
    
    try{
      const {data} = await axios.patch(`${process.env.REACT_APP_API_URL}/api/admin/master/v2/project_template/${reviewData._id}`,transformedData);
      setIsLoading(false);
      toast({
        title: "Project Template Updated Successfully",
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

  useEffect(() => {
    if (reviewData && reviewData.phases) {
      setFormData({
        templateName: reviewData.template_name,
        projectType: reviewData.template_type_id.name,
        segment: reviewData.template_segments.map((segment) => segment.segment_id.name),
        industry: reviewData.template_industries.map((industry) => industry.industry_id.name),
        useCase: reviewData.template_usecase,
        phases: reviewData.phases.map((phase) => {
          return {
          id: phase.phasesId._id,
          name: phase.phasesId.name,
          };
        }),
        modules: reviewData.phases.flatMap((phase) => {
          return phase.modules.map((module) => {
            return {
              id: module.moduleId._id,
              name: module.moduleId.name,
            };
          });
        }),
        task: reviewData.phases.flatMap((phase) => {
          return phase.modules.flatMap((module) => {
            return module.tasks.map((task) => {
              return {
                taskId: task.taskId._id,
                taskName: task.taskId.name,
              };
            });
          });
        }),
      });

        const initialAttachedModules = {};
        reviewData.phases.forEach((phase) => {
          initialAttachedModules[phase.phasesId._id] = [];
          phase.modules.forEach((module) => {
            initialAttachedModules[phase.phasesId._id].push(module.moduleId._id);
          });
        });
  
        setAttachedModules(initialAttachedModules);

        const initialAttachedTasks = {};
        reviewData.phases.forEach((phase)=>{
          phase.modules.forEach((module)=>{
            initialAttachedTasks[module.moduleId._id] = [];
            module.tasks.forEach((task)=>{
              initialAttachedTasks[module.moduleId._id].push(task.taskId._id);
            })
          })
        })

        setAttachedTasks(initialAttachedTasks);

        const industryIdObjects = (reviewData.template_industries || []).map((industry)=>({
          industry_id: industry.industry_id._id || "",
        }))

        const segmentIdObjects = (reviewData.template_segments || []).map((segment) => ({
          segment_id: segment.segment_id._id || "",
        }));

        setSummaryData({
          template_name: reviewData.template_name,
          template_type_id: reviewData.template_type_id._id || "",
          template_segment_id: segmentIdObjects,
          template_industry_id: industryIdObjects,
          template_usecase: reviewData.template_usecase || "",
          phases: reviewData.phases.map((phase) => ({
            phaseId: phase.phasesId._id || "",
            phaseName: phase.phasesId.name || "",

            modules: phase.modules.reduce((moduleArray, module) => {
              if (module && module.tasks) {
                const tasks = module.tasks.map((task) => ({
                  taskId: task.taskId._id || "",
                  taskName: task.taskId.name || "",
                  solName: task.taskId.task_solutionid?.name || task.taskId.task_actionName,
                  solType: task.taskId.task_type || "",
                }));
                if (tasks.length > 0) {
                  moduleArray.push({
                    moduleId: module.moduleId._id || "",
                    moduleName: module.moduleId.name || "",
                    tasks: tasks,
                  });
                }
              }
              return moduleArray;
            }, []),
          })),
        });

        setSelectedSegments(reviewData.template_segments.map((segment)=> segment.segment_id._id));
        setSelectedIndustries(reviewData.template_industries.map((industry)=> industry.industry_id._id));
    }


  }, [reviewData]);

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
      <Text mb='20px' textAlign='center' p='5px' bg='#389785' color='white' borderRadius='5px' fontSize={{ base: '16px', sm: '18px',md: '25px', lg: '25px' }}>Update Modernization-Journey Project Template</Text>
        <Progress value={100/5 * currPage} size='md' colorScheme='green' mb='10px' maxW='680px'/>

        { currPage===1 && <DefineProject selectedSegments={selectedSegments} setSelectedSegments={setSelectedSegments} selectedIndustries={selectedIndustries} setSelectedIndustries={setSelectedIndustries} summaryData={summaryData} setSummaryData={setSummaryData} formData={formData} setFormData={setFormData} />}
        
        { currPage===2 && <SelectPhase setSummaryData={setSummaryData} formData={formData} setFormData={setFormData} tableData={tableData} setTableData={setTableData} reviewData={reviewData} setReviewData={setReviewData} checkedPhases={checkedPhases} setCheckedPhases={setCheckedPhases}/>}

        { currPage===3 && <AttachModule summaryData={summaryData} setSummaryData={setSummaryData} formData={formData} setFormData={setFormData} tableData={tableData} attachedModules={attachedModules} setAttachedModules={setAttachedModules}/>}

        { currPage===4 && <AttachTask summaryData={summaryData} setSummaryData={setSummaryData} formData={formData} setFormData={setFormData} attachedTasks={attachedTasks} setAttachedTasks={setAttachedTasks}/>}
        
        { currPage===5 && <Summary summaryData={summaryData} formData={formData} />}

        <Flex maxW="680px" justifyContent="space-between" alignItems="center" mt='10px'>
          <Button isDisabled={currPage===1} leftIcon={<ArrowBackIcon />} onClick={handlePrevious} colorScheme='purple' variant='outline' >Previous</Button>
          
          <Button rightIcon={currPage!==5?<ArrowForwardIcon/>: (isLoading? <Spinner/> :<CheckIcon/>)} onClick={currPage!==5 ? handleNext: handleSubmit} colorScheme='purple' variant='outline' >{
            currPage===4? "Review" : (currPage!==5?"Next":"Update")
          }</Button>
        </Flex>

    </GridItem>
    </Grid>
    </>
  )
}

export default UpdateProject