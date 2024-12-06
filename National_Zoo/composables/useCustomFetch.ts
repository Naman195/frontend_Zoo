import type { UseFetchOptions } from "#app";

export function useCustomFetch<T>(
    url: string,
    options: UseFetchOptions<T> = {},

) {
    const route = useRoute();
    const token = route.query.token;

    const defaults: UseFetchOptions<T> = {
        baseURL: "http://localhost:8080/api",
        headers: useCookie("auth").value ?
            {
                Authorization: `Bearer ${useCookie("auth").value}`
            } 
             :
             token ? {
                Authorization: `Bearer ${token}`
             } : {}
    };

    let mergeOptions = {}
    mergeOptions = {...defaults, ...options };
    return $fetch<T>(url, mergeOptions);
}


