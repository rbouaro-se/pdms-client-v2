'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Customer } from '@/types/user'
import { Parcel, ParcelStatus } from '@/types/parcel'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

interface Props {
    customer: Customer
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ParcelHistoryDialog({ customer, open, onOpenChange }: Props) {
    // Separate parcels by type (sending vs receiving)
    const sendingParcels:Parcel[] = []
        // .filter(p => p.sender.id === customer.id)
    const receivingParcels: Parcel[] =[]
        // [].filter(p => p.recipient.id === customer.id)

    const getStatusBadge = (status: ParcelStatus) => {
        const statusMap = {
            'registered': { label: 'Registered', color: 'bg-blue-500' },
            'in_transit': { label: 'In Transit', color: 'bg-yellow-500' },
            'delivered': { label: 'Delivered', color: 'bg-green-500' },
            'available_for_pickup': { label: 'Ready for Pickup', color: 'bg-purple-500' },
            'returned': { label: 'Returned', color: 'bg-red-500' }
        }
        return (
            <Badge className={`${statusMap[status].color} text-white`}>
                {statusMap[status].label}
            </Badge>
        )
    }

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'PPPpp')
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Parcel History for {customer.name}</DialogTitle>
                    <DialogDescription>
                        View all parcel delivery history for this customer
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-8">
                    {/* Sending Parcels Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Parcels Being Sent</h3>
                        {sendingParcels.length > 0 ? (
                            <div className="space-y-4">
                                {sendingParcels.map(parcel => (
                                    <div key={parcel.parcelId} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium">Parcel ID: {parcel.parcelId}</p>
                                                <p>To: {parcel.recipient.name}</p>
                                                <p>Destination: {parcel.destination.name}</p>
                                                <p>Created: {formatDate(parcel.createdAt)}</p>
                                            </div>
                                            <div className="text-right">
                                                {getStatusBadge(parcel.status)}
                                                <p className="font-semibold mt-2">${parcel.deliveryCost.totalCost.toFixed(2)}</p>
                                                <p className="text-sm text-gray-500">{parcel.deliveryType}</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 pt-3 border-t">
                                            <p className="text-sm"><span className="font-medium">Content:</span> {parcel.contentDescription}</p>
                                            <p className="text-sm"><span className="font-medium">Dimensions:</span> {parcel.dimension.lengthCm}x{parcel.dimension.widthCm}x{parcel.dimension.heightCm} cm</p>
                                            <p className="text-sm"><span className="font-medium">Weight:</span> {parcel.weightKg} kg</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No sending parcels found</p>
                        )}
                    </div>

                    {/* Receiving Parcels Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Parcels Being Received</h3>
                        {receivingParcels.length > 0 ? (
                            <div className="space-y-4">
                                {receivingParcels.map(parcel => (
                                    <div key={parcel.parcelId} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium">Parcel ID: {parcel.parcelId}</p>
                                                <p>From: {parcel.sender.name}</p>
                                                <p>Origin: {parcel.origin.name}</p>
                                                <p>Created: {formatDate(parcel.createdAt)}</p>
                                            </div>
                                            <div className="text-right">
                                                {getStatusBadge(parcel.status)}
                                                {parcel.dispatcher && (
                                                    <p className="text-sm mt-2">
                                                        Dispatcher: {parcel.dispatcher.agent.firstName} {parcel.dispatcher.agent.lastName}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-3 pt-3 border-t">
                                            <p className="text-sm"><span className="font-medium">Expected Delivery:</span> {formatDate(parcel.deliveryDate)}</p>
                                            <p className="text-sm"><span className="font-medium">Content:</span> {parcel.contentDescription}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No receiving parcels found</p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}