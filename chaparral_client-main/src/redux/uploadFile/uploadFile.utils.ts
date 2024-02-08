import axios from 'axios'
import { size } from 'lodash'
import { STATUS_UPLOAD } from '@/constants'

export const modifyFiles = (existingFiles: any, payload: any) => {
  let fileToUpload = {}
  let files = payload.data;

  for (let i = 0; i < files.length; i++) {
    const id = size(existingFiles) + i + 1
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()

    fileToUpload = {
      ...fileToUpload,
      [id]: {
        id,
        project_id: payload.project_id,
        file: files[i],
        progress: 0,
        cancelSource: source,
        status: STATUS_UPLOAD.uploading,
      },
    }
  }

  return fileToUpload
}
