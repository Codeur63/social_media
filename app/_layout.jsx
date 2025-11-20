import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {AuthProvider, useAuth}  from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import {getUserData} from '@/services/userService';

const _layout = () => {
  return ( 
    <AuthProvider>
      <MainLayout/>
    </AuthProvider>
  )
}

const MainLayout = () => {

  const {setAuth, setUserData} = useAuth();
  const router = useRouter();


  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange( async (_event, session) => {
      console.log('session user: ', session?.user?.id);
      if (session) {
        router.replace('/home');
        setAuth(session?.user);
        await updateUserData(session?.user, session?.user.email || '');
      } else {
        setAuth(null);
        router.push('/(tabs)/welcome');
      }

      if (!session?.user) {
        setAuth(null);
        router.replace('/(tabs)/welcome');
        return;
      }

    });
  
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);
  

  const updateUserData = async (user, email) => {
    if (!user) return;
    
    let res = await getUserData(user.id);
    // console.log('got user data: ', res);
    if (res.success) {
      setUserData({...res.data,email});
    }
  }

  return (
    <SafeAreaProvider style={{ backgroundColor:'#fff'}}>
        <Stack
            screenOptions={{
              animation: 'slide_from_right',
              headerShown:false,
        }}>
          <Stack.Screen
            name='(main)/postDetails'
            options={{
              presentation:'modal'
            }}
          />


        </Stack>
    </SafeAreaProvider>   
    
  )
}

export default _layout;