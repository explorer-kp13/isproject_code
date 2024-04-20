import { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon, map, point } from "leaflet";
import { coordinatesData } from "./coordinates";

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


// const createClusterCustomIcon = function (cluster) {
//   return new divIcon({
//     html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
//     className: "custom-marker-cluster",
//     iconSize: point(33, 33, true)
//   });
// };

export default function Home() {

  const [data,setData]=useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [quantityValue, setQuantityValue] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState('1');
  const [time,setTime]=useState("1");

  const [mapCenter,setMapCenter] = useState([23.6850, 90.3563]);
  const [mapZoom,setMapZoom] = useState(5);

  const getData = async () => {
    try {
        const response = await axios.get("http://127.0.0.1:8001/get-data");
        console.log(response.data)
        setData(response.data)
    } catch (error) {
        console.error("Error:", error);
    }
  };

  useEffect(()=>{
    getData();
  },[])

  const handleSubmit = async (e, product, site, time, quantity) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8001/update-data', {
        product: product,
        site: site,
        time: time,
        quantity: quantity,
      });
      setSelectedProduct('1')
      setQuantityValue(0)
      alert(response.data.message);
      console.log(response.data.data);
      setData(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  function setType(type){
      setSelectedType(type);
      setMapZoom(5);
      setMapCenter([23.6850, 90.3563]);
  }

  const RecenterAutomatically = () => {
    const map = useMap();
     useEffect(() => {
       map.setView(mapCenter);
       map.setZoom(mapZoom);
     }, [mapCenter]);
     return null;
   }

  return (
    <>
    <div className="parent">
    {/* <div className="child"></div> */}
    <div className="child2">
      <h1>Enter Initial State</h1>
      <select value={time} onChange={(e)=>setTime(e.target.value)}>
        <option value={"1"}>Time 1</option>
        <option value={"2"}>Time 2</option>
        <option value={"3"}>Time 3</option>
      </select>
      <div className="button-container">
        <button onClick={() => setType("Supplier")}>Supplier</button>
        <button onClick={() => setType("Market")}>Market</button>
        <button onClick={() => setType("Dry Port")}>Dry Port</button>
        <button onClick={() => setType("Origin/Dest")}>Origin/Dest</button>
        <button onClick={() => setType(null)}>Show All</button>
      </div>
      <select onChange={(e)=>{
              setMapCenter([coordinatesData.filter(marker=>!selectedType || marker.type===selectedType)[e.target.value].latitude,coordinatesData.filter(marker=>!selectedType || marker.type===selectedType)[e.target.value].longitude]);
              setMapZoom(15);
            }}>
              <option value={null}>Select Site</option>
      {coordinatesData.filter(marker=>!selectedType || marker.type===selectedType).map((marker, index) => (
            <option key={index} value={index}>
              {marker.name}
            </option>
          ))}
          </select>
          <MapContainer center={mapCenter} zoom={mapZoom} className="map-container">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterCustomIcon}
      > */}

        {coordinatesData.filter(marker=>!selectedType || marker.type===selectedType).map((marker, index) => (
          <Marker key={index} position={[marker.latitude, marker.longitude]} icon={getIcon(marker.type)}
          onClick={()=>console.log('test')}>
            <Popup>
              <div>
                <h3>{marker.name}</h3>
                <form onSubmit={(e) => handleSubmit(e, selectedProduct, marker.s, time, quantityValue)}>
                <div className="product-info">
    <span className="product-label">Product 1 :</span>
    <span className="product-value">{data && data['1'][marker.s][time]}</span>
  </div>
  <div className="product-info">
    <span className="product-label">Product 2 :</span>
    <span className="product-value">{data && data['2'][marker.s][time]}</span>
  </div>
  <div className="product-info">
    <span className="product-label">Product 3 :</span>
    <span className="product-value">{data && data['3'][marker.s][time]}</span>
  </div>
  <div className="product-info">
    <span className="product-label">Product 4 :</span>
    <span className="product-value">{data && data['4'][marker.s][time]}</span>
  </div>
  <br></br>
                  <label htmlFor="product">Select Product:</label>
                  <select id="product" name="product" value={selectedProduct} onChange={(e)=>setSelectedProduct(e.target.value)}>
                    <option value="1">Product 1</option>
                    <option value="2">Product 2</option>
                    <option value="3">Product 3</option>
                    <option value="4">Product 4</option>
                  </select>
                  <br></br>
                  <label htmlFor="quantity">Quantity:</label>
                  <input type="number" id="quantity" name="quantity" value={quantityValue} onChange={(e)=>setQuantityValue(e.target.value)} />
                  <button type="submit">Submit</button>
                </form>
              </div>
            </Popup>
          </Marker>
        ))}
        <RecenterAutomatically/>
      {/* </MarkerClusterGroup> */}
    </MapContainer>
    </div>
    {/* <div className="child"></div> */}
    </div>
    </>
  );
}

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
      return supplierIcon;
  }
}


