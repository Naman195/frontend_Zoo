import type { Country } from "./Country";

export interface State {
    stateId: number | null;
    stateName?: string;
    country: Country;
  }