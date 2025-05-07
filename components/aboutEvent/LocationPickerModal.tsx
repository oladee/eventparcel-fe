"use client";

import React, { useState, useRef } from "react";
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";

interface LocationPickerModalProps {
  onLocationSelect: (location: string) => void;
  onCancel: () => void;
}

const mapContainerStyle = {
  height: "100%",
  width: "100%",
};

const centerDefault = { lat: 51.505, lng: -0.09 };

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  onLocationSelect,
  onCancel,
}) => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Autocomplete loaded
  const onLoadAutocomplete = (ac: google.maps.places.Autocomplete) => {
    setAutocomplete(ac);
  };

  // User picked a place from the dropdown
  const handlePlaceChanged = () => {
    if (!autocomplete) return;
    const place = autocomplete.getPlace();
    if (place.geometry?.location) {
      setPosition({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    } else {
      alert("No details available for input: " + place.name);
    }
  };

  // Map click handler
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    setPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  };

  // Reverse-geocode coords → address
  const handleSelect = () => {
    if (!position) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: position }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        onLocationSelect(results[0].formatted_address);
      } else {
        // fallback to coords if geocoding fails
        onLocationSelect(`Lat: ${position.lat.toFixed(5)}, Lng: ${position.lng.toFixed(5)}`);
      }
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[90%] h-[80%] p-4 rounded-md flex flex-col">
        <h2 className="text-xl font-bold mb-4">Select Location</h2>

        {/* Autocomplete search */}
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

        {/* Map */}
        <div className="flex-1">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={position || centerDefault}
            zoom={13}
            onClick={handleMapClick}
          >
            {position && <Marker position={position} />}
          </GoogleMap>
        </div>

        {/* Actions */}
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

export default LocationPickerModal;












// "use client";

// import React, { useState, useRef } from "react";
// import {
//   GoogleMap,
//   LoadScript,
//   Marker,
//   Autocomplete,
// } from "@react-google-maps/api";

// interface LocationPickerModalProps {
//   onLocationSelect: (location: string) => void;
//   onCancel: () => void;
// }

// const mapContainerStyle = {
//   height: "100%",
//   width: "100%",
// };

// const centerDefault = { lat: 51.505, lng: -0.09 };

// const libraries: ("places")[] = ["places"];

// const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
//   onLocationSelect,
//   onCancel,
// }) => {
//   const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
//   const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   // Callback when the Autocomplete is loaded
//   const onLoadAutocomplete = (autocompleteInstance: google.maps.places.Autocomplete) => {
//     setAutocomplete(autocompleteInstance);
//   };

//   // Callback when a place is selected in the Autocomplete
//   const handlePlaceChanged = () => {
//     if (autocomplete !== null) {
//       const place = autocomplete.getPlace();
//       if (place.geometry && place.geometry.location) {
//         const lat = place.geometry.location.lat();
//         const lng = place.geometry.location.lng();
//         setPosition({ lat, lng });
//       } else {
//         alert("No details available for input: " + place.name);
//       }
//     } else {
//       console.log("Autocomplete is not loaded yet!");
//     }
//   };

//   // When clicking on the map, set a new marker position
//   const handleMapClick = (e: google.maps.MapMouseEvent) => {
//     if (e.latLng) {
//       const lat = e.latLng.lat();
//       const lng = e.latLng.lng();
//       setPosition({ lat, lng });
//     }
//   };

//   // Return the chosen coordinates (reverse geocoding can be applied here if needed)
//   const handleSelect = () => {
//     if (position) {
//       // For now, we simply return the lat and lng. You can integrate
//       // Google Geocoder for a human-readable address if desired.
//       onLocationSelect(`Lat: ${position.lat.toFixed(5)}, Lng: ${position.lng.toFixed(5)}`);
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//       <LoadScript googleMapsApiKey="AIzaSyDSJLDP8ehodqfX8FEFjhfOyp7NNniFUa4" libraries={libraries}>
//         <div className="bg-white w-[90%] h-[80%] p-4 rounded-md flex flex-col">
//           <h2 className="text-xl font-bold mb-4">Select Location</h2>
//           {/* Google Places Autocomplete Search Input */}
//           <div className="mb-4">
//             <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={handlePlaceChanged}>
//               <input
//                 type="text"
//                 placeholder="Search for a place"
//                 className="w-full p-2 border rounded"
//                 ref={inputRef}
//               />
//             </Autocomplete>
//           </div>
//           {/* Google Map */}
//           <div className="flex-1">
//             <GoogleMap
//               mapContainerStyle={mapContainerStyle}
//               center={position ? position : centerDefault}
//               zoom={13}
//               onClick={handleMapClick}
//             >
//               {position && <Marker position={position} />}
//             </GoogleMap>
//           </div>
//           {/* Action Buttons */}
//           <div className="mt-4 flex justify-end gap-2">
//             <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded-md">
//               Cancel
//             </button>
//             <button
//               onClick={handleSelect}
//               className="px-4 py-2 bg-primary text-white rounded-md"
//               disabled={!position}
//             >
//               Select
//             </button>
//           </div>
//         </div>
//       </LoadScript>
//     </div>
//   );
// };

