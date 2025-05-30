"use client"
import React from 'react';
import {
    AdvancedMarker,
    APIProvider,
    InfoWindow,
    Map,
    Marker,
    Pin
} from '@vis.gl/react-google-maps';
　

import MovingMarker from "@/components/gps/moving-marker/MovingMarker";
import MarkerWithInfowindow from "@/components/gps/marker-with-infowindow/MarkerWithInfowindow";
import useGetCurrentAddress from "@/hooks/useGetCurrentAddress";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";

const MapContent = () => {
    const {location} = useGetCurrentAddress()
    console.log(location.lng, location.lat)
    const {dimensions} = useResponsiveScreen()

    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
            {location ?
                <>
                    <Map
                        defaultZoom={15}
                        mapId={"307c4270c2518d3c"}
                        style={{width: `${dimensions.width}px`, height:`${dimensions.height}px`}}
                         defaultCenter={{lat: location.lat!, lng: location.lng!}}>
                        {/* simple marker */}
                        <Marker
                            position={{lat: 10, lng: 10}}
                            clickable={true}
                            onClick={() => alert('marker was clicked!')}
                            title={'clickable google.maps.Marker'}
                        />


                        {/* advanced marker with customized pin */}
                        <AdvancedMarker
                            position={{lat: location.lat!, lng: location.lng!}}
                            title={'AdvancedMarker with customized pin.'}>
                            <Pin
                                background={'#22ccff'}
                                borderColor={'#1e89a1'}
                                glyphColor={'#0f677a'}></Pin>
                        </AdvancedMarker>

                        {/* advanced marker with html pin glyph */}
                        <AdvancedMarker
                            position={{lat: 15, lng: 20}}
                            title={'AdvancedMarker with customized pin.'}>
                            <Pin background={'#22ccff'} borderColor={'#1e89a1'} scale={1.4}>
                                {/* children are rendered as 'glyph' of pin */}
                                👀
                            </Pin>
                        </AdvancedMarker>

                        {/* advanced marker with html-content */}
                        <AdvancedMarker
                            position={{lat: 30, lng: 10}}
                            title={'AdvancedMarker with custom html content.'}>
                            <div
                                style={{
                                    width: 16,
                                    height: 16,
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    background: '#1dbe80',
                                    border: '2px solid #0e6443',
                                    borderRadius: '50%',
                                    transform: 'translate(-50%, -50%)'
                                }}></div>
                        </AdvancedMarker>

                        {/* simple positioned infowindow */}
                        <InfoWindow position={{lat: 40, lng: 0}} maxWidth={200}>
                            <p>
                                This is the content for another infowindow with <em>HTML</em>
                                -elements.
                            </p>
                        </InfoWindow>

                        {/* continously updated marker */}
                        <MovingMarker/>

                        {/* simple stateful infowindow */}
                        <MarkerWithInfowindow/>
                    </Map>

                </> : ""
            }
        </APIProvider>
    )
};

export default MapContent;
