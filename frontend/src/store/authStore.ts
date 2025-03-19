import { create } from "zustand";
import { persist } from "zustand/middleware"; 


interface User {
    id:string;
    name:string;
    email:string;
}
type UserRole = 'user' | 'company' | 'admin';
interface AuthState {
    user:User|null;
    accessToken:string|null;
    isAuthenticated:()=>boolean;
    role:UserRole|null;

    login:(payload:{user:User,accessToken:string;role:UserRole})=>void;
    logout:()=>void;
    setAccessToken:(accessToken:string)=>void;

}

export const useAuthStore = create<AuthState>()(
    persist(
        (set,get)=> ({
            // initialState
            user:null,
            accessToken:null,
            role:null,
            isAuthenticated:()=>!!get().accessToken,

            login:({user,accessToken,role})=> {
                set({
                    user,
                    accessToken,
                    role
                })
            },
            logout:()=>{
                set({
                    user:null,
                    accessToken:null,
                    role:null
                })
            },
            setAccessToken:(accessToken)=>{
                set({
                    accessToken
                })
            }
        }),
        {
            name:"auth-storage",
            partialize:(state)=>({
                user:state.user,
                role:state.role,
                accessToken:state.accessToken
            })
        }
    )
)