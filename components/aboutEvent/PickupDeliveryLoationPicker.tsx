"use client";

import React, { useState, useRef } from "react";
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";

interface PickupDeliveryLoationPicker {
    onLocationSelect: (location: {
      address: string;
      lat: number;
      lng: number;
    }) => void;
    onCancel: () => void;
  }
  

const mapContainerStyle = {
  height: "100%",
  width: "100%",
};

const centerDefault = { lat: 51.505, lng: -0.09 };

const PickupDeliveryLoationPicker: React.FC<PickupDeliveryLoationPicker> = ({
  onLocationSelect,
  onCancel
}) => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState<string>("");
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Callback when the Autocomplete is loaded
  const onLoadAutocomplete = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };
  

  // Callback when a place is selected in the Autocomplete
  const handlePlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const formattedAddress = place.formatted_address || place.name || "";

        setPosition({ lat, lng });
        setAddress(formattedAddress);

        if (position && address) {
          onLocationSelect({
            address,
            lat: parseFloat(position.lat.toFixed(5)),
            lng: parseFloat(position.lng.toFixed(5)),
          })}
      } else {
        alert("No details available for input: " + place.name);
      }
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };
 
    // When clicking on the map, update the marker position
    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setPosition({ lat, lng });
    
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results && results[0]) {
            setAddress(results[0].formatted_address);
            } else {
            console.error("Geocoder failed due to: " + status);
            setAddress(""); // fallback
            }
        });
        }
    };
  

  // When selecting a location, return the latitude and longitude as a formatted string
  const handleSelect = () => {
    if (position && address) {
      onLocationSelect({
        address,
        lat: parseFloat(position.lat.toFixed(5)),
        lng: parseFloat(position.lng.toFixed(5)),
      });
    } else {
      alert("Please select a valid location.");
    }
  };
  
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[90%] h-[80%] p-4 rounded-md flex flex-col">
        <h2 className="text-xl font-bold mb-4">Select Location</h2>
        {/* Google Places Autocomplete Search Input */}
        <div className="mb-4">
          <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={handlePlaceChanged}>
            <input
              type="text"
              placeholder="Search for a place"
              className="w-full p-2 border rounded"
              ref={inputRef}
            />
          </Autocomplete>
        </div>
        {/* Google Map */}
        <div className="flex-1">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={position ? position : centerDefault}
            zoom={13}
            onClick={handleMapClick}
          >
            {position && <Marker position={position} />}
          </GoogleMap>
        </div>
        {/* Modal Action Buttons */}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded-md">
            Cancel
          </button>
          <button
            onClick={handleSelect}
            className="px-4 py-2 bg-primary text-white rounded-md"
            disabled={!position}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default PickupDeliveryLoationPicker;
