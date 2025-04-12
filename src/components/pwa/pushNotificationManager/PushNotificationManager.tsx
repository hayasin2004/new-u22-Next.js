import React, {useEffect, useState} from 'react';
import {sendNotification, subscribeUser, unsubscribeUser} from "@/acitons/pwa/pwaAcitons";
import urlBase64ToUint8Array from "../../../../utils/urlBase64ToUint8Array";

const PushNotificationManager = () => {

    const [isSupported, setIsSupported] = useState(false)
    const [subscription, setSubscription] = useState<PushSubscription | null>(null)
    const [message, setMessage] = useState('')

    // serviceWorker →　PWAにオフライン機能やバックグラウンド処理を提供する重要な技術
    // 対応するブラウザではnavigator.serviceWorkerが存在する

    // PushManager →　browserがPushAPIをサポートしているかどうかのチェックをする
    // PushAPIを利用することでバックグラウンドでプッシュ通知を受け取ることができる。
    // 対応しているブラウザではwindow.PushManagerが存在する

    useEffect(() => {
        if ("serviceWorker" in navigator && "PushManager" in window) {
            setIsSupported(true)
            registerServiceWorker()
        }
    }, [])

    // このコードはサービスワーカを登録し、プッシュ通知のサブスクリプション情報を取得する用の非同期関数
    const registerServiceWorker = async () => {
        const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            updateViaCache: "none",
        })
        // この部分でプッシュ通知のサブスクリプションを取得する部分
        // 返される値は通知を受け取るために必要な情報（エンドポイント、APIキーなどがある）
        const sub = await registration.pushManager.getSubscription()
        setSubscription(sub)
    }

    const subscribeToPush = async () => {
        const registration = await navigator.serviceWorker.ready
        const sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
                process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
            )
        })
        setSubscription(sub)
        const serializeSub = JSON.parse(JSON.stringify(sub))
        await  subscribeUser(serializeSub)
    }

    const unSubscribeFromPush = async () => {
        await subscription?.unsubscribe()
        setSubscription(null)
        await unsubscribeUser()
    }

    const sendTestNotification = async () => {
        if (subscription) {
            await sendNotification(message)
            setMessage("")
        }
    }

    // 通知を受け取れない　かつ　バックグランド処理ができないときのエラーハンドリング
    if (!isSupported) {
        return <p>お使いの端末では通知を受け取ることができません。</p>
    }


    return (
        <div>
            <h3>プッシュ通知テスト</h3>
            {subscription ? (
                <>
                    <p>あなたはプッシュ通知を許可しますか？</p>
                    <button onClick={unSubscribeFromPush}>解約</button>
                    <input type="text" value={message} onChange={(e) => setMessage(e.target.value)}
                           placeholder={"通知メッセージを入力してください"}/>
                    <button onClick={sendTestNotification}>テスト通知を送信する</button>
                </>
            ) : (
                <>
                    <p>通知を許可していない。</p>
                    <button onClick={subscribeToPush}>通知を許可する</button>
                </>
            )}
        </div>
    );
}


export default PushNotificationManager;