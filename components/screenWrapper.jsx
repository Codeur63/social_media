import { View, Text } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ScreenWrapper = ({children, bg='white'}) => {

  const insets = useSafeAreaInsets();
  const paddingTop = insets?.top > 0 ? insets.top + 5 : 30;
  const paddingBottom = insets?.top >0 ? insets.top + 10 : 30
  return (
    <View style={{ flex: 1, paddingTop, backgroundColor: bg, paddingBottom, paddingHorizontal:10}}>
        {children}
    </View>
  )
};

export default ScreenWrapper;