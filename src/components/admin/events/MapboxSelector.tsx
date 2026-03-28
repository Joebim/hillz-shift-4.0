'use client';

import React, { useState } from 'react';
import Map, { Marker, NavigationControl, ViewStateChangeEvent, MapMouseEvent } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/src/components/ui/Button';
import { MapPin } from 'lucide-react';

interface MapboxSelectorProps {
    initialLat?: number;
    initialLng?: number;
    onSelect: (lat: number, lng: number) => void;
    onClose: () => void;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const defaultCenter = {
    lat: 9.0820,
    lng: 8.6753
};

export function MapboxSelector({ initialLat, initialLng, onSelect, onClose }: MapboxSelectorProps) {
    const [markerPos, setMarkerPos] = useState({
        lat: initialLat || defaultCenter.lat,
        lng: initialLng || defaultCenter.lng
    });

    const [viewState, setViewState] = useState({
        latitude: initialLat || defaultCenter.lat,
        longitude: initialLng || defaultCenter.lng,
        zoom: 10
    });

    const handleMapClick = (e: MapMouseEvent) => {
        const { lng, lat } = e.lngLat;
        setMarkerPos({ lat, lng });
    };

    const handleConfirm = () => {
        onSelect(markerPos.lat, markerPos.lng);
        onClose();
    };

    if (!MAPBOX_TOKEN || MAPBOX_TOKEN === 'your_mapbox_access_token_here') {
        return (
            <div className="h-[400px] flex flex-col items-center justify-center bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-sm p-8 text-center gap-4">
                <MapPin className="text-amber-500 animate-bounce" size={48} />
                <p className="font-bold">Mapbox Access Token Missing</p>
                <p className="max-w-[280px]">Please update NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your .env.local file to enable map selection.</p>
                <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm h-[400px]">
                <Map
                    {...viewState}
                    onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
                    onClick={handleMapClick}
                    style={{ width: '100%', height: '100%' }}
                    mapStyle="mapbox://styles/mapbox/streets-v12"
                    mapboxAccessToken={MAPBOX_TOKEN}
                    cursor="crosshair"
                >
                    <NavigationControl position="top-right" />
                    <Marker latitude={markerPos.lat} longitude={markerPos.lng} anchor="bottom">
                        <MapPin className="text-violet-600 fill-violet-100" size={32} />
                    </Marker>
                </Map>
            </div>

            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="text-[10px] md:text-xs font-mono text-gray-500 flex flex-col md:flex-row md:gap-4 leading-none">
                    <span>Lat: {markerPos.lat.toFixed(6)}</span>
                    <span className="hidden md:inline text-gray-200">|</span>
                    <span>Lng: {markerPos.lng.toFixed(6)}</span>
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={onClose}>Cancel</Button>
                    <Button type="button" size="sm" onClick={handleConfirm} className="bg-violet-600 hover:bg-violet-700 text-white px-6">
                        Confirm Location
                    </Button>
                </div>
            </div>
        </div>
    );
}
