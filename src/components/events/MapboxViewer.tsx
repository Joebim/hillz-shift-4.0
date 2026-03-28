'use client';

import React, { useState } from 'react';
import Map, { Marker, NavigationControl, ViewStateChangeEvent, MapMouseEvent } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

interface MapboxViewerProps {
    lat: number;
    lng: number;
    zoom?: number;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export function MapboxViewer({ lat, lng, zoom = 14 }: MapboxViewerProps) {
    const [viewState, setViewState] = useState({
        latitude: lat,
        longitude: lng,
        zoom: zoom
    });

    if (!MAPBOX_TOKEN || MAPBOX_TOKEN === 'your_mapbox_access_token_here') {
        return (
            <div className="w-full h-[300px] flex flex-col items-center justify-center bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-sm p-4 text-center gap-2">
                <MapPin className="text-amber-500 animate-bounce" size={24} />
                <p>Mapbox access token is missing or invalid.</p>
                <p className="text-[10px] opacity-60">Please configure NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in .env.local</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative border border-gray-100 shadow-sm">
            <Map
                {...viewState}
                onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/light-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
            >
                <NavigationControl position="top-right" />
                <Marker latitude={lat} longitude={lng} anchor="bottom">
                    <MapPin className="text-purple-600 fill-purple-100" size={32} />
                </Marker>
            </Map>
        </div>
    );
}
