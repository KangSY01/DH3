
import React from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import WavesOfMemory from './pages/WavesOfMemory';
import TreasureHunt from './pages/MarketGame';
import VoiceOfBusan from './pages/VoiceOfBusan';
import FutureHarbor from './pages/FutureHarbor';

const Navigation = () => {
  const location = useLocation();
  const menuItems = [
    { path: '/', label: 'HOME', icon: '🏛️' },
    { path: '/waves', label: 'TIMELINE', icon: '⏳' },
    { path: '/market', label: 'EXPLORE', icon: '🔍' },
    { path: '/voice', label: 'ARCHIVE', icon: '🎙️' },
    { path: '/harbor', label: 'VISION', icon: '✨' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0a192f]/90 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex justify-around items-center z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0">
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center group transition-all ${
            location.pathname === item.path ? 'text-[#c5a059]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <span className="text-xl mb-1 group-hover:scale-110 transition-transform">{item.icon}</span>
          <span className="text-[10px] tracking-[0.2em] font-medium uppercase">{item.label}</span>
          {location.pathname === item.path && (
            <div className="absolute -bottom-1 w-4 h-0.5 bg-[#c5a059] md:bottom-1"></div>
          )}
        </Link>
      ))}
    </nav>
  );
};

const HomePage = () => {
  return (
    <div className="min-h-screen archive-bg flex flex-col items-center justify-center p-6 pt-[118px] pb-40 md:pt-[182px] md:pb-24">
      <div className="text-center mb-20 fade-up">
        <h2 className="text-[#c5a059] text-sm tracking-[0.4em] mb-4 font-medium uppercase">Busan Digital Humanities Archive</h2>
        <h1 className="text-5xl md:text-8xl text-white mb-6 font-serif font-black tracking-tight leading-tight">
          부산역사<br/><span className="text-[#c5a059]">보물상자</span>
        </h1>
        <div className="w-24 h-1 bg-[#c5a059] mx-auto mb-8"></div>
        <p className="text-slate-400 text-lg md:text-xl font-light tracking-wide">영도 할배의 기록으로 읽는 부산의 시간과 공간</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        {[
          { path: '/waves', title: '파도의 기억', desc: '역사적 타임라인 아카이브', icon: '⏳' },
          { path: '/market', title: '부기와 탐험', desc: '지리적 기록물 큐레이션', icon: '🔍' },
          { path: '/voice', title: '부산의 목소리', desc: 'AI 도슨트 구술 기록', icon: '🎙️' },
          { path: '/harbor', title: '미래의 부산', desc: '시민 참여형 미래 비전 설계', icon: '✨' }
        ].map((item, idx) => (
          <Link 
            key={idx}
            to={item.path} 
            className="group relative bg-[#112240] p-10 rounded-sm border border-white/5 hover:border-[#c5a059]/50 transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 text-4xl opacity-10 group-hover:opacity-30 transition-opacity">
              {item.icon}
            </div>
            <h2 className="text-2xl font-serif text-white mb-2 group-hover:text-[#c5a059] transition-colors">{item.title}</h2>
            <p className="text-slate-500 text-sm font-light tracking-tight">{item.desc}</p>
          </Link>
        ))}
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
            <Route path="/market" element={<TreasureHunt />} />
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
