'use client';

import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
    width: '100%',
    height: '100%',
    minHeight: '300px',
    borderRadius: '12px'
};

interface GoogleMapViewerProps {
    lat: number;
    lng: number;
    zoom?: number;
}

export function GoogleMapViewer({ lat, lng, zoom = 14 }: GoogleMapViewerProps) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
    });

    const position = { lat, lng };
    const needsKey = !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!isLoaded) return <div className="w-full h-[300px] flex items-center justify-center bg-gray-50 rounded-xl animate-pulse text-sm text-gray-400">Loading Map...</div>;

    return (
        <div className="w-full h-full relative rounded-xl overflow-hidden border border-gray-100 shadow-sm">
            {needsKey && (
                <div className="absolute top-2 left-2 right-2 z-10 bg-amber-50/90 text-amber-800 text-xs p-2 rounded-lg border border-amber-200">
                    Map requires API key configuration.
                </div>
            )}
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={position}
                zoom={zoom}
                options={{ disableDefaultUI: false }}
            >
                <Marker position={position} />
            </GoogleMap>
        </div>
    );
}
