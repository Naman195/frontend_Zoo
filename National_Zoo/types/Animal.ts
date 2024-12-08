import type { Zoo } from "./Zoo";

export interface Animal {
    animalId: string;
    animalName: string;
    animalType: string;
    zoo: Zoo;
  }