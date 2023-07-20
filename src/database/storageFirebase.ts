import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './FirebaseConfig';

export const uploadSource = async (uriSource: string, pathStorage: string) => {
  try {
    if (uriSource && pathStorage) {
      const fetchedVideo = await fetch(uriSource);
      
      const videoBlob = await fetchedVideo.blob();
      // const datevideo = new Date().getTime().toString();
      const videoRef = ref(storage, pathStorage);
      const uploadTask = await uploadBytes(videoRef, videoBlob);
      const urlStore = await getDownloadURL(uploadTask.ref);
      return urlStore;
    }
    console.log('error en uploadVideo storage', 'Datos incopletos');
  } catch (error) {
    console.log('error en uploadVideo storage', error);
  }
};
