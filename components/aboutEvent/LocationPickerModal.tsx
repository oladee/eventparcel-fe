"use client";
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";

// A helper to recenter the map when the position changes
const RecenterMap: React.FC<{ position: [number, number] | null }> = ({ position }) => {
  const map = useMap();
  React.useEffect(() => {
    if (position) {
      map.setView(position);
    }
  }, [position, map]);
  return null;
};

// Component to handle clicks on the map (with proper event typing)
const MapClickHandler: React.FC<{ setPosition: (pos: [number, number]) => void }> = ({ setPosition }) => {
  useMapEvents({
    click: (e: LeafletMouseEvent) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

interface LocationPickerModalProps {
  onLocationSelect: (location: string) => void;
  onCancel: () => void;
}

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({ onLocationSelect, onCancel }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Forward geocoding: search for a place
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const firstResult = data[0];
        const lat = parseFloat(firstResult.lat);
        const lon = parseFloat(firstResult.lon);
        setPosition([lat, lon]);
      } else {
        alert("No results found");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred while searching");
    }
  };

  // Reverse geocode the chosen coordinates for a human-readable address
  const handleSelect = async () => {
    if (position) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position[0]}&lon=${position[1]}`
        );
        const data = await res.json();
        const address =
          data.display_name || `Lat: ${position[0].toFixed(5)}, Lng: ${position[1].toFixed(5)}`;
        onLocationSelect(address);
      } catch (err) {
        console.error(err);
        onLocationSelect(`Lat: ${position[0].toFixed(5)}, Lng: ${position[1].toFixed(5)}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[90%] h-[80%] p-4 rounded-md flex flex-col">
        <h2 className="text-xl font-bold mb-4">Select Location</h2>
        {/* Search input */}
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a place"
            className="w-full p-2 border rounded"
          />
          <button onClick={handleSearch} className="mt-2 px-4 py-2 bg-primary text-white rounded">
            Search
          </button>
        </div>
        {/* Map container */}
        <div className="flex-1">
          <MapContainer
            center={position || ([51.505, -0.09] as [number, number])}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            {/* 
              Casting the attribution prop to any to bypass the TS error
              about attribution not being defined on TileLayerProps.
            */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              {...({ attribution: "&copy; OpenStreetMap contributors" } as any)}
            />
            <MapClickHandler setPosition={setPosition} />
            <RecenterMap position={position} />
            {position && <Marker position={position} />}
          </MapContainer>
        </div>
        {/* Modal action buttons */}
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














// // components/aboutEvent/LocationPickerModal.tsx
// "use client";
// import React, { useState } from "react";
// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// import "leaflet/dist/leaflet.css";


// // Helper component to handle map clicks
// const MapClickHandler: React.FC<{ setPosition: (pos: [number, number]) => void }> = ({ setPosition }) => {
//   useMapEvents({
//     click: (e) => {
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

//   const handleSelect = () => {
//     if (position) {
//       // You can format the location string as needed.
//       onLocationSelect(`Lat: ${position[0].toFixed(5)}, Lng: ${position[1].toFixed(5)}`);
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//       <div className="bg-white w-[90%] h-[80%] p-4 rounded-md flex flex-col">
//         <h2 className="text-xl font-bold mb-4">Select Location</h2>
//         <div className="flex-1">
//           <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100%", width: "100%" }}>
//             <TileLayer
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               attribution='&copy; OpenStreetMap contributors'
//             />
//             <MapClickHandler setPosition={setPosition} />
//             {position && <Marker position={position} />}
//           </MapContainer>
//         </div>
//         <div className="mt-4 flex justify-end gap-2">
//           <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded-md">
//             Cancel
//           </button>
//           <button onClick={handleSelect} className="px-4 py-2 bg-primary text-white rounded-md" disabled={!position}>
//             Select
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LocationPickerModal;
