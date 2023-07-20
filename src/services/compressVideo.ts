import {
  FFmpegKit,
  FFmpegKitConfig,
  FFprobeKit,
} from 'ffmpeg-kit-react-native';
import * as FileSystem from 'expo-file-system';
import { uploadFileStorage } from './StorageFiles';
import * as MediaLibrary from 'expo-media-library';
var RNFS = require('react-native-fs');

export const compressVideo = async (
  videoUrl: string,
  duration: number,
  pathToSave: string,
  rangeInit: number,
  rangeFinish: number,
  dispatch: any,
  extSource: string,
  typePost: string,
) => {
  try {
    if(await validForCompress(videoUrl,duration)){
      console.log("pas 2");

      const postDir = `${FileSystem.cacheDirectory}matter/`;
      const outputPath = `${postDir}post_upload.MOV`;
      await ensureDirExists(postDir);
      FFmpegKitConfig.enableStatisticsCallback((statisticsData) =>
        progressCallBack(statisticsData, duration,0.11, 0.40, dispatch)
      );
      await FFmpegKit.execute(
        `-y -i ${videoUrl} -c:v libx264 -vf "scale=720:-2" -preset slow -crf 23 -c:a copy  ${outputPath}`
      );
      const session = await FFprobeKit.getMediaInformation(outputPath);
    let reqFile = await RNFS.stat(outputPath);
      let urlStoragePost = await uploadFileStorage(outputPath,pathToSave,0.40,0.69,dispatch,extSource,typePost);
      return urlStoragePost;
    }else{
      let urlStoragePost = await uploadFileStorage(videoUrl,pathToSave,0.40,0.69,dispatch,extSource,typePost);
      return urlStoragePost;
    }
  
  } catch (error) {
    console.log('error in compressVideo: ', error);
    return { status: 500, uri: '' };
  }
};

export const reEncodingVideoList = async(videoList : Array<string>) => {
  let newListOfVideo =[];
  for (const videoUrl of videoList) {
    let encodingVideo = await reEncodingVideo(videoUrl)
    newListOfVideo.push(encodingVideo);
  }
  return newListOfVideo;
}

const reEncodingVideo = async(videoUrl: string) => {
  try {
    const postDir = `${FileSystem.cacheDirectory}matter/`;
    const outputPath = `${postDir + Date.now() }.mov`;
    await ensureDirExists(postDir);
    await FFmpegKit.execute(
      ` -i ${videoUrl} ${outputPath}`
    );
    return(outputPath)
  } catch (error) {
    console.log("Error en mergeVideos",error)
    return('')
  }
}

export const mergeVideos = async(videosUrl: Array<string>) => {
  try {
    const postDir = `${FileSystem.cacheDirectory}matter/`;
    const outputPath = `${postDir}video_merge.mov`;
    let exists = await RNFS.exists(outputPath);
    exists &&  await RNFS.unlink(outputPath);
    await ensureDirExists(postDir);
    const textFile = await (await writeTextFileWithAllVideoFiles(videosUrl))  
    const result = await FFmpegKit.execute(`-f concat -safe 0 -i file://${textFile} -c copy  ${outputPath}`)
    const assetInfo = await MediaLibrary.getAssetInfoAsync(outputPath);

    return(outputPath)
  } catch (error) {
    console.log("Error en mergeVideos",error)
    return('')
  }
}

const validForCompress = async(path: string, duration: number) => {
  let  durationNumber = duration/1000
  // let reqFile = {size:3000};
  let reqFile = await RNFS.stat(path);
  let sizeNumber = reqFile.size/1000000;
  console.log('sizeNumber',reqFile);
  console.log('durationNumber',durationNumber);
  return((sizeNumber/durationNumber) >=0.4 )
}

async function progressCallBack(statisticsData: any, duration: number, rangeInit: number,rangeFinish: number,dispatch: any) {
  const time = statisticsData.getTime();
  let progress = parseInt(time) / duration;
  onUploadProgress(progress,rangeInit,rangeFinish,dispatch);
}
async function ensureDirExists(postDir: string) {
  const dirInfo = await FileSystem.getInfoAsync(postDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(postDir, { intermediates: true });
  }
}

const onUploadProgress = (
  progress: number,
  rangeInit: number,
  rangeFinish: number,
  dispatch: any,
) => {
  const rateTotal = (rangeFinish - rangeInit) as number;
  const increment = (rateTotal * progress).toFixed(2);
  dispatch({
    type: 'setUploadVideo',
    payload: { status: 1, progress: (rangeInit+parseFloat(increment)) as number },
  });
};



const writeTextFileWithAllVideoFiles = async (filePaths : Array<string>) => {
  var path = RNFS.DocumentDirectoryPath + '/videoList.txt';
  
  var fileContent = ''
  filePaths.forEach((path : any) => {
  console.log("fileplay1",path);
    fileContent += `file '${path}'\r\n`;
  });
  console.log(fileContent);
  return RNFS.writeFile(path, fileContent, 'utf8')
  .then((success : AnalyserOptions) => {
     console.log(path)
     if (RNFS.exists(path))
        console.log('FILE WRITTEN!')
     return path
  })
  .catch((err:any) => {
      console.log(err.message)
      return ''
  });  
  }