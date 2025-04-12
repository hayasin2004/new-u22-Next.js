"use client"
import React, {useEffect, useState} from 'react';
import {kyotoTourist} from "@/dummyData/kyotoTourist";
import {AdvancedMarker, APIProvider, InfoWindow, Map, useAdvancedMarkerRef} from "@vis.gl/react-google-maps";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";


const KyotoTouristSpot = () => {
    // ダミーデータにピンを指す用のやつ
    const [markerRef] = useAdvancedMarkerRef();

    // 端末に合わせて位置情報を合わせる物　→　カスタムフックであとから用意したい。　作成済
    const {dimensions} = useResponsiveScreen()

    const [selectedSpot, setSelectedSpot]
        = useState<{ lat: number , lng: number ,description: string} | null>(null)
    console.log(JSON.stringify(selectedSpot))
    const kyotoTouristData = kyotoTourist

    // dimensions →　寸法って意味
    if (dimensions.width == 0 || dimensions.height == 0) {
        return null;
    }


    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
            <Map defaultZoom={14}
                 defaultCenter={{lat: 34.9946, lng: 135.7850}}
                 mapId={"307c4270c2518d3c"} style={{width: `${dimensions.width}px` , height:`${dimensions.height}px`}}>
                {kyotoTouristData.map((spot, index) => (
                    <AdvancedMarker
                        ref={markerRef}
                        key={index}
                        position={{lat: spot.lat, lng: spot.lng}}
                        title={spot.name}
                        clickable={true}
                        onClick={() => setSelectedSpot({lat: spot.lat, lng: spot.lng ,description : spot.description})}
                    />
                ))}
                {selectedSpot && selectedSpot.lat && selectedSpot.lng && (
                    <InfoWindow
                        position={{lat: selectedSpot.lat, lng: selectedSpot.lng}}
                        maxWidth={200}
                        onCloseClick={() => setSelectedSpot(null)}>
                        {selectedSpot.description}
                    </InfoWindow>
                )}
            </Map>

        </APIProvider>
    );
}


export default KyotoTouristSpot;