"use client";

import { LocateFixed, MapPin, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

type Coordinates = { latitude: number; longitude: number };
export type LocationValue = Coordinates & {
  address: string;
  city: string;
  state: string;
  pincode: string;
  mapLink: string;
};

type Props = {
  value: LocationValue;
  onChange: (value: LocationValue) => void;
  onError?: (message: string) => void;
};

type SearchResult = {
  display_name: string;
  lat: string;
  lon: string;
  address?: Record<string, string>;
};

const INDIA_CENTER: [number, number] = [22.5937, 78.9629];

function locationFromResult(result: SearchResult): LocationValue {
  const address = result.address || {};
  return {
    latitude: Number(result.lat),
    longitude: Number(result.lon),
    address: result.display_name,
    city:
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      "",
    state: address.state || "",
    pincode: address.postcode || "",
    mapLink: `https://www.google.com/maps/search/?api=1&query=${result.lat},${result.lon}`,
  };
}

async function reverseGeocode(latitude: number, longitude: number) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`,
    { headers: { Accept: "application/json" } },
  );
  if (!response.ok) throw new Error("Location lookup failed");
  return (await response.json()) as SearchResult;
}

function MapClickHandler({ onPick }: { onPick: (lat: number, lon: number) => void }) {
  useMapEvents({ click: (event) => onPick(event.latlng.lat, event.latlng.lng) });
  return null;
}

function RecenterMap({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 15);
  }, [map, position]);
  return null;
}

export default function ClinicLocationPicker({ value, onChange, onError }: Props) {
  const hasCoordinates = Number.isFinite(value.latitude) && Number.isFinite(value.longitude) && (value.latitude !== 0 || value.longitude !== 0);
  const position = useMemo<[number, number]>(
    () => (hasCoordinates ? [value.latitude, value.longitude] : INDIA_CENTER),
    [hasCoordinates, value.latitude, value.longitude],
  );
  const [query, setQuery] = useState(value.address);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => setQuery(value.address), [value.address]);

  useEffect(() => {
    if (query.trim().length < 3 || query === value.address) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&countrycodes=in&q=${encodeURIComponent(query)}`,
          { signal: controller.signal, headers: { Accept: "application/json" } },
        );
        if (!response.ok) throw new Error("Search failed");
        setResults((await response.json()) as SearchResult[]);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) onError?.("Location search is temporarily unavailable.");
      } finally {
        setSearching(false);
      }
    }, 450);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [onError, query, value.address]);

  const chooseResult = (result: SearchResult) => {
    const next = locationFromResult(result);
    setQuery(next.address);
    setResults([]);
    onChange(next);
  };

  const chooseCoordinates = async (latitude: number, longitude: number) => {
    onChange({ ...value, latitude, longitude, mapLink: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}` });
    try {
      const result = await reverseGeocode(latitude, longitude);
      onChange(locationFromResult(result));
      setQuery(result.display_name);
    } catch {
      onError?.("We found the location, but could not retrieve its address. You can complete the address below.");
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      onError?.("Your browser does not support location access.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        void chooseCoordinates(coords.latitude, coords.longitude).finally(() => setLocating(false));
      },
      () => {
        setLocating(false);
        onError?.("Location permission was denied. Search for your clinic instead.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className="space-y-4 rounded-2xl border border-cyan-100 bg-cyan-50/40 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 font-semibold text-slate-900"><MapPin size={18} className="text-cyan-700" /> Find your clinic</h3>
          <p className="mt-1 text-sm text-slate-600">Search an address, choose a result, or tap the map to place your clinic.</p>
        </div>
        <button type="button" onClick={useCurrentLocation} disabled={locating} className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-cyan-200 bg-white px-3 py-2 text-xs font-semibold text-cyan-800 hover:bg-cyan-50 disabled:opacity-60">
          <LocateFixed size={15} /> {locating ? "Finding..." : "Use my location"}
        </button>
      </div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-3 text-slate-400" size={17} />
        <input className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search clinic, hospital, area or address" aria-label="Search clinic location" />
        {(searching || results.length > 0) && (
          <div className="absolute z-1000 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
            {searching && <p className="px-3 py-2 text-sm text-slate-500">Searching locations...</p>}
            {results.map((result) => <button type="button" key={`${result.lat}-${result.lon}`} onClick={() => chooseResult(result)} className="block w-full border-b border-slate-100 px-3 py-2 text-left text-sm text-slate-700 last:border-0 hover:bg-cyan-50">{result.display_name}</button>)}
          </div>
        )}
      </div>
      <div className="h-64 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
        <MapContainer center={position} zoom={hasCoordinates ? 15 : 5} scrollWheelZoom className="h-full w-full">
          <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapClickHandler onPick={(lat, lon) => void chooseCoordinates(lat, lon)} />
          {hasCoordinates && <><CircleMarker center={position} radius={10} pathOptions={{ color: "#0e7490", fillColor: "#06b6d4", fillOpacity: 0.9 }} /><RecenterMap position={position} /></>}
        </MapContainer>
      </div>
      <div className="rounded-xl border border-white bg-white p-3 text-sm">
        <p className="font-semibold text-slate-800">Selected location</p>
        <p className="mt-1 text-slate-600">{value.address || "No location selected yet"}</p>
        {(value.city || value.state || value.pincode) && <p className="mt-1 text-xs text-slate-500">{[value.city, value.state, value.pincode].filter(Boolean).join(" • ")}</p>}
        <button type="button" disabled={!hasCoordinates} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-cyan-700 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
          <MapPin size={14} /> Use this location
        </button>
      </div>
    </div>
  );
}
