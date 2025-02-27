import React, { useState } from "react";
import axios from "axios";
import MatchingResult from "./MatchingResult"; // 모달로 띄울 컴포넌트
import "./styles.css";

function MatchingForm() {

    const [startName, setStartName] = useState(""); 
    const [startPhone, setStartPhone] = useState(""); 
    const [startAddress, setStartAddress] = useState("");
    const [startDetailAddress, setStartDetailAddress] = useState("");

    const [endName, setEndName] = useState("");
    const [endPhone, setEndPhone] = useState("");
    const [endAddress, setEndAddress] = useState("");
    const [endDetailAddress, setEndDetailAddress] = useState("");

    const [itemTypeNm, setItemTypeNm] = useState(""); 
    const [isRefrigerated, setIsRefrigerated] = useState(false);
    const [isFragile, setIsFragile] = useState(false);
    const [isHazardous, setIsHazardous] = useState(false);
    const [weight, setWeight] = useState(""); 
    const [quantity, setQuantity] = useState("");

    const searchAddress = (setAddress) => {
        if (!window.daum || !window.daum.Postcode) {
            alert("Daum 주소 API가 로드되지 않았습니다. 새로고침해 주세요.");
            return;
        }
        new window.daum.Postcode({
            oncomplete: (data) => {
                setAddress(data.address);
            },
        }).open();
    };
    
    const [matchedDriver, setMatchedDriver] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleNumberInput = (e, setState) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setState(value);
        }
    };
const backend_server = "http://52.79.188.179:8000/match-driver"
const backend_test = "http://127.0.0.1:8000/match-driver"

    const handleSubmit = async () => {
        try {
            const response = await axios.post(backend_server, {
                start_address: startAddress,
                end_address: endAddress,
                cold_storage: isRefrigerated ? 1 : 0,
                fragile_item: isFragile ? 1 : 0,
                hazardous_material: isHazardous ? 1 : 0,
                weight: parseFloat(weight) || 0,
                quantity: parseInt(quantity, 10) || 0
            });

            if (response.data.matchedDriver) {
                setMatchedDriver(response.data.matchedDriver);
                setShowModal(true);
            } else {
                alert("적합한 기사를 찾을 수 없습니다.");
            }
        } catch (error) {
            console.error("매칭 실패:", error);
            alert("매칭 요청 중 오류 발생!");
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
            </div>

            <div className="checkbox-group">
                <label><input type="checkbox" checked={isRefrigerated} onChange={() => setIsRefrigerated(!isRefrigerated)} /> 냉장/냉동 식품</label>
                <label><input type="checkbox" checked={isFragile} onChange={() => setIsFragile(!isFragile)} /> 파손물</label>
                <label><input type="checkbox" checked={isHazardous} onChange={() => setIsHazardous(!isHazardous)} /> 위험물</label>
            </div>

            <button className="submit-btn" onClick={handleSubmit}>퀵 접수하기</button>
        
            {showModal && (
                <MatchingResult 
                    matchedDriver={matchedDriver} 
                    customerRequest={{
                        start_address: startAddress,
                        start_detail: startDetailAddress,
                        end_address: endAddress,
                        end_detail: endDetailAddress,
                        item_type_nm: itemTypeNm,
                        cold_storage: isRefrigerated ? 1 : 0,
                        fragile_item: isFragile ? 1 : 0,
                        hazardous_material: isHazardous ? 1 : 0,
                        weight: parseFloat(weight) || 0,
                        quantity: parseInt(quantity, 10) || 0
                    }}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}

export default MatchingForm;