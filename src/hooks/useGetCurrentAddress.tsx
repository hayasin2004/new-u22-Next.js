import  {useEffect, useState} from 'react';
import {currentAddress} from "@/types/Address";

const UseGetCurrentAddress = () => {
    const [location, setLocation] = useState<currentAddress>({ lat: null , lng: null });

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
    return {location};
};

export default UseGetCurrentAddress;