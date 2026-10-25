import type { ImageSlot } from "./types";

export interface Office {
  city: string;
  address: string;
  /** Longitude and latitude, used to place the marker on the map. */
  coordinates: readonly [number, number];
}

export const contactPerson: { name: string; role: string; photo: ImageSlot } = {
  name: "Jaed Al Zaber",
  role: "CEO & Creative Director",
  photo: { alt: "", width: 176, height: 176 },
};

export const contactChannels = {
  email: "simplexstudio.xyz@gmail.com",
  careers: "simplexstudio.xyz@gmail.com",
  // Swap for a booking link (e.g. a calendar page) when one is available.
  schedule: "mailto:simplexstudio.xyz@gmail.com?subject=Schedule%20a%20call",
  // International format, digits only. The WhatsApp button appears while this is set.
  whatsapp: "8801886626070",
  phone: "+880 1886-626070",
} as const;

// Lviv and Wroclaw street addresses were hidden in the supplied design; add them when confirmed.
export const offices: readonly Office[] = [
  { city: "Lviv", address: "Ukraine", coordinates: [24.03, 49.84] },
  { city: "Wroclaw", address: "Poland", coordinates: [17.04, 51.11] },
  { city: "Wilmington", address: "United States, Delaware, 1201 North Market Street, Suite 111", coordinates: [-75.55, 39.75] },
  { city: "New York", address: "United States, 1 Water St, Suite 10004, New York, NY", coordinates: [-74.01, 40.7] },
];

export const messageLimit = 500;
