"use client";

import React, {useState, useEffect} from "react";
import Japan from "@react-map/japan";
import styles from "./style.module.css";
import { prefMap } from "./prefMap";

interface SelectedPref {
    code: string;
    name: string;
}

export default function JapanMap() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPref, setSelectedPref] = useState<SelectedPref | null>(null);

    const onSelect = (state: string | null) => {
        // デバッグログを追加
        console.log("onSelect called with:", state);
        console.log("prefMap:", prefMap);

        if (state) {
            const prefName = prefMap[state];
            console.log("Found prefName:", prefName);

            if (prefName) {
                console.log("Setting selectedPref and opening modal");
                setSelectedPref({ code: state, name: prefName });
                setModalOpen(true);
            } else {
                console.log("Prefecture not found in prefMap");
                alert(`不明な都道府県コード: ${state}`);
            }
        } else {
            console.log("state is null or undefined");
        }
    };

    const closeModal = () => {
        console.log("Closing modal");
        setModalOpen(false);
        setSelectedPref(null);
    };

    // デバッグ用: 状態を監視
    useEffect(() => {
        console.log("modalOpen:", modalOpen);
        console.log("selectedPref:", selectedPref);
    }, [modalOpen, selectedPref]);

    // ESCキーでモーダルを閉じる
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && modalOpen) {
                closeModal();
            }
        };

        if (modalOpen) {
            document.addEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'unset';
        };
    }, [modalOpen]);

    // デバッグ用: 強制的にモーダルを開くボタンを追加
    const openTestModal = () => {
        console.log("Opening test modal");
        setSelectedPref({ code: "13", name: "東京都" });
        setModalOpen(true);
    };

    return (
        <div>
            {/* デバッグ用ボタン */}
            <button onClick={openTestModal} style={{ marginBottom: '10px' }}>
                テスト用モーダルを開く
            </button>

            <div className={styles.mapWrapper}>
                <Japan type="select-single" onSelect={onSelect}/>
            </div>

            {/* モーダル */}
            {modalOpen && selectedPref && (
                <div
                    className={styles.modalOverlay}
                    onClick={closeModal}
                    style={{
                        // デバッグ用: 基本的なスタイルを直接指定
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}
                >
                    <div
                        className={styles.modalContent}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            // デバッグ用: 基本的なスタイルを直接指定
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '8px',
                            maxWidth: '500px',
                            width: '90%'
                        }}
                    >
                        <div className={styles.modalHeader}>
                            <h2>{selectedPref.name}</h2>
                            <button
                                className={styles.closeButton}
                                onClick={closeModal}
                                aria-label="閉じる"
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '10px',
                                    border: 'none',
                                    background: 'none',
                                    fontSize: '20px',
                                    cursor: 'pointer'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <p><strong>都道府県コード:</strong> {selectedPref.code}</p>
                            <p><strong>都道府県名:</strong> {selectedPref.name}</p>
                            <div className={styles.detailSection}>
                                <h3>詳細情報</h3>
                                <p>ここに{selectedPref.name}の詳細情報を表示できます。</p>
                                <div className={styles.emojiSection}>
                                    🤗🤗🤗🤗🤗🤗🥶🥶👹🐽🐽🐷🐷🐷🐷
                                </div>
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button
                                className={styles.primaryButton}
                                onClick={closeModal}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                閉じる
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}