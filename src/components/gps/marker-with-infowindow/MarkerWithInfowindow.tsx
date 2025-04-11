import React, {useState} from 'react';
import {AdvancedMarker, InfoWindow, useAdvancedMarkerRef} from "@vis.gl/react-google-maps";

const MarkerWithInfowindow = () => {

    const [infowindowOpen, setInfowindowOpen] = useState(true);
    const [markerRef, marker] = useAdvancedMarkerRef();

    return (
        <>
            <AdvancedMarker
                ref={markerRef}
                position={{lat: 35.092830194194086, lng:136.87946177662857}}
            />
            {infowindowOpen && (
                <InfoWindow
                    anchor={marker}
                    maxWidth={200}
                    onCloseClick={() => setInfowindowOpen(false)}>
                    ここは名古屋港水族館から一番近い警察署
                </InfoWindow>
            )}
        </>
    );
}


export default MarkerWithInfowindow;