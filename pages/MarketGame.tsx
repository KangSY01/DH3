
import React, { useState, useEffect, useRef } from 'react';
import { geminiService } from '../services/geminiService';

interface TreasureSpot {
  id: string;
  name: string;
  icon: string;
  quiz: string;
  options: string[];
  answer: number;
  history: string;
  lat: number;
  lng: number;
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
    lat: 35.0975, lng: 129.0106
  },
  {
    id: 'jagalchi',
    name: '자갈치시장',
    icon: '🐟',
    quiz: '자갈치시장의 슬로건 "오이소, 보이소, ___!"에 들어갈 말은?',
    options: ['먹으소', '노이소', '사이소'],
    answer: 2,
    history: '자갈치 아지매들의 억척스럽고 따뜻한 삶이 녹아있는 대한민국 최대의 수산시장이에요.',
    lat: 35.0968, lng: 129.0306
  },
  {
    id: 'taejongdae',
    name: '태종대',
    icon: '🗼',
    quiz: '태종대는 어느 왕이 이곳의 경치에 반해 활을 쏘며 즐겼다고 해서 이름 붙여졌나요?',
    options: ['세종대왕', '신라 태종 무열왕', '고려 태조 왕건'],
    answer: 1,
    history: '신라의 태종 무열왕이 삼국통일 후 이곳의 빼어난 절경을 즐기며 휴식을 취했다고 해요.',
    lat: 35.0524, lng: 129.0877
  },
  {
    id: 'gwangalli',
    name: '광안리 해수욕장',
    icon: '🌉',
    quiz: '광안대교의 다른 이름은 무엇일까요?',
    options: ['다이아몬드 브릿지', '루비 브릿지', '사파이어 브릿지'],
    answer: 0,
    history: '광안대교는 부산의 랜드마크로, 밤이면 다이아몬드처럼 빛나서 다이아몬드 브릿지라고도 불러요.',
    lat: 35.1532, lng: 129.1189
  },
  {
    id: 'haeudae',
    name: '해운대 해수욕장',
    icon: '🏖️',
    quiz: '해운대라는 이름은 통일신라 시대의 누구의 자에서 따왔나요?',
    options: ['최치원', '이순신', '장보고'],
    answer: 0,
    history: '최치원이 동백섬의 바위에 자신의 자인 "해운"을 새긴 것에서 유래했답니다.',
    lat: 35.1587, lng: 129.1603
  }
];

