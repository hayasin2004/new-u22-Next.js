"use client"
import React from 'react';
import PushNotificationManager from "@/components/pwa/pushNotificationManager/PushNotificationManager";
import InstallPrompt from "@/components/pwa/installPrompt/InstallPrompt";


const Notification = () => {
    return (
        <div>
            <h2>通知のテスト画面</h2>
            <PushNotificationManager />
            <InstallPrompt />
        </div>
    );
};

export default Notification;