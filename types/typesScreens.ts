export interface SenderObjectProps {
  phone: string;
  message: string;
  contactName: string;
}
export interface ButtonProps {
  title: string;
  icon: string;
  accion: any;
}

export interface GalleryPostProps {
  setSourceUri: Function;
}

export interface GroupFeedProps {
  route: {
    params: {
      idGroup: string;
      idPost: string;
    };
  };
}

export interface InfoProps {
  title: string;
  data: number;
}

export interface UserProps {
  name: string;
}

export interface GroupMembersProps {
  route: {
    params: {
      members: Array<string>;
    };
  };
}

export interface HeaderHomeProps {
  currentFilter: string;
  setCurrentFilter: Function;
  groupsArray: Array<any>;
}

export interface ProfileUserProps {
  route: {
    params: {
      idUser: string;
    };
  };
}

export interface PostsHeaderProps {
  postLength: number;
  btnActive: string;
  callBackViewPost: Function;
}

export interface ButtonProps {
  title: string;
  image: object;
  accion: any;
}

export interface SwitchOpcionProps {
  toggleSwitch: Function;
  value: boolean;
  title: string;
  image: object;
}
export interface VideoPreviewProps {
  route: {
    params: {
      source: {
        uri: string;
        width?:number;
        height?:number;
        codec?: undefined;
      };
      typeSource: string;
      videoListOfCamera:Array<string>;
      originOfSource : string;
    };
  };
}