const TreasureHunt: React.FC = () => {
  const [gameState, setGameState] = useState<'start' | 'map' | 'quiz' | 'finish'>('start');
  const [selectedSpot, setSelectedSpot] = useState<TreasureSpot | null>(null);
  const [collected, setCollected] = useState<string[]>([]);
  const [groundingInfo, setGroundingInfo] = useState<{ text: string, links: { title: string, uri: string }[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // 지도 초기화 및 마커 배치
  useEffect(() => {
    if (gameState === 'map' && !mapRef.current) {
      const L = (window as any).L;
      if (!L) return;

      const map = L.map('map', {
        center: [35.12, 129.08],
        zoom: 12,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      SPOTS.forEach(spot => {
        const isCollected = collected.includes(spot.id);
        const iconHtml = `
          <div class="flex flex-col items-center marker-container" id="marker-${spot.id}">
            <div class="relative w-10 h-10 flex items-center justify-center bg-white border-4 ${isCollected ? 'border-emerald-500 shadow-emerald-200' : 'border-sky-500 shadow-sky-200'} rounded-full shadow-xl transition-all hover:scale-125">
              <span class="text-xl">${isCollected ? '⭐' : spot.icon}</span>
              <div class="absolute -bottom-1 w-2 h-2 rotate-45 ${isCollected ? 'bg-emerald-500' : 'bg-sky-500'}"></div>
            </div>
            <div class="mt-1 bg-white/90 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-sm whitespace-nowrap border border-slate-100">${spot.name}</div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-div-icon',
          iconSize: [40, 60],
          iconAnchor: [20, 50]
        });

        const marker = L.marker([spot.lat, spot.lng], { icon: customIcon }).addTo(map);
        marker.on('click', () => handleSpotClick(spot));
        markersRef.current.push({ id: spot.id, marker });
      });

      mapRef.current = map;
    }

    if (mapRef.current && gameState === 'map') {
      markersRef.current.forEach(({ id, marker }) => {
        const spot = SPOTS.find(s => s.id === id);
        if (!spot) return;
        const isCollected = collected.includes(id);
        const L = (window as any).L;
        
        marker.setIcon(L.divIcon({
          html: `
            <div class="flex flex-col items-center marker-container">
              <div class="relative w-10 h-10 flex items-center justify-center bg-white border-4 ${isCollected ? 'border-emerald-500 shadow-emerald-200' : 'border-sky-500 shadow-sky-200'} rounded-full shadow-xl">
                <span class="text-xl">${isCollected ? '⭐' : spot.icon}</span>
                <div class="absolute -bottom-1 w-2 h-2 rotate-45 ${isCollected ? 'bg-emerald-500' : 'bg-sky-500'}"></div>
              </div>
              <div class="mt-1 bg-white/90 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-sm whitespace-nowrap border border-slate-100">${spot.name}</div>
            </div>
          `,
          className: 'custom-div-icon',
          iconSize: [40, 60],
          iconAnchor: [20, 50]
        }));
      });
    }

    return () => {
      if (gameState !== 'map' && mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = [];
      }
    };
  }, [gameState, collected]);

  const handleSpotClick = async (spot: TreasureSpot) => {
    if (collected.includes(spot.id)) return;
    
    setSelectedSpot(spot);
    setGameState('quiz');
    setIsLoading(true);
    
    // Google Search Grounding 데이터 호출
    const info = await geminiService.getPlaceSearchInfo(spot.name);
    setGroundingInfo(info);
    setIsLoading(false);
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
                안녕! 내는 부산의 마스코트 <span className="font-bold text-sky-600">부기</span>라고 해!<br/>
                진짜 부산 지도를 보면서 숨겨진 5개의 역사 보물을 찾으러 가볼까?<br/>
                구글 검색 실시간 정보를 확인하며 진짜 부산의 보물을 발견해보자!
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
                  <span className="animate-pulse">📍</span> 지도 위의 핀을 클릭해 탐험을 시작하세요!
                </span>
              </div>
              
              <div className="relative w-full aspect-[16/10] bg-sky-50 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-sky-100">
                <div id="map"></div>
                
                <div className="absolute bottom-6 left-6 z-[20] bg-white/95 p-4 rounded-2xl shadow-xl border border-sky-200 flex items-center gap-4 animate-bounce">
                  <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-2xl border-2 border-sky-200">🕊️</div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-sky-800">지도를 움직여봐!</p>
                    <p className="text-[10px] text-slate-500">부산 곳곳에 보물이 숨어있어!</p>
                  </div>
                </div>
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
                  <p className="text-sky-600 font-bold italic">구글 검색 실시간 정보 기반 퀴즈</p>
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

                <div className="bg-sky-50/50 p-8 rounded-[2rem] border-4 border-white shadow-inner text-left flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl">🔍</span>
                    <h3 className="text-xl font-jua text-sky-800">구글 검색 실시간 정보</h3>
                  </div>
                  
                  {isLoading ? (
                    <div className="flex-grow flex flex-col items-center justify-center space-y-4 py-12">
                      <div className="w-16 h-16 border-8 border-sky-200 border-t-sky-500 rounded-full animate-spin"></div>
                      <p className="text-sky-600 font-bold animate-pulse">부기가 최신 정보를 찾는 중...</p>
                    </div>
                  ) : (
                    <div className="flex-grow flex flex-col h-full">
                      <div className="bg-white/80 p-5 rounded-2xl border border-sky-100 mb-6 flex-grow overflow-y-auto max-h-[180px] custom-scrollbar">
                        <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                          {groundingInfo?.text || selectedSpot.history}
                        </div>
                      </div>
                      
                      {groundingInfo?.links && groundingInfo.links.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-sky-600 uppercase tracking-widest px-1">검색 출처 및 더보기</p>
                          <div className="flex flex-col gap-2">
                            {groundingInfo.links.map((link, i) => (
                              <a 
                                key={i} 
                                href={link.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 bg-white hover:bg-sky-50 p-3 rounded-xl border border-sky-100 transition-all hover:translate-x-1 shadow-sm"
                              >
                                <span className="text-lg">🌐</span>
                                <div className="text-left flex-grow overflow-hidden">
                                  <p className="text-[11px] font-bold text-slate-800 truncate group-hover:text-sky-700">{link.title}</p>
                                  <p className="text-[9px] text-slate-400 truncate">{link.uri}</p>
                                </div>
                                <span className="text-sky-300">↗️</span>
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
              <div className="bg-sky-50 p-12 rounded-[3rem] text-left border-4 border-white max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
                <p className="text-slate-700 leading-relaxed text-xl text-center">
                  진짜 지도를 따라 탐험한 부산의 보물찾기, 어땠어?<br/>
                  구글 검색으로 알아본 <span className="font-extrabold text-sky-600 text-2xl">부산의 오늘과 어제</span>가<br/>
                  너에게 소중한 기억이 되었길 바래!
                </p>
              </div>
              <button 
                onClick={() => {
                  setCollected([]);
                  setGameState('start');
                  setGroundingInfo(null);
                }}
                className="bg-slate-900 text-white font-jua px-16 py-6 rounded-[2rem] text-2xl shadow-2xl hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
              >
                새로운 모험 시작하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreasureHunt;
