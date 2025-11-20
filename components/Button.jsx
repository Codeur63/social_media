import { View, Text,Pressable } from 'react-native'
import React from 'react';
import Loading from '../components/Loading'

const Button = ({
    buttonStyle,
    textStyle,
    title='',
    onPress=()=>{},
    loading=false,
    hasShadow=true,
    }
) => {

    const shadowStyle = {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }

  return (
    <Pressable onPress={onPress} className={`px-4 py-2 ${buttonStyle}`} style={hasShadow ? shadowStyle : {}}>
      <Text className={`${textStyle} font-bold text-center`}>{loading ? <Loading size='small' color='white'/> : title}</Text>
    </Pressable>
  )
}

export default Button;