import { supabase } from "@/lib/supabase";

export const createNotification = async (notifications) => {
    try{

        const {data, error } = await supabase.from('notification').insert(notifications).select().single();

        if(error){
            console.log('notification error : ', error)
            return {success:false, msg:'Something went wrong '}
        }

        return {success:true, data:data}

    } catch(error){
        console.log('notification error : ', error)
        return {success:false, msg:'Something went wrong '}
    }
}

export const fetchNotification = async (receiverId) => {
    try{
        const {data,error} = await supabase.from('notification').select(`*, sender:senderId(id, name,image) `).eq('receiverid', receiverId).order('created_at',{ascending:false});

        if(error){
            console.log('fetchNotification error : ', error)
            return {success: false, msg: 'Could not fetch the notification'}
        }

        return {success:true, data:data}
    
    } catch(error){
        console.log('fetchNotification error : ', error)
        return {success:false, msg:'Could not fetch the notification'}
    }
}