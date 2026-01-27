
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';

interface TreasureSpot {
  id: string;
  name: string;
  icon: string;
  quiz: string;
  options: string[];
  answer: number;
  history: string;
  x: string; // 지도상 가로 위치 (%)
  y: string; // 지도상 세로 위치 (%)
}

const SPOTS: TreasureSpot[] = [
  {
    id: 'gamcheon',
    name: '감천문화마을',
    icon: '🏡',
    quiz: '감천문화마을은 과거 어떤 사람들의 삶의 터전이었나요?',
    options: ['왕실 가족', '피란민과 서민', '해외 상인'],
    answer: 1,
    history: '6.25 전쟁 당시 피란민들이 산비탈에 집을 지어 살기 시작한 곳이 지금의 아름다운 마을이 되었답니다.',
    x: '32%', y: '68%'
  },
  {
    id: 'jagalchi',
    name: '자갈치시장',
    icon: '🐟',
    quiz: '자갈치시장의 슬로건 "오이소, 보이소, ___!"에 들어갈 말은?',
    options: ['먹으소', '노이소', '사이소'],
    answer: 2,
    history: '자갈치 아지매들의 억척스럽고 따뜻한 삶이 녹아있는 대한민국 최대의 수산시장이에요.',
    x: '42%', y: '72%'
  },
  {
    id: 'taejongdae',
    name: '태종대',
    icon: '🗼',
    quiz: '태종대는 어느 왕이 이곳의 경치에 반해 활을 쏘며 즐겼다고 해서 이름 붙여졌나요?',
    options: ['세종대왕', '신라 태종 무열왕', '고려 태조 왕건'],
    answer: 1,
    history: '신라의 태종 무열왕이 삼국통일 후 이곳의 빼어난 절경을 즐기며 휴식을 취했다고 해요.',
    x: '55%', y: '88%'
  },
  {
    id: 'gwangalli',
    name: '광안리',
    icon: '🌉',
    quiz: '광안대교의 다른 이름은 무엇일까요?',
    options: ['다이아몬드 브릿지', '루비 브릿지', '사파이어 브릿지'],
    answer: 0,
    history: '광안대교는 부산의 랜드마크로, 밤이면 다이아몬드처럼 빛나서 다이아몬드 브릿지라고도 불러요.',
    x: '72%', y: '58%'
  },
  {
    id: 'haeudae',
    name: '해운대',
    icon: '🏖️',
    quiz: '해운대라는 이름은 통일신라 시대의 누구의 자에서 따왔나요?',
    options: ['최치원', '이순신', '장보고'],
    answer: 0,
    history: '최치원이 동백섬의 바위에 자신의 자인 "해운"을 새긴 것에서 유래했답니다.',
    x: '82%', y: '48%'
  }
];

