import { Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react';
import { useRouter } from 'expo-router';
import ButtonBack from './ButtonBack';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { Alert } from 'react-native';

const Header = ({title , showButton = false, exit= false}) => {

    const router = useRouter();
    const {logout,user} = useAuth();
    const handleLgout = async () => {

        Alert.alert(
            'Confirm',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    onPress: () => logout(),
                    style:'destructive'
                },
            ]
        );

        if(!user){
            router.push('/login/signIn');
        }

    }

    return (
      <View className='flex-row items-center justify-center align-center mt-5 mb-5'>
        { showButton && <View className='absolute' style={{left: 0}}>
            <ButtonBack/>
             </View> }
        <Text className='text-center text-2xl font-bold text-green-600 self-center' style={{letterSpacing : 1}}>{title || ''}</Text>
        {
            exit && (
                <TouchableOpacity onPress={handleLgout}className='absolute' style={{right: 0}} >
                    <Ionicons name="exit-outline" size={24} color="red"/>
                </TouchableOpacity>
            )
        }

      </View>
    )
  
}

export default Header