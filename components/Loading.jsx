import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react';
import { Colors } from '../constants/theme';

const Loading = ({size='large',color=Colors.quaternary}) => {
  return (
    <View className='font-bold text-2xl'>
        <ActivityIndicator size={size} color={'#16A34A'} />
    </View>
  )
}

export default Loading