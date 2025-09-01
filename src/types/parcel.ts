// schemas/configuration.ts
import { z } from "zod";
import { Customer } from "./user";


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
  isActive: boolean
  createdAt: string
}

export interface CreateBranchRequest {
  name: string
  location: {
    longitude: number
    latitude: number
    description?: string
  }
  contact: {
    email: string
    phoneNumber: string
  }
}

export interface BranchLocationFilter {
  latitude?: number;
  longitude?: number;
}

export interface BranchFilter {
  name?: string;
  location?: BranchLocationFilter;
  isActive?: boolean;
  createdAfter?: string; // ISO 8601 date string
}

export interface BranchFetchOptions {
  filter?: BranchFilter;
}


export type DispatcherType = 'bus' | 'van' | 'truck' | 'motorcycle'

export interface Agent {
  agentId: string
  firstName: string
  lastName: string
}

export interface DispatcherResponse {
  dispatcherId: string
  dispatcherNumber: string
  type: DispatcherType
  agent: Agent
  available: boolean
}

export interface CreateDispatcherRequest {
  dispatcherNumber: string
  type: DispatcherType
  agentId: string
  available: boolean
}

export interface DispatcherFilterOptions {
  type?: DispatcherType
  available?: boolean
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

export interface SenderOrRecipient {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
}

export interface Agent {
  firstName: string
  lastName: string
}

export interface Dispatcher {
  dispatcherId: string
  dispatcherNumber: string
  type: 'van' | 'motorcycle' | 'bus' | 'truck'
  agent: Agent
  available: boolean
}

export type ParcelStatus = 'registered' | 'in-transit' | 'delivered' | 'available_for_pickup'|'returned'
export type DeliveryType = 'standard' | 'express' | 'regular' | 'same_day'
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
  deliveryDate: string
  origin: Branch
  destination: Branch
  weightKg: number
  dimension: Dimensions
  parcelType: ParcelType
  deliveryCost: DeliveryCost
  deliveryType: DeliveryType
  contentDescription: string
  sender: SenderOrRecipient
  recipient: SenderOrRecipient
  dispatcher: Dispatcher
  createdAt:string
}


// Type definitions
export interface CreateParcelRequest {
  senderName: string;
  senderPhoneNumber: string;
  recipientName: string;
  recipientPhoneNumber: string;
  deliveryType: 'STANDARD' | 'EXPRESS' | 'SAME_DAY';
  weightKg: number;
  dimension: {
    lengthCm: number;
    widthCm: number;
    heightCm: number;
  };
  originBranchId: string;
  destinationBranchId: string;
  dispatcherId: string;
  parcelType: string;
  contentDescription: string;
  insuranceValue: number;
  notes?: string;
}

export interface ParcelStatusChangeRequest {
  status: ParcelStatus
  notes?: string
  updatedBy?: string
}

export interface ParcelStatusChangeResponse{
  message: string
  status: ParcelStatus
}

export interface ParcelFetchOptions {
  status?: ParcelStatus[]
  originBranchId?: string
  destinationBranchId?: string
  serviceType?: string
  createdAtStart?: string
  createdAtEnd?: string
}


export interface ParcelTrackingResponse {
  parcelTrackingId: string
  status: ParcelStatus
  originBranch: Branch
  destinationBranch: Branch
  estimatedDeliveryTime: Date
  lastUpdatedTime: Date
}

// types/configuration.ts
export interface ConfigurationDto {
  // Limits
  maxParcelWeightKg: number
  maxParcelDimensionCm: number
  maxInsuranceValue: number

  // Delivery cost
  flatDeliveryCost: number
  deliveryBaseCost: number
  deliveryCostPerKg: number
  insurancePercentage: number
  ratePerDeliveryDistanceKm: number

  // Feature Toggles
  useFlatDeliveryCost: boolean
  useFlatDeliveryTypeFee: boolean
  useFlatParcelTypeFee: boolean

  // ParcelType Base Fees
  flatParcelTypeFee: number
  documentParcelTypeSurcharge: number
  fragileParcelTypeSurcharge: number
  oversizeParcelTypeSurcharge: number
  perishableParcelTypeSurcharge: number
  electronicsParcelTypeSurcharge: number
  clothingParcelTypeSurcharge: number
  furnitureParcelTypeSurcharge: number
  otherParcelTypeSurcharge: number

  // DeliveryType Surcharge Rates
  flatDeliveryTypeFee: number
  expressDeliverySurcharge: number
  standardDeliverySurcharge: number
  regularDeliverySurcharge: number
  sameDayDeliverySurcharge: number

  // Delivery Windows
  expressDeliveryWindow: number
  standardDeliveryWindow: number
  regularDeliveryWindow: number
  sameDayDeliveryWindow: number
}

// export const configurationSchema = z.object({
//   maxParcelWeightKg: z.number().positive(),
//   maxParcelDimensionCm: z.number().positive(),
//   maxInsuranceValue: z.number().min(0),

//   flatDeliveryCost: z.number().min(0),
//   deliveryBaseCost: z.number().min(0),
//   deliveryCostPerKg: z.number().min(0),
//   insurancePercentage: z.number().min(0),
//   ratePerDeliveryDistanceKm: z.number().min(0),

//   useFlatDeliveryCost: z.boolean(),
//   useFlatDeliveryTypeFee: z.boolean(),
//   useFlatParcelTypeFee: z.boolean(),

//   flatParcelTypeFee: z.number().min(0),
//   documentParcelTypeSurcharge: z.number().min(0),
//   fragileParcelTypeSurcharge: z.number().min(0),
//   oversizeParcelTypeSurcharge: z.number().min(0),
//   perishableParcelTypeSurcharge: z.number().min(0),
//   electronicsParcelTypeSurcharge: z.number().min(0),
//   clothingParcelTypeSurcharge: z.number().min(0),
//   furnitureParcelTypeSurcharge: z.number().min(0),
//   otherParcelTypeSurcharge: z.number().min(0),

//   flatDeliveryTypeFee: z.number().min(0),
//   expressDeliverySurcharge: z.number().min(0),
//   standardDeliverySurcharge: z.number().min(0),
//   regularDeliverySurcharge: z.number().min(0),
//   sameDayDeliverySurcharge: z.number().min(0),

//   expressDeliveryWindow: z.number().min(1),
//   standardDeliveryWindow: z.number().min(1),
//   regularDeliveryWindow: z.number().min(1),
//   sameDayDeliveryWindow: z.number().min(1),
// })

// export type ConfigurationForm = z.infer<typeof configurationSchema>