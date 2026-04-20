import { ref, update, get } from "firebase/database";
import { db } from "../services/firebase";
import type { Zone } from "../services/venueData";

let simulationInterval: ReturnType<typeof setInterval> | null = null;

const crowdLevels: Zone['crowdLevel'][] = ["low", "medium", "high"];

const getRandomWaitTime = (level: Zone['crowdLevel']) => {
  if (level === "low") return Math.floor(Math.random() * 5) + 1;
  if (level === "medium") return Math.floor(Math.random() * 10) + 6;
  return Math.floor(Math.random() * 10) + 16;
};

export const startSimulation = () => {
  if (simulationInterval) return;

  console.log("Starting crowd simulation...");
  simulationInterval = setInterval(async () => {
    try {
      const zonesRef = ref(db, 'zones');
      const snapshot = await get(zonesRef);
      const zones = snapshot.val() as Record<string, Zone>;

      if (!zones) return;

      const keys = Object.keys(zones);
      // Randomly select 2 zones to shift
      const selectedIndices = new Set<number>();
      while (selectedIndices.size < 2) {
        selectedIndices.add(Math.floor(Math.random() * keys.length));
      }

      const updates: Record<string, any> = {};

      selectedIndices.forEach(index => {
        const key = keys[index];
        const zone = zones[key];
        
        // Shift crowd level up or down
        const currentLevelIndex = crowdLevels.indexOf(zone.crowdLevel);
        const direction = Math.random() > 0.5 ? 1 : -1;
        let newLevelIndex = currentLevelIndex + direction;

        // Clamp to 0-2
        if (newLevelIndex < 0) newLevelIndex = 0;
        if (newLevelIndex > 2) newLevelIndex = 2;

        const newLevel = crowdLevels[newLevelIndex];
        
        updates[`${key}/crowdLevel`] = newLevel;
        updates[`${key}/waitTime`] = getRandomWaitTime(newLevel);
      });

      await update(zonesRef, updates);
      console.log("Simulation step complete: Updated 2 zones.");
    } catch (error) {
      console.error("Simulation error:", error);
    }
  }, 20000); // Every 20 seconds
};

export const stopSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    console.log("Simulation stopped.");
  }
};
