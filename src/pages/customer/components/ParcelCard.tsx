import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {  MapPin, Package, Truck, User, Calendar, Info } from "lucide-react";
import { format } from "date-fns";
import { Parcel } from "@/pages/tracking/data/chat-types";

interface ParcelCardProps {
    parcel: Parcel;
    onTrack?: (parcelId: string) => void;
}

export function ParcelCard({ parcel, onTrack }: ParcelCardProps) {
    // Status badge color mapping
    const statusColors = {
        'registered': 'bg-blue-500',
        'in-transit': 'bg-yellow-500',
        'delivered': 'bg-green-500',
        'failed': 'bg-red-500',
    };

    // Delivery type colors
    // const deliveryTypeColors = {
    //     'standard': 'bg-gray-500',
    //     'express': 'bg-purple-500',
    //     'priority': 'bg-orange-500',
    // };

    // Calculate progress percentage based on status
    const progressValue = {
        'registered': 25,
        'in-transit': 60,
        'delivered': 100,
        'failed': 100,
    }[parcel.status];

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
                    <Badge className={statusColors[parcel.status]}>
                        {parcel.status.replace('-', ' ')}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                {/* Progress indicator */}
                <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span>Delivery Progress</span>
                        <span>{progressValue}%</span>
                    </div>
                    <Progress value={progressValue} />
                </div>

                {/* Route information */}
                <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <span className="font-medium">{parcel.origin.name}</span>
                    <div className="flex-1 border-t border-dashed mx-2"></div>
                    <MapPin className="h-4 w-4 text-green-500" />
                    <span className="font-medium">{parcel.destination.name}</span>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>
                            {parcel.parcelType} • {parcel.weightKg.toFixed(2)}kg
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span className="capitalize">
                            {parcel.dispatcher.type} • {parcel.deliveryType}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                            {format(new Date(parcel.deliveryDate), 'MMM dd, yyyy')}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{parcel.recipient.name}</span>
                    </div>
                </div>

                {/* Special instructions (if any) */}
                {parcel.specialInstructions && (
                    <div className="flex items-start space-x-2 text-sm p-2 bg-muted rounded">
                        <Info className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <span>{parcel.specialInstructions}</span>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex justify-between">
                <div>
                    <span className="font-semibold">GHS {parcel.deliveryCost.totalCost.toFixed(2)}</span>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTrack?.(parcel.parcelId)}
                    disabled={parcel.status === 'delivered' || parcel.status === 'failed'}
                >
                    Track Package
                </Button>
            </CardFooter>
        </Card>
    );
}