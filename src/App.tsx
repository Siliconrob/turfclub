import React, {useEffect, useRef, useState} from 'react'
import './App.css'
import mapboxgl, {Marker} from 'mapbox-gl';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {API} from "./API.tsx";
import {findPosition} from "./FindPosition.tsx";

mapboxgl.accessToken = API.MAP_TOKEN;

function numericOnly(evt: React.KeyboardEvent<HTMLInputElement>) {

  console.log(evt);

  const isAlpha = /\p{L}/u.test(evt.key.charAt(0))
  if (isAlpha) {
    evt.preventDefault();
  }
}

const mapStart = {
  latitude: 44.2853,
  longitude: -99.4632
};

class Route {
  public Start!: never;
  public End!: never;
}

let markers = new Array<Marker>();


function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [startText, setStartText] = useState('');
  const [endText, setEndText] = useState('');
  const [route, setRoute] = useState(new Route());
  const [showPoints, setShowPoints] = useState(false);
  const [zoom, setZoom] = useState(0);


  const handleClick = async () => {
    toast.info('Searching', {autoClose: 1250});
    try {
      
      const positions = {
        Start: await findPosition(startText),
        End: await findPosition(endText)
      };
      
      const newPositions = new Route();
      newPositions.Start = positions.Start as never;
      newPositions.End = positions.End as never;
      setRoute(newPositions);
      setShowPoints(true);
    } catch (error) {
      setShowPoints(false);
      toast.error('Error, check console logs for details');
      const detail = error as unknown as Error;
      console.error(detail.message);
    }
  };


  useEffect(() => {
    if (map.current) {
      
      if (showPoints) {
        while (markers.length > 0) {
          let currentMarker = markers.pop();
          if (currentMarker !== undefined && currentMarker !== null) {
            currentMarker.remove();  
          }
        }
        
        
        // const start = [route.Start?.position?.lng, route.Start?.position?.lat];
        // const end = [route.End?.position?.lng, route.End?.position?.lat];

        const start = new mapboxgl.Marker().setLngLat([route.Start?.position?.lng, route.Start?.position?.lat]);
        const end = new mapboxgl.Marker().setLngLat([route.End?.position?.lng, route.End?.position?.lat]);

        //map.current.addLayer()
        
        
        markers.push(start);
        markers.push(end);

        start.addTo(map.current);
        // // @ts-ignore
        // map.current.flyTo({
        //   center: start.getLngLat(),
        //   essential: true,
        //   zoom: 14
        // });
        return;
      }
      
      // @ts-ignore
      map.current.flyTo({
        center: [mapStart.longitude, mapStart.latitude],
        essential: true
      });
      
      return; // initialize map only once
    }

    // @ts-ignore
    map.current = new mapboxgl.Map({
      // @ts-ignore
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [mapStart.longitude, mapStart.latitude],
      zoom: zoom
    });
  });


  return (
    <>
      <ToastContainer position="top-right"/>
      <div>
        <h1>Turfjs Club</h1>
      </div>
      <div className="card">
        <div className="row parent">
          <div className="child">
            <label>Start</label>
          </div>
          <div className="child">
            <input required type="text" name="searchText" placeholder={"From here"} onChange={(e) => {
              const input = e.target.value as unknown as string;
              setStartText(input);
              console.log(input);
            }}/>
          </div>
        </div>
        <div className="row parent">
          <div className="child">
            <label>End</label>
          </div>
          <div className="child">
            <input required type="text" name="searchText" placeholder={"To there"} onChange={(e) => {
              const input = e.target.value as unknown as string;
              setEndText(input);
              console.log(input);
            }}/>
          </div>
        </div>
        <div className="row">
          <button className="pad-items" onClick={handleClick}>Search</button>
        </div>
      </div>
      <div className="show">

      </div>
      <div ref={mapContainer} className="map-container"/>
    </>
  )
}

export default App
