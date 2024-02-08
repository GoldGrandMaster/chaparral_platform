import axios from 'axios'
import uploadFileTypes from './uploadFile.types'

export const setUploadFile = (data: any, project_id: any) => ({
  type: uploadFileTypes.SET_UPLOAD_FILE,
  payload: { data, project_id },
})

export const setUploadProgress = (id: any, progress: any) => ({
  type: uploadFileTypes.SET_UPLOAD_PROGRESS,
  payload: {
    id,
    progress,
  },
})

export const successUploadFile = (id: any) => ({
  type: uploadFileTypes.SUCCESS_UPLOAD_FILE,
  payload: id,
})

export const failureUploadFile = (id: any) => ({
  type: uploadFileTypes.FAILURE_UPLOAD_FILE,
  payload: id,
})

export const uploadFile = (files: any) => (dispatch: any) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return;
  }
  if (files.length) {
    files.forEach(async (file: any) => {
      const formPayload = new FormData()
      formPayload.append('file', file.file)
      formPayload.append('project_id', file.project_id)

      try {
        await axios({
          baseURL: 'http://localhost:8080/api/projects',
          url: '/upload',
          headers: {
            Authorization: `Bearer ${token}`
          },
          method: 'post',
          data: formPayload,
          cancelToken: file.cancelSource.token,
          onUploadProgress: progress => {
            const { loaded, total } = progress

            const percentageProgress = Math.floor((loaded / (total != undefined ? total : 1)) * 100)
            dispatch(setUploadProgress(file.id, percentageProgress))
          },
        })
        dispatch(successUploadFile(file.id))
      } catch (error) {
        if (axios.isCancel(error)) {
          // Do something when user cancel upload
          console.log('cancelled by user')
        }
        dispatch(failureUploadFile(file.id))
      }
    })
  }
}

export const retryUpload = (id: any) => (dispatch: any, getState: any) => {
  dispatch({
    type: uploadFileTypes.RETRY_UPLOAD_FILE,
    payload: id,
  })

  const { fileProgress } = getState().UploadFile

  const reuploadFile = [fileProgress[id]]

  dispatch(uploadFile(reuploadFile))
}
