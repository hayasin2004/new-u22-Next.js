"use client"
import React, {useEffect, useState} from 'react';

const GetCurrentAddress = () => {

        const [location, setLocation] = useState({ lat: null, lng: null });

        useEffect(() => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLocation({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        });
                    },
                    (error) => {
                        console.error("Error getting location:", error);
                    }
                );
            } else {
                console.error("Geolocation is not supported by this browser.");
            }
        }, []);

        return (
            <div>
                <h1>現在地</h1>
                <p>緯度: {location.lat}</p>
                <p>経度: {location.lng}</p>
            </div>
        )


}


export default GetCurrentAddress;