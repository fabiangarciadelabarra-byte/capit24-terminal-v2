"use client";

import { create } from "zustand";

export const useCountryStore = create((set) => ({
  country: null,
  setCountry: (code) => set({ country: code }),
}));
