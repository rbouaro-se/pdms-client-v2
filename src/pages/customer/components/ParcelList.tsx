import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { ParcelCard } from "./ParcelCard";
import { Parcel } from "@/types/parcel";

interface ParcelListProps {
    parcels: Parcel[];
    onTrackParcel: (parcelId: string) => void;
}

export function ParcelList({ parcels, onTrackParcel }: ParcelListProps) {
    // Filter parcels by status for the tabs
    const registeredParcels = parcels.filter(p => p.status === 'registered');
    const inTransitParcels = parcels.filter(p => p.status === 'in_transit');
    const deliveredParcels = parcels.filter(p => p.status === 'delivered');
    const failedParcels = parcels.filter(p => p.status === 'returned');

    return (
        <div className="space-y-4">
            {/* Search bar */}
            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search parcels by ID, recipient, or description..."
                    className="pl-10"
                />
            </div>

            {/* Status tabs */}
            <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="all">All ({parcels.length})</TabsTrigger>
                    <TabsTrigger value="registered">Registered ({registeredParcels.length})</TabsTrigger>
                    <TabsTrigger value="in-transit">In Transit ({inTransitParcels.length})</TabsTrigger>
                    <TabsTrigger value="delivered">Delivered ({deliveredParcels.length})</TabsTrigger>
                    <TabsTrigger value="failed">Failed ({failedParcels.length})</TabsTrigger>
                </TabsList>

                {/* All parcels */}
                <TabsContent value="all">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {parcels.map(parcel => (
                            <ParcelCard
                                key={parcel.parcelId}
                                parcel={parcel}
                                onTrack={onTrackParcel}
                            />
                        ))}
                    </div>
                </TabsContent>

                {/* Filtered by status */}
                <TabsContent value="registered">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {registeredParcels.map(parcel => (
                            <ParcelCard
                                key={parcel.parcelId}
                                parcel={parcel}
                                onTrack={onTrackParcel}
                            />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="in-transit">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {inTransitParcels.map(parcel => (
                            <ParcelCard
                                key={parcel.parcelId}
                                parcel={parcel}
                                onTrack={onTrackParcel}
                            />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="delivered">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {deliveredParcels.map(parcel => (
                            <ParcelCard
                                key={parcel.parcelId}
                                parcel={parcel}
                                onTrack={onTrackParcel}
                            />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="failed">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                        {failedParcels.map(parcel => (
                            <ParcelCard
                                key={parcel.parcelId}
                                parcel={parcel}
                                onTrack={onTrackParcel}
                            />
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}