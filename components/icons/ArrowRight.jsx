import { View, Text } from 'react-native'
import React from 'react'
import Svg, {Path} from 'react-native-svg';

const ArrowRight = () => {
  return (
    <View className='rotate-180'>
      <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
          <Path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></Path>
      </Svg>
    </View>
  )
}

export default ArrowRight

