import { View, Text } from 'react-native'
import React from 'react'
import Svg, {Path, Rect} from 'react-native-svg'; 

const HorizontalIcon = () => {
  return (
    <View>
        <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
    <Rect x="18" y="10.5" width="3" height="3" rx="1" stroke="#141B34" stroke-width="1.5" />
    <Rect x="10.5" y="10.5" width="3" height="3" rx="1" stroke="#141B34" stroke-width="1.5" />
    <Rect x="3" y="10.5" width="3" height="3" rx="1" stroke="#141B34" stroke-width="1.5" />
</Svg>
    </View>
  )
}

export default HorizontalIcon