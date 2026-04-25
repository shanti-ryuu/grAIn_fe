import { SensorThreshold } from '@/utils/enums';

export interface DryingAlert {
  type: 'over_drying' | 'under_drying' | 'complete' | 'normal';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  action: string;
}

const TARGET_MOISTURE = SensorThreshold.MoistureTarget;

export function analyzeDryingStatus(
  currentMoisture: number,
  targetMoisture: number = TARGET_MOISTURE,
  temperature: number,
): DryingAlert {
  if (currentMoisture < SensorThreshold.MoistureMin) {
    return {
      type: 'over_drying',
      severity: 'critical',
      message: 'OVER-DRYING DETECTED: Grain moisture below 10%',
      action: 'Stop dryer immediately to prevent grain cracking',
    };
  }

  if (currentMoisture <= targetMoisture && currentMoisture >= SensorThreshold.MoistureMin) {
    return {
      type: 'complete',
      severity: 'info',
      message: 'Drying complete! Safe storage moisture achieved',
      action: 'Stop dryer and transfer grains to storage',
    };
  }

  if (temperature > SensorThreshold.HighTempRisk) {
    return {
      type: 'over_drying',
      severity: 'warning',
      message: 'High temperature risk — grain cracking possible',
      action: 'Reduce temperature or increase fan speed',
    };
  }

  return {
    type: 'normal',
    severity: 'info',
    message: `Continue drying — current moisture: ${currentMoisture}%`,
    action: `Target: ${targetMoisture}% for safe storage`,
  };
}
