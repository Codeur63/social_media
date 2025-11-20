import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import ScreenWrapper from '@/components/screenWrapper';
import { createComment, fetchPostDetails, removeComment } from '@/services/postServices';
import CardPost from '@/components/CardPost';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/Loading';
import { KeyboardAvoidingView } from 'react-native';
import SendIcon from '@/components/icons/sendIcon';
import CommentItem from '@/components/CommentItem';
import { supabase } from '@/lib/supabase';
import { getUserData } from '@/services/userService';
import { removePost } from '@/services/postServices';
import {createNotification} from '@/services/notificationServices';

const postDetails = () => {

  const {postId, commentId} = useLocalSearchParams();
  const {user} = useAuth();

  const router = useRouter();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startloading, setStartLoading] = useState(false);
  const inputRef = useRef(null)
  const commentRef = useRef(null)

  useEffect(()=>{
    getPostDetails();
  },[postId])

  const handleNewComment = async(payload)=>{
    if(payload.new){
      let newComment = {...payload.new}
      let res = await getUserData(newComment.userId);
      newComment.user = res.success? res.data:{}
      setPost(prevPost=>{
        return {
          ...prevPost,
          comments:[newComment, ...prevPost.comments]
        }
      })
    }
  }

  useEffect(()=>{
    let commentChannel = supabase.channel('comments').on('postgres_changes', {event:'INSERT', schema:'public', table:'comments', filter:`postId==eq=.${postId}`}, handleNewComment).subscribe()

    getPostDetails()

    return () => {
      supabase.removeChannel(commentChannel)
    }
  })

  const getPostDetails = async() => {
    // fetch post details here
    let res = await fetchPostDetails(postId);
    if(res.success) setPost(res.data);
    setLoading(false)
  }


  if (!post && !user) {
    <Loading size='small'/>
  } 
  const onNewComment = async() => {
    setStartLoading(true);

    if(!commentRef.current) return null

    let data = {
      userId: user?.id,
      postId : postId,
      text : commentRef.current
    }

    // create and add new comment 
    let res = await createComment(data);
    setStartLoading(false);

    console.log('user id', user.id, 'post id ', post?.userId);
 

    if(res.success){
      //send notification later 
      if(user?.id !== post?.userId ){
        let notify = {
          senderId:user?.id,
          receiverid:post?.userId,
          title:'commented on your post',
          data:JSON.stringify({postId:postId, commentId: res?.data?.id})
        }
        createNotification(notify)
      }
      inputRef?.current?.clear();
      commentRef.current='';
    } else {
      Alert.alert('Comment', res.msg)
    }
  }


  const onDeletePost = async (item) =>{
    // delete post
    let res = await removePost(postId);
    if(res.success){
      router.back()
    }else{
      Alert.alert('Post', res.msg)
    }

  } 

  const onEditPost = async(item) =>{
    router.back();
    router.push({pathname:'newPost', params:{...item}})
  }

  const onDeleteComment = async (comment) => {
    console.log('eleting comment: ', comment);
    let res = await removeComment(comment?.id)
    if(res.success){
      setPost(prevPost =>{
        let updatedPost = {...prevPost}
        updatedPost.comments = updatedPost.comments.filter(c=> c.id !== comment.id)
        return updatedPost;
      } )
    } else {
      Alert.alert('Comment', res.msg)
    }
  }

  if(loading){
    return(
      <View className='flex-1 justify-center align-middle items-center bg-white'>
        <Loading/> 
      </View>
    )
  }

  if(!post){
    return(
      <View className='flex-start items-center mt-24'>
        <Text className='text-center font-bold text-2xl text-green-600'> Post not found !</Text>
      </View>
    )
  }




  return (
    <ScreenWrapper bg='white'>
      <KeyboardAvoidingView
         keyboardVerticalOffset={80} >
      <ScrollView
        bounces
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingTop:0, paddingHorizontal:0}}
        >          
      <View className='flex-1'>
        <CardPost
            item={{...post, comments:[{count:post?.comments?.length}]}}
            currentUser={user}
            router={router}
            hasShadow={false}
            showMoreIcon={false}
            showEdit={true}
            onDelete = {onDeletePost}
            onEdit = {onEditPost}
          />

          {/* comment input  */}         

          <View className='flex-row items-center justify-between gap-5 '>
            <TextInput
              placeholder='Type your comment ... '
              className='w-3/4 placeholder:gray-300 font-semibold text-[16px] rounded-xl py-4 px-4 border border-gray-300 flex-1'
              ref={inputRef}
              onChangeText={value => commentRef.current = value}
            />
            
            {
              startloading ? (
                <View className='flex justify-center items-center rounded-xl px-4 py-4 border border-green-400' style={{borderColor: '#16A34A'}}>
                  <Loading size='small'color={'#16A34A'} />
                 </View> 
              ) : (
              <TouchableOpacity className='rounded-xl px-3 py-3 border border-gray-300 flex-2' onPress={onNewComment} style={{borderColor: '#16A34A'}}>
                <SendIcon/>
              </TouchableOpacity>
              )
            }
          </View>
      </View>

      {/* comment list  */}
            <View className=''>
              {
                post?.comments?.map(comment=><CommentItem key={comment?.id?.toString()} item={comment} highlight={comment?.id === commentId ? true : false} canDelete={user?.id === comment.userId } onDelete={onDeleteComment} />)
              } 
              {
                post?.comments?.length == 0 && (
                  <Text className='text-center mt-5 font-bold text-green-600 text-2xl'>
                    Be first to comment !
                  </Text>
                )
              }
            </View>
            
      </ScrollView>
          </KeyboardAvoidingView>
    </ScreenWrapper>
  )
}

export default postDetails