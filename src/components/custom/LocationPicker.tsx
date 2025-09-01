'use client'

import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

type LocationValue = {
    latitude: number
    longitude: number
    description?: string
}

interface Props {
    value?: LocationValue | null
    onChange: (v: LocationValue) => void
    className?: string
    placeholder?: string
}

/**
 * Fix leaflet's default icon paths when bundlers don't resolve them automatically.
 */
const fixLeafletIcons = () => {
    try {
        const iconRetina = new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).toString()
        const icon = new URL('leaflet/dist/images/marker-icon.png', import.meta.url).toString()
        const shadow = new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).toString()

        L.Icon.Default.mergeOptions({
            iconRetinaUrl: iconRetina,
            iconUrl: icon,
            shadowUrl: shadow,
        })
    } catch (err) {
        // ignore if import.meta or URL fails in certain environments
    }
}

fixLeafletIcons()

function MapSync({ center }: { center: [number, number] }) {
    const map = useMap()
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom(), { animate: true })
        }
    }, [center, map])
    return null
}

export default function LocationPicker({
    value,
    onChange,
    className,
    placeholder = 'Search for a place or address',
}: Props) {
    // ensure tuple types so TS treats them as LatLngTuple
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState<Array<any>>([])
    const [loading, setLoading] = useState(false)
    const [center, setCenter] = useState<[number, number]>(
        value ? [value.latitude, value.longitude] : [0, 0]
    )
    const [selected, setSelected] = useState<LocationValue | null>(value ?? null)
    const debounceRef = useRef<number | null>(null)

    useEffect(() => {
        // keep center in sync when outside value changes
        if (value) {
            setCenter([value.latitude, value.longitude])
            setSelected(value)
            setQuery(value.description ?? '')
        }
    }, [value])

    useEffect(() => {
        if (!query) {
            setSuggestions([])
            setLoading(false)
            return
        }

        setLoading(true)
        if (debounceRef.current) {
            window.clearTimeout(debounceRef.current)
        }
        debounceRef.current = window.setTimeout(() => {
            // Nominatim search (no custom headers in browsers; avoid User-Agent header)
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                query
            )}&addressdetails=1&limit=6`
            fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    setSuggestions(Array.isArray(data) ? data : [])
                })
                .catch(() => setSuggestions([]))
                .finally(() => setLoading(false))
        }, 400)

        return () => {
            if (debounceRef.current) {
                window.clearTimeout(debounceRef.current)
            }
        }
    }, [query])

    const handleSelect = (item: any) => {
        const lat = parseFloat(item.lat)
        const lon = parseFloat(item.lon)
        const desc = item.display_name
        const loc: LocationValue = { latitude: lat, longitude: lon, description: desc }
        setSelected(loc)
        setCenter([lat, lon])
        setQuery(desc)
        setSuggestions([])
        onChange(loc)
    }

    const handleMarkerDrag = (e: any) => {
        const marker = e.target
        const pos = marker.getLatLng()
        const loc: LocationValue = {
            latitude: pos.lat,
            longitude: pos.lng,
            description: selected?.description ?? '',
        }
        setSelected(loc)
        onChange(loc)
    }

    // explicit tuple ensures correct typing for MapContainer center prop
    const mapCenter: [number, number] =
        center[0] === 0 && center[1] === 0 ? [6.522, -1.363] : center

    return (
        <div className={className}>
            <div className="mb-2">
                <input
                    aria-label="Search location"
                    placeholder={placeholder}
                    className="w-full rounded border px-3 py-2 text-sm"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                    }}
                />
                {loading && <div className="text-xs text-muted-foreground mt-1">Searching…</div>}
                {suggestions.length > 0 && (
                    <ul className="max-h-48 overflow-auto rounded border py-1 text-sm">
                        {suggestions.map((s: any) => (
                            <li
                                key={s.place_id}
                                className="cursor-pointer px-3 py-2 hover:bg-muted/50"
                                onClick={() => handleSelect(s)}
                            >
                                <div className="font-medium">{s.display_name.split(',')[0]}</div>
                                <div className="text-xs text-muted-foreground">{s.display_name}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div style={{ height: 280 }} className="rounded">
                <MapContainer
                    center={mapCenter as L.LatLngExpression}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                >
                    <MapSync center={mapCenter} />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {selected && (
                        <Marker
                            draggable
                            position={[selected.latitude, selected.longitude] as L.LatLngExpression}
                            eventHandlers={{
                                dragend: handleMarkerDrag,
                            }}
                        >
                            <Popup>{selected.description ?? `${selected.latitude}, ${selected.longitude}`}</Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
        </div>
    )
}