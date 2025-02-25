import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // ✅ 주문 ID 가져오기
import "./styles.css";

function MatchingProcess() {
    const { orderId } = useParams(); // ✅ URL에서 주문 ID 가져오기
    const [matchedDriver, setMatchedDriver] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMatchedDriver = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/get-matched-driver/${orderId}`);
                console.log("매칭된 기사 응답:", response.data);
                setMatchedDriver(response.data);
            } catch (err) {
                console.error("🚨 기사 정보 불러오기 실패:", err);
                setError("매칭된 기사 정보를 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchMatchedDriver();
    }, [orderId]);

    return (
        <div className="matching-process">
            <h2>기사 매칭 결과</h2>

            {loading ? (
                <p>매칭 중입니다... ⏳</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : matchedDriver ? (
                <div className="driver-info">
                    <h3>🛵 매칭된 기사 정보</h3>
                    <p><strong>기사 ID:</strong> {matchedDriver.driverID}</p>
                    <p><strong>평균 점수:</strong> {matchedDriver.mean_score}</p>
                    <p><strong>출발지와 거리:</strong> {matchedDriver.distance_to_origin.toFixed(2)} km</p>
                </div>
            ) : (
                <p>❌ 매칭된 기사가 없습니다.</p>
            )}
        </div>
    );
}

export default MatchingProcess;
