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
  gate_a:     { name: "Gate A",           type: "gate",       crowdLevel: "medium", waitTime: 8,  isOpen: true,  capacity: 65 },
  gate_b:     { name: "Gate B",           type: "gate",       crowdLevel: "high",   waitTime: 18, isOpen: true,  capacity: 85 }, // Lowered from 92 to avoid instant emergency
  gate_c:     { name: "Gate C",           type: "gate",       crowdLevel: "low",    waitTime: 2,  isOpen: true,  capacity: 30 },
  gate_d:     { name: "Gate D",           type: "gate",       crowdLevel: "low",    waitTime: 0,  isOpen: false, capacity: 10 },
  food_north: { name: "Food Court North", type: "food",       crowdLevel: "high",   waitTime: 22, isOpen: true,  capacity: 75 }, // Lowered
  food_south: { name: "Food Court South", type: "food",       crowdLevel: "medium", waitTime: 12, isOpen: true,  capacity: 55 },
  burger_zone:{ name: "Burger Zone",      type: "food",       crowdLevel: "low",    waitTime: 5,  isOpen: true,  capacity: 20 },
  pizza_hub:  { name: "Pizza Hub",        type: "food",       crowdLevel: "medium", waitTime: 9,  isOpen: true,  capacity: 48 },
  rest_east:  { name: "Restrooms East",   type: "restroom",   crowdLevel: "low",    waitTime: 1,  isOpen: true,  capacity: 15 },
  rest_west:  { name: "Restrooms West",   type: "restroom",   crowdLevel: "medium", waitTime: 6,  isOpen: true,  capacity: 42 },
  vip_lounge: { name: "VIP Lounge",       type: "lounge",     crowdLevel: "low",    waitTime: 0,  isOpen: true,  capacity: 25 },
  main_arena: { name: "Main Arena",       type: "arena",      crowdLevel: "medium", waitTime: 0,  isOpen: true,  capacity: 71 }
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
    // Explicitly call with null to trigger fallback
    callback(null);
  });

  return () => off(zonesRef);
};
