import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { decode } from 'base64-arraybuffer';
import { supabase } from '@/lib/supabase';
import { supabaseUrl } from '@/lib/supabase';
import { Alert } from 'react-native';


export const getUserImageSrc = imagePath => {
    if(imagePath){
        return getSupabaseFileUrl(imagePath)
    } 
}

export const getSupabaseFileUrl = filePath =>{
    if(filePath){
        return {uri: `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`}
    }
}

export const uploadFile = async(folderName, fileUri, isImage = true) => {
    try{
        let fileName  = getFilePath(folderName, isImage);
        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {encoding: 'base64'});   
        let imageData = decode(fileBase64); ///array buffer
        let {data,error} = await supabase.storage.from('uploads').upload(fileName, imageData, {
            cacheControl :'3600',
            upsert:false,
            contentType: isImage ? 'image/*' : 'video/*'
        });

        if(error){
            console.log('file upload error :', error)
            return {success:false, msg: 'Could not upload media' }
        }

        console.log('file uploaded successfully :', data)

        return {success:true, data: data.path}

    } catch (error) {
        console.log('file upload error :', error)
        return {success:false, msg: 'Could not upload media' }
    }
}

export const getFilePath = (folderName, isImage) => {
    return `/${folderName}/${new Date().getTime()}${isImage ? '.jpg' : '.png'}`
}

// export const downloadFile = async (url) => {
//   try {
//     const { uri } = await FileSystem.downloadAsync(
//       url,
//       getLocalFilePath(url)
//     );
//     return uri;
//   } catch (error) {
//     console.error("Erreur lors du téléchargement :", error);
//     return null;
//   }
// };

// export const getLocalFilePath = (filePath) => {
//   let fileName = filePath.split('/').pop();
//   return `${FileSystem.documentDirectory}${fileName}`;
// };

export const downloadFile = async (url) => {
    try{
        const {uri} = await FileSystem.downloadAsync(url, FileSystem.documentDirectory + '.jpeg')
        return uri
    } catch(error){
        console.log('file download error :', error)
        return null
    }
}

export const downloadAndShareImage = async (imageUrl, caption) => {
  try {
    // 1. Récupérer le nom du fichier à partir de l'URL
    const fileName = imageUrl.split('/').pop();
    // 2. Construire le chemin local où enregistrer l'image
    const localUri = `${FileSystem.documentDirectory}${fileName}`;

    // 3. Télécharger l'image
    const { uri : imageUri } = await FileSystem.downloadAsync(imageUrl, localUri);

    // 4. Partager l'image
    await Sharing.shareAsync(imageUri, {
      mimeType: 'image/jpeg', // ou 'image/png' selon le type d'image
      dialogTitle: 'Partager l\'image',
      UTI: 'image',
      message: caption,
    });

  } catch (error) {
    console.error("Erreur lors du téléchargement ou du partage :", error);
    Alert.alert("Erreur", "Impossible de télécharger ou partager l'image.");
    return null;
  }
};