import { IconCash, IconShield, IconUsersGroup, IconUserShield } from '@tabler/icons-react';
// import { UserStatus } from './schema'

// export const callTypes = new Map<UserStatus, string>([
//   ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
//   ['inactive', 'bg-neutral-300/40 border-neutral-300'],
//   ['invited', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
//   [
//     'suspended',
//     'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
//   ],
// ])

import { Branch } from '@/types/parcel';


export const dummyBranches: Branch[] = [
  {
    branchId: 'BR-001',
    name: 'Downtown Main Branch',
    location: {
      longitude: -73.935242,
      latitude: 40.730610,
      description: '123 Main Street, New York, NY'
    },
    contact: {
      phoneNumber: '+1-212-555-0101',
      email: 'downtown@parcelcompany.com'
    },
    createdAt: '2023-01-15T09:30:00Z'
  },
  {
    branchId: 'BR-002',
    name: 'Westside Distribution Center',
    location: {
      longitude: -118.243683,
      latitude: 34.052235,
      description: '456 Sunset Blvd, Los Angeles, CA'
    },
    contact: {
      phoneNumber: '+1-310-555-0202',
      email: 'westside@parcelcompany.com'
    },
    createdAt: '2023-02-20T14:45:00Z'
  },
  {
    branchId: 'BR-003',
    name: 'Northside Hub',
    location: {
      longitude: -87.629799,
      latitude: 41.878113,
      description: '789 Michigan Ave, Chicago, IL'
    },
    contact: {
      phoneNumber: '+1-312-555-0303',
      email: 'northside@parcelcompany.com'
    },
    createdAt: '2023-03-10T11:20:00Z'
  },
  {
    branchId: 'BR-004',
    name: 'South Terminal',
    location: {
      longitude: -95.369804,
      latitude: 29.760427,
      description: '321 Texas Street, Houston, TX'
    },
    contact: {
      phoneNumber: '+1-713-555-0404',
      email: 'south@parcelcompany.com'
    },
    createdAt: '2023-04-05T16:10:00Z'
  },
  {
    branchId: 'BR-005',
    name: 'East Coast Logistics',
    location: {
      longitude: -71.058884,
      latitude: 42.360081,
      description: '654 Beacon Street, Boston, MA'
    },
    contact: {
      phoneNumber: '+1-617-555-0505',
      email: 'eastcoast@parcelcompany.com'
    },
    createdAt: '2023-05-12T08:00:00Z'
  },
  {
    branchId: 'BR-006',
    name: 'Central Dispatch',
    location: {
      longitude: -84.387985,
      latitude: 33.748997,
      description: '987 Peachtree Street, Atlanta, GA'
    },
    contact: {
      phoneNumber: '+1-404-555-0606',
      email: 'central@parcelcompany.com'
    },
    createdAt: '2023-06-18T13:25:00Z'
  },
  {
    branchId: 'BR-007',
    name: 'Mountain View Depot',
    location: {
      longitude: -122.057403,
      latitude: 37.386051,
      description: '555 Silicon Valley Blvd, Mountain View, CA'
    },
    contact: {
      phoneNumber: '+1-650-555-0707',
      email: 'mountainview@parcelcompany.com'
    },
    createdAt: '2023-07-22T10:15:00Z'
  },
  {
    branchId: 'BR-008',
    name: 'Desert Oasis Terminal',
    location: {
      longitude: -111.891045,
      latitude: 33.448376,
      description: '777 Palm Canyon Dr, Phoenix, AZ'
    },
    contact: {
      phoneNumber: '+1-602-555-0808',
      email: 'desert@parcelcompany.com'
    },
    createdAt: '2023-08-30T15:40:00Z'
  },
  {
    branchId: 'BR-009',
    name: 'Pacific Northwest Hub',
    location: {
      longitude: -122.332069,
      latitude: 47.606209,
      description: '888 Space Needle Way, Seattle, WA'
    },
    contact: {
      phoneNumber: '+1-206-555-0909',
      email: 'pacific@parcelcompany.com'
    },
    createdAt: '2023-09-14T12:05:00Z'
  },
  {
    branchId: 'BR-010',
    name: 'Rocky Mountain Center',
    location: {
      longitude: -104.990251,
      latitude: 39.739235,
      description: '999 Colfax Avenue, Denver, CO'
    },
    contact: {
      phoneNumber: '+1-303-555-1010',
      email: 'rocky@parcelcompany.com'
    },
    createdAt: '2023-10-25T09:50:00Z'
  },
  {
    branchId: 'BR-011',
    name: 'Great Lakes Distribution',
    location: {
      longitude: -83.045753,
      latitude: 42.331429,
      description: '444 Riverfront Dr, Detroit, MI'
    },
    contact: {
      phoneNumber: '+1-313-555-1111',
      email: 'greatlakes@parcelcompany.com'
    },
    createdAt: '2023-11-08T14:30:00Z'
  },
  {
    branchId: 'BR-012',
    name: 'Southern Comfort Terminal',
    location: {
      longitude: -90.071533,
      latitude: 29.951065,
      description: '222 Bourbon Street, New Orleans, LA'
    },
    contact: {
      phoneNumber: '+1-504-555-1212',
      email: 'southern@parcelcompany.com'
    },
    createdAt: '2023-12-01T11:45:00Z'
  }
]

// You can also export a smaller subset for quick testing
export const testBranches: Branch[] = dummyBranches.slice(0, 5)