import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 라우터 추가
import "./styles.css";

function MatchingForm() {
    const navigate = useNavigate(); // 페이지 이동 함수

    // 출발지 & 도착지 상태 관리
    const [startName, setStartName] = useState(""); 
    const [startPhone, setStartPhone] = useState(""); 
    const [startAddress, setStartAddress] = useState("");
    const [startDetailAddress, setStartDetailAddress] = useState("");

    const [endName, setEndName] = useState("");
    const [endPhone, setEndPhone] = useState("");
    const [endAddress, setEndAddress] = useState("");
    const [endDetailAddress, setEndDetailAddress] = useState("");

    const [itemTypeNm, setItemTypeNm] = useState(""); // 물품 종류
    const [isRefrigerated, setIsRefrigerated] = useState(0); // 냉장/냉동 여부 (0: X, 1: O)
    const [isFragile, setIsFragile] = useState(0); // 파손물 여부 (0: X, 1: O)
    const [weight, setWeight] = useState(""); // 물건 무게
    const [quantity, setQuantity] = useState(""); // 물건 수량

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

    // 숫자 입력 필드 제한 (연락처, 무게, 수량)
    const handleNumberInput = (e, setState) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setState(value);
        }
    };

    // FastAPI로 데이터 전송 (퀵 접수)
    const handleSubmit = async () => {
        const requestData = {
            start_name: startName,
            start_phone: startPhone,
            start_address: startAddress,
            start_detail: startDetailAddress,
            end_name: endName,
            end_phone: endPhone,
            end_address: endAddress,
            end_detail: endDetailAddress,
            item_type_nm: itemTypeNm,
            is_refrigerated: isRefrigerated ? 1 : 0,
            is_fragile: isFragile ? 1 : 0,
            weight: weight,
            quantity: quantity
        };

        try {
            const response = await axios.post("http://127.0.0.1:8000/match-driver", requestData);
            const matchedDriver = response.data;

            alert(`기사 매칭 완료! 기사 ID: ${matchedDriver.driver_id}`);
        
            // 기사 매칭 결과 페이지로 이동
            navigate(`/matching-process/${matchedDriver.driver_id}`);
        } catch (error) {
            console.error("매칭 실패:", error);
        }
    };

    return (
        <div className="matching-form">
            <h2>퀵 접수</h2>

            <div className="form-row">
                <div className="form-section">
                    <label>출발지</label>
                    <div className="inline-inputs">
                        <input type="text" placeholder="이름" className="input-box small" value={startName} onChange={(e) => setStartName(e.target.value)} />
                        <input type="text" placeholder="연락처" className="input-box small" value={startPhone} onChange={(e) => handleNumberInput(e, setStartPhone)} />
                    </div>
                    <input type="text" value={startAddress} placeholder="출발지 주소" readOnly className="input-box" onClick={() => searchAddress(setStartAddress)} />
                    <input type="text" value={startDetailAddress} onChange={(e) => setStartDetailAddress(e.target.value)} placeholder="상세주소 (예: 층, 동/호수)" className="input-box" />
                </div>

                <div className="form-section">
                    <label>도착지</label>
                    <div className="inline-inputs">
                        <input type="text" placeholder="이름" className="input-box small" value={endName} onChange={(e) => setEndName(e.target.value)} />
                        <input type="text" placeholder="연락처" className="input-box small" value={endPhone} onChange={(e) => handleNumberInput(e, setEndPhone)} />
                    </div>
                    <input type="text" value={endAddress} placeholder="도착지 주소" readOnly className="input-box" onClick={() => searchAddress(setEndAddress)} />
                    <input type="text" value={endDetailAddress} onChange={(e) => setEndDetailAddress(e.target.value)} placeholder="상세주소 (예: 층, 동/호수)" className="input-box" />
                </div>
            </div>

            <div className="form-row">
                <div className="form-section">
                    <label>물품 종류</label>
                    <select value={itemTypeNm} onChange={(e) => setItemTypeNm(e.target.value)} className="input-box">
                        <option value="">-- 물품 종류 선택 --</option>
                        <option value="1">농/수/축산물 (냉동/냉장)</option>
                        <option value="2">농/수/축산물 (일반)</option>
                        <option value="3">미용/화장품</option>
                        <option value="4">생활용품</option>
                        <option value="5">서적</option>
                        <option value="6">의료/건강식품</option>
                        <option value="7">패션/패션잡화</option>
                        <option value="8">전자제품</option>
                        <option value="0">기타</option>
                    </select>
                </div>

                <div className="form-section">
                    <label>물건 정보</label>
                    <div className="inline-inputs">
                        <input type="text" value={weight} onChange={(e) => handleNumberInput(e, setWeight)} placeholder="무게 (kg)" className="input-box small" /> kg
                        <input type="text" value={quantity} onChange={(e) => handleNumberInput(e, setQuantity)} placeholder="수량" className="input-box small" /> 개
                    </div>
                </div>

                <div className="form-section">
                    <label>냉장/냉동 여부</label>
                    <div>
                        <label><input type="checkbox" value="1" checked={isRefrigerated === 1} onChange={() => setIsRefrigerated(isRefrigerated === 1 ? 0 : 1)} /> 예</label>
                    </div>
                </div>

                <div className="form-section">
                    <label>파손물 여부</label>
                    <div>
                        <label><input type="checkbox" value="1" checked={isFragile === 1} onChange={() => setIsFragile(isFragile === 1 ? 0 : 1)} /> 예</label>
                    </div>
                </div>
            </div>

            <button className="submit-btn" onClick={handleSubmit}>퀵 접수하기</button>
        </div>
    );
}

export default MatchingForm;
