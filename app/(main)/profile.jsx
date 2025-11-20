import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '@/components/screenWrapper'
import ButtonBack from '@/components/ButtonBack';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Header from '@/components/Header';
import Pencil from '@/components/icons/Pencil';
import Email from '@/components/icons/Email';
import Person from '@/components/icons/Person';
import Location from '@/components/icons/Location';
import { getSupabaseFileUrl } from '@/services/imageServices';
import { fetchPosts } from '@/services/postServices';
import Loading from '@/components/Loading';
import CardPost from '@/components/CardPost';


var limit = 0;

const Profile = () => {
  
    const {user, setAuth} = useAuth();
    const router = useRouter();
    const [alert, setAlert] = useState(false)
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading ] = useState(false);


    const getPosts= async () =>{
      //call the api here

      if(!hasMore) return null;
      limit = limit + 10;

      let res = await fetchPosts(limit, user?.id);
      if(res.success){
        if(posts.length == res.data.length) setHasMore(false);
        setPosts(res.data)
      }
    }


  return (
    <ScreenWrapper>
    <View className=''>
        
        <View className=''>
          <FlatList
            data={posts}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={<UserHeader user={user} router={router}/>}
            ListHeaderComponentStyle={{marginBottom:30}}
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
            <View style={{marginVertical: posts.length == 0 ? 100 : 30}}>
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

export default Profile;

  export const UserHeader = ({item, user, router }) =>{

    const first_letter = user?.name.charAt(0).toUpperCase();
    const imageSource = user?.image ? getSupabaseFileUrl(user?.image) : null;



    return (
      <View>
        {/* Header  */}
        <View className=''>
            <Header title='Profile' showButton={true} exit={true}/>
        </View>

        {/* Profile */}
        <View className='flex-col justify-center align-center gap-1'>
           <View className='flex justify-center items-center mt-5'>
            {
                user?.image ? (                    
                    <View className='relative w-48 h-48 justify-center items-center rounded-2xl bg-green-600 mt-5' style={{width: 80, height: 80}}>
                    <Image
                      source={imageSource}
                      transition={100}
                      className="rounded-2xl"
                      style={{ width: 100, height: 100, borderRadius: 20 }}
                      contentFit="cover" 
                    />
                    <Pressable className=' text-white absolute shadow-lg shadow-black/25 bg-green-600 rounded-full px-2 py-2' style={{right: -10, bottom:-10}}
                      onPress={()=>router.push('/editProfile')}
                    >
                     <Pencil size={24} color='white' />
                    </Pressable>
                    </View>
                ) : (
                    <View className='mt-5'>
                     <View className='relative w-48 h-48 justify-center items-center rounded-2xl bg-green-600' style={{width: 80, height: 80}}>
                        <Text className='font-bold text-white' style={{fontSize: 50}}>{first_letter}</Text>
                     </View>
                   <TouchableOpacity className=' text-white absolute shadow-lg shadow-black/25' style={{right: 0, bottom:0}} onPress={()=>router.push('/editProfile')}>
                     <Pencil size={24} color='white' />
                    </TouchableOpacity>
                     </View>
                )
            }
           </View>

           {/* username and address */}
           <View className=' items-center gap-1'>
            <Text className='text-center font-semibold text-gray-700 text-[30px] lowercase mt-5'>{user && user?.name}</Text>
            <Text className='text-center font-extralarge text-gray-500 text-xl lowercase'>{user  && user.pseudo}</Text>
           </View>

           {/* email, phone, bio */}
           <View className=' mt-5 gap-5'>
            <View className='space-y-5 gap-2'>
            <View className='flex-row items-center gap-2 '> 
                <Email/>
                <Text className='text-gray-700 opacity-70 font-extralarge'>{user && user?.email}</Text>
            </View>

             <View className='flex-row items-center gap-2'> 
                <Person/>
                <Text className='text-gray-700 opacity-70 font-extralarge'>{user && user?.phoneNumber}</Text>
            </View>

            <View className='flex-row items-center gap-2'> 
                <Location/>
                <Text className='text-gray-700 opacity-70 font-extralarge'>{user && user?.address}</Text>
            </View>
            <Text className='leading-relaxed text-gray-500 text-lg tracking-wider' style={{textAlign:'justify'}}>{user  && user.bio}</Text>
            </View>
           </View>

        </View>
        
      </View>
       
    )
  }  

