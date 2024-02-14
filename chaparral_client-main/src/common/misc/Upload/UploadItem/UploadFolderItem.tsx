import React, { useMemo } from 'react'
import Styles from './UploadItem.module.css'
import { STATUS_UPLOAD } from '@/constants'
import { FileIcon } from '@radix-ui/react-icons'
import { FolderIcon } from 'lucide-react'


const UploadFolderItem = (props: any) => {
  const files = props.files;
  let status = 0;
  let complete_cnt = 0;
  let progress = 0;
  let total = 0;
  files.forEach((ele: any) => {
    complete_cnt += (ele.status == STATUS_UPLOAD.success ? 1 : 0);
    progress += ele.progress * ele.file.size / 100.0;
    total += ele.file.size;
  });
  if (files.every((ele: any) => ele.status == STATUS_UPLOAD.success))
    status = STATUS_UPLOAD.success;
  else if (files.some((ele: any) => ele.status == STATUS_UPLOAD.uploading)) status = STATUS_UPLOAD.uploading;
  else status = STATUS_UPLOAD.failed;
  const renderIcon = useMemo(() => {
    const cancelUpload = () => {
      files.forEach((ele: any) => {
        if (ele.status != STATUS_UPLOAD.success) ele.cancelSource.cancel('Cancelled by user')
      });
    }
    if (status === STATUS_UPLOAD.uploading) {
      return (
        <span
          title="Cancel upload"
          style={{ color: 'red' }}
          onClick={cancelUpload}
        >
          ✕
        </span>
      )
    } else if (status === STATUS_UPLOAD.success) {
      return (
        <span
          title="Success upload"
          style={{ color: 'green', cursor: 'initial' }}
        >
          ✓
        </span>
      )
    } else if (status === STATUS_UPLOAD.failed) {
      return (
        <span
          title="Retry upload"
          style={{ color: 'orange' }}
          onClick={props.retryUpload}
        >
          ↩︎
        </span>
      )
    }

    return null
  }, [status])
  return (
    <div className={Styles.wrapperItem + " bg-white dark:bg-black"}>
      <div className={Styles.leftSide}>
        <div className={Styles.progressBar}>
          <div style={{ width: `${Math.floor(progress * 100 / total)}%` }} />
        </div>
        <div className='flex flex-row align-center gap-x-1'>
          <FolderIcon height={"100%"} className='shrink-0' />
          <label className='whitespace-nowrap overflow-hidden overflow-ellipsis'
            title={props.folderName + ' ' + complete_cnt + '/' + files.length}>
            {props.folderName + ' ' + complete_cnt + '/' + files.length}
          </label>
        </div>
      </div>
      <div className={Styles.rightSide}>
        {renderIcon}
        <span>{Math.floor(progress * 100 / total)}%</span>
      </div>
    </div>
  )
}

export default UploadFolderItem
