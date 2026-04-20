import { ref, set, onValue, off } from "firebase/database";
import { db } from "./firebase";

export interface Zone {
  name: string;
  type: string;
  crowdLevel: "low" | "medium" | "high";
  waitTime: number;
  isOpen: boolean;
  capacity: number;
}

export const initialZones: Record<string, Zone> = {
  gate_north: { name: "North Gate", type: "gate", crowdLevel: "medium", waitTime: 8, isOpen: true, capacity: 45 },
  gate_south: { name: "South Gate", type: "gate", crowdLevel: "high", waitTime: 18, isOpen: true, capacity: 82 },
  gate_east:  { name: "East Gate", type: "gate", crowdLevel: "low", waitTime: 2, isOpen: true, capacity: 25 },
  gate_west:  { name: "West Gate", type: "gate", crowdLevel: "low", waitTime: 0, isOpen: true, capacity: 15 },
  section_a:  { name: "Section A", type: "seat", crowdLevel: "medium", waitTime: 0, isOpen: true, capacity: 65 },
  section_b:  { name: "Section B", type: "seat", crowdLevel: "high", waitTime: 0, isOpen: true, capacity: 88 },
  section_c:  { name: "Section C", type: "seat", crowdLevel: "low", waitTime: 0, isOpen: true, capacity: 35 },
  section_d:  { name: "Section D", type: "seat", crowdLevel: "low", waitTime: 0, isOpen: true, capacity: 20 },
  food_north: { name: "Food Court North", type: "food", crowdLevel: "high", waitTime: 22, isOpen: true, capacity: 78 },
  food_south: { name: "Food Court South", type: "food", crowdLevel: "medium", waitTime: 12, isOpen: true, capacity: 52 },
  rest_ne:    { name: "Restrooms NE", type: "restroom", crowdLevel: "low", waitTime: 1, isOpen: true, capacity: 30 },
  rest_sw:    { name: "Restrooms SW", type: "restroom", crowdLevel: "medium", waitTime: 6, isOpen: true, capacity: 48 },
  concourse:  { name: "Main Concourse", type: "area", crowdLevel: "medium", waitTime: 0, isOpen: true, capacity: 55 },
  pitch:      { name: "Field / Pitch", type: "arena", crowdLevel: "low", waitTime: 0, isOpen: true, capacity: 0 }
};

export const seedVenueData = async () => {
  try {
    const venueRef = ref(db, 'zones');
    await set(venueRef, initialZones);
    console.log("Venue data seeded successfully");
  } catch (error) {
    console.error("Error seeding venue data:", error);
  }
};

export const subscribeToZones = (callback: (zones: Record<string, Zone> | null) => void) => {
  const zonesRef = ref(db, 'zones');
  onValue(zonesRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  }, (error) => {
    console.error("Firebase subscription error:", error);
    callback(null);
  });

  return () => off(zonesRef);
};
