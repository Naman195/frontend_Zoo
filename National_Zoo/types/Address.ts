import type { City } from "./City";

export interface Address {
    street: string;
    zipCode: string;
    city: City;
  }