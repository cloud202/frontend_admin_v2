import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Flex, FormLabel, HStack, Input, Menu, MenuButton, MenuItem, MenuList, Textarea } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import axios from "axios"

const DefineProject = ({selectedSegments, setSelectedSegments, selectedIndustries, setSelectedIndustries, summaryData, setSummaryData,formData,setFormData}) => {
  const [projectType,setProjectType] = useState([])
  const [segment,setSegment] = useState([])
  const [industry,setIndustry] = useState([])


  const handleSegmentChange = (val) => {
    if (selectedSegments.includes(val._id)) {
      setSelectedSegments(selectedSegments.filter((segmentId) => segmentId !== val._id));
      setFormData({...formData,segment: formData.segment.filter((segment)=> segment!==val.name)});
      setSummaryData({...summaryData,template_segment_id: summaryData.template_segment_id.filter((segId) =>segId.segment_id!==val._id)});
    } else {
      setSelectedSegments([...selectedSegments, val._id]);
      setFormData({...formData,segment: [...formData.segment,val.name]});
      const newSegment ={
        segment_id: val._id
      }
      setSummaryData({...summaryData,template_segment_id: [...summaryData.template_segment_id,newSegment]});
    }
  };

  const handleIndustryChange = (val) => {
    if (selectedIndustries.includes(val._id)) {
      setSelectedIndustries(selectedIndustries.filter((industryId) => industryId !== val._id));
      setFormData({...formData,industry: formData.industry.filter((industry)=> industry!==val.name)});
      setSummaryData({...summaryData,template_industry_id: summaryData.template_industry_id.filter((indId) =>indId.industry_id!==val._id)});
    } else {
      setSelectedIndustries([...selectedIndustries, val._id]);
      setFormData({...formData,industry: [...formData.industry,val.name]});

      const newIndustry = {
        industry_id: val._id
      }
      setSummaryData({...summaryData,template_industry_id: [...summaryData.template_industry_id,newIndustry]});
    }
  };

  useEffect(() => {
    async function fetchData(){
        const project = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/master/project_type`)
        setProjectType(project.data)

        const segment = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/master/project_segment`)
        setSegment(segment.data);

        const industry = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/master/project_industry`)
        setIndustry(industry.data);
    }
    fetchData();  
  }, [])


  return (
      <Flex direction="column" maxW="680px">
        <Flex align="center" mb="20px">
          <FormLabel flex="1">Template Name:</FormLabel>
          <Input w="80%" type="text" placeholder="Enter the template name" value={formData.templateName} onChange={(e)=>{setSummaryData({...summaryData,template_name: e.target.value});setFormData({...formData,templateName: e.target.value})}}/>
        </Flex>

        <Flex align="center" mb="20px">
          <FormLabel flex="1">Project Type:</FormLabel>
          <Menu >
            <MenuButton w="80%" as={Button} variant="outline" colorScheme="gray" rightIcon={<ChevronDownIcon />}>
              {formData.projectType}
            </MenuButton>
            <MenuList>
                {
                    projectType && projectType.map((val,ind)=> 
                      <MenuItem key={ind} onClick={() => {setFormData({...formData,projectType: val.name}); setSummaryData({...summaryData,template_type_id: val._id})}}>{val.name}</MenuItem>)
                }
            </MenuList>
          </Menu>
        </Flex>

        <Flex align="center" mb="20px">
          <FormLabel flex="1">Segment:</FormLabel>
          <Menu >
            <MenuButton w="80%" as={Button} variant="outline" colorScheme="gray" rightIcon={<ChevronDownIcon />}>
            {formData.segment.length > 0 ? formData.segment.map((segment, index) => (
              <span key={segment}>
                {segment}
                {index !== formData.segment.length - 1 && ', '}
              </span>
            )): "Select one or more options"}
            </MenuButton>
            <MenuList>
            {
              segment &&
              segment.map((val, ind) => (
                <HStack pl='12px' key={val._id}>
                  <Checkbox
                    spacing={2}
                    size='md'
                    colorScheme='green'
                    isChecked={selectedSegments.includes(val._id)}
                    onChange={() => handleSegmentChange(val)}
                  >
                    {val.name}
                  </Checkbox>
                </HStack>
              ))
              // <MenuItem key={ind} onClick={() => {setFormData({...formData,segment: val.name}); setSummaryData({...summaryData,template_segment_id: val._id})}}>{val.name}</MenuItem>)
            }

            </MenuList>
          </Menu>
        </Flex>

        <Flex align="center" mb="20px">
          <FormLabel flex="1">Industry:</FormLabel>
          <Menu >
            <MenuButton w="80%" as={Button} variant="outline" colorScheme="gray" rightIcon={<ChevronDownIcon />}>
              {formData.industry.length > 0 ? formData.industry.map((industry,ind)=>(
                <span key={industry}>{industry}
                {ind !== formData.industry.length - 1 && ','}
                </span>
              )): "Select one or more options"}
            </MenuButton>
            <MenuList>
                {
                    industry && 
                    industry.map((val,ind)=> (
                      <HStack pl='12px' key={val._id}>
                      <Checkbox
                        spacing={2}
                        size='md'
                        colorScheme='green'
                        isChecked={selectedIndustries.includes(val._id)}
                        onChange={() => handleIndustryChange(val)}
                      >
                        {val.name}
                      </Checkbox>
                    </HStack>
                    ))
                    // <MenuItem key={ind} onClick={() => {setFormData({...formData,industry: val.name}); setSummaryData({...summaryData,template_industry_id: val._id})}}>{val.name}</MenuItem>)
                }
            </MenuList>
          </Menu>
        </Flex>

        <Flex align="center" mb="20px">
          <FormLabel flex="1">Use Case:</FormLabel>
          <Textarea w="80%" placeholder="Enter the use case" value={formData.useCase} onChange={(e) => {setFormData({...formData,useCase: e.target.value}); setSummaryData({...summaryData,template_usecase: e.target.value})}}/>
        </Flex>
      </Flex>
  );
};

export default DefineProject;
