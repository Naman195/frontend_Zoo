import type { State } from "./State";

export interface City {
    cityId: number | null;
    cityName?: string;
    state: State;
  }