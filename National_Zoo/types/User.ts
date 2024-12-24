import type { Address } from "./Address";

export interface User{
    userId:Number,
    fullName:String,
    email:String,
    username:String,
    image:Object,
    address: Address
      
}