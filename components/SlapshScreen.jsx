import React, { useEffect } from 'react';
import { View, Text, Dimensions,Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import ScreenWrapper from '@/components/screenWrapper';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirection automatique après l'animation
    const timer = setTimeout(() => {
      router.replace('/(tabs)/welcome'); // Utilisez replace pour ne pas garder le splash dans l'historique
    }, 3500); // 3.5 secondes pour laisser le temps aux animations

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View>
      <View className="flex-1 justify-center items-center  bg-gradient-to-br from-green-400 to-green-600">
        {/* Animation du logo/icône */}
        <MotiView
          from={{
            scale: 0,
            rotate: '0deg',
            opacity: 0,
          }}
          animate={{
            scale: 1,
            rotate: '360deg',
            opacity: 1,
          }}
          transition={{
            type: 'spring',
            damping: 15,
            stiffness: 100,
            duration: 1000,
          }}
          className="mb-8"
        >
          <Image 
            source={require('../assets/images/chat.jpg')}
            resizeMode='contain'
            className='w-94 h-94'
          />
        </MotiView>

        {/* Animation du titre principal */}
        <MotiView
          from={{
            translateY: 50,
            opacity: 0,
          }}
          animate={{
            translateY: 0,
            opacity: 1,
          }}
          transition={{
            type: 'timing',
            duration: 800,
            delay: 500,
          }}
          className="items-center mb-6"
        >
          <Text className="text-4xl font-bold text-white mb-2">MyApp</Text>
          <Text className="text-lg text-white opacity-90 text-center px-8">
            Bienvenue dans votre nouvelle expérience
          </Text>
        </MotiView>

        {/* Animation de l'indicateur de chargement */}
        <MotiView
          from={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            type: 'timing',
            duration: 600,
            delay: 1000,
          }}
          className="absolute bottom-20"
        >
          {/* Indicateur de chargement animé */}
          <View className="flex-row gap-4 flex justify-center items-center">
            {[0, 1, 2].map((index) => (
              <MotiView
                key={index}
                from={{
                  scale: 1,
                  opacity: 0.3,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  type: 'timing',
                  duration: 800,
                  delay: index * 200 + 1200,
                  repeatReverse: false,
                  loop: true,
                }}
                className="w-3 h-3 bg-white rounded-full"
              />
            ))}
          </View>
          
 
        </MotiView>

        {/* Animation de fond décorative */}
        <MotiView
          from={{
            scale: 0,
            opacity: 0.1,
          }}
          animate={{
            scale: 2,
            opacity: 0.05,
          }}
          transition={{
            type: 'timing',
            duration: 2000,
            delay: 800,
          }}
          className="absolute -top-20 -right-20"
        >
          <View className="w-96 h-96 bg-white rounded-full" />
        </MotiView>

        <MotiView
          from={{
            scale: 0,
            opacity: 0.1,
          }}
          animate={{
            scale: 1.5,
            opacity: 0.03,
          }}
          transition={{
            type: 'timing',
            duration: 2500,
            delay: 1200,
          }}
          className="absolute -bottom-32 -left-32"
        >
          <View className="w-80 h-80 bg-white rounded-full" />
        </MotiView>
      </View>
    </View>
  );
};

export default SplashScreen;