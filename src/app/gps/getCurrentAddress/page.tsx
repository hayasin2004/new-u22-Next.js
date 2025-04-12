"use client"
import React  from 'react';
import useGetCurrentAddress from "@/hooks/useGetCurrentAddress";

const GetCurrentAddress = () => {
        const {location} = useGetCurrentAddress()

        return (
            <div>
                <h1>現在地確認用ページ</h1>
                <p>緯度: {location.lat}</p>
                <p>経度: {location.lng}</p>
            </div>
        )

}


export default GetCurrentAddress;