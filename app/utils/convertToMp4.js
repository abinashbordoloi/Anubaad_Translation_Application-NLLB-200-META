
// import com.rnfs.RNFSPackage; 

import { FFmpegKit,FFmpegKitConfig } from 'ffmpeg-kit-react-native';

export const convertToMp4 = async (inputPath) => {
  const outputPath = inputPath.replace('.3gp', '.mp4');
  
  const command = `-i ${inputPath} ${outputPath}`;
  
  await FFmpegKit.execute(command).then(async (session) => {
    const returnCode = await session.getReturnCode();
    if (returnCode.isSuccess()) {
      console.log('Conversion successful', outputPath);
    } else {
      console.log('Conversion failed', returnCode);
    }
  });

  return outputPath;
};

