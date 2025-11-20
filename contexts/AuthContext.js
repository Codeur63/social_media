import {createContext, useState, useContext} from 'react';
import AlertMessage from '@/components/alertMessage';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
    const [user, setUser] = useState(null);
    const [alert, setAlert] = useState(false)

    const setAuth = authUser => setUser(authUser);

    const setUserData = userData => setUser({...userData});

    
    const logout = async () => {
        const {error} = await supabase.auth.signOut();

         if(error){
            console.log(error);
                <AlertMessage
                    children={'Sign Out Success'}
                    duration={500}
                    onClose={()=>setAlert(true)}
               />
            }
        
        if (!user) {
            router.replace('./signIn');
            return null;
        }
        router.replace('/(tabs)/welcome')     

        setUser(null);
    }

    return (
        <AuthContext.Provider value = {{user, setAuth, setUserData,logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);