/* eslint-disable no-mixed-spaces-and-tabs */
import React, { Dispatch, SetStateAction } from 'react'
import { ColorPaletteProp } from '@mui/joy/styles'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { TAccountType } from './account'

export interface inputProps {
  name: string
  type: string
  className?: string
  placeholder: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  label: string
  value?: string
}

export interface IAPIError {
  data: {
    success: false
    timestamp: string
    path: string
    message: string
    errors: string[] | null
  }
  status: number
}

export type IAPIResponse<D> = {
  message: string
} & (
  | { success: true; data: D }
  | {
      success: false
      timestamp: string
      path: string
    }
)

export interface Page<T> {
  content: T[]
  pageable: Pageable
  totalElements: number
  totalPages: number
  last: boolean
  size: number
  number: number
  sort: Sort
  first: boolean
  numberOfElements: number
  empty: boolean
}

export interface Pageable {
  pageNumber?: number
  pageSize?: number
  sort?: string[]
}

export interface Sort {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

export interface IResponse<Data> {
  data?: Data
  error?: FetchBaseQueryError | SerializedError | IAPIError
}

export interface selectedSignUpOption {
  selected:
    | 'Packer'
    | 'Organisation'
    | 'Business'
    | 'Individual'
    | 'Rewards'
    | null
}

////////////////

export interface inputAuthenticationProps {
  name: string
  type: string
  placeholder: string
  classStyle?: string
  label: string
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export interface form {
  provider: 'Local' | 'Google' | 'Apple'
  firstName: string
  lastName: string
  email?: string
  password?: string
  confirmPassword?: string
  location: { coordinates: [number, number] }
  type: 'Business' | 'Individual' | 'Client'
  number: string
  googleToken: string
  appleToken: string
}

export type TRoute = {
  roles: TAccountType[]
  name: string
  icon: React.ElementType
  path: string
  hasChip: boolean
  children?: {
    roles: TAccountType[]
    name: string
    path: string
    hasChip: boolean
  }[]
}

export type TAlert = {
  title: string
  color: ColorPaletteProp
  icon: React.ReactElement
}

export type TFeedback = {
  title: string
  message: string
  color: ColorPaletteProp
  icon: React.ReactElement
}

export interface activeComponentProps {
  setActiveComponent: Dispatch<SetStateAction<string>>
  setStep: Dispatch<SetStateAction<number>>
  image: string | null
  setImage: Dispatch<SetStateAction<string | null>>
  setImageState: Dispatch<SetStateAction<string>>
  setForm: Dispatch<SetStateAction<form>>
}

export interface interestComponentProps {
  setActiveComponent: Dispatch<SetStateAction<string>>
  setStep: Dispatch<SetStateAction<number>>
  setImageState: Dispatch<SetStateAction<string>>
  selectedOption: Dispatch<
    SetStateAction<
      'Packer' | 'Organisation' | 'Business' | 'Individual' | 'Rewards' | null
    >
  >
  selected: string | null
  setForm: Dispatch<SetStateAction<form>>
}

export interface extraInterestProps {
  setActiveComponent: Dispatch<SetStateAction<string>>
  setStep: Dispatch<SetStateAction<number>>
  setImageState: Dispatch<SetStateAction<string>>
  setForm: Dispatch<SetStateAction<form>>
  handleSubmit: () => void
  handleVerifyAccount: (field: string, code: string) => void
  checkVerification?: string
  handleVerifyEmail: () => void
}

export interface dashBoardTableProps {
  customer: string
  appointment: string
  date: number
  total: number
  status: string
}

export interface ParcelStatistics {
  totalParcels: number
  monthlyGrowthPercentage: number
  currentMonthName: string
  previousMonthName: string

  inTransitParcels: number
  inTransitPercentage: number

  deliveredParcels: number
  deliveredPercentage: number

  pendingParcels: number
  dueToday: number

  // Revenue stats
  totalRevenue: number
  monthlyRevenue: number
  monthlyRevenueGrowth: number
  monthlyRevenueGrowthPercentage: number
  weeklyRevenue: number
  weeklyRevenueGrowthPercentage: number
  dailyRevenue: number
  dailyRevenueGrowthPercentage: number
  deliveredRevenue: number
  inTransitRevenue: number
}

export interface DashboardStats {
  total: {
    value: number
    comparison: {
      value: number
      percentage: number
      period: string
      trend: 'up' | 'down' | 'stable'
    }
  }
  inTransit: {
    value: number
    percentage: number
  }
  delivered: {
    value: number
    percentage: number
  }
  pending: {
    value: number
    dueToday: number
  }
}

export interface MonthlyParcelStats {
  month: string
  total: number
  registered: number
  inTransit: number
  availableForPickup: number
  delivered: number
  returned: number
  // totalRevenue: number
  // registeredRevenue: number
  // inTransitRevenue: number
  // availableForPickupRevenue: number
  // deliveredRevenue: number
  // returnedRevenue: number
}

export interface RecentDelivery {
  parcelId: string
  recipient: {
    name: string
    email?: string
    phone: string
  }
  status:
    | 'REGISTERED'
    | 'IN_TRANSIT'
    | 'AVAILABLE_FOR_PICKUP'
    | 'DELIVERED'
    | 'RETURNED'
  lastUpdateTime: string
  destination: string
  deliveryTimeDisplay: string
}

// Map backend status to frontend status
export const statusMapping = {
  REGISTERED: 'pending',
  IN_TRANSIT: 'in-transit',
  AVAILABLE_FOR_PICKUP: 'pending',
  DELIVERED: 'delivered',
  RETURNED: 'pending',
} as const

export type FrontendStatus = 'delivered' | 'in-transit' | 'pending' | 'available_for_pickup' | 'returned'