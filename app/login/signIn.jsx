import { View, Text,TextInput, Pressable, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import React, {useState, useRef} from 'react';
import ScreenWrapper from '@/components/screenWrapper';
import ButtonBack from '@/components/ButtonBack';
import {Colors} from '@/constants/theme';
import Email from '@/components/icons/Email';
import Password from '@/components/icons/Password';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import { MotiView, AnimatePresence } from 'moti';
import Person from '@/components/icons/Person';
import { supabase } from '@/lib/supabase';
import AlertMessage from '@/components/alertMessage';


const signIn = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [alert, setAlert] = useState(false);

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const onSubmit = async() => {

    setLoading(true);

    if(!email.trim() || !password.trim() || !name){
      setError('Please enter a correct information.')
      return;
    }

    if (!validateEmail(email)) {
      setError('Your email is not valid');
      return;
    }

    if(password !== confirmPassword){
      setError('Your password is not valid');
      return;
    }

    setLoading(true);
    setAlert(true);

    const {data : {session},  error} = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    console.log('session:', session);
    console.log('error:', error);

    if(error){
      <AlertMessage
      children={error.message}
      onClose={()=>setAlert(true)}
      />
    }

    setTimeout(() => {
      setLoading(true);
      router.push('../login/signUp');
      <AlertMessage
      children="Votre compte à bien été enregistrer !"
      duration={1000}
      onClose={()=>setAlert(true)}
      />
    }, 2000);
    console.log('Formulaire soumis avec :', { email, password });
  }


  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        keyboardVerticalOffset={20}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='gap-5'
      >
      <ScrollView
        className='' showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" bounces={true}
      >        
      <View className='flex-1 items-start gap-10 mx-5 pt-5'>
        <ButtonBack/>
        <View className=''>
          <Text className='font-bold text-5xl text-green-600'>Let's,</Text>
          <Text className='font-bold text-5xl text-green-600'>Get Started</Text>
        </View>
        <View className='gap-8 w-full flex-col'>
        <Text className='text-gray-500 opacity-60'> Please enter your details, </Text>
        

        <View className='flex-row items-center gap-2 border rounded-2xl border-gray-300 p-2'>
            <Person/>
            <TextInput placeholder='Enter your name' className='w-full font-bold text-[16px] opacity-50' value={name} onChangeText={setName}/>
          </View>
          <View className='flex-row items-center gap-2 border rounded-2xl border-gray-300 p-2'>
            <Email/>
            <TextInput placeholder='Enter your email' className='w-full font-bold text-[16px] opacity-50' value={email} onChangeText={setEmail}/>
          </View>
          <View className='flex-row items-center gap-2 border rounded-xl border-gray-300 p-2'>
            <Password/>
            <TextInput placeholder='Enter your password' className='w-full font-bold text-[16px] opacity-50' secureTextEntry={true} value={password} onChangeText={setPassword}/>
          </View>
          <View className='flex-row items-center gap-2 border rounded-xl border-gray-300 p-2'>
            <Password/>
            <TextInput placeholder='Confirm your password' className='w-full font-bold text-[16px] opacity-50' secureTextEntry={true} value={confirmPassword} onChangeText={setConfirmPassword}/>
          </View>

          { alert && <AlertMessage
          children="Votre compte à bien été enregistrer !"
          duration={1000}
          onClose={()=>{setAlert(false)}}
        />
          }

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

          <Button
          title='Sign Up'
          buttonStyle='bg-green-600 rounded-xl py-4 w-full'
          textStyle='text-2xl text-white'
          onPress={onSubmit}
          loading={loading}
          hasShadow={true}
          />
        </View>
        <View className='flex-row items-center justify-center w-full'>
            <Text className='opacity-30'>Don't have an account ?</Text>
            <Pressable onPress={()=>router.push('../login/signUp')}>
              <Text className='font-bold text-green-600 opacity-100 '> Sign In</Text>
            </Pressable>
        </View>
      </View> 
      </ScrollView>
      </KeyboardAvoidingView>
      
    </ScreenWrapper>
  )
}

export default signIn
