
import React, { useState, useEffect, useRef } from 'react';
import { TIMELINE_DATA } from '../constants';

const WavesOfMemory: React.FC = () => {
  const [step, setStep] = useState(0);
  const [isOpeningFinished, setIsOpeningFinished] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  // 시퀀스 데이터
  const sequences = [
    {
      title: "1950년, 삶의 마지막 항구",
      narration: "이곳은 누군가에겐 삶의 마지막 항구였고, 누군가에겐 새로운 시작의 땅이었습니다. 거친 파도 속에서도 사람들은 서로의 온기로 불을 지피고, 희망이라는 이름의 땀방울을 흘렸죠.",
      img: "https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=1600&auto=format&fit=crop",
      filter: "grayscale(1) sepia(0.2) contrast(1.2)",
      prompt: "1950년대 중반, 흑백 사진 속 부산 국제시장 골목의 피란민들"
    },
    {
      title: "기억의 번역, 변화의 순간",
      narration: "시간의 베틀 위에서, AI는 과거의 실을 현재의 색으로 물들입니다. 수많은 기억의 파편들이 모여, 오늘날 부산의 모습으로 피어나는 찬란한 찰나입니다.",
      img: "https://images.unsplash.com/photo-1570114001925-fb391a27e025?q=80&w=1600&auto=format&fit=crop",
      filter: "grayscale(0.5) contrast(1.1)",
      prompt: "흑백 인물들이 서서히 현대적 복장과 컬러로 변모하는 모핑 현장"
    },
    {
      title: "2026년, 역동적인 내일",
      narration: "과거의 땀과 열정은 오늘날의 역동적인 에너지로 다시 태어났습니다. 우리는 모두, 시간이라는 거대한 파도를 함께 타고 있는 항해자들입니다.",
      img: "https://images.unsplash.com/photo-1610986751713-399a81878be7?q=80&w=1600&auto=format&fit=crop",
      filter: "none",
      prompt: "활기찬 광안대교 야경과 미래 지향적인 부산 도심 풍경"
    }
  ];

  const nextStep = () => {
    if (step < sequences.length - 1) {
      setStep(step + 1);
    } else {
      setIsOpeningFinished(true);
      setTimeout(() => {
        timelineRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 8 + 2}px`,
    duration: `${Math.random() * 5 + 3}s`,
    delay: `${Math.random() * 2}s`
  }));

  return (
    <div className="min-h-screen bg-sky-50 transition-all duration-1000">
      {/* 오프닝 시퀀스 레이어 */}
      {!isOpeningFinished && (
        <div 
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-hidden transition-all duration-1000 bg-black"
          onClick={nextStep}
        >
          <div 
            className="absolute inset-0 transition-all duration-[2000ms] ease-in-out scale-110"
            style={{ 
              backgroundImage: `url(${sequences[step].img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: sequences[step].filter,
              opacity: 0.6
            }}
          />

          <div className={`absolute inset-0 transition-opacity duration-1000 ${step === 1 ? 'opacity-100' : 'opacity-30'}`}>
            {particles.map(p => (
              <div 
                key={p.id}
                className="particle"
                style={{
                  left: p.left,
                  width: p.size,
                  height: p.size,
                  animationDuration: p.duration,
                  animationDelay: p.delay,
                  bottom: '-10px'
                }}
              />
            ))}
          </div>

          <div className="relative z-10 max-w-3xl px-8 text-center text-white">
            <div key={step} className="fade-in space-y-6">
              <span className="inline-block px-4 py-1 border border-white/30 rounded-full text-xs font-bold tracking-widest text-sky-200 uppercase">
                Step {step + 1}
              </span>
              <h2 className="text-4xl md:text-6xl font-jua text-white drop-shadow-2xl">
                {sequences[step].title}
              </h2>
              <p className="text-lg md:text-2xl leading-relaxed text-slate-100 font-medium drop-shadow-lg">
                {sequences[step].narration}
              </p>
              
              <div className="pt-12">
                <p className="text-sm text-white/50 animate-pulse">
                  {step < 2 ? "화면을 클릭하여 시간을 이동하세요" : "모험을 시작하려면 클릭하세요"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 실제 연표 섹션 */}
      <div 
        ref={timelineRef}
        className={`p-4 pt-[118px] pb-40 md:p-12 md:pt-[150px] md:pb-32 transition-opacity duration-1000 ${isOpeningFinished ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="max-w-4xl mx-auto">
          <header className="mb-16 text-center">
            <span className="text-sky-400 font-bold mb-2 block animate-fade-in tracking-widest">MEMORY TIMELINE</span>
            <h1 className="text-5xl md:text-7xl text-sky-900 mb-6 font-jua">파도의 기억</h1>
            <p className="text-sky-700 text-xl md:text-2xl font-medium">출렁이는 바다 물결처럼 흐르는 부산의 역사를 따라가보세요.</p>
          </header>

          <div className="relative border-l-8 border-sky-100 ml-6 md:ml-0 md:flex md:flex-col md:items-center md:border-l-0">
            {TIMELINE_DATA.map((event, index) => (
              <div 
                key={index} 
                className={`mb-4 relative w-full md:w-[48%] group ${
                  index % 2 === 0 ? 'md:ml-auto md:pl-12' : 'md:mr-auto md:pr-12'
                }`}
              >
                {/* Dot */}
                <div className="absolute top-1/2 -translate-y-1/2 -left-[44px] md:left-auto md:right-auto w-12 h-12 bg-white rounded-full border-4 border-sky-500 shadow-xl z-10 
                  md:left-1/2 md:-translate-x-1/2 transition-transform group-hover:scale-110 duration-300 flex items-center justify-center">
                    <span className="text-lg font-bold text-sky-600">{index + 1}</span>
                  </div>
                
                <div className="bg-white p-8 rounded-[2.5rem] shadow-md border-2 border-transparent hover:border-sky-300 transition-all hover:shadow-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="inline-block px-5 py-2 bg-sky-600 text-white rounded-2xl text-xl font-bold shadow-sm">
                      {event.year}
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-jua text-slate-900 mb-4 leading-tight">{event.title}</h3>
                  <p className="text-slate-700 text-lg md:text-xl leading-relaxed font-medium">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Timeline Connector for Desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-2 bg-sky-100 -translate-x-1/2 -z-0"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WavesOfMemory;
