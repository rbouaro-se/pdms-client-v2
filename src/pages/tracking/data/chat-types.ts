import { conversations } from './convo.json'

export type ChatUser = (typeof conversations)[number]
export type Convo = ChatUser['messages'][number]

export interface Location {
  longitude: number
  latitude: number
  description: string | null
}

export interface Contact {
  phoneNumber: string
  email: string
}

export interface Branch {
  branchId: string
  name: string
  location: Location
  contact: Contact
}

export interface Dimensions {
  lengthCm: number
  widthCm: number
  heightCm: number
}

export interface DeliveryCost {
  baseFee: number
  parcelTypeSurcharge: number
  deliveryTypeSurcharge: number
  insuranceSurcharge: number
  deductions: number
  totalCost: number
}

export interface Person {
  name: string
  phoneNumber: string
}

export interface Agent {
  firstName: string
  lastName: string
}

export interface Dispatcher {
  dispatcherId: string
  dispatcherNumber: string
  type: 'van' | 'motorcycle' | 'bicycle' | 'truck'
  agent: Agent
  available: boolean
}

export type ParcelStatus = 'registered' | 'in-transit' | 'delivered' | 'failed'
export type DeliveryType = 'standard' | 'express' | 'priority'
export type ParcelType =
  | 'clothing'
  | 'electronics'
  | 'documents'
  | 'jewelry'
  | 'furniture'
  | 'food'
  | 'other'

export interface Parcel {
  parcelId: string
  status: ParcelStatus
  deliveryDate: string // ISO 8601 format
  origin: Branch
  destination: Branch
  weightKg: number
  dimension: Dimensions
  parcelType: ParcelType
  deliveryCost: DeliveryCost
  deliveryType: DeliveryType
  contentDescription: string
  sender: Person
  recipient: Person
  dispatcher: Dispatcher
  // Optional fields
  trackingHistory?: TrackingEvent[]
  specialInstructions?: string
  estimatedDeliveryTime?: string // ISO 8601 format
  actualDeliveryTime?: string | null // ISO 8601 format
}

// Additional interface for tracking history events
export interface TrackingEvent {
  timestamp: string // ISO 8601 format
  location: Location
  status: ParcelStatus
  description: string
  branchId?: string
  dispatcherId?: string
}