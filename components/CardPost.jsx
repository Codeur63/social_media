import { View, Text, Pressable,Image, TouchableOpacity, ScrollView, Share, Alert} from 'react-native'
import React, {useEffect, useState} from 'react'
import moment from 'moment'
import { downloadAndShareImage, downloadFile, getSupabaseFileUrl } from '@/services/imageServices'
import { useRouter } from 'expo-router'
import HTMLView from 'react-native-htmlview';
import { Video } from 'expo-av'
import HeartIcon from './icons/HeartIcon'
import { createPostLike, getPostLike, removePostLike } from '@/services/postServices'
import HorizontalIcon from '@/components/icons/HorizontalIcon';
import ShareIcon from '@/components/icons/ShareIcon';
import CommentIcon from '@/components/icons/CommentIcon';
import { cleanText } from '@/constants/helpers/common';
import Loading from './Loading'
import Pencil from './icons/Pencil'
import TrashIcon from './icons/TrashIcon'



const CardPost = ({ item, currentUser, router, hasShadow = true, showMoreIcon = true,
  showEdit = false, onDelete=() =>{}, onEdit=() =>{}
 }) => {
  
  CardPost.displayName = 'CardPost';

  const routers = useRouter()
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);


  if (!item?.user) return null;

  // Sécurisation de l'accès à item.user
  const user = item?.user ?? {}
  const first_letter = user.name?.charAt(0)?.toUpperCase() || '?';
  // const likeked = item.postLikes.some(like => like.userId !== like.currentUser?.id );


  const createdAt = moment(item?.created_at).fromNow();

  useEffect(()=>{
    setLikes(item?.postLikes);
  })

  // const hasLiked = likes.map(like=>like.userId).includes(currentUser?.id)
  const hasLiked = likes.some(like => like.userId === currentUser?.id);


  // const onLike = async() =>{

  //   try{

  //     if(hasLiked){
  //       //remove like
  //        let updatedLikes = likes.filter(like => like.userId !== currentUser?.id);

  //        setLikes([...updatedLikes])
  //        let res = await removePostLike(item?.id, currentUser?.id)
  //        if(!res.success){
  //         Alert.alert('Like', 'Something went wrong')
  //        }
  //       console.log('remove a like : ', res.msg)

  //     } else{
  //        // add like
  //        let data ={
  //         userId: currentUser?.id,
  //         postId: item?.id
  //        }

  //        let res = await createPostLike(data)
  //        if(!res.success){
  //         Alert.alert('Like', 'Something went wrong')
  //        }

  //        setLikes([...likes, data])
  //        setLikeded(true)
  //        console.log('added a like : ', res.msg)

      
  //     }

  //   } catch(error) {
  //     console.log('Error to like : ', error)
  //     Alert.alert('Like', 'Something went wrong')
  //   }
  // }



  // direction de la recherche et de l'innovation techonologique hotel de ville  14H 12h

  const onLike = async () => {
  try {
    if (hasLiked) {
      // Supprimer le like
      const updatedLikes = likes.filter(like => like.userId !== currentUser?.id);
      const res = await removePostLike(item?.id, currentUser?.id);

      if (!res.success) {
        Alert.alert('Like', 'Something went wrong');
        return; // Arrête l'exécution en cas d'erreur
      }

      setLikes(updatedLikes); // Met à jour l'état avec les likes filtrés
      console.log('Removed a like:', res.msg);
    } else {
      // Ajouter un like
      const newLike = {
        userId: currentUser?.id,
        postId: item?.id,
      };

      const res = await createPostLike(newLike);

      if (!res.success) {
        Alert.alert('Like', 'Something went wrong');
        return; // Arrête l'exécution en cas d'erreur
      }

      setLikes([...likes, newLike]); // Ajoute le nouveau like
      console.log('Added a like:', res.msg);
    }
  } catch (error) {
    console.log('Error to like:', error);
    Alert.alert('Like', 'Something went wrong');
  }
};


    const openPostDetails = () => {

    // details for a post
    if(!showMoreIcon) return null;
    router.push({pathname: 'postDetails', params: {postId: item?.id}})

  }


  const onShare = async()=>{
    let content = {message: cleanText(item?.body)};
    if(item?.file){
      //dowload the file then share the local uri
      // let url = await downloadFile(getSupabaseFileUrl(item?.file).uri)
      setLoading(true);
      let url = await downloadAndShareImage(getSupabaseFileUrl(item?.file).uri) 
      setLoading(false); 
      content.url = url; 
      console.log('You have a file')
    }
    Share.share(content);
  }

  const handlePostDelete = async() => {
    Alert.alert('Confirm', 'Are you sure you want to delete your post',
      [
      {
        text:'Cancel',
        onPress: ()=> console.log('modal cancelled'),
        style:'cancel'
      }, 
      {
        text:'Delete',
        onPress: () => onDelete(item),
        style:'destructive'
      }

    ]
    )
  }
 
  return (
    <ScrollView
      bounces
    >
    <View className={`bg-white border-gray-300 border rounded-xl py-4 flex flex-col gap-2  ${hasShadow ? 'shadow-black shadow-2xl' : ''} mb-5`}>

      {/* user info and post time */}
      <View className='flex justify-between flex-row mx-4' >
        <View className='flex flex-row items-center gap-2'>
        
          <Pressable onPress={() => router.push('/(main)/profile')}>
            {user.image ? (
              <Image
                source={getSupabaseFileUrl(user.image)}
                transition={100}
                style={{ width: 40, height: 40, borderRadius: 10 }}
                contentFit='cover'
              />
            ) : (
              <View className='w-10 h-10 justify-center items-center rounded-2xl bg-green-600'>
                <Text className='text-[20px] font-bold text-white'>{first_letter}</Text>
              </View>
            )}
          </Pressable>
          <View className='gap-1'>
            <Text className='text-[16px] font-bold text-gray-600'>{user.name}</Text>
            <Text className='text-gray-500 text-[12px]'>{createdAt}</Text>
          </View>
        </View>  

        {
          showMoreIcon && (
            <View className='flex flex-row'>
              <TouchableOpacity onPress={openPostDetails} className='self-center'>
                <HorizontalIcon/>
              </TouchableOpacity>         
            </View>       
          )
        }
        {
          showEdit && currentUser.id === item?.userId && (
            <View className='flex-row items-center gap-2'>
              <TouchableOpacity onPress={()=> onEdit(item)} className='self-center'>
                <Pencil size={20} color={'black'}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePostDelete} className='self-center'>
                <TrashIcon size={20} color={'red'} bg={'white'} />
              </TouchableOpacity>
            </View>
          )
        }

      </View>

      {/* post content */}
      <View className='mx-4 gap-2'>
          <View>            
            <HTMLView
              value={item?.body}
            />
          </View>

          {/* post image  */}
          <View>
            {
            item?.file && item?.file.includes('postImages') && (
              <Image
                source={getSupabaseFileUrl(item.file)}
                transition={100}
                style={{ width: 309, height: 300 }}
                contentFit='cover'
                className='rounded-2xl'
              />
            )            
            }
            {/* post video  */}
          {
            item?.file && item?.file.includes('postVideos') && (
              <Video
                style={{height:300, width:309, borderRadius:16}}
                source={getSupabaseFileUrl(item.file)}
                useNativeControls
                resizeMode='cover'
                isLopping
                className='rounded-2xl'
              />
            ) 
          }
          </View>
          {/* Like, comment & share */}
          <View className='flex gap-3 items-center flex-row'>

            {/* like */}
            <View className='flex-row items-center gap-2'>
              <TouchableOpacity onPress={onLike} >
                <HeartIcon fill={hasLiked ? 'red' :'white'} color={hasLiked ? 'white' :'#141B34'}/>
              </TouchableOpacity>              
              <Text>
                {
                  likes?.length || 0
                }
              </Text>
            </View>

                {/* comment  */}
            <View className='flex-row items-center gap-2'>
              <TouchableOpacity onPress={openPostDetails}>
                <CommentIcon/>
              </TouchableOpacity>
              <Text>
                {
                  item?.comments[0]?.count
                }
              </Text>
            </View>

                {/* share  */}
            <View className='flex-row items-center gap-2'>
                {
                  loading ? (
                    <Loading size='small'/>
                  ) : (
                  <TouchableOpacity onPress={onShare}>
                    <ShareIcon/>
                  </TouchableOpacity>
                  )
                }
            </View>


          </View>
      </View>    
    </View>
    </ScrollView>
  )
}


export default CardPost;
