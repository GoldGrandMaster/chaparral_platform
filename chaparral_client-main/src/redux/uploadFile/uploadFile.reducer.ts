import axios from 'axios'
import uploadFileTypes from './uploadFile.types'
import { modifyFiles } from './uploadFile.utils'
import { STATUS_UPLOAD } from '../../constants'
interface FileProgressItem {
  id: any;
  file: any; // You can replace 'any' with a more specific type if desired
  progress: any;
  cancelSource: any; // Replace 'any' with the appropriate type for your cancel source
  status: any;
}

interface FileProgress {
  [id: number]: FileProgressItem;
}

interface InitialState {
  fileProgress: FileProgress;
}
const INITIAL_STATE: InitialState = {
  fileProgress: {
    // format will be like below
    // 1: {
    //   id: 1,
    //   file,
    //   progress: 0,
    //   cancelSource: source,
    //   status: 0,
    // },
  },
}

const fileProgressReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case uploadFileTypes.SET_UPLOAD_FILE:
      return {
        ...state,
        fileProgress: {
          ...state.fileProgress,
          ...modifyFiles(state.fileProgress, action.payload),
        },
      }

    case uploadFileTypes.SET_UPLOAD_PROGRESS:
      return {
        ...state,
        fileProgress: {
          ...state.fileProgress,
          [action.payload.id]: {
            ...state.fileProgress[action.payload.id],
            progress: action.payload.progress,
          },
        },
      }

    case uploadFileTypes.SUCCESS_UPLOAD_FILE:
      return {
        ...state,
        fileProgress: {
          ...state.fileProgress,
          [action.payload]: {
            ...state.fileProgress[action.payload],
            status: STATUS_UPLOAD.success,
          },
        },
      }

    case uploadFileTypes.FAILURE_UPLOAD_FILE:
      return {
        ...state,
        fileProgress: {
          ...state.fileProgress,
          [action.payload]: {
            ...state.fileProgress[action.payload],
            status: STATUS_UPLOAD.failed,
            progress: 0,
          },
        },
      }

    case uploadFileTypes.RETRY_UPLOAD_FILE:
      const CancelToken = axios.CancelToken
      const cancelSource = CancelToken.source()

      return {
        ...state,
        fileProgress: {
          ...state.fileProgress,
          [action.payload]: {
            ...state.fileProgress[action.payload],
            status: STATUS_UPLOAD.uploading,
            progress: 0,
            cancelSource,
          }
        }
      }

    default:
      return state
  }
}

export default fileProgressReducer
