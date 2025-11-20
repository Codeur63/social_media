import {
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Alert
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import ScreenWrapper from '@/components/screenWrapper';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Image } from 'expo-image';
import { getSupabaseFileUrl, uploadFile } from '@/services/imageServices';
import RichTextEditor from '@/components/RichTextEditor';
import { useLocalSearchParams, useRouter } from 'expo-router';
import GalleryIcon from '@/components/icons/GalleryIcon';
import VideoIcon from '@/components/icons/VideoIcon';
import Button from '@/components/Button';
import * as ImagePicker from 'expo-image-picker';
import TrashIcon from '@/components/icons/TrashIcon';
import {Video} from 'expo-av';
import {createOrUpdatePost} from '@/services/postServices';

const NewPost = () => {
  const { user } = useAuth();
  const post = useLocalSearchParams();
  const router = useRouter();
  const bodyRef = useRef('');
  const editorRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const imageSource = user?.image ? getSupabaseFileUrl(user.image) : null;
  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || '?';

  useEffect(()=>{
    if(post && post.id){
      bodyRef.current = post.body
      setFile(post.file || null);
      setTimeout(()=>{
        editorRef?.current?.setContentHTML(post.body)
      },300)
    }
  },[post.body])
  console.log('post ', post.body)

  const onPick = async (isImage) => {
    const mediaConfig = {
      mediaTypes: isImage
        ? ImagePicker.MediaTypeOptions.Images
        : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: isImage ? 0.7 : undefined,
    };

    const result = await ImagePicker.launchImageLibraryAsync(mediaConfig);

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setFile(asset); // on garde l'objet complet
    }
  };

  const isLocalFile = (file) => {
    return file && typeof file === 'object' && 'uri' in file;
  };

  const getFileType = (file) => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.type?.startsWith('video') ? 'video' : 'image';
    }
    if (typeof file === 'string' && file.includes('postImage')) {
      return 'image';
    }
    return 'video';
  };

  const getFileUri = (file) => {
    if (!file) return null;
    if (isLocalFile(file)) return file.uri;
    const remote = getSupabaseFileUrl(file);
    return remote?.uri ?? null;
  };

  const onSubmit = async () => {

    let data = {
      file,
      body:bodyRef.current,
      userId:user?.id
    }

    if(post&& post.id) data.id = post.id || null;

    //create post
    if(bodyRef.current || file){

      setLoading(true);
      const postRes = await createOrUpdatePost(data);
      setLoading(false);0
      if(postRes.success){
        router.push('/home');
        bodyRef.current = ''
        router.back();
      } else {
        Alert.alert('Post', 'Please try again!')
      }
      router.back();
    } else{
      Alert.alert('Post', 'Please choose an image or enter a text')
    }

  };

  return (
    <ScreenWrapper>
      <View className="pb-10">
        <Header title="Create Post" showButton />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={80}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bouncesZoom={true}
          >
            {/* Avatar */}
            <View className="mt-3 flex-row items-center gap-5">
              {user?.image ? (
                <Image
                  source={imageSource}
                  transition={100}
                  style={{ width: 50, height: 50, borderRadius: 10 }}
                  contentFit="cover"
                />
              ) : (
                <View
                  className="justify-center items-center bg-green-600"
                  style={{ width: 80, height: 80, borderRadius: 16 }}
                >
                  <Text className="font-bold text-white" style={{ fontSize: 40 }}>
                    {firstLetter}
                  </Text>
                </View>
              )}
              <View>
                <Text className="font-semibold text-black text-2xl">{user?.name}</Text>
                <Text className="text-gray-500 text-md">{user?.pseudo}</Text>
              </View>
            </View>

            {/* Rich Text Editor */}
            <View className="mt-5">
              <RichTextEditor
                editorRef={editorRef}                
                file={file}
                onChange={(body) => (bodyRef.current = body)}
              />
            </View>

            {/* File Preview */}
            {file && (
              <View className="mt-5 w-full">
                {getFileType(file) === 'video' ? (
                  <Video
                    style={{}}
                    source={{uri : getFileUri(file)}}
                    useNativeControls
                    isLooping

                   />
                ) : (
                  <Image
                    source={{ uri: getFileUri(file) }}
                    transition={100}
                    style={{ minWidth: 100, height: 150, borderRadius:16}}
                    contentFit='cover'
                    
                  />
                )}

                <Pressable className='absolute top-5 right-5' onPress={()=>setFile(null)}>
                  <TrashIcon color={'white'} size={20} bg={'bg-red-300'} />
                </Pressable>
              </View>
            )}



            {/* Media Picker */}
            <View className="flex-row border border-gray-300 mt-5 rounded-2xl py-5 px-5 items-center justify-between">
              <Text className="text-base text-black">Ajouter un média</Text>
              <View className="flex-row items-center gap-5">
                <TouchableOpacity onPress={() => onPick(true)}>
                  <GalleryIcon />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPick(false)}>
                  <VideoIcon size={26} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}

            <Button
              title={post && post.id ? "Update": 'Post'}
              loading={loading}
              hasShadow={false}
              buttonStyle="w-full bg-green-600 rounded-xl py-4 px-4 mt-5"
              textStyle="text-white font-bold text-2xl "
              onPress={onSubmit}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ScreenWrapper>
  );
};

export default NewPost;
