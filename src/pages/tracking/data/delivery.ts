import { Parcel } from "./chat-types";

export const dummyParcels: Parcel[] = [
  {
    parcelId: 'PAR-2DA2B21',
    status: 'in-transit',
    deliveryDate: '2025-11-01T10:00:00',
    origin: {
      branchId: 'BR-0031001',
      name: 'Accra Central Branch',
      location: {
        longitude: -0.200682,
        latitude: 5.554237,
        description: 'Near Makola Market',
      },
      contact: {
        phoneNumber: '+233244123456',
        email: 'accra.central@pdms.com',
      },
    },
    destination: {
      branchId: 'BRA-AC58D34',
      name: 'Kumasi Main Branch',
      location: {
        longitude: -1.624428,
        latitude: 6.698081,
        description: 'Adum, near Kejetia Market',
      },
      contact: {
        phoneNumber: '+233244654321',
        email: 'kumasi.main@pdms.com',
      },
    },
    weightKg: 9.5,
    dimension: {
      lengthCm: 12.09,
      widthCm: 37.77,
      heightCm: 22.41,
    },
    parcelType: 'clothing',
    deliveryCost: {
      baseFee: 19.75,
      parcelTypeSurcharge: 2.9625,
      deliveryTypeSurcharge: 19.75,
      insuranceSurcharge: 10.0,
      deductions: 0.0,
      totalCost: 33.7125,
    },
    deliveryType: 'standard',
    contentDescription: 'shirt',
    sender: {
      name: 'Kwame Asante',
      phoneNumber: '233243112215',
    },
    recipient: {
      name: 'Ama Serwaa',
      phoneNumber: '233543112215',
    },
    dispatcher: {
      dispatcherId: 'DSP-B7BEE01',
      dispatcherNumber: 'GT-66376-23',
      type: 'van',
      agent: {
        firstName: 'John',
        lastName: 'Doe',
      },
      available: true,
    },
  },
  {
    parcelId: 'PAR-3BB4C32',
    status: 'registered',
    deliveryDate: '2025-11-03T14:30:00',
    origin: {
      branchId: 'BR-0031002',
      name: 'Tema Harbour Branch',
      location: {
        longitude: -0.016667,
        latitude: 5.666667,
        description: 'Near Tema Port',
      },
      contact: {
        phoneNumber: '+233244112233',
        email: 'tema.harbour@pdms.com',
      },
    },
    destination: {
      branchId: 'BRA-BD68E45',
      name: 'Takoradi Branch',
      location: {
        longitude: -1.759398,
        latitude: 4.889545,
        description: 'Harbour Road',
      },
      contact: {
        phoneNumber: '+233244445566',
        email: 'takoradi@pdms.com',
      },
    },
    weightKg: 15.2,
    dimension: {
      lengthCm: 45.0,
      widthCm: 30.0,
      heightCm: 20.0,
    },
    parcelType: 'electronics',
    deliveryCost: {
      baseFee: 25.0,
      parcelTypeSurcharge: 7.5,
      deliveryTypeSurcharge: 25.0,
      insuranceSurcharge: 15.0,
      deductions: 0.0,
      totalCost: 72.5,
    },
    deliveryType: 'express',
    contentDescription: 'smartphone',
    sender: {
      name: 'Nana Yaa',
      phoneNumber: '233543221100',
    },
    recipient: {
      name: 'Kofi Mensah',
      phoneNumber: '233243221100',
    },
    dispatcher: {
      dispatcherId: 'DSP-C8CFF12',
      dispatcherNumber: 'GT-77387-24',
      type: 'motorcycle',
      agent: {
        firstName: 'Michael',
        lastName: 'Owusu',
      },
      available: false,
    },
  },
  {
    parcelId: 'PAR-4CC5D43',
    status: 'delivered',
    deliveryDate: '2025-10-28T09:15:00',
    origin: {
      branchId: 'BR-0031003',
      name: 'East Legon Branch',
      location: {
        longitude: -0.175556,
        latitude: 5.635556,
        description: 'Near East Legon Police Station',
      },
      contact: {
        phoneNumber: '+233244556677',
        email: 'east.legon@pdms.com',
      },
    },
    destination: {
      branchId: 'BRA-CE79F56',
      name: 'Dansoman Branch',
      location: {
        longitude: -0.213333,
        latitude: 5.578333,
        description: 'Near Dansoman Roundabout',
      },
      contact: {
        phoneNumber: '+233244778899',
        email: 'dansoman@pdms.com',
      },
    },
    weightKg: 5.0,
    dimension: {
      lengthCm: 25.0,
      widthCm: 15.0,
      heightCm: 10.0,
    },
    parcelType: 'documents',
    deliveryCost: {
      baseFee: 10.0,
      parcelTypeSurcharge: 1.5,
      deliveryTypeSurcharge: 10.0,
      insuranceSurcharge: 5.0,
      deductions: 0.0,
      totalCost: 26.5,
    },
    deliveryType: 'standard',
    contentDescription: 'contract papers',
    sender: {
      name: 'Lawson & Partners',
      phoneNumber: '233303445566',
    },
    recipient: {
      name: 'Adwoa Beauty',
      phoneNumber: '233243445566',
    },
    dispatcher: {
      dispatcherId: 'DSP-D9DGG23',
      dispatcherNumber: 'GT-88498-25',
      type: 'bicycle',
      agent: {
        firstName: 'Samuel',
        lastName: 'Agyei',
      },
      available: true,
    },
  },
  {
    parcelId: 'PAR-5DD6E54',
    status: 'failed',
    deliveryDate: '2025-10-25T16:45:00',
    origin: {
      branchId: 'BR-0031004',
      name: 'Osu Branch',
      location: {
        longitude: -0.175,
        latitude: 5.555,
        description: 'Oxford Street',
      },
      contact: {
        phoneNumber: '+233244990011',
        email: 'osu@pdms.com',
      },
    },
    destination: {
      branchId: 'BRA-DF8AG67',
      name: 'Labone Branch',
      location: {
        longitude: -0.1675,
        latitude: 5.565,
        description: 'Near Labone SDA Church',
      },
      contact: {
        phoneNumber: '+233244112233',
        email: 'labone@pdms.com',
      },
    },
    weightKg: 2.5,
    dimension: {
      lengthCm: 20.0,
      widthCm: 15.0,
      heightCm: 5.0,
    },
    parcelType: 'jewelry',
    deliveryCost: {
      baseFee: 15.0,
      parcelTypeSurcharge: 4.5,
      deliveryTypeSurcharge: 15.0,
      insuranceSurcharge: 20.0,
      deductions: 0.0,
      totalCost: 54.5,
    },
    deliveryType: 'express',
    contentDescription: 'gold necklace',
    sender: {
      name: 'Amina Jewelers',
      phoneNumber: '233543667788',
    },
    recipient: {
      name: 'Esi Nyamekye',
      phoneNumber: '233243667788',
    },
    dispatcher: {
      dispatcherId: 'DSP-E0EHH34',
      dispatcherNumber: 'GT-99509-26',
      type: 'motorcycle',
      agent: {
        firstName: 'Daniel',
        lastName: 'Quartey',
      },
      available: true,
    },
  },
]
