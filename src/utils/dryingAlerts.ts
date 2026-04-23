export interface DryingAlert {
  type: 'over_drying' | 'under_drying' | 'optimal' | 'complete';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  action: string;
}

const TARGET_MOISTURE = 14;

export function analyzeDryingStatus(
  currentMoisture: number,
  targetMoisture: number = TARGET_MOISTURE,
  temperature: number,
): DryingAlert {
  if (currentMoisture < 10) {
    return {
      type: 'over_drying',
      severity: 'critical',
      message: 'OVER-DRYING DETECTED: Grain moisture below 10%',
      action: 'Stop dryer immediately to prevent grain cracking',
    };
  }

  if (currentMoisture <= targetMoisture && currentMoisture >= 10) {
    return {
      type: 'complete',
      severity: 'info',
      message: 'Drying complete! Safe storage moisture achieved',
      action: 'Stop dryer and transfer grains to storage',
    };
  }

  if (temperature > 65 && currentMoisture > 20) {
    return {
      type: 'over_drying',
      severity: 'warning',
      message: 'High temperature risk — grain cracking possible',
      action: 'Reduce temperature or increase fan speed',
    };
  }

  return {
    type: 'under_drying',
    severity: 'info',
    message: `Continue drying — current moisture: ${currentMoisture}%`,
    action: `Target: ${targetMoisture}% for safe storage`,
  };
}
