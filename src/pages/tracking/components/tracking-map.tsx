import React, { useEffect, useState, useRef } from 'react';
import {
    APIProvider,
    Map,
    AdvancedMarker,
    Pin,
    useMap
} from '@vis.gl/react-google-maps';
import {  Dot } from 'lucide-react';
interface Location {
    lat: number;
    lng: number;
}

interface RouteMapProps {
    origin: Location;
    destination: Location;
}

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID;



const RouteMapContent = ({ origin, destination }: RouteMapProps) => {
    const map = useMap();
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [truckPosition, setTruckPosition] = useState<Location | null>(null);
    const animationRef = useRef<number>(null);
    const progressRef = useRef(0);

    useEffect(() => {
        if (!map || !window.google) return;

        const directionsService = new google.maps.DirectionsService();
        directionsService.route(
            {
                origin: new google.maps.LatLng(origin.lat, origin.lng),
                destination: new google.maps.LatLng(destination.lat, destination.lng),
                travelMode: google.maps.TravelMode.DRIVING,
                
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    setDirections(result);
                } else {
                    console.error(`Directions request failed: ${status}`);
                }
            }
        );
    }, [map, origin, destination]);

    // Animate truck along the route
    useEffect(() => {
        if (!directions || !map) return;

        const routePath = directions.routes[0].overview_path;
        const numPoints = routePath.length;
        const duration = 50000; // 20 seconds for full animation
        // const interval = 50; // Update every 50ms

        let startTime: number | null = null;

        const animateTruck = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            progressRef.current = Math.min(elapsed / duration, 1);

            const pointIndex = Math.floor(progressRef.current * (numPoints - 1));
            const currentPoint = routePath[pointIndex];

            setTruckPosition({
                lat: currentPoint.lat(),
                lng: currentPoint.lng()
            });

            if (progressRef.current < 1) {
                animationRef.current = requestAnimationFrame(animateTruck);
            }
        };

        animationRef.current = requestAnimationFrame(animateTruck);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [directions, map]);

    // Draw the route polyline
    useEffect(() => {
        if (!map || !directions) return;

        const polyline = new google.maps.Polyline({
            path: directions.routes[0].overview_path,
            strokeColor: '#4285F4',
            strokeOpacity: 1.0,
            strokeWeight: 4,
            map: map
        });

        // Fit bounds to show entire route
        const bounds = new google.maps.LatLngBounds();
        directions.routes[0].legs.forEach(leg => {
            bounds.extend(leg.start_location);
            bounds.extend(leg.end_location);
        });
        map.fitBounds(bounds);

        return () => {
            polyline.setMap(null);
        };
    }, [directions, map]);

    return (
        <>
            <AdvancedMarker position={origin} title="Origin">
                <Pin background={'#FBBC04'} borderColor={'#137333'} glyphColor={'#000'} />
            </AdvancedMarker>

            <AdvancedMarker position={destination} title="Destination">
                <Pin background={'#34A853'} borderColor={'#137333'} glyphColor={'#000'} />
            </AdvancedMarker>
         
            {truckPosition && (
                <AdvancedMarker position={truckPosition} title="Delivery Truck">
                    {/* <div style={{ transform: 'rotate(90deg)', transition: 'transform 0.3s ease-out' }}>
                        <img src={Van} width="32" height="32" alt="Delivery Van" />
                    </div> */}

                    <Dot size={80} style={{ transition: 'transform 0.3s ease-out' }} color='#ca4912' strokeWidth={3}/>
                </AdvancedMarker>
            )}
        </>
    );
};

const RouteMap: React.FC<RouteMapProps> = ({ origin, destination }) => {
    return (
        <APIProvider apiKey={GOOGLE_API_KEY}>
            <Map
                mapId={GOOGLE_MAP_ID}
                style={{ width: '100%', height: '100%' }}
                defaultCenter={{
                    lat: (origin.lat + destination.lat) / 2,
                    lng: (origin.lng + destination.lng) / 2
                }}
                defaultZoom={8}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
            >
                <RouteMapContent origin={origin} destination={destination} />
            </Map>
        </APIProvider>
    );
};

export default RouteMap;