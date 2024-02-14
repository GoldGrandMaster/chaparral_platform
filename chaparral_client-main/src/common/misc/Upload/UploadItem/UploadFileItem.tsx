import React, { useMemo } from 'react'
import Styles from './UploadItem.module.css'
import { STATUS_UPLOAD } from '@/constants'
import { FileIcon } from 'lucide-react'


const UploadFileItem = (props: any) => {
  const { file, progress, cancelSource, status } = props.file
  const renderIcon = useMemo(() => {
    const cancelUpload = () => {
      cancelSource.cancel('Cancelled by user')
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
          <div style={{ width: `${progress}%` }} />
        </div>
        <div className='flex flex-row align-center gap-x-1'>
          <FileIcon height={"100%"} className='shrink-0' />
          <label className='whitespace-nowrap overflow-hidden overflow-ellipsis' title={file.name}>{file.name}</label>
        </div>
      </div>
      <div className={Styles.rightSide}>
        {renderIcon}
        <span>{progress}%</span>
      </div>
    </div>
  )
}

export default UploadFileItem
