import React from "react";
import { Link } from "react-router-dom"; // 페이지 이동을 위한 Link 사용
import "./Header.css";

const logo = process.env.PUBLIC_URL + "/logo.png" // public 폴더의 로고 불러옴

function Header() {
    return (
    <header className="header">
        <div className="logo">
            <img src={logo} alt="Driver Matching Logo" className="logo-img" />
            <span className="logo-text">Quick DM</span>
        </div>
        <nav>
            <ul className="nav-menu">
                <li><Link to="/">홈</Link></li>
                <li><Link to="/matchingForm">퀵 접수하기</Link></li>
                <li><Link to="/usageHistory">이용내역</Link></li>
            </ul>
        </nav>
        <div className="header-right">
            <button className="qna-btn">문의하기</button>
            <button className="login-btn">로그인</button>
        </div>
    </header>
    );
}

export default Header;
