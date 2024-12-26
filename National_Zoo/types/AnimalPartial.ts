import type { Animal } from "./Animal";

export type AnimalPartial = Pick<Animal, "animalName" | "animalType" | "image">
  
