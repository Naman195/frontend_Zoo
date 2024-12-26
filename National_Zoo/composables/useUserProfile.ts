const userProfile = ref(null);

export const useUserProfile = () => {

    const setUser = (userData) => {
        userProfile.value = userData;
    }


    const getUser = () => {
        return userProfile.value;
    }

    return { userProfile, setUser, getUser };
}