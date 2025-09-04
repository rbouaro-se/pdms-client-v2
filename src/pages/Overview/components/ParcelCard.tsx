import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MapPin, Package, Truck, User, Calendar } from "lucide-react";
import { format } from "date-fns";
import { formatGhanaCedisWithSymbol } from "@/utils";
import { Parcel } from "@/types/parcel";
import { mapBackendStatus, statusConfig } from "@/utils/statuses";

interface ParcelCardProps {
    parcel: Parcel;
    onTrack?: (parcelId: string) => void;
}

// Helper function to format text with proper capitalization
const formatText = (text: string): string => {
    if (!text) return '';

    // Replace underscores and hyphens with spaces
    const spacedText = text.replace(/[_-]/g, ' ');

    // Capitalize first letter of each word and lowercase the rest
    return spacedText
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

// Helper function to format enum-like values
const formatEnumValue = (value: string): string => {
    if (!value) return '';

    // Handle camelCase by adding spaces before capital letters
    const withSpaces = value.replace(/([A-Z])/g, ' $1');

    return formatText(withSpaces);
};

export function ParcelCard({ parcel, onTrack }: ParcelCardProps) {
    // Valid statuses based on your specification
    const validStatuses = [
        'registered',
        'in-transit',
        'available_for_pickup',
        'delivered',
        'returned'
    ] as const;

    type ValidStatus = typeof validStatuses[number];

    // Calculate progress percentage based on status
    const progressValue: Record<ValidStatus, number> = {
        'registered': 25,
        'in-transit': 50,
        'available_for_pickup': 75,
        'delivered': 100,
        'returned': 100
    };

    // Get current status with fallback for invalid statuses
    const currentStatus = validStatuses.includes(parcel.status as ValidStatus)
        ? parcel.status as ValidStatus
        : 'registered'; // Default fallback

    const currentProgress = progressValue[currentStatus];

    const frontendStatus = mapBackendStatus(parcel.status)
    const StatusIcon = statusConfig[frontendStatus].icon

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-lg">#{parcel.parcelId}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                            {parcel.contentDescription}
                        </p>
                    </div>

                    <Badge
                        variant={statusConfig[frontendStatus].variant}
                        className='flex items-center gap-1 text-xs'
                    >
                        <StatusIcon className='h-3 w-3' />
                        {statusConfig[frontendStatus].label}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                {/* Progress indicator */}
                <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span>Delivery Progress</span>
                        <span>{currentProgress}%</span>
                    </div>
                    <Progress value={currentProgress} />
                </div>

                {/* Route information */}
                <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <span className="font-medium">{parcel.origin?.name || 'Unknown Origin'}</span>
                    <div className="flex-1 border-t border-dashed mx-2"></div>
                    <MapPin className="h-4 w-4 text-green-500" />
                    <span className="font-medium">{parcel.destination?.name || 'Unknown Destination'}</span>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>
                            {formatEnumValue(parcel.parcelType)} • {parcel.weightKg?.toFixed(2) || '0.00'}kg
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span>
                            {formatEnumValue(parcel.dispatcher?.type)} • {formatEnumValue(parcel.deliveryType)}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                            {parcel.deliveryDate ? format(new Date(parcel.deliveryDate), 'MMM dd, yyyy') : 'No date'}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{parcel.recipient?.name || 'Unknown Recipient'}</span>
                    </div>
                </div>

            </CardContent>

            <CardFooter className="flex justify-between">
                <div>
                    <span className="font-semibold">
                        {formatGhanaCedisWithSymbol(parcel.deliveryCost?.totalCost?.toFixed(2) || '0.00')}
                    </span>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTrack?.(parcel.parcelId)}
                    disabled={currentStatus === 'delivered' || currentStatus === 'returned'}
                >
                    Track Package
                </Button>
            </CardFooter>
        </Card>
    );
}