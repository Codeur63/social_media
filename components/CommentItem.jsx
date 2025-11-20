import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import moment from 'moment';
import { getSupabaseFileUrl } from '@/services/imageServices';
import TrashIcon from './icons/TrashIcon';

const CommentItem = ({item, canDelete = false, onDelete = ()=>{}, highlight = false}) => {


  const first_letter = item?.user.name?.charAt(0)?.toUpperCase() || '?';

  const handleDelete = () =>{
    Alert.alert('Confirm', 'Are you sure you want to delete your opinion ?', [
        {
            text:'Cancel',
            onPress: () => console.log('modal cancelled')
        },
        {
            text:'Delete',
            onPress: () => onDelete(item),
            style:'destructive'
        }
    ])
  }

  const createdAt = moment(item?.created_at).format('MMM d')

  return (
    <View className='mt-5'>
        <View className={`flex-row gap-2 border border-gray-300 rounded-xl p-4 ${highlight && 'bg-slate-400 elevation-xl'}  `} >
        {
            item?.user.image ? (
            <Image
             source={getSupabaseFileUrl(item?.user.image)}
             transition={100}
             style={{ width: 40, height: 40, borderRadius: 10 }}
             contentFit='cover'
            />
            ) : (
            <View className='w-10 h-10 justify-center items-center rounded-2xl bg-green-600'>
                <Text className='text-[20px] font-bold text-white'>{first_letter}</Text>
            </View>
            )
        }
            <View className={`flex-col justify-between flex-1 `} >
                <View className='flex-row gap-2 flex-1 justify-between   items-center'>
                    <View className='flex-row gap-2 items-center '>
                        <Text className='font-bold'>
                            {item?.user?.name}
                        </Text>
                        <Text></Text>
                        <Text className='text-gray-400 '>{createdAt}</Text>
                    </View>
                    {
                        canDelete && (
                    <TouchableOpacity className='' onPress={handleDelete}>
                        <TrashIcon color={'red'} bg='white' size={18} />
                    </TouchableOpacity>
                        )
                    }
                </View>
                <Text>
                    {item?.text}
                </Text>
            </View>
        </View>
    </View>
  )
}


export default CommentItem;