import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Button } from '@/src/components/ui/Button';

const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '12px'
};

const defaultCenter = {
    lat: 9.0820,
    lng: 8.6753
};

interface GoogleMapSelectorProps {
    initialLat?: number;
    initialLng?: number;
    onSelect: (lat: number, lng: number) => void;
    onClose: () => void;
}

export function GoogleMapSelector({ initialLat, initialLng, onSelect, onClose }: GoogleMapSelectorProps) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
    });

    const [markerPos, setMarkerPos] = useState({
        lat: initialLat || defaultCenter.lat,
        lng: initialLng || defaultCenter.lng
    });

    const onClick = useCallback((e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            setMarkerPos({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        }
    }, []);

    const handleConfirm = () => {
        onSelect(markerPos.lat, markerPos.lng);
        onClose();
    };

    if (!isLoaded) return <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-xl animate-pulse">Loading Map...</div>;

    const needsKey = !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    return (
        <div className="space-y-4">
            {needsKey && (
                <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-sm mb-4 border border-amber-200">
                    <span className="font-bold">Warning:</span> NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set. Map may not load properly.
                </div>
            )}
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={markerPos}
                    zoom={10}
                    onClick={onClick}
                    options={{ disableDefaultUI: true, zoomControl: true }}
                >
                    <Marker position={markerPos} />
                </GoogleMap>
            </div>

            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="text-xs font-mono text-gray-500">
                    Lat: {markerPos.lat.toFixed(6)} | Lng: {markerPos.lng.toFixed(6)}
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
                    <Button type="button" size="sm" onClick={handleConfirm} className="bg-violet-600 hover:bg-violet-700 text-white">
                        Confirm Location
                    </Button>
                </div>
            </div>
        </div>
    );
}
