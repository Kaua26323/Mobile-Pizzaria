import React, { useState, createContext, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../services/api";

type AuthContextData = {
  user: UserProps | null;
  isAuthenticated: boolean;
  loading:         boolean;
  loadingAuth:     boolean;
  signIn:  (credentiils: SingInProps) => Promise<void>;
  signOut: () => Promise<void>;
};

type UserProps = {
  id:    string;
  name:  string;
  email: string;
  token: string;
};

type AuthProviderProps = {
  children: ReactNode;
}

type SingInProps = {
  email:    string;
  password: string;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps){
  const [user, setUser] = useState<UserProps | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const isAuthenticated = !!user?.name;

  useEffect(() => {
    async function getUser(){
      const userInfo = await AsyncStorage.getItem('@sujeitopizzaria');
      let hasUser: UserProps = JSON.parse(userInfo || '{}');

      if(Object.keys(hasUser).length > 0){
        api.defaults.headers.common["Authorization"] = `Bearer ${hasUser.token}`;
        setUser(hasUser);
      }

      setLoading(false);
    };

    getUser();
  }, [])

  async function signIn({email, password}: SingInProps){ 
    setLoadingAuth(true);
      
    try{
      const response = await api.post<UserProps>("/session", {
        email,
        password
      });

      const data = {
        ...response.data
      }

      await AsyncStorage.setItem('@sujeitopizzaria', JSON.stringify(data));
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      setUser(response.data);

    }catch(err){
      console.log(err);
      alert("Algo deu errado");

    } finally {
      setLoadingAuth(false);
    }
  }

  async function signOut(){
    try{
      await AsyncStorage.clear();
      setUser(null);

    }catch(err){
      console.error(err);
      alert("Erro ao fazer o logOut");
    }
  }

  return(
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        loadingAuth,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>

  )
};
