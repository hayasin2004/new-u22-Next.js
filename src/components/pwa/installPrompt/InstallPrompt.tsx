import React, {useEffect, useState} from 'react';
declare global {
    interface Window {
        MSStream?: unknown; // `unknown` 型や適切な型を指定
    }
}
const InstallPrompt :React.FC = () => {
    const [isIOS, setIsIOS] = useState(false)
    const [isStandalone, setIsStandalone] = useState(false)

    useEffect(() => {
        // IOSかどうかの判断
        setIsIOS(
            /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
        )
        // ホーム画面にインストールされたかの状態の管理
        setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)

    }, [])

    if (isStandalone) {
        return null
    }

    return (
        <div>
            <h3>JTKのインストール</h3>
            <button>ホーム場面についかする</button>
            {isIOS && (
                <p>
                    アプリをインストールする際には⎋ボタンを押してください。
                    <span role="img" aria-label="share icon">{' '}⎋{' '}</span>
                    ホーム画面にアプリを追加してください！
                    <span role="img" aria-label="plus icon">{' '}➕{' '}</span>.
                </p>
            )}
        </div>
    );
};

export default InstallPrompt;