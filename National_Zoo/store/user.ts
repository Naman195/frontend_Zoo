import { defineStore } from "pinia";
import type { User } from "~/types/User";

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as User | null
    }), 

    actions: {
        setUser(userData: User) {
            this.user = userData;

            const userCookie = useCookie('user')
            userCookie.value = JSON.stringify(userData);
        },

        removeUser(){
            this.user = null;

            const userCookie = useCookie('user');
            userCookie.value = null;

        },


    },

    persist: true

})



// {
//     key: 'user',
//     storage: {
//         getItem: (key: string) => {
//             const cookie = useCookie(key);
//             return cookie.value ? JSON.parse(cookie.value) : null;
//         },

//         setItem: (key: string, value: string) => {
//             const cookie = useCookie(key);
//             cookie.value = JSON.stringify(value)
//         },

//         removeItem: (key: string) => {
//             const cookie = useCookie(key)
//             cookie.value = null
//         }


//     }
// }