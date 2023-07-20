import { StyleProp, ImageStyle } from 'react-native';
import { CancelPromise } from '../src/modals/PostViewer'
import { MemberData } from './typesGroup';

//AudioReproductor
export interface AudioReproProps {
    audioUri: any;
}

export interface AudioOperation {
    start: () => Promise<any>;
    cancel: CancelPromise;
}


//AudioReproCircleProps
export interface AudioReproCircleProps {
    audioUri: any;
}

//AvatarListView
export interface AvatarListViewProps {
    text?: string;
    withDescription?: boolean;
    description?: string;
    source: any;
    onPress?: Function;
    showDescription?: boolean;
    avatarSize?: number;
    avatarStyle?: StyleProp<any>;
    button?:boolean;
    acctionButton?:Function;
}

//AvatarListStacked
export interface AvatarListStackedProps {
    members : MemberData[];
    maxAvatars: number | undefined;
    size : number | undefined
}

//CardDescription
export interface PosterData {
    id: string;
    name: string;
    photo: string;
}

export interface CardDescriptionProps {
    inverted?: boolean;
    setViewPostModal?: (value : boolean)=> void;
    description: string;
    posterData: PosterData;
    typePost: string;
    videoUri?: string;
}

//CardGroup
export interface CardGroupprops {
    groupData: any;
}


//CardIcons
export interface CardIconsProps {
    styleContainer?: StyleProp<any>;
    iconSize: number;
    typePost: string;
    iconColor?: string;
    comments: number;
    onPressShare: () => void;
    onPressDownload: () => void;
    onPressComment: () => void;
    progressLoading: number
}

//Carousel
export interface CarouselProps {
    arrayOfAnswers: [];
    refCarousel: any;
    setIndexCarousel: (index: number) => void;
}


//CircleImage
export interface CircleImageProps {
    source: any;
    size: number;
    border?: boolean;
    style?: ImageStyle;
}


//CircularProgress
export interface CircularPogressProps {
    progress: any;
}

//Divider
export interface DividerProp {
    positive?: boolean;
}


//FilterItem
export interface FilterItemProps {
    isActive: boolean;
    text: string;
    flag?: string;
    onPress: any;
}

//GalleryAlbums
export interface GalleryAlbumsProps {
    title: string;
    setShow: (show: boolean) => void;
    show: boolean;
    data: Array<any>;
    setAlbum: (item: any) => void;
    loadPhotos: (item: any) => void;
    loadCamRoll: (type: string) => void;
}

//GenericCard
export interface GenericCardProps {
    iconName?: string;
    title: string;
    subTitle?: string;
    notificationNumber?: number;
    notificationActive: boolean;
}

//Header
export interface HeaderProps {
    screen: string;
    onBack?: Function;
    onPressTitle?: Function;
    groupData?: any;
    showAvatars?: boolean;
    setShowAvatars?: (value: boolean) => void;
}

//ImagePicker
export interface CustomImagePickerProps {
    setImageCallback: Function;
    showVideos: boolean;
    uploadCallback: Function;
    setShow: Function;
}

export interface LoadingProps {
    background?: string;
    color?: string;
}

//ItemsContact
export interface ItemsContactSmallProps {
    contactData: any;
}

//KeyboardAvoidingWrapper
export interface KeyboardAvoidingWrapperProps {
    children: React.ReactNode;
    styleKeyboardAvoiding?: StyleProp<any>;
}

//KeyboardSimpleWrapper
export interface KeyboardSimpleWrapperProps {
    children: React.ReactNode;
    styleKeyboardAvoiding?: StyleProp<any>;
}

//ListMembers
export interface ListMembersProps {
    currentGroup: any;
    onAbout?: () => void;
}


//Loader
export interface LoaderProps {
    progress: number;
    text: string;
}

export interface InfiniteLoaderProps {
    time: number;
}

//Loading
export interface LoadingProps {
    background?: string;
    color?: string;
}

//MoreItem
export interface MoreItemProps {
    cant: number;
    action: Function;
}


//NotificationItem
export interface NotificationItemProps {
    itemData: any;
    deleteItem: Function;
}

//Post
export interface PostProps {
    postData: any;
    theme?: any;
    stylePost?: StyleProp<any>;
    currentPostId: string;
    setCurrentPostId: Function;
}

//PostRecents
export interface PostProps {
    postData: any;
}

//PostVideoOrImage
export interface PostVideoOrImageProps {
    postData?: any;
    posterData: PosterData;
    typePost: string;
    comments: number;
    shareOption: () => void;
    downloadOption: () => void;
    setShowComments: (value: boolean) => void;
    setViewPostModal: (value: boolean) => void;
    children: React.ReactNode;
}

//Profiel Post
export interface PostGridProps {
    filter: string;
    idUser: string;
}

//TopBar
export interface TopBarProps {
    leftText?: string;
    centerText?: string;
    backButton?: boolean;
    backAction?: Function;
    rightButton?: boolean;
    rightButtonPrimary?: boolean;
    rightButtonText?: string;
    rightAction?: Function;
    divider?: boolean;
    children?: any;
    css?: any;
}

//UsersGroup
export interface UsersGroupProps {
    membersProp: Array<string>;
    groupData: any;
}

export interface VideoControlProps {
    playbackInstance: any;
    playbackInstanceInfo: any;
    togglePlay: any;
}
