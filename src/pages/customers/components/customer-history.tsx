'use client'

import { Customer } from '@/types/user'
import { Parcel, ParcelStatus } from '@/types/parcel'
import { Badge } from '@/components/ui/badge'
import moment from 'moment'
import {
    useGetSentParcelsQuery,
    useGetReceivedParcelsQuery,
    useGetSentParcelsCountQuery,
    useGetReceivedParcelsCountQuery
} from '@/api/slices/parcelApiSlice'
import { useMemo } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { useParams } from 'react-router-dom'

export function CustomerParcelHistoryPage() {
    const params = useParams()
    const customerId = params.customerId as string

    const pageable = { page: 0, size: 200 }

    console.log('Fetching parcel history for customerId:', customerId);

    const {
        data: sentParcelsData,
        isLoading: isLoadingSent,
        error: sentError,
    } = useGetSentParcelsQuery({
        customerId,
        pageable
    })

    const {
        data: receivedParcelsData,
        isLoading: isLoadingReceived,
        error: receivedError,
    } = useGetReceivedParcelsQuery({
        customerId,
        pageable
    })

    // Fetch counts
    const { data: sentCount } = useGetSentParcelsCountQuery(customerId)
    const { data: receivedCount } = useGetReceivedParcelsCountQuery(customerId)

    const sendingParcels = useMemo(() => sentParcelsData?.content || [], [sentParcelsData])
    const receivingParcels = useMemo(() => receivedParcelsData?.content || [], [receivedParcelsData])

    const isLoading = isLoadingSent || isLoadingReceived
    const hasError = sentError || receivedError

    const getStatusBadge = (status: ParcelStatus) => {
        const statusMap = {
            'registered': { label: 'Registered', color: 'bg-blue-500' },
            'in-transit': { label: 'In Transit', color: 'bg-yellow-500' },
            'delivered': { label: 'Delivered', color: 'bg-green-500' },
            'available_for_pickup': { label: 'Ready for Pickup', color: 'bg-purple-500' },
            'returned': { label: 'Returned', color: 'bg-red-500' }
        }
        return (
            <Badge className={`${statusMap[status]?.color || 'bg-gray-500'} text-white`}>
                {statusMap[status]?.label || status}
            </Badge>
        )
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Not specified';

        const date = moment(dateString);
        if (!date.isValid()) return 'Invalid date';

        return date.format('MMM DD, YYYY, hh:mm A');
    }

    const formatDateRelative = (dateString: string) => {
        if (!dateString) return '';

        const date = moment(dateString);
        if (!date.isValid()) return '';

        return `(${date.fromNow()})`;
    }

    const formatDeliveryDate = (dateString: string) => {
        if (!dateString) return 'Not specified';

        const date = moment(dateString);
        if (!date.isValid()) return 'Invalid date';

        // If delivery date is in the future, show relative time
        if (date.isAfter(moment())) {
            return `${date.format('MMM DD, YYYY')} - ${date.fromNow()}`;
        }

        return date.format('MMM DD, YYYY, hh:mm A');
    }

    if (hasError) {
        return (
            <div className="container mx-auto p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Parcel History</h1>
                    <p className="text-gray-600">View parcel delivery history</p>
                </div>
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Failed to load parcel history. Please try again.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Parcel History</h1>
                <p className="text-gray-600">
                    View parcel delivery history
                    {sentCount !== undefined && receivedCount !== undefined && (
                        <span className="ml-2">
                            ({sentCount} sent • {receivedCount} received)
                        </span>
                    )}
                </p>
            </div>

            {isLoading ? (
                <div className="space-y-8">
                    {/* Sending Parcels Skeleton */}
                    <div>
                        <Skeleton className="h-6 w-48 mb-4" />
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <Skeleton key={i} className="h-32 w-full" />
                            ))}
                        </div>
                    </div>
                    {/* Receiving Parcels Skeleton */}
                    <div>
                        <Skeleton className="h-6 w-48 mb-4" />
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <Skeleton key={i} className="h-32 w-full" />
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Sending Parcels Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Parcels Being Sent ({sendingParcels.length})</h3>
                        {sendingParcels.length > 0 ? (
                            <div className="space-y-4">
                                {sendingParcels.map(parcel => (
                                    <div key={parcel.parcelId} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium">Parcel ID: {parcel.parcelId}</p>
                                                <p>To: {parcel.recipient?.name || 'Unknown recipient'}</p>
                                                <p>Destination: {parcel.destination?.name || 'Unknown destination'}</p>
                                                <p className="text-sm text-gray-600">
                                                    Created: {formatDate(parcel.createdAt)}
                                                    <span className="ml-1 text-xs">{formatDateRelative(parcel.createdAt)}</span>
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                {getStatusBadge(parcel.status)}
                                                <p className="font-semibold mt-2">${parcel.deliveryCost?.totalCost?.toFixed(2) || '0.00'}</p>
                                                <p className="text-sm text-gray-500">{parcel.deliveryType}</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 pt-3 border-t">
                                            <p className="text-sm"><span className="font-medium">Content:</span> {parcel.contentDescription}</p>
                                            {parcel.dimension && (
                                                <p className="text-sm"><span className="font-medium">Dimensions:</span> {parcel.dimension.lengthCm}x{parcel.dimension.widthCm}x{parcel.dimension.heightCm} cm</p>
                                            )}
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
                        <h3 className="text-lg font-semibold mb-4">Parcels Being Received ({receivingParcels.length})</h3>
                        {receivingParcels.length > 0 ? (
                            <div className="space-y-4">
                                {receivingParcels.map(parcel => (
                                    <div key={parcel.parcelId} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium">Parcel ID: {parcel.parcelId}</p>
                                                <p>From: {parcel.sender?.name || 'Unknown sender'}</p>
                                                <p>Origin: {parcel.origin?.name || 'Unknown origin'}</p>
                                                <p className="text-sm text-gray-600">
                                                    Created: {formatDate(parcel.createdAt)}
                                                    <span className="ml-1 text-xs">{formatDateRelative(parcel.createdAt)}</span>
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                {getStatusBadge(parcel.status)}
                                                {parcel.dispatcher && (
                                                    <p className="text-sm mt-2">
                                                        Dispatcher: {parcel.dispatcher.agent?.firstName} {parcel.dispatcher.agent?.lastName}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-3 pt-3 border-t">
                                            <p className="text-sm">
                                                <span className="font-medium">Expected Delivery:</span> {formatDeliveryDate(parcel.deliveryDate)}
                                            </p>
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
            )}
        </div>
    )
}