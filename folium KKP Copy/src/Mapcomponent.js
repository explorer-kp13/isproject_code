import React, { useState } from "react";
import "./styles.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon, point } from "leaflet";
import { coordinatesData } from "./coordinates"; // Import coordinatesData from coordinates.js

// Define icons for different types
const supplierIcon = new Icon({
  iconUrl: require("./icons/supplier-icon.png"),
  iconSize: [38, 38]
});

const marketIcon = new Icon({
  iconUrl: require("./icons/market-icon.png"),
  iconSize: [38, 38]
});

const dryPortIcon = new Icon({
  iconUrl: require("./icons/dry-port-icon.png"),
  iconSize: [38, 38]
});

const originDestIcon = new Icon({
  iconUrl: require("./icons/origin-dest-icon.png"),
  iconSize: [38, 38]
});

const createClusterCustomIcon = function (cluster) {
  return new divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true)
  });
};

const initialTextAreaValue = '';

export default function App() {
  const [textAreaValue, setTextAreaValue] = useState(initialTextAreaValue);
  const [selectedType, setSelectedType] = useState(null);

  const handleChange = (event) => {
    setTextAreaValue(event.target.value);
  };

  const handleTypeFilter = (type) => {
    setSelectedType(type === selectedType ? null : type);
  };
  

  // Filter markers based on the selected type
  const filteredMarkers = selectedType
    ? coordinatesData.filter((coordinate) => coordinate.type === selectedType)
    : coordinatesData;

  return (
    <div>
      <div className="button-container">
        <button onClick={() => handleTypeFilter("Supplier")}>Supplier</button>
        <button onClick={() => handleTypeFilter("Market")}>Market</button>
        <button onClick={() => handleTypeFilter("Dry Port")}>Dry Port</button>
        <button onClick={() => handleTypeFilter("Origin/Dest")}>Origin/Dest</button>
        <button onClick={() => setSelectedType(null)}>Show All</button>
      </div>
      <MapContainer center={[23.6850, 90.3563]} zoom={7} className="map-container">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
        >
          {filteredMarkers.map((marker, index) => (
            <Marker key={index} position={[marker.latitude, marker.longitude]} icon={getIcon(marker.type)}>
              <Popup>{marker.name}</Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}

// Function to get the appropriate icon based on the type
function getIcon(type) {
  switch (type) {
    case "Supplier":
      return supplierIcon;
    case "Market":
      return marketIcon;
    case "Dry Port":
      return dryPortIcon;
    case "Origin/Dest":
      return originDestIcon;
    default:
      return supplierIcon; // Default icon
  }
}