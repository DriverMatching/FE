import React, { useEffect, useCallback } from "react";
import "./resultStyles.css"; 
import axios from "axios"; // 백엔드 API 요청을 위한 axios 추가
const backend_server = "http://52.79.188.179:8000/match-driver"
const backend_test = "http://127.0.0.1:8000/match-driver"

const GOOGLE_MAPS_API_KEY = "AIzaSyAUNrCgGKTQuvgmUPMcCmZEjT18IMwEpBw";
const MAP_ID = "2d23b5a53eb8b295"; // Google Cloud에서 생성한 mapId 입력

function MatchingResult({ matchedDriver, customerRequest, onClose }) {
    // 데이터베이스에 저장 함수 (확정 버튼 클릭 시 실행)
    const handleConfirm = async () => {
        if (!customerRequest || !matchedDriver) {
            alert("누락된 정보가 있습니다.");
            return;
        }
        
        const requestData = {
            customer: { ...customerRequest },
            driver: { ...matchedDriver }
        };
    
        console.log("백엔드로 전송하는 데이터:", requestData);  // 확인용 로그 추가

        try {
            const response = await fetch(backend_server, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customer: {
                        ...customerRequest, // 프론트엔드에서 전달받은 고객 요청 정보
                        origin_latitude: matchedDriver.origin_latitude,
                        origin_longitude: matchedDriver.origin_longitude,
                        destination_latitude: matchedDriver.destination_latitude,
                        destination_longitude: matchedDriver.destination_longitude
                    },
                    driver: matchedDriver
                }),
            });

            const data = await response.json();
            alert(data.message);
        } catch (error) {
            console.error("매칭 저장 실패:", error);
            alert("매칭 저장 중 오류 발생");
        }
    };

    // React Hook 호출 순서 오류 해결 (useCallback을 항상 실행되게 변경)
    const initMap = useCallback(() => {
        if (!matchedDriver || !window.google || !window.google.maps) return;

        const { origin_latitude, origin_longitude, driver_latitude, driver_longitude, destination_latitude, destination_longitude } = matchedDriver;

        const map = new window.google.maps.Map(document.getElementById("map"), {
            zoom: 11.5,
            center: { lat: origin_latitude, lng: origin_longitude },
            mapId: MAP_ID,
        });

        // 커스텀 마커 아이콘 (출발: 빨간색, 기사: 초록색, 도착: 파란색)
        const icons = {
            origin: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            driver: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
            destination: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        };

        // 마커 추가
        new window.google.maps.Marker({
            position: { lat: origin_latitude, lng: origin_longitude },
            map,
            title: "출발지",
            icon: icons.origin,
        });

        new window.google.maps.Marker({
            position: { lat: driver_latitude, lng: driver_longitude },
            map,
            title: "기사",
            icon: icons.driver,
        });

        new window.google.maps.Marker({
            position: { lat: destination_latitude, lng: destination_longitude },
            map,
            title: "도착지",
            icon: icons.destination,
        });

        // 경로 표시
        new window.google.maps.Polyline({
            path: [
                { lat: origin_latitude, lng: origin_longitude },
                { lat: driver_latitude, lng: driver_longitude },
                { lat: destination_latitude, lng: destination_longitude },
            ],
            geodesic: true,
            strokeColor: "#FF5733",
            strokeOpacity: 1.0,
            strokeWeight: 3,
            map,
        });
    }, [matchedDriver]);

    // Google Maps API 스크립트 로드 함수
    const loadGoogleMapsScript = () => {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.maps) {
                resolve(); // 이미 로드된 경우 즉시 resolve()
                return;
            }

            const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
            if (existingScript) {
                existingScript.onload = resolve;
                return;
            }

            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&map_ids=${MAP_ID}`;
            script.async = true;
            script.defer = true;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    };

    // Google Maps API 로드 및 지도 초기화
    useEffect(() => {
        if (!matchedDriver) return;

        loadGoogleMapsScript()
            .then(initMap)
            .catch((err) => console.error("Google Maps API 로드 실패:", err));
    }, [matchedDriver, initMap]);

    // 조건부 렌더링을 Hook 실행 이후로 이동 (React Hook 규칙 위반 방지)
    if (!matchedDriver) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>매칭된 기사</h2>
                <div className="modal-content">
                    <table className="driver-table">
                        <thead>
                            <tr>
                                <th>기사 ID</th>
                                <td>{matchedDriver.driver_id}</td>
                            </tr>
                            <tr>
                                <th>출발지-기사 거리 (km)</th>
                                <td>{parseFloat(matchedDriver.distance_to_origin).toFixed(2)} km</td>
                            </tr>
                            <tr>
                                <th>경력 (년)</th>
                                <td>{matchedDriver.years_of_experience}년</td>
                            </tr>
                            <tr>
                                <th>친절도 (5점 만점)</th>
                                <td>{matchedDriver.kindness}점</td>
                            </tr>
                            <tr>
                                <th>별점 (5점 만점)</th>
                                <td>{parseInt(matchedDriver.score)}점</td>
                            </tr>
                        </thead>
                    </table>

                    {/* 지도 */}
                    <div id="map" className="map-container"></div>
                </div>

                {/* 버튼 */}
                <div className="button-container">
                    <button onClick={onClose}>닫기</button>
                    <button onClick={handleConfirm}>확정</button>
                </div>
            </div>
        </div>
    );
}

export default MatchingResult;
