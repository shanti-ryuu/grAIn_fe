import { useEffect, useState } from 'react'
import { ref, onValue, off } from 'firebase/database'
import { db } from '@/lib/firebase'
import { DeviceStatus } from '@/utils/enums'

export interface RealtimeSensorData {
  temperature: number
  humidity: number
  moisture: number
  fanSpeed: number
  energy: number
  status: string
  updatedAt: number
}

export function useRealtimeSensor(deviceId?: string) {
  const [sensorData, setSensorData] = useState<RealtimeSensorData | null>(null)
  const [isOnline, setIsOnline] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    if (!deviceId || !db) return

    const sensorRef = ref(db, `grain/devices/${deviceId}/sensors`)
    const statusRef = ref(db, `grain/devices/${deviceId}/status`)

    const unsubscribeSensor = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setSensorData(data)
        setLastUpdated(new Date())
      }
    })

    const unsubscribeStatus = onValue(statusRef, (snapshot) => {
      setIsOnline(snapshot.val() === DeviceStatus.Online)
    })

    return () => {
      off(sensorRef)
      off(statusRef)
    }
  }, [deviceId])

  return { sensorData, isOnline, lastUpdated }
}
