import { View, Text,TextInput, Pressable, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import React, {useState} from 'react';
import ScreenWrapper from '@/components/screenWrapper';
import ButtonBack from '@/components/ButtonBack';
import Email from '@/components/icons/Email';
import Password from '@/components/icons/Password';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import { MotiView, AnimatePresence } from 'moti';
import { supabase } from '@/lib/supabase';
import AlertMessage from '@/components/alertMessage';


const signUp = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({});
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [alert, setAlert] = useState(false);

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const onSubmit = async() => {

    setLoading(true);

    if(!email.trim() || !password.trim()){
      setError('Please enter a correct information')
      return;
    }

    if(email.trim() === ''  || password === '' ){
      setError('Please remove the space on password or email')
      return;
    }

    if (!validateEmail(email)) {
      setError('Your email is not valid');
      return;
    }

    const {data: {session},error} = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log('session:', session);
    console.log('error:', error);

    if(error){
      <AlertMessage
      children='Error SignIn'
      duration={500}
      onClose={()=>setAlert(true)}
      />
    }

    setLoading(true);
    router.push('/home')
    // setTimeout(() => {
    //   setLoading(true);
    //   <AlertMessage
    //     children='Your are connecter'
    //     duration={500}
    //   />
    //   router.push('/home');
    // }, 2000);

    
  }

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
          keyboardVerticalOffset={80} 
        >
      <ScrollView>
      <View className='flex-1 items-start gap-10 mx-5 pt-5 pb-5'>
        <ButtonBack/>
        <View className=''>
          <Text className='font-bold text-5xl text-green-600'>Hey,</Text>
          <Text className='font-bold text-5xl text-green-600'>Welcome Back</Text>
        </View>
        <View className='gap-8 w-full flex-col'>
        <Text className='text-gray-500 opacity-60'> Please login to continue, </Text>
          <View className='flex-row items-center gap-2 border rounded-2xl border-gray-300 p-2'>
            <Email/>
            <TextInput placeholder='Enter your email' className='w-full font-bold text-[16px] opacity-50' value={email} onChangeText={setEmail}/>
          </View>
          <View className='flex-row items-center gap-2 border rounded-xl border-gray-300 p-2'>
            <Password/>
            <TextInput placeholder='Enter your password' className='w-full font-bold text-[16px] opacity-50' secureTextEntry={true} value={password} onChangeText={setPassword}/>
          </View>
      <AnimatePresence>
                {
                  error !== '' && (
                    <MotiView
                    from={{ opacity: 0, scale: 0.2 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1 }}
                    transition={{ type: 'timing', duration: 500 }}
                  >
                  <View className='flex w-full bg-red-500 rounded-xl py-3 px-3'>
                      <Text className='text-white text-center text-[16px] font-semibold'>{error}</Text>
                    </View>
                </MotiView>
                  )
                }
                </AnimatePresence>
            <Pressable>
              <Text className='text-[16px] font-bold text-green-600 text-right'>Forget Password ?</Text>
            </Pressable>  
          <Button
          title='Sign In'
          buttonStyle='bg-green-600 rounded-xl py-4 w-full'
          textStyle='text-2xl text-white'
          onPress={onSubmit}
          loading={loading}
          hasShadow={true}
          />
        </View>
        <View className='flex-row items-center justify-center w-full'>
            <Text className='opacity-30'>Already you don't have an account ?</Text>
            <Pressable onPress={()=>router.push('../login/signIn')}>
              <Text className='font-bold text-green-600 opacity-100 '> Sign Up</Text>
            </Pressable>
        </View>
      </View> 
      </ScrollView>
        </KeyboardAvoidingView>
    </ScreenWrapper>
  )
}

export default signUp
