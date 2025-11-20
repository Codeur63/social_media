import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { getSupabaseFileUrl } from '@/services/imageServices';
import moment from 'moment';

const NotificationItem = ({item, router}) => {


    const handleClick = () => {
        //open post details
        let {postId, commentId} = JSON.parse(item?.data)
        router.push({pathname:'postDetails', params:{postId, commentId}})
    } 

    const first_letter = item?.sender?.name?.charAt(0)?.toUpperCase();

    const createdAt = moment(item?.createdAt).format('MMM d');

  return (
    <View className='bg-white'>
    <TouchableOpacity  className='flex-1 items-start justify-between flex-row border border-gray-300 rounded-xl px-4 py-4 ' onPress={handleClick} >
        <View className='flex flex-row gap-2'>
            {
                item?.sender?.image ? (
                    <Image
                        source={getSupabaseFileUrl(item?.sender?.image)}
                        transition={100}
                        className='rounded-2xl'
                        style={{width: 30, height: 30, borderRadius:10}}
                    />
                ) : (
                    <View className='w-10 h-10 justify-center items-center rounded-2xl bg-green-300'>
                        <Text className='text-[20px] font-bold text-white'>{first_letter}</Text>
                    </View>
                )
            }
            <View className=''>
                <Text className='font-bold '>
                    {
                    item?.sender?.name
                    } 
                </Text>
                <Text className=''>
                {
                    item?.title
                }     
                </Text>   
            </View>
        </View>

      <Text className='text-gray-300 opacity-50'>
        {
            createdAt
        }
      </Text>
    </TouchableOpacity>
    </View>
  )
}

export default NotificationItem;