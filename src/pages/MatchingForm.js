import React, { useState } from "react";
import axios from "axios";
import "./styles.css";

function MatchingForm() {
    // 출발지 & 도착지 상태 관리
    const [startAddress, setStartAddress] = useState("");
    const [startDetailAddress, setStartDetailAddress] = useState("");

    const [endAddress, setEndAddress] = useState("");
    const [endDetailAddress, setEndDetailAddress] = useState("");

    // Daum 주소 검색 함수
    const searchAddress = (setAddress) => {
        if (!window.daum || !window.daum.Postcode) {
            alert("Daum 주소 API가 로드되지 않았습니다. 새로고침해 주세요.");
            return;
        }

        new window.daum.Postcode({
            oncomplete: (data) => {
                let fullAddress = data.address;
                setAddress(fullAddress);
            },
        }).open();
    };

    // FastAPI로 데이터 전송 (출발지 & 도착지 주소)
    const handleSubmit = async () => {
        const requestData = {
            start_address: startAddress,
            start_detail: startDetailAddress,
            end_address: endAddress,
            end_detail: endDetailAddress
        };

        try {
            const response = await axios.post("http://localhost:8000/save-order", requestData);
            alert(response.data.message);
        } catch (error) {
            console.error("데이터 저장 오류:", error);
        }
    };

    return (
        <div className="matching-form">
            <div className="form-section">
                <label>출발지</label>
                <div className="inline-inputs">
                    <input type="text" placeholder="이름" className="input-box small" />
                    <input type="text" placeholder="연락처" className="input-box small" />
                </div>
                <input type="text" value={startAddress} placeholder="출발지 주소" readOnly className="input-box"
                    onClick={() => searchAddress(setStartAddress)}
                />
                <input type="text" value={startDetailAddress} onChange={(e) => setStartDetailAddress(e.target.value)}
                    placeholder="상세주소 (예: 층, 동/호수)" className="input-box"
                />
            </div>

            <div className="form-section">
                <label>도착지</label>
                <div className="inline-inputs">
                    <input type="text" placeholder="이름" className="input-box small" />
                    <input type="text" placeholder="연락처" className="input-box small" />
                </div>
                <input type="text" value={endAddress} placeholder="도착지 주소" readOnly className="input-box"
                    onClick={() => searchAddress(setEndAddress)}
                />
                <input type="text" value={endDetailAddress} onChange={(e) => setEndDetailAddress(e.target.value)}
                    placeholder="상세주소 (예: 층, 동/호수)" className="input-box"
                />
            </div>

            <input type="button" value="퀵 접수하기" className="submit-btn" onClick={handleSubmit} />
        </div>
    );
}

export default MatchingForm;
