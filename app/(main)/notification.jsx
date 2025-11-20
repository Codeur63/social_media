import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '@/components/screenWrapper'
import { fetchNotification } from '@/services/notificationServices';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import NotificationItem from '@/components/NotificationItem';
import Loading from '@/components/Loading';
import Header from '@/components/Header';

export default function Notification() {

  const [notification, setNotification] = useState([]);
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const {user} = useAuth();

 
  useEffect(()=>{
    getNotifications();
  },[])

  const getNotifications = async() => {
    setLoading(true);
    let res = await fetchNotification(user?.id)
    if(res.success) setNotification(res.data)
    setLoading(false);
  }

  if(loading){
    return(
      <View className='flex-1 justify-center items-center bg-white'>
        <Loading size='large'/>
      </View>
    )
  }

  if(notification.length == 0){
    return(
      <View className='flex-1 justify-center items-center bg-white'>
        <Text className='text-center font-bold text-2xl text-green-600'> No notification found !</Text>
        <TouchableOpacity className='border-bottom-2' onPress={()=>router.back()} >
          <Text className='font-bold text-md '> 
            Back to Home
          </Text>
          </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScreenWrapper >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{}}
      >
        <Header title={"Notifications"} showButton={true} />
        <View>
        {
        notification.map(item=>{
          return(
            <NotificationItem
              item={item}
              key={item?.id}
              router={router}
              />

          )
        })
      }

        </View>
      </ScrollView>
    </ScreenWrapper>
  )
}