import { View, Text } from 'react-native'
import React from 'react'
import {RichEditor, RichToolbar, actions} from 'react-native-pell-rich-editor'

const RichTextEditor = ({editorRef, file, onChange}) => {
  return (
    <View style={{minHeight:200}}>
        <RichToolbar
        actions = {[
            actions.setStrikethrough,
            actions.removeFormat,
            actions.setBold,
            actions.setItalic,
            actions.insertOrderedList,
            actions.blockquote,            
            actions.alignLeft,
            actions.alignCenter,
            actions.alignRight, 
            actions.alignFull,
            actions.code,
            actions.line,
            actions.heading1,
            actions.heading4,
        ]}
        iconMap={{
            [actions.heading1] : ({tintColor}) => <Text style={{color:tintColor}}>H1</Text>,
            [actions.heading4] : ({tintColor}) => <Text style={{color:tintColor}}>H4</Text>

        }}
        style={{ borderColor:'gray', marginTop:10, borderTopRightRadius:20, borderTopLeftRadius:20, paddingHorizontal:10}}
        editor = {editorRef}
        disabled = {false}
        file = {file}
        onChange = {onChange}
        flatContainerstyle={{backgroundColor:'transparent', padding:0}}
        containerStyle={{backgroundColor:'transparent', padding:0}}
        selectedIconTint='#16a34a'
        iconTint='black'
        />

        <RichEditor
        ref={editorRef}
        containerStyle={{backgroundColor:'transparent', paddingTop:10, minHeight:100,flex: 1,borderWidth:0.5,borderColor:'gray',borderBottomRightRadius:20, borderBottomLeftRadius:20, borderTopWidth:0}}
        editorStyle = {{backgroundColor:'transparent', color:'gray'}} 
        placeholder = {'What\'s on your mind ? '} 
        onChange={onChange}
        style={{flex:1, backgroundColor:'transparent', border:2, borderColor:'black', borderBottomRightRadius:20, borderBottomLeftRadius:20}}
        />
    </View>
  )
}

export default RichTextEditor