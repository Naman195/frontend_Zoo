import type { Zoo } from "./Zoo";

export interface Animal {
    animalId: string;
    animalName: string;
    animalType: string;
    image: String | null;
    zoo: Zoo;
  }[]