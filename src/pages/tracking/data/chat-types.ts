import { ParcelStatus } from '@/types/parcel'
import { conversations } from './convo.json'

export type ChatUser = (typeof conversations)[number]
export type Convo = ChatUser['messages'][number]


// Additional interface for tracking history events
export interface TrackingEvent {
  timestamp: string // ISO 8601 format
  location: Location
  status: ParcelStatus
  description: string
  branchId?: string
  dispatcherId?: string
}