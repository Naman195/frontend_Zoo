import type { User } from "./User";

export interface userLogin{
    
        message: string;
        token: string | null;
        userId: number | null;
        username: string | null;
        user: User | null; 
      
}