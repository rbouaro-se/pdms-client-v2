import { faker } from '@faker-js/faker';
import { Parcel, ParcelStatus, DeliveryType, ParcelType } from '@/pages/tracking/data/chat-types';

function generateDummyParcels(count: number): Parcel[] {
  const parcels: Parcel[] = [];

  const statuses: ParcelStatus[] = ['registered', 'in-transit', 'delivered', 'failed'];
  const deliveryTypes: DeliveryType[] = ['standard', 'express', 'priority'];
  const parcelTypes: ParcelType[] = ['clothing', 'electronics', 'documents', 'jewelry', 'furniture', 'food', 'other'];
  const dispatcherTypes = ['van', 'motorcycle', 'bicycle', 'truck'];

  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const deliveryDate = faker.date.soon({ days: 7 });
    const deliveredDate = status === 'delivered' || status === 'failed'
      ? faker.date.between({ from: deliveryDate, to: new Date().setFullYear(2030, 10, 10) })
      : null;

    const parcel: Parcel = {
      parcelId: `PK${faker.string.numeric(8).toUpperCase()}`,
      status,
      deliveryDate: deliveryDate.toISOString(),
      origin: {
        branchId: `BR${faker.string.numeric(4)}`,
        name: `${faker.location.city()} Branch`,
        location: {
          longitude: parseFloat(faker.location.longitude().toString()),
          latitude: parseFloat(faker.location.latitude().toString()),
          description: faker.location.streetAddress(),
        },
        contact: {
          phoneNumber: faker.phone.number(),
          email: faker.internet.email(),
        },
      },
      destination: {
        branchId: `BR${faker.string.numeric(4)}`,
        name: `${faker.location.city()} Branch`,
        location: {
          longitude: parseFloat(faker.location.longitude().toString()),
          latitude: parseFloat(faker.location.latitude().toString()),
          description: faker.location.streetAddress(),
        },
        contact: {
          phoneNumber: faker.phone.number(),
          email: faker.internet.email(),
        },
      },
      weightKg: faker.number.float({ min: 0.1, max: 20, fractionDigits: 2 }),
      dimension: {
        lengthCm: faker.number.int({ min: 10, max: 100, }),
        widthCm: faker.number.int({ min: 10, max: 100 }),
        heightCm: faker.number.int({ min: 5, max: 50 }),
      },
      parcelType: parcelTypes[Math.floor(Math.random() * parcelTypes.length)],
      deliveryCost: {
        baseFee: faker.number.float({ min: 10, max: 50, fractionDigits: 2 }),
        parcelTypeSurcharge: faker.number.float({ min: 0, max: 15, fractionDigits: 2 }),
        deliveryTypeSurcharge: faker.number.float({ min: 0, max: 25, fractionDigits: 2 }),
        insuranceSurcharge: faker.number.float({ min: 0, max: 10, fractionDigits: 2 }),
        deductions: faker.number.float({ min: 0, max: 5, fractionDigits: 2 }),
        totalCost: faker.number.float({ min: 15, max: 100, fractionDigits:2 }),
      },
      deliveryType: deliveryTypes[Math.floor(Math.random() * deliveryTypes.length)],
      contentDescription: faker.commerce.productDescription(),
      sender: {
        name: faker.person.fullName(),
        phoneNumber: faker.phone.number(),
      },
      recipient: {
        name: faker.person.fullName(),
        phoneNumber: faker.phone.number(),
      },
      dispatcher: {
        dispatcherId: `DP${faker.string.numeric(6)}`,
        dispatcherNumber: `DN${faker.string.numeric(4)}`,
        type: dispatcherTypes[Math.floor(Math.random() * dispatcherTypes.length)] as any,
        agent: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
        },
        available: faker.datatype.boolean(),
      },
      trackingHistory: generateTrackingHistory(status, deliveryDate),
      specialInstructions: Math.random() > 0.7 ? faker.lorem.sentence() : undefined,
      estimatedDeliveryTime: faker.date.soon({ days: 3 }).toISOString(),
      actualDeliveryTime: deliveredDate ? deliveredDate.toISOString() : null,
    };

    parcels.push(parcel);
  }

  return parcels;
}

function generateTrackingHistory(status: ParcelStatus, deliveryDate: Date) {
  const events = [];
  const statusSequence: ParcelStatus[] = ['registered', 'in-transit'];

  if (status === 'delivered') statusSequence.push('delivered');
  if (status === 'failed') statusSequence.push('failed');

  let currentDate = new Date(deliveryDate);
  currentDate.setDate(currentDate.getDate() - 3); // Start 3 days before delivery date

  for (const eventStatus of statusSequence) {
    currentDate = faker.date.between({
      from: currentDate,
      to: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000) // Add 1 day
    });

    events.push({
      timestamp: currentDate.toISOString(),
      location: {
        longitude: parseFloat(faker.location.longitude().toString()),
        latitude: parseFloat(faker.location.latitude().toString()),
        description: faker.location.streetAddress(),
      },
      status: eventStatus,
      description: getStatusDescription(eventStatus),
      branchId: `BR${faker.string.numeric(4)}`,
    });
  }

  return events;
}

function getStatusDescription(status: ParcelStatus): string {
  switch (status) {
    case 'registered':
      return 'Parcel registered at origin branch';
    case 'in-transit':
      return 'Parcel is on the way to destination';
    case 'delivered':
      return 'Parcel successfully delivered';
    case 'failed':
      return 'Delivery attempt failed';
    default:
      return 'Status update';
  }
}

// Generate 20 dummy parcels
export const dummyParcels = generateDummyParcels(20);