import type { Address } from "./Address";

export interface User{
    userId:Number,
    fullName:string,
    email:string,
    username:string,
    image:File | null,
    address: Address
      
}