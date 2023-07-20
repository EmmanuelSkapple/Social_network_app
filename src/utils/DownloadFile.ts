import * as FileSystem from 'expo-file-system';

export async function donwloadFile(uri: string, id: string, postType: string) {
  try {
    const extension = postType === 'Video'
      ? 'mp4'
      : postType === 'Photo'
        ? 'jpg'
        : postType === 'Audio'
          ? 'mp3'
          : null;
    if (extension != null) {
      const postDir = `${FileSystem.cacheDirectory}matter/`;
      const postFileUri = `${postDir}post_${id}.${extension}`;
      await ensureDirExists(postDir);
      const fileReq = await FileSystem.downloadAsync(uri, postFileUri);
      if (fileReq.status === 200) {
        return fileReq.uri;
      }
    }
  } catch (e) {
    console.error("Couldn't download gif files:", e);
  }
}

async function ensureDirExists(postDir: string) {
  const dirInfo = await FileSystem.getInfoAsync(postDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(postDir, { intermediates: true });
  }
}
