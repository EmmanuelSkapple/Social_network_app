import { FlipType, manipulateAsync, SaveFormat } from "expo-image-manipulator";

export const compressAndFlipImage = async (uriPhoto : string,cameraType:string) => {
  const flipPhoto = await manipulateAsync(
    uriPhoto,
    cameraType == 'front'? [{ flip: FlipType.Horizontal }]:[],
    { compress: 0.3, format: SaveFormat.JPEG },
  );
  return flipPhoto;
}