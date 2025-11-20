import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import ArrowRight from './icons/ArrowRight';

const ButtonBack = () => {
    const router = useRouter();
  return (
    <Pressable onPress={()=>{router.back()}} className='bg-gray-200 rounded-xl p-1 flex-row'>
        <ArrowRight/> 
    </Pressable>
  )
}

export default ButtonBack