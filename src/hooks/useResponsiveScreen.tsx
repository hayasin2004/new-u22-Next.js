import React, {useEffect, useState} from 'react';

const useResponsiveScreen = () => {

    const [dimensions, setDimensions] = useState({width: 0, height: 0});

    useEffect(() => {
        // ここで端末ごとの幅高さを状態管理している
        const handleResize = () => {
            setDimensions({width: window.innerWidth, height: window.innerHeight});
        }
        handleResize()

        //     ここで端末のウィンドウサイズ変更を監視
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);

    }, []);


    return {dimensions}
};

export default useResponsiveScreen;