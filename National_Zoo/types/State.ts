import type { Country } from "./Country";

export interface State {
    stateId: number;
    stateName: string;
    country: Country;
  }