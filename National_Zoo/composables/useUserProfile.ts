import type { User } from "~/types/User";

const userProfile = ref(null);

export const useUserProfile = () => {

    const setUser = (userData:any) => {
        userProfile.value = userData;
    }


    const getUser = () => {
        return userProfile.value;
    }

    return { userProfile, setUser, getUser };
}