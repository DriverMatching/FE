import React, { useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./resultStyles.css"; // CSS 파일 추가

const GOOGLE_MAPS_API_KEY = "AIzaSyAUNrCgGKTQuvgmUPMcCmZEjT18IMwEpBw";
const MAP_ID = "2d23b5a53eb8b295"; // Google Cloud에서 생성한 mapId 입력

function MatchingResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const matchedDriver = location.state?.matchedDriver;

    // Google Maps API 스크립트 로드 함수
    const loadGoogleMapsScript = () => {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.maps) {
                resolve();
                return;
            }

            if (document.querySelector(`script[src*="maps.googleapis.com"]`)) {
                document.querySelector(`script[src*="maps.googleapis.com"]`).onload = resolve;
                return;
            }

            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=marker&map_ids=${MAP_ID}`;
            script.async = true;
            script.defer = true;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    };

    // 지도 초기화 함수
    const initMap = useCallback(() => {
        if (!matchedDriver || !window.google || !window.google.maps) return;

        const { origin_latitude, origin_longitude, driver_latitude, driver_longitude, destination_latitude, destination_longitude } = matchedDriver;

        const map = new window.google.maps.Map(document.getElementById("map"), {
            zoom: 11.5,
            center: { lat: origin_latitude, lng: origin_longitude },
            mapId: MAP_ID, // mapId 추가
        });

        // 마커 스타일 조정 (크기 줄이기)
        const addMarker = (position, label, color) => {
            const markerElement = document.createElement("div");
            markerElement.className = "custom-marker";
            markerElement.style.backgroundColor = color;
            markerElement.style.padding = "5px 10px";
            markerElement.style.fontSize = "12px";
            markerElement.innerText = label;

            return new window.google.maps.marker.AdvancedMarkerElement({
                position,
                map,
                content: markerElement,
            });
        };

        // 마커 추가
        addMarker({ lat: origin_latitude, lng: origin_longitude }, "출발", "#007bff");
        addMarker({ lat: driver_latitude, lng: driver_longitude }, "기사🚖", "#dc3545");
        addMarker({ lat: destination_latitude, lng: destination_longitude }, "도착", "#28a745");

        // 경로 표시
        const routePath = new window.google.maps.Polyline({
            path: [
                { lat: origin_latitude, lng: origin_longitude },
                { lat: driver_latitude, lng: driver_longitude },
                { lat: destination_latitude, lng: destination_longitude },
            ],
            geodesic: true,
            strokeColor: "#FF5733",
            strokeOpacity: 1.0,
            strokeWeight: 3,
        });

        routePath.setMap(map);
    }, [matchedDriver]);

    // Google Maps API 로드 및 지도 초기화
    useEffect(() => {
        if (matchedDriver) {
            window.initMap = initMap; // 전역 함수 등록
            loadGoogleMapsScript()
                .then(initMap)
                .catch((err) => console.error("Google Maps API 로드 실패:", err));
        }
    }, [matchedDriver, initMap]);

    return (
        <div className="matching-container">
            <h2>매칭된 기사</h2>
            {matchedDriver ? (
                <div className="matching-content">
                    <table className="driver-table">
                        <thead>
                            <tr>
                                <th>기사 ID</th>
                                <th>출발지-기사 거리 (km)</th>
                                <th>경력 (년)</th>
                                <th>친절도 (5점 만점)</th>
                                <th>별점 (5점 만점)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{matchedDriver.driver_id}</td>
                                <td>{parseFloat(matchedDriver.distance_to_origin).toFixed(2)} km</td>
                                <td>{matchedDriver.years_of_experience}년</td>
                                <td>{matchedDriver.kindness}점</td>
                                <td>{matchedDriver.score}점</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* 지도 */}
                    <div id="map" className="map-container"></div>
                </div>
            ) : (
                <p>매칭된 기사가 없습니다.</p>
            )}

            {/* 버튼 */}
            <div className="button-container">
                <button onClick={() => navigate("/")}>취소</button>
                <button onClick={() => alert("기사 확정!")}>확정</button>
            </div>
        </div>
    );
}

export default MatchingResult;
