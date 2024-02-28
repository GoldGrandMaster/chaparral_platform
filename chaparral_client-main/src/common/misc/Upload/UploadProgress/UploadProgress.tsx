import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { size, toArray } from 'lodash';

import { uploadFile, retryUpload } from "@/redux/uploadFile/uploadFile.actions";
import UploadFolderItem from '../UploadItem/UploadFolderItem';
import Styles from './UploadProgress.module.css';
import UploadFileItem from '../UploadItem/UploadFileItem';
import { STATUS_UPLOAD } from '@/constants';
interface DirMap {
  [key: string]: any[];
}

const UploadProgress = () => {
  const dispatch = useDispatch();
  const fileProgress = useSelector((state: any) => state.UploadFile.fileProgress);
  const uploadedFileAmount = size(fileProgress);
  const [finalOut, setFinalOut] = useState<any[]>([]);
  useEffect(() => {
    const fileToUpload = toArray(fileProgress).filter((file: any) => file.progress === 0 && file.status === STATUS_UPLOAD.uploading)
    dispatch<any>(uploadFile(fileToUpload));

  }, [uploadedFileAmount])
  useEffect(() => {
    const fO: any[] = [];
    const dO: DirMap = {};
    const combineOut: any[] = [];
    toArray(fileProgress).forEach(fileInfo => {
      let path: string = Object.getOwnPropertyDescriptor(fileInfo.file, 'path')?.value;
      if (path[0] == '/') path = path.substring(1);
      if (path.includes('/')) {
        const key = path.split('/')[0];
        if (!dO[key]) dO[key] = [];
        dO[key].push(fileInfo);
      } else {
        fO.push(fileInfo);
      }
    });
    fO.forEach(ele => combineOut.push({ type: "file", data: ele }));
    Object.keys(dO).forEach(ele => combineOut.push({ type: "folder", folderName: ele, data: dO[ele] }));
    combineOut.sort((a: any, b: any) => {
      let key1;
      let key2;
      if (a.type == "file") key1 = a.data.id;
      else key1 = a.data[0].id;
      if (b.type == "file") key2 = b.data.id;
      else key2 = b.data[0].id;
      if (key1 > key2) return -1;
      else if (key1 == key2) return 0;
      else return 1;
    });
    // setFilesOnly(fO);
    // setDirsOnly(dO);
    // console.log(combineOut);
    setFinalOut(combineOut);
  }, [fileProgress])

  return uploadedFileAmount > 0 ? (
    <div className={Styles.wrapper}>
      <h4 className='dark:bg-[#0658c2]'>Uploading Files</h4>
      {
        finalOut.map(item => (
          item.type == "file" ?
            <UploadFileItem
              key={item.data.id}
              file={item.data}
              retryUpload={() => dispatch<any>(retryUpload(item.data.id))}
            /> :
            <UploadFolderItem
              key={item.folderName}
              files={item.data}
              folderName={item.folderName}
              retryUpload={() => item.data.forEach((val: any) => { if (val.status != STATUS_UPLOAD.success) dispatch<any>(retryUpload(val.id)) })}
            />
        ))
      }
      {/* {
        filesOnly.map((file: any) => (
          <UploadFileItem
            key={file.id}
            file={file}
            retryUpload={() => dispatch<any>(retryUpload(file.id))}
          />
        ))
      }
      {
        Object.keys(dirsOnly).map(key => (
          <UploadFolderItem
            key={key}
            files={dirsOnly[key]}
            folderName={key}
            retryUpload={() => dirsOnly[key].forEach(val => { if (val.status != STATUS_UPLOAD.success) dispatch<any>(retryUpload(val.id)) })}
          />
        ))
      } */}
      {/* {size(fileProgress)
        ? toArray(fileProgress)
          .map((file: any) => (
            <UploadItem
              key={file.id}
              file={file}
              retryUpload={() => dispatch<any>(retryUpload(file.id))}
            />
          ))
        : null
      } */}
    </div>
  ) : null
}

export default UploadProgress;
