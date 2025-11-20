import { Text, View, ScrollView, Pressable, TextInput, Alert, KeyboardAvoidingView, Platform} from 'react-native'
import React, {useEffect, useState} from 'react'
import ScreenWrapper from '@/components/screenWrapper'
import Header from '@/components/Header'
import { useAuth } from '@/contexts/AuthContext'
import {Image} from 'expo-image' 
import {useRouter} from 'expo-router'
import Pencil from '@/components/icons/Pencil'
import Person from '@/components/icons/Person'
import Phone from '@/components/icons/Phone';
import Home from '@/components/icons/Home';
import Dribble from '@/components/icons/Dribble';
import Button from '@/components/Button'
import { updateUser } from '@/services/userService';
import * as ImagePicker from 'expo-image-picker';
import { uploadFile } from '@/services/imageServices';
import {getSupabaseFileUrl} from '@/services/imageServices';


const EditProfile= () => {

  const {user:currentUser, setUserData} = useAuth();

  const router = useRouter();

  const [loading, setLoading] = useState(false)

  const [user, setUser]  = useState({
    name: currentUser?.name,
    phoneNumber: currentUser?.phoneNumber,
    bio: currentUser?.bio,
    image: currentUser?.image,
    address : currentUser?.address,
    pseudo : currentUser?.pseudo
  })

  useEffect ( ()=>{
    if(currentUser){
      setUser({
        name: currentUser?.name || '',
        phoneNumber: currentUser?.phoneNumber || '',
        bio: currentUser?.bio || '',
        image: currentUser?.image || '',
        address : currentUser?.address || '',
        pseudo : currentUser?.pseudo || ''
      })
    }
  }, [currentUser])

  if(!currentUser){
    return <Text>Chargement de l'utilisatuer</Text>;
  }

  const first_letter = user?.name.charAt(0).toUpperCase();

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    })  


    if (result.assets && result.assets.length > 0) {
      const fileUri = result.assets[0].uri;
      setUser({ ...user, image: fileUri });
      await uploadFile('profiles', fileUri, true);
    }

  }   
  

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'Autorise l’accès à la galerie pour choisir une image.');
      }
    })();
  }, []);


  const onSubmit = async () =>{
    let userData = {...user};
    let {name, phoneNumber, pseudo, address, bio , image } = userData;
    
    if(!name || !phoneNumber  || !bio || !image ){
      Alert.alert('Profil', 'Please fill all the fields')
      return;
    }
    setLoading(true);

    if (typeof image === 'string' && image.startsWith('file://')) {
      let imageRes = await uploadFile('profiles', image, true);
      if (imageRes.success) {
        userData.image = imageRes.data;
      } else {
        Alert.alert('Image', 'Failed to upload image');
      }
    }

    //update user
     const res = await updateUser(currentUser?.id, userData);
     setLoading(false);  
     console.log(res);
     if(res.success){
      setUserData({...currentUser, ...userData});
      router.back();
     }
  }
   
    return (
      <ScreenWrapper>    
        <View className=''>
          <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={80} 
        >
          <ScrollView className='' showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" bounces={true}>
          <Header title='Edit Profile' showButton={true}/>

          {/* form   */}
          <View className='mt-5'>
              <View className='flex justify-center items-center'>
                {
                  user?.image ? (
                    <View className='relative justify-center items-center rounded-2xl bg-green-600 ' style={{width: 80, height: 80}}>
                    <Image
                      source={{ uri: user?.image || getSupabaseFileUrl(user?.image)}}
                      transition={100}
                      className="rounded-2xl"
                      style={{ width: 100, height: 100, borderRadius: 20 }}
                      contentFit="cover" 
                    />
                    <Pressable className=' text-white absolute shadow-lg shadow-black/25 bg-green-600 rounded-full px-2 py-2' style={{right: -10, bottom:-10}}
                      onPress={onPickImage}
                    >
                     <Pencil size={24} color='white' />
                    </Pressable>
                    </View>

                  ) : (
                    <View className='mt-5'>
                     <View className='relative w-48 h-48 justify-center items-center rounded-2xl bg-green-600' style={{width: 80, height: 80}}>
                        <Text className='font-bold text-white' style={{fontSize: 50}}>{first_letter}</Text>
                     </View>
                     
                    <Pressable className=' text-white absolute shadow-lg shadow-black/25' style={{right: 0, bottom:0}}
                      onPress={onPickImage}
                    >
                     <Pencil size={24} color='white' />
                    </Pressable>
                     </View>
                  )
                }
              </View>
              <Text className='mt-5 mb-5 font-semibold text-black
              '>
                Please fill your profile details , 
              </Text>
              <View className='gap-5 mb-1'>

                <View className='flex-row items-center gap-2 border rounded-xl border-gray-300 p-2'>
                  <Person/>
                  <TextInput placeholder='Enter your name' className='w-full font-bold text-[16px] opacity-50' value={user?.name} onChangeText={value=>setUser({...user, name:value})}/>
                </View>

                <View className='flex-row items-center gap-2 border rounded-xl border-gray-300 p-2'>
                  <Phone/>
                  <TextInput placeholder='Enter your phone number' className='w-full font-bold text-[16px] opacity-50' value={user?.phoneNumber} onChangeText={value =>setUser({...user, phoneNumber:value})} />
                </View>

                <View className='flex-row items-center gap-2 border rounded-xl border-gray-300 p-2'>
                  <Home/>
                  <TextInput placeholder='Enter your address' className='w-full font-bold text-[16px] opacity-50' value={user?.address} onChangeText={value =>setUser({...user, address:value})} />
                </View>

                <View className='flex-row items-center gap-2 border rounded-xl border-gray-300 p-2'>
                  <Dribble/>
                  <TextInput placeholder='Enter your Pseudo' className='w-full font-bold text-[16px] opacity-50' value={user?.pseudo} onChangeText={value =>setUser({...user, pseudo:value})} />
                </View>

                <View className='flex-row items-start gap-2 border rounded-xl border-gray-300 p-2'>
                  <TextInput placeholder='Enter your bio' className='w-full font-bold text-[16px] opacity-50' style={{textAlign:'justify'}} 
                  multiline={true}
                  maxLength={500}
                  value={currentUser?.bio}
                  onChangeText={value=>setUser({...user, bio:value })}
                  />
                </View>

                <Button title='Update' loading={loading} hasShadow={false} buttonStyle={'w-full bg-green-600 rounded-xl py-4 px-4'} textStyle={'text-white font-bold text-2xl tracking-wider'} onPress={()=>onSubmit()}/>
              </View>
          </View>
          </ScrollView>
        </KeyboardAvoidingView>
        </View>
      </ScreenWrapper>
    )
  
}

export default EditProfile ;