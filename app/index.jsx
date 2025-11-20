import { View, Text,Button} from "react-native";
import React, { useEffect } from "react";
import '../global.css';
import { useRouter } from "expo-router";
import ScreenWrapper from "../components/screenWrapper";
import SlapshScreen from '@/components/SlapshScreen';


export default function Index() {
    const router = useRouter();


    const time = setTimeout(()=>{
        <Text className="text-red-400 mt-10"> Bonjour le monde des teletobise</Text>
    }, 2000)

    useEffect(()=>{
        <Text>Bonjour le monde</Text>
    })


    return (
        <View>
            <SlapshScreen/>
        </View>
    );
}
