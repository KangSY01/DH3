
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import WavesOfMemory from './pages/WavesOfMemory';
import MarketGame from './pages/MarketGame';
import VoiceOfBusan from './pages/VoiceOfBusan';
import FutureHarbor from './pages/FutureHarbor';

const Navigation = () => {
  const location = useLocation();
  const menuItems = [
    { path: '/', label: '홈', icon: '🏠' },
    { path: '/waves', label: '파도의 기억', icon: '🌊' },
    { path: '/market', label: '웅성웅성 시장통', icon: '🍜' },
    { path: '/voice', label: '부산의 목소리', icon: '👴' },
    { path: '/harbor', label: '미래의 항구', icon: '⚓' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 px-4 py-3 flex justify-around items-center z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0">
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center p-2 rounded-xl transition-all ${
            location.pathname === item.path ? 'bg-sky-100 text-sky-600 scale-105' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <span className="text-2xl mb-1">{item.icon}</span>
          <span className="text-xs font-jua">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

const HomePage = () => {
  return (
    <div className="min-h-screen wave-bg flex flex-col items-center justify-center p-6 pt-[118px] pb-40 md:pt-[182px] md:pb-24">
      <div className="text-center mb-[90px] animate-bounce">
        <h1 className="text-4xl md:text-6xl text-sky-800 mb-4 tracking-tighter">부산역사 보물상자</h1>
        <p className="text-sky-600 font-medium">영도 할배와 함께하는 신나는 역사 여행!</p>
      </div>

      <div className="grid grid-cols-2 gap-6 w-full max-w-2xl mb-20">
        <Link to="/waves" className="pastel-blue p-8 rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center">
          <span className="text-5xl mb-4">🌊</span>
          <h2 className="text-xl font-jua">파도의 기억</h2>
          <p className="text-sm text-slate-500 text-center mt-2">시간을 따라 걷는 부산 연표</p>
        </Link>
        <Link to="/market" className="pastel-yellow p-8 rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center">
          <span className="text-5xl mb-4">🍜</span>
          <h2 className="text-xl font-jua">웅성웅성 시장통</h2>
          <p className="text-sm text-slate-500 text-center mt-2">피란 시절 밀면 만들기</p>
        </Link>
        <Link to="/voice" className="pastel-pink p-8 rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center">
          <span className="text-5xl mb-4">👴</span>
          <h2 className="text-xl font-jua">부산의 목소리</h2>
          <p className="text-sm text-slate-500 text-center mt-2">영도 할배의 AI 도슨트</p>
        </Link>
        <Link to="/harbor" className="pastel-green p-8 rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center">
          <span className="text-5xl mb-4">⚓</span>
          <h2 className="text-xl font-jua">미래의 항구</h2>
          <p className="text-sm text-slate-500 text-center mt-2">함께 그리는 내일의 부산</p>
        </Link>
      </div>

      <div className="mt-8 text-center text-slate-500 max-w-md bg-white/30 p-6 rounded-2xl backdrop-blur-sm">
        <p className="text-sm">"부산의 역사는 당신의 오늘과 연결되어 있습니다."</p>
        <p className="text-xs mt-2 italic font-semibold">- 디지털 인문학 큐레이터 -</p>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/waves" element={<WavesOfMemory />} />
            <Route path="/market" element={<MarketGame />} />
            <Route path="/voice" element={<VoiceOfBusan />} />
            <Route path="/harbor" element={<FutureHarbor />} />
          </Routes>
        </div>
        <Navigation />
      </div>
    </HashRouter>
  );
};

export default App;
