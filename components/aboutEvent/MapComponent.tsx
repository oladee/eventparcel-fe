"use client";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { Autocomplete } from "@react-google-maps/api";
import { useState, useRef } from "react";

const libraries: any = ["places"];

const MapComponent = ({ onLocationSelect }: { onLocationSelect: (location: string) => void }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  if (!isLoaded) return <p>Loading Map...</p>;

  // Handle place selection
  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.formatted_address) {
        const location = {
          lat: place.geometry.location?.lat()!,
          lng: place.geometry.location?.lng()!,
        };
        setMarker(location);
        map?.panTo(location);
        onLocationSelect(place.formatted_address);
      }
    }
  };

  // Handle map click
  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    setMarker({ lat, lng });

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();

    if (data.results.length > 0) {
      onLocationSelect(data.results[0].formatted_address);
    }
  };

  return (
    <div className="w-full h-[400px] relative">
      {/* Search Input */}
      <Autocomplete
        onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
        onPlaceChanged={handlePlaceSelect}
      >
        <input
          type="text"
          placeholder="Search for a place..."
          className="absolute top-3 left-1/2 transform -translate-x-1/2 w-[80%] p-2 border rounded-md z-10"
        />
      </Autocomplete>

      {/* Google Map */}
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        zoom={10}
        center={{ lat: 6.5244, lng: 3.3792 }} // Default: Lagos, Nigeria
        onLoad={(map) => setMap(map)}
        onClick={handleMapClick}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
