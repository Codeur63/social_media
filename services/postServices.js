import {uploadFile} from './imageServices'
import {supabase} from '../lib/supabase'

export const createOrUpdatePost = async (post) => {
    try{

        //upload image
        if(post.file && typeof post.file == 'object' ){
            let isImage = post?.file?.type == 'image'
            let folderName = isImage ? 'postImages' : 'postVideos';
            let fileResult = await uploadFile(folderName, post?.file?.uri, isImage)
            if(fileResult.success) post.file = fileResult.data
            else {
                return fileResult
            }
        }

        const {data,error} = await supabase.from('posts').upsert(post).select().single();
        if(error){
            console.log('createPost error: ', error)
            return {success:false, msg:'Could not create your post'}
        }
        return {success:true, data}
        
    } catch(error){
        console.log('createPost error: ', error)
        return {success:false, msg:'Could not create your post'}
    }
}

export const fetchPosts = async (limit = 10, userId) => {
    try {

        if(userId){
            const {data,error}= await supabase.from('posts').select(`*, user: users(id,name,image), postLikes(*), comments(count)`).order('created_at', {ascending:false}).eq('userId', userId).limit(limit);
        
            if(error){
                console.log('fetchPost error: ',error )
                return {success:false, msg: 'Could not fetch your post'}
            }
            return {success:true, data}
        } else {
            const {data,error}= await supabase.from('posts').select(`*, user: users(id,name,image), postLikes(*), comments(count)`).order('created_at', {ascending:false}).limit(limit);
        
        if(error){
            console.log('fetchPost error: ',error )
            return {success:false, msg: 'Could not fetch your post'}
        }
        return {success:true, data}
        }

    } catch(error){
        console.log('fecthPost error: ',error )
        return {success:false, msg: 'Could not fetch your post'}
    }
}

export const createPostLike = async (postLike) => {
    try{

        const {data, error} = await supabase.from('postLikes').insert(postLike).select().single();
        
        
        if(error){
            console.log('postLike error: ', error)
            return {success:false, msg:'Could not like your post'}
        }

        return {success:true, data:data}

    } catch (error) {
        console.log('postLike error: ', error)
        return {success:false, msg:'Could not like your post'}
    }
}

export const removePostLike = async(postId, userId) => {
    try{

        const {error} = await supabase.from('postLikes').delete().eq('userId', userId).eq('postId', postId);

        if(error){
            console.log('postLike error: ', error)
            return {success:false, msg:'Could not remove the post like'}
        }

        return {success:true}

    } catch(error){
        console.log('postLike error: ', error)
        return {success:false, msg:'Could not remove the post like'}
    }
}

export const fetchPostDetails = async (postId) => {

    if (postId === undefined || postId === null) {
        console.log("postId est undefined ou null");
        return { success: false, msg: "postId est requis" };
    }

    try{
        const {data,error} = await supabase.from('posts').select(`*, user: users(id, name, image), postLikes(*), comments(*, user: users(id,name,image))`).eq('id', postId).order('created_at',{ascending:false, foreignTable:'comments'}).single();

        if(error){
            console.log('fetchPostDetails error : ', error)
            return {success: false, msg: 'Could not fetch the detail post'}
        }

        return {success:true, data:data}
    
    } catch(error){
        console.log('fetchPostsDetails error : ', error)
        return {success:false, msg:'Could not fetch the detail post'}
    }
}

export const createComment = async (comment) => {
    try{

        const {data, error } = await supabase.from('comments').insert(comment).select().single();

        if(error){
            console.log('createComment error : ', error)
            return {success:false, msg:'Could not send a comment to detail post'}
        }

        return {success:true, data:data}

    } catch(error){
        console.log('createComment error : ', error)
        return {success:false, msg:'Could not send a comment to detail post'}
    }
}

export const removeComment = async (commentId) => {
    try{

        const {error} = await supabase.from('comments').delete().eq('id', commentId)
        if(error){
            console.log('remove error : ', error)
            return {success:false, msg:'Could not remove the comment'}
        }

        return {success:true, data : {commentId}}

    } catch(error){
        console.log('removeCommentId error : ', error)
        return {success:false, msg:'Could not remove the comment'}
    }
} 

export const removePost = async(postId) => {
    try{

        const {error} = await supabase.from('posts').delete().eq('id', postId)

        if(error){
            console.log('remove error : ', error)
            return {success:false, msg:'Could not remove the post'}
        }

        return {success:true, data : {postId}}

    } catch(error){
        console.log('deletePost error : ', error)
        return {success:false, msg:'Could not remove the Post'}
    }
}