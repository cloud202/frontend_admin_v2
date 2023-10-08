import React from 'react'
import '../../../css/admin/fileInput.css'
import { useState } from "react"
import upload from '../../../img/cloudUpload.jpg'
import { Button, Flex, IconButton, useToast } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import AWS from "aws-sdk";

const Upload = ({setLinks,type,fileName,setFileName}) => {
  const toast = useToast();
  const [file, setFile] = useState(null);

  const uploadFile = async (file) => {
    

    const S3_BUCKET= process.env.REACT_APP_BUCKET_NAME;
    const REGION= process.env.REACT_APP_REGION;

    // S3 Credentials
    AWS.config.update({
      accessKeyId: process.env.REACT_APP_ACCESS,
      secretAccessKey: process.env.REACT_APP_SECRET,
    });
    const s3 = new AWS.S3({
      params: { Bucket: S3_BUCKET },
      region: REGION
    });

    // Files Parameters
    // if(!file.name) return;
    console.log('File',file.name);
    if(!file.name)  return ;

    const params = {
      Bucket: S3_BUCKET,
      Key: file.name,
      Body: file
    };

    // Uploading file to s3

    var upload = s3
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        // File uploading progress
        console.log(
          "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
        );
        
      })
      .promise();

    await upload.then((err, data) => {
      console.log(err);
      console.log(`https://s3.eu-west-1.amazonaws.com/modx-1.0/${params.Key}`);
      setLinks((prevState)=> ( {
        ...prevState,
        [type]: [...prevState[type],`https://s3.eu-west-1.amazonaws.com/modx-1.0/${params.Key}`]
      }))

      // Fille successfully uploaded
      toast({
        title: "File Uploaded Successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    });
  };

  const handleFileChange = (e) => {
    handleFileName(e);
    const files = e.target.files[0];
    setFile(files);
    uploadFile(e.target.files[0])
  };

  const handleFileName = (e) => {
    if(!e.target.files) return;

      const newFiles = Array.from(e.target.files);
      
      setFileName((prevState) => ({
        ...prevState,
        [type]: [...prevState[type],...newFiles],
      }));
      
    }

    const handleDeleteFile = (index) => {
        // const updatedFiles = [...fileName];
        // updatedFiles.splice(index, 1);
        // setFileName(updatedFiles);

        setFileName((prevState) => ({
          ...prevState,
          [type]: prevState[type].filter((item,ind) => ind !== index),
        }));
        
        
        
        // const updatedFilesTemp = [...file];
        // updatedFilesTemp.splice(index,1);
        setFile("");

        setLinks((prevState) => {
          const updatedTypeArray = prevState[type].filter((item, ind) => ind !== index);
          return {
            ...prevState,
            [type]: updatedTypeArray,
          };
        });
        

      };

      setTimeout(() => {
        console.log('Files',fileName);
      }, 3000);
  return (
    <>
    <div className='wrapper'>
          <div className="upload-btn-wrapper">
            <img src={upload} className="img"/>
            <button className="btn">Select File to Upload</button>
            <input type="file" name="myfile" onChange={(e)=>{handleFileChange(e);}}/>
          </div>

          <Flex flexDir='column' >
            {/* {
              fileName[type].length>0 && fileName[type].map((files, index) => (
                <Button key={files+index} mb='4px' onClick={()=> handleDeleteFile(index)} rightIcon={<CloseIcon/>} size='xs'>{files.name}</Button>
            ))} */}

            {Array.isArray(fileName[type]) && fileName[type].length > 0 && fileName[type].map((files, index) => (
              <Button key={files.name + index} mb='4px' onClick={() => handleDeleteFile(index)} rightIcon={<CloseIcon/>} size='xs'>{files.name}</Button>
            ))}


            {/* {file && file.map((fileName, index) => (
                <Button key={file+index} mb='4px' onClick={()=> handleDeleteFile(index)} rightIcon={<CloseIcon/>} size='xs'>{fileName.name}</Button>
            ))} */}
            {/* {file &&
                <Button mb='4px' onClick={(event)=> handleDeleteFile(event)} rightIcon={<CloseIcon/>} size='xs'>{file['name']? file['name']: ""}</Button>
            } */}
            </Flex>
    </div>
    
  </>
  )
}

export default Upload
