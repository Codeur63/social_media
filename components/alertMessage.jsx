import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'



const AlertMessage = ({children, duration=1000, onClose } ) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) {
        onClose(); // Appelé seulement si défini
      }
    }, duration);;
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className='rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-600 px-6 py-6 shadow-md shadow-slate-900'>
      <Text className='text-white text-center font-semibold text-[16px]'>{children}</Text>
    </View>
  )
}

export default AlertMessage;
