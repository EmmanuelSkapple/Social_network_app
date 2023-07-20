import axios from 'axios';

 const serverUrl = 'https://lyfelab.org';
// const serverUrl = 'http://192.168.0.92:3000';

// eslint-disable-next-line consistent-return
export  async function uploadFileStorage(
  file: any,
  pathToSave: string,
  rangeInit: number,
  rangeFinish: number,
  dispatch: any,
  extSource: string,
  typePost: string,
) {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: file,
      name: 'video.mov',
      type: getTypeSource(extSource, typePost),
    } as unknown as Blob);

    formData.append('pathToSave', pathToSave);
    formData.append('typePost', typePost);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // eslint-disable-next-line max-len
        onUploadProgress: (progressEvent: any) => onUploadProgress(progressEvent, rangeInit, rangeFinish, dispatch),
      };
      const req = await axios.post(
        `${serverUrl}/upload-file-to-storage`,
        formData,
        config,
      );
      dispatch({
        type: 'setUploadVideo',
        payload: { status: 1, progress: 0.7 },
      });

      if (req.data.status === 200) {
        return req.data.filePath;
      }
      return '';
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('error en sendFile', e);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

const getTypeSource = (extSource: string, typePost: string) => {
  const type = typePost === 'Video' ? 'video' : typePost === 'Photo' ? 'image' : 'audio';
  return `${type}/${extSource}`;
};

const onUploadProgress = (
  progressEvent: any,
  rangeInit: number,
  rangeFinish: number,
  dispatch: any,
) => {
  const rateTotal = (rangeFinish - rangeInit) as number;
  console.log('====================================');
  console.log(progressEvent.total);
  console.log('====================================');
  const porcentUpload = ((parseFloat(progressEvent.loaded).toFixed(2) as any)/ parseInt(progressEvent.total, 10)) as any as number;
  const increment = (rateTotal * porcentUpload).toFixed(2);
  dispatch({
    type: 'setUploadVideo',
    payload: { status: 1, progress: (rangeInit+parseFloat(increment)) as number },
  });
};
