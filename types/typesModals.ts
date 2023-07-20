import { PosterData } from './typesComponents';

//AuthWithPassword
export interface AuthWithPasswordProps {
  show: boolean;
  setShow: any;
  setIsAuth: any;
}

//GalleryPost
export interface ChooseLanguageProps {
  show: boolean;
  setShow: any;
}

//GalleryPost
export interface GalleryPostProps {
  show: boolean;
  setShow: any;
  fromCamera?:boolean;
}
export interface CustomImageContainerProps {
  setSourceUri: Function;
  setDescription: Function;
  description: string;
}




//ProfileOpcions
export interface ProfileOptionsProps {
  show: boolean;
  edit :Function;
  setShow: any;
}


//GroupsListPost
export interface GroupsListPostProps {
  show: boolean;
  setShow: any;
  SelectGroup: any;
}

//NewAudioRecord
export interface NewAudioRecordProps {
  show: boolean;
  setShow: any;
}

export interface HeaderPostModalProps {
  objAudio: any;
  setShowGroupList: Function;
}

//NewPostsOpcions
export interface NewPostOpcionsProps {
  show: boolean;
  setShow: any;
  goToCameraPost: Function;
  goToMatterStamp: Function;
  goToGalleryPost: Function;
  goToAudioPost: Function;
  // showStamp?: boolean;
}

//NewQuestionOptions
export interface NewQuestionOptionsProps {
  show: boolean;
  setShow: any;
  // currentGroup: string;
  updateQuestions: Function;
}

//PostViewer
export interface PostViewerProps {
  comments?: number;
  description?: string;
  posterData?: PosterData;
  setShow: Function;
  show: boolean;
  type: string;
  uri: string;
  shareOption: () => void;
  downloadOption: () => void;
  postData: any;
}

//ProfileOpcions
export interface GroupOpcionsProps {
  show: boolean;
  setShow: any;
  edit: any;
}

//ShareToNumberPhone
export interface ShareToNumberPhoneProps {
  numberContact: string;
  nameContact: string;
  message: string;
  show: boolean;
  setShow: Function;
}
