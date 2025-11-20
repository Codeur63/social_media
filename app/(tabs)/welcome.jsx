import { View, Text, Image, ActivityIndicator, Pressable } from 'react-native'
import React, {useState} from 'react'
import ScreenWrapper from '../../components/screenWrapper'
import { StatusBar } from 'expo-status-bar';
import Button from '../../components/Button';
import { useRouter } from "expo-router";
import {Colors} from '../../constants/theme';
import { Icon } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

const Welcome = () => {

  const router = useRouter();

  const {user, session} = useAuth();
  const [loading, setLoading] = useState(false);

  if(session){
    setLoading(true);
    if(loading) return <ActivityIndicator className='flex-1 justify-center align-center'/>
    router.push('/home');
  }

  return (
    <ScreenWrapper>
      <StatusBar style='dark'/>
      <View className=' flex-1 justify-around items-center mx-10 align-middle'>
        {/* Welcome Image */}
        <Image
        source={require('../../assets/images/afro.png')}
        className='h-96 w-96 rounded-lg '
        resizeMode='contain'
      />

    {/* Title */}
        <View className='gap-7'>
          <Text className={`font-bold text-4xl text-black text-center`}>LinkUp!</Text>
          <Text className={`text-xl text-center text-black opacity-50`}>Where every thought finds a home and every image tells a story.</Text>
        </View>

        {/* footer */}
        <View className='w-full my-10'>
          <Button
            title="Getting Started"
            buttonStyle="bg-green-600 rounded-xl py-4 my-10"
            textStyle="text-2xl text-white"
            onPress={()=>{
              router.push('../login/signUp ')
            }} 
          />
          <View className='flex-row justify-center items-center gap-3 '>
            <Text className='opacity-30'>Already have an account ?</Text>
            <Pressable onPress={()=>router.push('../login/signIn')}>
              <Text className='font-bold text-green-600 opacity-100'>Sign In</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Welcome;

