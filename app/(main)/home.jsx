import { View, Text, Button, Alert, Pressable, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import AlertMessage from '@/components/alertMessage';
import HeartIcon from '@/components/icons/HeartIcon'
import AddSquareIcon from '@/components/icons/AddSquareIcon';
import {Image} from 'expo-image';
import ScreenWrapper from '@/components/screenWrapper';
import { getSupabaseFileUrl } from '@/services/imageServices';
import { fetchPosts } from '@/services/postServices';
import CardPost from '@/components/CardPost';
import Loading from '@/components/Loading';
import { getUserData } from '@/services/userService';

var limit = 0;

const Home = () => {

    const {user, setAuth} = useAuth();
    const router = useRouter();
    const [alert, setAlert] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [posts, setPosts] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0)  


    const handlePostEvent = async (payload) => {
        if(payload.eventType == 'INSERT' && payload?.new?.id){
            let newPost = {...payload.new}
            let res = await getUserData(newPost.userId);  
            newPost.postLikes = [];
            newPost.comments = [{count:0}]          
            newPost.user = res.success ? res.data : {} ;
            // setPosts((prevPosts) => {
            //     const postExists = prevPosts.some((post) => post.id === newPost.id);
            //     if (postExists) {
            //     return prevPosts; // Évite les doublons
            //     }
            //     return [newPost, ...prevPosts];
            // });
            setPosts(prevPosts=>[newPost, ...prevPosts])
        }
        if(payload.eventType=='DELETE' && payload.old.id){
            setPosts(prevPosts=>{
                let updatedPosts = prevPosts.filter(post=>post.id!== payload.old.id)
                return updatedPosts;
            })
        }
        if(payload.eventType='UPDATE' && payload?.new?.id){
            setPosts(prevPosts => {
                let updatedPost = prevPosts.map(post => {
                    if(post.id === payload.new.id){
                        post.body = payload.new.body;
                        post.file = payload.new.file
                    }
                    return post;
                });

                return updatedPost;
            })
        }
    }

    const handleNotificationEvent = async(payload) => {
        if(payload.eventType == 'INSERT' && payload?.new?.id){
           setNotificationCount(notificationCount + 1)
        }
    } 

    useEffect(()=>{
        let postChannel = supabase.channel('posts').on('postgres_changes', {event:'*', schema:'public', table:'posts'}, handlePostEvent).subscribe();
        getPosts();
        
        let notificationChannel = supabase.channel('notification').on('postgres_changes', {event:'INSERT', schema:'public', table:'notifications', filter:`receiverid=eq.${user?.id}`}, handleNotificationEvent).subscribe();

        return () => {
            supabase.removeChannel(postChannel);
            supabase.removeChannel(notificationChannel)
        }
    }, [])

    const getPosts = async () => {
      
        // call the api here 
        if(!hasMore) return null;
        limit = limit + 4;

        let res = await fetchPosts(limit);
        if(res.success){
            if(posts.length == res.data?.length) setHasMore(false);
            setPosts(res.data)
        }

    }

    const first_letter = user?.name;
    const imageSource  = user?.image ? getSupabaseFileUrl(user?.image) : null;

    return (
        <ScreenWrapper>
        <View className='flex-1 py-5'>
            {/* Header  */}
            <View className='flex-row items-center justify-between pb-5'>
                <Text className='text-[30px] font-bold text-green-600'>Welcome ,</Text>
                <View className='flex-row items-center gap-5'>
                    <Pressable onPress={()=>{
                        setNotificationCount(0)
                         router.push('/(main)/notification')
                    }}>
                        <HeartIcon/>
                        {
                            notificationCount>0 && (
                                <View className='bg-red-600 rounded-full w-5 h-5 items-center justify-center absolute top-0 right-0'>
                                    <Text className='text-white font-semibold text-center'  >
                                        {
                                            notificationCount
                                        }
                                    </Text>
                                </View>
                            )
                        }
                    </Pressable>
                    <Pressable onPress={()=> router.push('/(main)/newPost')}>
                        <AddSquareIcon/>
                    </Pressable>
                    <Pressable  onPress={()=>router.push('/(main)/profile')}>
                        {
                            user?.image  ? (
                                <Image source={imageSource}
                                    transition={100}
                                    className='rounded-2xl'
                                    style={{width: 30, height: 30, borderRadius:10}}
                                />
                            ) : (
                                <View className='w-10 h-10 justify-center items-center rounded-2xl bg-green-600'>
                                    <Text className='text-[20px] font-bold text-white'>{first_letter}</Text>
                                </View>
                            )
                        }
                    </Pressable>
                </View>
            </View>
            {/* post list */}
            <View className=''>
                <FlatList
                    data={posts}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingTop:0, paddingHorizontal:0}}
                    keyExtractor={item=>item.id.toString() || Math.random().toString()}
                    renderItem={({item})=><CardPost
                        item={item}
                        currentUser={user}
                        router={router}
                        />
                    }
                    onEndReached={()=>{
                        getPosts();
                    }}
                    onEndReachedThreshold={0.2}
                    ListFooterComponent={ hasMore ? (
                        <View style={{marginVertical: posts.length == 0 ? 10 : 30}}>
                            <Loading/>
                        </View>
                    ) : <View style={{marginVertical: 30}}>
                        <Text className='text-center text-gray-500'>No more posts</Text>
                        </View>
                        }
                    />
            </View>
            </View>
        </ScreenWrapper>
    )
}

export default Home;