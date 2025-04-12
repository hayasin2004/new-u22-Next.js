"use server"
import webpush, {PushSubscription} from 'web-push'

webpush.setVapidDetails(
    `mailto:${process.env.testEmail}`,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
)

let subscription: PushSubscription | null = null

export const subscribeUser = async (sub: PushSubscription) => {
    subscription = sub
    return {success: true}
}

export const unsubscribeUser = async () => {
    subscription = null
    return {success: true}
}


export const sendNotification = async (message: string) => {
    if (!subscription) {
        throw new Error("登録が完了していないです。")
    }
    try {

        await webpush.sendNotification(
            subscription,
            JSON.stringify({
                title: "テスト通知",
                body: message,
                icon: "/images/PWA-Icon.png"
            }),
        )

    } catch (err) {
        console.error(err)
        return {success: false, error: "通知の送信に失敗しました。"}
    }

}
