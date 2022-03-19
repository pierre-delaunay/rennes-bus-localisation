import {StrictMode, useEffect, useState, useRef} from "react";
import Amplify, {Auth, Geo} from "aws-amplify";
import {AmazonLocationServiceMapStyle} from "@aws-amplify/geo";
import {AmplifyMapLibreRequest} from "maplibre-gl-js-amplify";
import Map, {
    NavigationControl,
    ViewState,
    Marker,
    Popup,
    FullscreenControl,
    GeolocateControl,
    ScaleControl
} from "react-map-gl";
import ReactDOM from 'react-dom';
import 'mapbox-gl/dist/mapbox-gl.css';

import awsconfig from "./aws-exports";

import "maplibre-gl/dist/maplibre-gl.css";
import "./index.css";
import ControlPanel from "./control-panel";

/**
 * Amplify configuration.
 */
Amplify.configure(awsconfig);

/**
 * Bus information retrieved from Open Data Rennes.
 */
interface Bus {
    busId: number;
    busRoute: string;
    latitude: number;
    longitude: number;
    timestamp?: string;
}

const App = () => {
    const [transformerReady, setTransformerReady] = useState<boolean>(false);
    const [buses, setBuses] = useState<Bus[]>([]);
    const amplifyMaplibre = useRef<AmplifyMapLibreRequest>();

    /** Refresh markers every minute. */
    const MINUTE_MS = 60000;

    const [viewState, setViewState] = useState<Partial<ViewState>>({
        longitude: -1.6777926,
        latitude: 48.117266,
        zoom: 12,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            getBusData().then();
        }, MINUTE_MS);

        const createTransformer = async () => {
            if (!transformerReady) {
                const credentials = await Auth.currentCredentials();
                amplifyMaplibre.current = new AmplifyMapLibreRequest(
                    credentials,
                    (Geo.getDefaultMap() as AmazonLocationServiceMapStyle).region
                );
                setTransformerReady(true);
            }
        };

        createTransformer().then();

        /**
         * Retrieves buses data from STAR Open Data API.
         * {@link https://data.explore.star.fr/explore/dataset/tco-bus-vehicules-position-tr/information}
         */
        async function getBusData() {
            try {
                const apiEndpoint = process.env.REACT_APP_STAR_API_ENDPOINT || '';
                const apiToken = process.env.REACT_APP_STAR_API_KEY || '';
                const response = await fetch(apiEndpoint, {
                    mode: 'cors',
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': apiToken
                    }
                });
                const data = await response.json();
                let buses: Bus[] = [];

                data.records.forEach((bus: { fields: { numerobus: any; nomcourtligne: any; }; geometry: any; }) => {
                    const busInfo: Bus = {
                        busId: bus.fields.numerobus,
                        latitude: bus.geometry.coordinates[1], longitude: bus.geometry.coordinates[0],
                        busRoute: bus.fields.nomcourtligne
                    };
                    buses.push(busInfo);
                })
                setBuses(buses);
            } catch (error) {
                console.log(error);
            }
        }

        getBusData().then();

        return () => clearInterval(interval);

    }, [transformerReady]);

    return (
        <div>
            {amplifyMaplibre.current && transformerReady ? (
                <>
                    <Map
                        {...viewState}
                        style={{width: "100%", height: "100vh"}}
                        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                        transformRequest={amplifyMaplibre.current.transformRequest}
                        mapStyle={Geo.getDefaultMap().mapName}
                        onMove={(e) => setViewState(e.viewState)}
                    >
                        <GeolocateControl position="top-left"/>
                        <FullscreenControl position="top-left"/>
                        <NavigationControl position="top-left"/>
                        <ScaleControl/>

                        {
                            buses.map(bus => {
                                return (<Marker
                                    key={bus.busId}
                                    longitude={bus.longitude}
                                    latitude={bus.latitude}>
                                    <img src="https://static.thenounproject.com/png/886617-200.png" alt="Bus icon"/>
                                </Marker>)
                            })
                        }

                        {
                            buses.map(bus => {
                                return (<Popup
                                    key={bus.busId}
                                    longitude={bus.longitude}
                                    latitude={bus.latitude}
                                    closeButton
                                    closeOnClick
                                    offset={[0, -25]}
                                    anchor="bottom">
                                    {bus.busRoute}
                                </Popup>)
                            })
                        }

                    </Map>
                    <ControlPanel/>
                </>
            ) : (
                <h1>Loading...</h1>
            )}
        </div>
    );
};

ReactDOM.render(
    <StrictMode>
        <App/>
    </StrictMode>,
    document.getElementById("root")
);