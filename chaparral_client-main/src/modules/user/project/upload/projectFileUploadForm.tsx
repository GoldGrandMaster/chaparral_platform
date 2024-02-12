import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/common/components/ui/button';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import Dropzone, { useDropzone } from 'react-dropzone';
import UploadProgress from '@/common/misc/Upload/UploadProgress/UploadProgress';
import { useDispatch } from 'react-redux';
import { setUploadFile } from '@/redux/uploadFile/uploadFile.actions';
import { EditIcon, FileIcon, FolderIcon, UploadIcon } from 'lucide-react';

const Label = styled.label`
  font-weight: bold;
`;

const StyledForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 500px;
`;

const ProjectFileUploadForm = () => {
    const dispatch = useDispatch();
    const [curProject, setCurProject] = useState([]);
    const [isInDropzone, setIsInDropzone] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const filterdFiles: File[] = [];
    const handleFileUpload = (filelist: File[]) => {
        console.log(filelist);
        for (let i = 0; i < filelist.length; i++) {
            if (filelist[i].name != 'analysis.tdf' && filelist[i].name != 'analysis.tdf_bin') continue;
            let path: string = Object.getOwnPropertyDescriptor(filelist[i], 'path')?.value;
            if (path[0] == '/') path = path.substring(1);
            if (path.indexOf('/') == path.lastIndexOf('/'))
                filterdFiles.push(filelist[i]);
        }
        // setFiles(filt);
        dispatch(setUploadFile(filterdFiles, curProject[1]));
        // setFiles([]);
    }

    // const handleSubmit = () => {
    //     const token = localStorage.getItem('token');

    //     if (!token) {
    //         // Handle case where token is not available
    //         return;
    //     }
    //     const data = new FormData();
    //     data.append('project_id', JSON.parse(localStorage.getItem('currentProject') || "")[1]);
    //     console.log(files);
    //     for (let i = 0; i < files.length; i++) data.append('files', files[i]);
    //     // data.append('files', files);
    //     const requestOptions = {
    //         method: 'POST',
    //         headers: {
    //             'Authorization': `Bearer ${token}`
    //         },
    //         body: data
    //     };

    //     fetch(config.backend_url + 'projects/upload', requestOptions)
    //         .then(response => {
    //             if (response.ok) return response.json();
    //             throw new Error("There was an error");
    //         })
    //         .then(res => {
    //             // navigate('/user/project/');
    //             toast.success("Successfully uploaded");
    //         })
    //         .catch(error => {
    //             console.error('Error:', error);
    //             toast.error("There was an error uploading files")
    //         });
    // };

    useEffect(() => {
        const curProj = JSON.parse(localStorage.getItem('currentProject') || "");
        setCurProject(curProj);
    }, [])
    return (
        <div className='flex flex-col gap-3 h-full'>
            <p style={{ fontSize: "30px" }}>{curProject[2]}</p>
            <h1>{curProject[3]}</h1>
            <div className='flex gap-3'>
                <Button className="bg-primary-foreground border-[1px] border-solid border-tertiary text-primary"
                    onClick={() => {
                        inputRef.current?.removeAttribute('directory');
                        inputRef.current?.removeAttribute('webkitdirectory');
                        inputRef.current?.removeAttribute('mozdirectory');
                        inputRef.current?.click()
                    }}>
                    <FileIcon></FileIcon>
                    Upload files
                </Button>
                <Button className="bg-primary-foreground border-[1px] border-solid border-tertiary text-primary"
                    onClick={() => {
                        inputRef.current?.setAttribute('directory', '');
                        inputRef.current?.setAttribute('webkitdirectory', '');
                        inputRef.current?.setAttribute('mozdirectory', '');
                        inputRef.current?.click()
                    }}>
                    <FolderIcon></FolderIcon>
                    Upload folder
                </Button>
            </div>
            {/* <MyDropzone></MyDropzone> */}
            <Dropzone
                onDrop={handleFileUpload}
                onDragEnter={() => setIsInDropzone(true)}
                onDragLeave={() => setIsInDropzone(false)}
                onDropAccepted={() => setIsInDropzone(false)}
                noClick
            >
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()} className='h-full pb-[35px]'>
                        <input {...getInputProps()} ref={inputRef} />
                        <div
                            className={`relative flex flex-col gap-[16px] h-full
                        ${isInDropzone ? "border rounded-xl border-4 border-blue-500 dark:bg-gray-800 bg-gray-100" : ""}`}
                        >
                            {files.length > 0 &&
                                Array.from(files).map((file: File, ind: number) => <div key={ind}>- {file.name}</div>)
                            }
                            {isInDropzone &&
                                <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
                                    Drag and Drop files or folders
                                </div>
                            }
                        </div >
                    </div>
                )}
            </Dropzone>
            <UploadProgress />
        </div>
    );
};

export default ProjectFileUploadForm;