// export default LocationPickerModal;























// "use client";

// import React, { useState } from "react";
// import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
// import { LeafletMouseEvent } from "leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// // Custom marker icon using images from the public folder
// const customMarkerIcon = new L.Icon({
//   iconUrl: "/images/marker-icon.png",
//   // iconRetinaUrl: "/images/marker-icon.png",
//   shadowUrl: "/images/marker-icon-shadow.png",
//   iconSize:     [38, 95], // size of the icon
//   shadowSize:   [50, 64], // size of the shadow
//   iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
//   shadowAnchor: [4, 62],  // the same for the shadow
//   popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
// });

// // Helper to recenter the map when position changes
// const RecenterMap: React.FC<{ position: [number, number] | null }> = ({ position }) => {
//   const map = useMap();
//   React.useEffect(() => {
//     if (position) {
//       map.setView(position);
//     }
//   }, [position, map]);
//   return null;
// };

// // Component to handle map clicks with proper event typing
// const MapClickHandler: React.FC<{ setPosition: (pos: [number, number]) => void }> = ({ setPosition }) => {
//   useMapEvents({
//     click: (e: LeafletMouseEvent) => {
//       setPosition([e.latlng.lat, e.latlng.lng]);
//     },
//   });
//   return null;
// };

// interface LocationPickerModalProps {
//   onLocationSelect: (location: string) => void;
//   onCancel: () => void;
// }

// const LocationPickerModal: React.FC<LocationPickerModalProps> = ({ onLocationSelect, onCancel }) => {
//   const [position, setPosition] = useState<[number, number] | null>(null);
//   const [searchQuery, setSearchQuery] = useState<string>("");

//   // Forward geocoding: search for a place
//   const handleSearch = async () => {
//     if (!searchQuery.trim()) return;
//     try {
//       const res = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
//       );
//       const data = await res.json();
//       if (data && data.length > 0) {
//         const firstResult = data[0];
//         const lat = parseFloat(firstResult.lat);
//         const lon = parseFloat(firstResult.lon);
//         setPosition([lat, lon]);
//       } else {
//         alert("No results found");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Error occurred while searching");
//     }
//   };

//   // Reverse geocode the chosen coordinates for a human-readable address
//   const handleSelect = async () => {
//     if (position) {
//       try {
//         const res = await fetch(
//           `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position[0]}&lon=${position[1]}`
//         );
//         const data = await res.json();
//         const address =
//           data.display_name || `Lat: ${position[0].toFixed(5)}, Lng: ${position[1].toFixed(5)}`;
//         onLocationSelect(address);
//       } catch (err) {
//         console.error(err);
//         onLocationSelect(`Lat: ${position[0].toFixed(5)}, Lng: ${position[1].toFixed(5)}`);
//       }
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//       <div className="bg-white w-[90%] h-[80%] p-4 rounded-md flex flex-col">
//         <h2 className="text-xl font-bold mb-4">Select Location</h2>
//         {/* Search input */}
//         <div className="mb-4">
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search for a place"
//             className="w-full p-2 border rounded"
//           />
//           <button onClick={handleSearch} className="mt-2 px-4 py-2 bg-primary text-white rounded">
//             Search
//           </button>
//         </div>
//         {/* Map container */}
//         <div className="flex-1">
//           <MapContainer
//             center={position || ([51.505, -0.09] as [number, number])}
//             zoom={13}
//             style={{ height: "100%", width: "100%" }}
//           >
//             {/* Casting attribution prop to any to bypass TS error */}
//             <TileLayer
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               {...({ attribution: "&copy; OpenStreetMap contributors" } as any)}
//             />
//             <MapClickHandler setPosition={setPosition} />
//             <RecenterMap position={position} />
//             {position && <Marker position={position} icon={customMarkerIcon} />}
//           </MapContainer>
//         </div>
//         {/* Modal action buttons */}
//         <div className="mt-4 flex justify-end gap-2">
//           <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded-md">
//             Cancel
//           </button>
//           <button
//             onClick={handleSelect}
//             className="px-4 py-2 bg-primary text-white rounded-md"
//             disabled={!position}
//           >
//             Select
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LocationPickerModal;