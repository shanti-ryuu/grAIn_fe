import { useState, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────

export interface SensorInput {
  temperature: number;   // °C
  humidity: number;      // %
  moisture: number;      // current grain moisture %
  fanSpeed: number;      // %
  timeElapsed: number;   // minutes since drying started
  solarVoltage?: number; // V (optional)
}

export interface AIPrediction {
  predictedMoisture30min: number;
  estimatedMinutesToTarget: number;
  recommendation: string;
  recommendationType: 'optimal' | 'warning' | 'critical';
  efficiencyScore: number;   // 0–100
  confidence: number;        // 0–100
  isDryingComplete: boolean;
  projectedMoistureCurve: { time: number; moisture: number }[];
}

// ─── Physics-based drying model (Page's equation simplified) ────

const TARGET_MOISTURE = 14;  // % wet basis — safe storage for rice
const MIN_MOISTURE = 10;     // % — below this = over-drying risk
const OPT_TEMP_MIN = 40;     // °C
const OPT_TEMP_MAX = 60;     // °C
const OPT_HUMIDITY_MAX = 60; // %
const OPT_FAN_MIN = 70;      // %
const OPT_FAN_MAX = 90;      // %

function calculateDryingRate(temp: number, fanSpeed: number): number {
  // Base moisture loss per minute (empirical for thin-layer rice drying)
  const baseRate = 0.008;
  const tempFactor = (temp - 30) / 40;   // normalize 30–70°C
  const fanFactor = fanSpeed / 100;
  return baseRate * (1 + tempFactor * 0.6) * (0.4 + fanFactor * 0.6);
}

function predictMoisture(
  currentMoisture: number,
  minutesAhead: number,
  dryingRate: number,
): number {
  const predicted = currentMoisture - dryingRate * minutesAhead;
  return Math.max(MIN_MOISTURE, predicted);
}

function estimateTimeToTarget(
  currentMoisture: number,
  targetMoisture: number,
  dryingRate: number,
): number {
  if (currentMoisture <= targetMoisture) return 0;
  if (dryingRate <= 0) return Infinity;
  return Math.ceil((currentMoisture - targetMoisture) / dryingRate);
}

function generateRecommendation(input: SensorInput): {
  text: string;
  type: 'optimal' | 'warning' | 'critical';
} {
  if (input.moisture <= TARGET_MOISTURE) {
    return {
      text: 'Target moisture reached — drying complete! Stop dryer to prevent over-drying',
      type: 'optimal',
    };
  }
  if (input.temperature > 65) {
    return {
      text: 'Temperature too high — reduce heating by 5°C to prevent grain cracking',
      type: 'critical',
    };
  }
  if (input.temperature < 35) {
    return {
      text: 'Temperature too low — increase heating for faster drying',
      type: 'warning',
    };
  }
  if (input.fanSpeed < 50) {
    return {
      text: `Increase fan speed to ${Math.min(input.fanSpeed + 20, 85)}% for better airflow`,
      type: 'warning',
    };
  }
  if (input.humidity > 70) {
    return {
      text: 'High ambient humidity detected — increase exhaust fan speed',
      type: 'warning',
    };
  }
  return {
    text: 'Optimal drying conditions — maintain current settings',
    type: 'optimal',
  };
}

function calculateEfficiency(input: SensorInput): number {
  let score = 100;
  // Temperature penalty
  if (input.temperature < OPT_TEMP_MIN) score -= (OPT_TEMP_MIN - input.temperature) * 2;
  if (input.temperature > OPT_TEMP_MAX) score -= (input.temperature - OPT_TEMP_MAX) * 3;
  // Humidity penalty
  if (input.humidity > OPT_HUMIDITY_MAX) score -= (input.humidity - OPT_HUMIDITY_MAX) * 1.5;
  // Fan speed penalty
  if (input.fanSpeed < OPT_FAN_MIN) score -= (OPT_FAN_MIN - input.fanSpeed) * 0.5;
  if (input.fanSpeed > OPT_FAN_MAX) score -= (input.fanSpeed - OPT_FAN_MAX) * 0.3;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function calculateConfidence(input: SensorInput): number {
  // Higher confidence when conditions are stable and within optimal ranges
  let confidence = 70; // base
  if (input.temperature >= OPT_TEMP_MIN && input.temperature <= OPT_TEMP_MAX) confidence += 10;
  if (input.humidity <= OPT_HUMIDITY_MAX) confidence += 8;
  if (input.fanSpeed >= OPT_FAN_MIN && input.fanSpeed <= OPT_FAN_MAX) confidence += 7;
  if (input.timeElapsed > 30) confidence += 5; // more data = more confidence
  return Math.min(100, confidence);
}

function generateMoistureCurve(
  currentMoisture: number,
  dryingRate: number,
): { time: number; moisture: number }[] {
  return Array.from({ length: 13 }, (_, i) => ({
    time: i * 30,
    moisture: Math.max(MIN_MOISTURE, currentMoisture - dryingRate * i * 30),
  }));
}

// ─── Main prediction function ─────────────────────────────

export function runPrediction(input: SensorInput): AIPrediction {
  const dryingRate = calculateDryingRate(input.temperature, input.fanSpeed);
  const predictedMoisture30min = predictMoisture(input.moisture, 30, dryingRate);
  const estimatedMinutesToTarget = estimateTimeToTarget(input.moisture, TARGET_MOISTURE, dryingRate);
  const recommendation = generateRecommendation(input);
  const efficiencyScore = calculateEfficiency(input);
  const confidence = calculateConfidence(input);
  const isDryingComplete = input.moisture <= TARGET_MOISTURE;
  const projectedMoistureCurve = generateMoistureCurve(input.moisture, dryingRate);

  return {
    predictedMoisture30min: Math.round(predictedMoisture30min * 10) / 10,
    estimatedMinutesToTarget,
    recommendation: recommendation.text,
    recommendationType: recommendation.type,
    efficiencyScore,
    confidence,
    isDryingComplete,
    projectedMoistureCurve,
  };
}

// ─── Hook ─────────────────────────────────────────────────

export function useAIPrediction(sensorInput: SensorInput | null) {
  const [prediction, setPrediction] = useState<AIPrediction | null>(null);

  const compute = useCallback(() => {
    if (!sensorInput) return;
    const result = runPrediction(sensorInput);
    setPrediction(result);
  }, [sensorInput]);

  useEffect(() => {
    compute();
  }, [compute]);

  return { prediction, recompute: compute };
}
