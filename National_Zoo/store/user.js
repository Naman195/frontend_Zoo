import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null 
    }), 

    actions: {
        setUser(userData) {
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

    persist: {
        storage: {
            getItem: (key) => {
                const cookie = useCookie(key);
                return cookie.value ? JSON.parse(cookie) : null;
            },

            setItem: (key, value) => {
                const cookie = useCookie(key);
                cookie.value = JSON.stringify(value)
            },

            removeItem: (key) => {
                const cookie = useCookie(key)
                cookie.value = null
            }


        }
    }

})