import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';

// Types for Apple Health data
interface HealthKitSample {
  value: number;
  startDate: string;
  endDate: string;
  sourceName?: string;
}

// Dynamic import to avoid errors on non-native platforms
let CapacitorHealthkit: any = null;

const loadHealthKit = async () => {
  if (CapacitorHealthkit) return CapacitorHealthkit;
  try {
    const mod = await import('@perfood/capacitor-healthkit');
    CapacitorHealthkit = mod.CapacitorHealthkit;
    return CapacitorHealthkit;
  } catch {
    return null;
  }
};

export const isAppleHealthAvailable = (): boolean => {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios';
};

export const requestAppleHealthPermissions = async (): Promise<boolean> => {
  if (!isAppleHealthAvailable()) return false;

  const hk = await loadHealthKit();
  if (!hk) return false;

  try {
    await hk.requestAuthorization({
      all: [],
      read: [
        'HKQuantityTypeIdentifierHeartRate',
        'HKQuantityTypeIdentifierStepCount',
        'HKQuantityTypeIdentifierOxygenSaturation',
        'HKQuantityTypeIdentifierBloodPressureSystolic',
        'HKQuantityTypeIdentifierBloodPressureDiastolic',
        'HKCategoryTypeIdentifierSleepAnalysis',
      ],
      write: [],
    });
    return true;
  } catch (error) {
    console.error('Apple Health permission error:', error);
    return false;
  }
};

export const syncAppleHealthData = async (userId: string): Promise<{
  heartRate?: number;
  steps?: number;
  spo2?: number;
  systolic?: number;
  diastolic?: number;
}> => {
  if (!isAppleHealthAvailable()) throw new Error('Apple Health not available');

  const hk = await loadHealthKit();
  if (!hk) throw new Error('HealthKit plugin not loaded');

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  const results: Record<string, any> = {};

  // Heart Rate - latest reading
  try {
    const hrData = await hk.queryHKitSampleType({
      sampleName: 'HKQuantityTypeIdentifierHeartRate',
      startDate: yesterday,
      endDate: now.toISOString(),
      limit: 1,
    });

    if (hrData?.resultData?.length > 0) {
      const bpm = Math.round(hrData.resultData[0].value * 60); // Apple returns count/s
      results.heartRate = bpm;

      await supabase.from('wearable_heart_rate').insert({
        user_id: userId,
        source: 'apple_health',
        bpm,
        heart_rate_type: 'resting',
        measured_at: hrData.resultData[0].startDate,
      });
    }
  } catch (e) {
    console.warn('HR sync failed:', e);
  }

  // Steps - today total
  try {
    const stepsData = await hk.queryHKitSampleType({
      sampleName: 'HKQuantityTypeIdentifierStepCount',
      startDate: todayStart,
      endDate: now.toISOString(),
      limit: 0, // all samples
    });

    if (stepsData?.resultData?.length > 0) {
      const totalSteps = stepsData.resultData.reduce(
        (sum: number, s: HealthKitSample) => sum + s.value, 0
      );
      results.steps = Math.round(totalSteps);

      const today = now.toISOString().split('T')[0];
      await supabase.from('wearable_steps').upsert({
        user_id: userId,
        source: 'apple_health',
        step_count: Math.round(totalSteps),
        date: today,
      }, { onConflict: 'user_id,source,date' });
    }
  } catch (e) {
    console.warn('Steps sync failed:', e);
  }

  // SpO2
  try {
    const spo2Data = await hk.queryHKitSampleType({
      sampleName: 'HKQuantityTypeIdentifierOxygenSaturation',
      startDate: yesterday,
      endDate: now.toISOString(),
      limit: 1,
    });

    if (spo2Data?.resultData?.length > 0) {
      const value = Math.round(spo2Data.resultData[0].value * 100); // Apple returns 0-1
      results.spo2 = value;

      await supabase.from('wearable_spo2').insert({
        user_id: userId,
        source: 'apple_health',
        spo2_value: value,
        measured_at: spo2Data.resultData[0].startDate,
      });
    }
  } catch (e) {
    console.warn('SpO2 sync failed:', e);
  }

  // Blood Pressure
  try {
    const sysData = await hk.queryHKitSampleType({
      sampleName: 'HKQuantityTypeIdentifierBloodPressureSystolic',
      startDate: yesterday,
      endDate: now.toISOString(),
      limit: 1,
    });
    const diaData = await hk.queryHKitSampleType({
      sampleName: 'HKQuantityTypeIdentifierBloodPressureDiastolic',
      startDate: yesterday,
      endDate: now.toISOString(),
      limit: 1,
    });

    if (sysData?.resultData?.length > 0 && diaData?.resultData?.length > 0) {
      const systolic = Math.round(sysData.resultData[0].value);
      const diastolic = Math.round(diaData.resultData[0].value);
      results.systolic = systolic;
      results.diastolic = diastolic;

      await supabase.from('wearable_blood_pressure').insert({
        user_id: userId,
        source: 'apple_health',
        systolic,
        diastolic,
        measured_at: sysData.resultData[0].startDate,
      });
    }
  } catch (e) {
    console.warn('BP sync failed:', e);
  }

  // Update wearable_connections
  const existingConn = await supabase
    .from('wearable_connections')
    .select('id')
    .eq('user_id', userId)
    .eq('provider', 'apple_health')
    .maybeSingle();

  if (existingConn.data) {
    await supabase.from('wearable_connections').update({
      last_sync_at: now.toISOString(),
      sync_status: 'synced',
      is_active: true,
    }).eq('id', existingConn.data.id);
  } else {
    await supabase.from('wearable_connections').insert({
      user_id: userId,
      provider: 'apple_health',
      is_active: true,
      last_sync_at: now.toISOString(),
      sync_status: 'synced',
    });
  }

  return results;
};

export const disconnectAppleHealth = async (userId: string): Promise<void> => {
  await supabase
    .from('wearable_connections')
    .update({ is_active: false })
    .eq('user_id', userId)
    .eq('provider', 'apple_health');
};
