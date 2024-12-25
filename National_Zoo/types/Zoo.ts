import type { Address } from "./Address";

export interface Zoo {
    zooId: number;
    fullName: string;
    zooName: string;
    address: Address;
    image: File | null;
  }