const TreasureHunt: React.FC = () => {
  const [gameState, setGameState] = useState<'start' | 'map' | 'quiz' | 'finish'>('start');
  const [selectedSpot, setSelectedSpot] = useState<TreasureSpot | null>(null);
  const [collected, setCollected] = useState<string[]>([]);
  const [groundingInfo, setGroundingInfo] = useState<{ text: string, links: { title: string, uri: string }[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  const handleSpotClick = async (spot: TreasureSpot) => {
    if (collected.includes(spot.id) || animatingId) return;
    
    setAnimatingId(spot.id);
    
    // 시각적 효과를 위해 줌 & 글로우 애니메이션 대기
    setTimeout(async () => {
      setSelectedSpot(spot);
      setGameState('quiz');
      setIsLoading(true);
      
      // 구글 맵 대신 구글 서치 그라운딩 데이터를 가져옴
      const info = await geminiService.getPlaceSearchInfo(spot.name);
      setGroundingInfo(info);
      setIsLoading(false);
      setAnimatingId(null);
    }, 450);
  };

  const handleAnswer = (index: number) => {
    if (selectedSpot && index === selectedSpot.answer) {
      setCollected([...collected, selectedSpot.id]);
      setGameState('map');
      if (collected.length + 1 === SPOTS.length) {
        setGameState('finish');
      }
    } else {
      alert('틀렸어! 부기가 힌트를 줄 테니 다시 한번 생각해보자~');
    }
  };

  return (
    <div className="min-h-screen wave-bg p-6 pt-[118px] pb-40 flex flex-col items-center md:pt-[150px]">
      <div className="max-w-4xl w-full bg-white/95 backdrop-blur rounded-[2.5rem] shadow-2xl overflow-hidden mt-[50px] mb-12 border-4 border-white/50 relative">
        <div className="p-8 text-center">
          {gameState === 'start' && (
            <div className="py-16 space-y-8">
              <div className="relative inline-block">
                <span className="text-9xl block mb-4 animate-bounce">🕊️</span>
                <span className="absolute -top-4 -right-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">부기 Boogi</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-jua text-sky-900">부기와 함께! 부산 보물찾기</h1>
              <p className="text-slate-600 leading-relaxed max-w-lg mx-auto text-lg">
                안녕! 내는 부산의 마스코트 <span className="font-bold text-sky-600">부기</span>야!<br/>
                부산 지도 곳곳에 숨겨진 5개의 역사 보물을 찾으러 가볼까?<br/>
                구글 검색을 통해 실시간으로 장소 정보를 확인하며 탐험해봐!
              </p>
              <button 
                onClick={() => setGameState('map')}
                className="bg-sky-500 hover:bg-sky-600 text-white font-jua px-16 py-6 rounded-3xl text-3xl shadow-[0_10px_0_rgb(3,105,161)] transition-all hover:translate-y-1 hover:shadow-[0_5px_0_rgb(3,105,161)] active:translate-y-2 active:shadow-none"
              >
                모험 시작하기!
              </button>
            </div>
          )}

          {gameState === 'map' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-center bg-sky-50/80 p-5 rounded-3xl border border-sky-100 mb-2 gap-4">
                <div className="flex items-center gap-4">
                  <span className="bg-sky-500 text-white font-jua px-4 py-2 rounded-xl text-xl shadow-sm">
                    수집 현황: {collected.length} / {SPOTS.length}
                  </span>
                  <div className="flex gap-1">
                    {SPOTS.map(s => (
                      <span key={s.id} className={`w-4 h-4 rounded-full ${collected.includes(s.id) ? 'bg-sky-500' : 'bg-slate-200 shadow-inner'}`}></span>
                    ))}
                  </div>
                </div>
                <span className="text-sky-800 font-bold flex items-center gap-2">
                  <span className="animate-pulse">📍</span> 지도 위의 핀을 클릭해 보물을 찾으세요!
                </span>
              </div>
              
              <div className="relative w-full aspect-[16/10] bg-[#e3f2fd] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-sky-100 group">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 62.5" preserveAspectRatio="none">
                  <path d="M10,20 Q20,10 40,15 T70,10 T95,25 L100,62.5 L0,62.5 Z" fill="#C8E6C9" />
                  <path d="M30,35 Q45,25 60,40 T90,30 L100,50 L100,62.5 L0,62.5 Z" fill="#A5D6A7" />
                </svg>

                {SPOTS.map(spot => (
                  <button
                    key={spot.id}
                    onClick={() => handleSpotClick(spot)}
                    style={{ left: spot.x, top: spot.y }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group/marker transition-all duration-300 ${
                      animatingId === spot.id 
                        ? 'scale-[2] z-50' 
                        : collected.includes(spot.id) ? 'scale-90 opacity-80' : 'hover:scale-125 z-10'
                    }`}
                  >
                    <div className="relative flex flex-col items-center">
                      <span className={`mb-2 px-3 py-1 bg-white shadow-xl rounded-lg text-xs font-bold whitespace-nowrap border border-sky-100 opacity-0 group-hover/marker:opacity-100 transition-opacity ${animatingId === spot.id ? 'opacity-0' : ''}`}>
                        {spot.name}
                      </span>
                      <div className={`relative w-12 h-12 flex items-center justify-center transition-all duration-300 ${animatingId === spot.id ? 'animate-marker-glow' : ''}`}>
                        <div className={`absolute bottom-0 w-2 h-2 rotate-45 translate-y-1 ${collected.includes(spot.id) ? 'bg-emerald-500' : 'bg-sky-500'}`}></div>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-xl border-4 transition-all ${
                          collected.includes(spot.id) ? 'bg-emerald-500 border-white' : 'bg-white border-sky-500 text-sky-600'
                        }`}>
                          {collected.includes(spot.id) ? '⭐' : spot.icon}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {gameState === 'quiz' && selectedSpot && (
            <div className="space-y-8 py-4 animate-fade-in">
              <div className="flex items-center justify-center gap-4">
                <div className="w-20 h-20 bg-sky-50 rounded-3xl flex items-center justify-center text-5xl shadow-inner border-2 border-sky-100">
                  {selectedSpot.icon}
                </div>
                <div className="text-left">
                  <h2 className="text-4xl font-jua text-sky-900">{selectedSpot.name}</h2>
                  <p className="text-sky-600 font-bold italic">부기의 실시간 검색 리포트</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                <div className="bg-white p-8 rounded-[2rem] border-4 border-sky-50 shadow-sm text-left flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="bg-sky-500 text-white w-8 h-8 flex items-center justify-center rounded-xl font-bold">Q</span>
                    <h3 className="text-xl font-jua text-slate-800">부기의 역사 퀴즈</h3>
                  </div>
                  <p className="text-xl text-slate-800 mb-8 font-medium leading-relaxed">{selectedSpot.quiz}</p>
                  <div className="space-y-4 mt-auto">
                    {selectedSpot.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className="w-full text-left bg-slate-50 hover:bg-sky-100 border-2 border-slate-100 hover:border-sky-300 p-5 rounded-2xl font-bold text-lg transition-all flex justify-between items-center group"
                      >
                        <span>{idx + 1}. {option}</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">➡️</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Google Search Grounding 데이터 섹션 */}
                <div className="bg-emerald-50/50 p-8 rounded-[2rem] border-4 border-white shadow-inner text-left flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">🌐</span>
                    <h3 className="text-xl font-jua text-emerald-800">실시간 구글 검색 정보</h3>
                  </div>
                  
                  {isLoading ? (
                    <div className="flex-grow flex flex-col items-center justify-center space-y-4 py-12">
                      <div className="relative">
                        <div className="w-16 h-16 border-8 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
                        <span className="absolute inset-0 flex items-center justify-center text-xl">🔍</span>
                      </div>
                      <p className="text-emerald-600 font-bold animate-pulse">부기가 구글에서 정보를 찾는 중...</p>
                    </div>
                  ) : (
                    <div className="flex-grow flex flex-col h-full">
                      <div className="bg-white/80 p-5 rounded-2xl border border-emerald-100 mb-6 flex-grow overflow-y-auto max-h-[220px] custom-scrollbar">
                        <p className="text-slate-700 text-base leading-relaxed whitespace-pre-line">
                          {groundingInfo?.text || selectedSpot.history}
                        </p>
                      </div>
                      
                      {groundingInfo?.links && groundingInfo.links.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest px-1">검색 출처 및 더보기</p>
                          <div className="flex flex-wrap gap-2">
                            {groundingInfo.links.map((link, i) => (
                              <a 
                                key={i} 
                                href={link.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-white hover:bg-emerald-500 hover:text-white px-4 py-2 rounded-xl border border-emerald-100 text-xs font-bold text-slate-700 transition-all"
                              >
                                🔗 {link.title.length > 15 ? link.title.substring(0, 15) + '...' : link.title}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={() => setGameState('map')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-500 px-8 py-3 rounded-full text-sm font-bold transition-all"
              >
                ← 지도로 돌아가기
              </button>
            </div>
          )}

          {gameState === 'finish' && (
            <div className="py-20 space-y-8 animate-fade-in">
              <span className="text-[10rem] block animate-bounce">💎</span>
              <h2 className="text-5xl font-jua text-sky-600">부산의 보물을 모두 찾았어!</h2>
              <div className="bg-sky-50 p-12 rounded-[3rem] border-4 border-white max-w-2xl mx-auto shadow-2xl">
                <p className="text-slate-900 leading-relaxed text-2xl font-bold mb-6 text-center">
                  "부기가 구글 검색으로 확인한 진짜 부산"
                </p>
                <p className="text-slate-700 leading-relaxed text-xl text-center">
                  검색을 통해 확인한 부산은 과거의 역사에 머물지 않고 <br/>
                  <span className="font-extrabold text-sky-600">오늘 이 순간에도 끊임없이 변화하며 발전하는 활기찬 도시</span>였어! <br/><br/>
                  이곳의 역사를 아는 너는 이제 부산의 진정한 홍보대사야!
                </p>
              </div>
              <button 
                onClick={() => {
                  setCollected([]);
                  setGameState('start');
                  setGroundingInfo(null);
                }}
                className="bg-slate-900 text-white font-jua px-16 py-6 rounded-[2rem] text-2xl shadow-2xl hover:bg-slate-800 transition-all active:scale-95"
              >
                새로운 모험 시작!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreasureHunt;
