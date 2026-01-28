
import React, { useState, useRef } from 'react';
import { TIMELINE_DATA } from '../constants';

const WavesOfMemory: React.FC = () => {
  const [isOpeningFinished, setIsOpeningFinished] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  const startArchive = () => {
    setIsOpeningFinished(true);
    setTimeout(() => {
      timelineRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#0a192f] transition-all duration-1000">
      {/* 오프닝 시퀀스: 인문학적 깊이가 느껴지는 텍스트 중심 */}
      {!isOpeningFinished && (
        <div 
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#0a192f] cursor-pointer"
          onClick={startArchive}
        >
          <div className="max-w-4xl px-8 text-center fade-up">
            <h2 className="text-[#c5a059] text-sm tracking-[0.6em] mb-12 font-medium">PROLOGUE</h2>
            <h1 className="text-4xl md:text-7xl font-serif font-black text-white mb-10 leading-tight">
              기억은 파도처럼 밀려와<br/>역사의 문장이 된다
            </h1>
            <p className="text-slate-400 text-xl md:text-2xl leading-relaxed font-light max-w-2xl mx-auto">
              우리는 시간의 기록자입니다. 부산이 겪어온 수많은 계절을<br/>
              디지털의 선으로 다시 잇고 기억합니다.
            </p>
            <div className="mt-20 flex flex-col items-center gap-4">
              <div className="w-0.5 h-16 bg-gradient-to-b from-[#c5a059] to-transparent"></div>
              <span className="text-[#c5a059] text-xs tracking-[0.3em] animate-pulse">ENTER THE ARCHIVE</span>
            </div>
          </div>
        </div>
      )}

      {/* 타임라인 아카이브 섹션 */}
      <div 
        ref={timelineRef}
        className={`p-6 pt-[140px] pb-40 md:p-20 md:pt-[180px] transition-all duration-1000 ${isOpeningFinished ? 'opacity-100' : 'opacity-0 scale-95'}`}
      >
        <div className="max-w-7xl mx-auto">
          <header className="mb-32 text-left border-l-2 border-[#c5a059] pl-10 max-w-4xl">
            <span className="text-[#c5a059] text-xs font-bold mb-4 block tracking-[0.5em]">HISTORICAL CHRONOLOGY</span>
            <h1 className="text-6xl md:text-9xl text-white mb-8 font-serif font-black tracking-tighter">파도의 기억</h1>
            <p className="text-slate-400 text-xl md:text-3xl font-light leading-relaxed">부산의 시간을 수놓은 주요 사건들을<br/>고고학적 시각으로 기록한 디지털 도록입니다.</p>
          </header>

          <div className="relative">
            {TIMELINE_DATA.map((event, index) => (
              <div 
                key={index} 
                className={`relative w-full mb-8 md:mb-16 group flex ${
                  index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'
                }`}
              >
                {/* 인덱스 노드 (중앙 배치) */}
                <div className="hidden md:flex absolute left-1/2 top-16 -translate-x-1/2 flex-col items-center z-20">
                  <div className="w-4 h-4 bg-[#c5a059] rotate-45 group-hover:scale-150 transition-transform duration-500 shadow-[0_0_15px_rgba(197,160,89,0.5)]"></div>
                </div>
                
                {/* 항목 카드: 전체의 3/5(60%) 너비 차지 */}
                <div className={`w-full md:w-[60%] bg-[#112240]/40 p-10 md:p-16 hover:bg-[#112240] transition-all border border-white/5 group-hover:border-[#c5a059]/30 relative overflow-hidden ${
                  index % 2 === 0 ? 'md:pl-24' : 'md:pr-24'
                }`}>
                  {/* 장식적 요소: 배경 연도 */}
                  <div className="absolute top-0 right-0 text-[10rem] font-serif font-black text-white/[0.02] -translate-y-1/4 translate-x-1/4 pointer-events-none group-hover:text-[#c5a059]/[0.05] transition-colors">
                    {event.year.replace('년', '')}
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-baseline gap-8 mb-6">
                      <span className="text-[#c5a059] text-5xl md:text-7xl font-serif font-black tracking-tighter">
                        {event.year}
                      </span>
                      <div className="h-px bg-gradient-to-r from-[#c5a059]/40 to-transparent flex-grow"></div>
                    </div>
                    <h3 className="text-4xl md:text-6xl font-serif text-white mb-10 leading-[1.1] group-hover:translate-x-2 transition-transform duration-700">
                      {event.title}
                    </h3>
                    <p className="text-slate-400 text-xl md:text-2xl leading-relaxed font-light tracking-tight group-hover:text-slate-200 transition-colors duration-500 max-w-3xl">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* 중앙 수직선 (데스크탑 전용) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#c5a059]/50 via-white/5 to-transparent -translate-x-1/2 -z-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WavesOfMemory;
