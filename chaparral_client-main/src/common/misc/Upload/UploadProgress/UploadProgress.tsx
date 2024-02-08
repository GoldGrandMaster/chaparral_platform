import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { size, toArray } from 'lodash';

import { uploadFile, retryUpload } from "@/redux/uploadFile/uploadFile.actions";
import UploadItem from '../UploadItem/UploadItem';
import Styles from './UploadProgress.module.css';

const UploadProgress = () => {
  const dispatch = useDispatch();
  const fileProgress = useSelector((state: any) => state.UploadFile.fileProgress);
  const uploadedFileAmount = size(fileProgress)
  useEffect(() => {
    const fileToUpload = toArray(fileProgress).filter((file: any) => file.progress === 0)
    dispatch<any>(uploadFile(fileToUpload));
  }, [uploadedFileAmount])

  return uploadedFileAmount > 0 ? (
    <div className={Styles.wrapper}>
      <h4 className='dark:bg-[#0658c2]'>Uploading Files</h4>
      {size(fileProgress)
        ? toArray(fileProgress)
          .map((file: any) => (
            <UploadItem
              key={file.id}
              file={file}
              retryUpload={() => dispatch<any>(retryUpload(file.id))}
            />
          ))
        : null}
    </div>
  ) : null
}

export default UploadProgress;
