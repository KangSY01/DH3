
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
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect', message: string } | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameState === 'map' && mapContainerRef.current && !mapInstanceRef.current) {
      const L = (window as any).L;
      if (!L) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [35.12, 129.08],
        zoom: 12,
        zoomControl: false,
      });

      // 밝은 분위기를 위해 CartoDB Positron(밝은 테마) 레이어 사용
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const markers: any[] = [];
      SPOTS.forEach(spot => {
        const isCollected = collected.includes(spot.id);
        const iconHtml = `
          <div class="flex flex-col items-center" id="marker-${spot.id}">
            <div class="relative w-10 h-10 flex items-center justify-center bg-[#0a192f] border-2 ${isCollected ? 'border-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.5)]' : 'border-[#1e293b]'} rounded-full shadow-xl transition-all hover:scale-125">
              <span class="text-xl">${isCollected ? '⭐' : spot.icon}</span>
              <div class="absolute -bottom-1 w-2 h-2 rotate-45 ${isCollected ? 'bg-[#c5a059]' : 'bg-[#1e293b]'}"></div>
            </div>
            <div class="mt-1 bg-[#1e293b] px-2 py-0.5 rounded-sm text-[9px] font-bold text-white shadow-md whitespace-nowrap border border-white/10 uppercase tracking-tighter">${spot.name}</div>
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
        markers.push({ id: spot.id, marker });
      });

      markersRef.current = markers;
      mapInstanceRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 300);
    }

    return () => {
      if (gameState !== 'map' && mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
      }
    };
  }, [gameState, collected]);

  const handleSpotClick = async (spot: TreasureSpot) => {
    if (collected.includes(spot.id)) return;
    
    setSelectedSpot(spot);
    setGameState('quiz');
    setIsLoading(true);
    setFeedback(null);
    
    try {
      const info = await geminiService.getPlaceSearchInfo(spot.name);
      setGroundingInfo(info);
    } catch (error) {
      setGroundingInfo({ text: spot.history, links: [] });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (selectedSpot && index === selectedSpot.answer) {
      setFeedback({ type: 'correct', message: '훌륭합니다! 역사의 조각을 하나 더 찾으셨군요.' });
      setTimeout(() => {
        setCollected(prev => [...prev, selectedSpot.id]);
        if (collected.length + 1 === SPOTS.length) {
          setGameState('finish');
        } else {
          setGameState('map');
        }
        setFeedback(null);
      }, 2000);
    } else {
      setFeedback({ type: 'incorrect', message: '아직은 기억이 조금 흐릿하군요. 다시 한번 살펴볼까요?' });
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a192f] p-6 pt-[118px] pb-40 flex flex-col items-center md:pt-[150px] transition-colors duration-1000">
      
      {/* 즉각적인 피드백 메시지 레이어 */}
      {feedback && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] fade-up">
          <div className={`px-10 py-6 rounded-sm border backdrop-blur-xl shadow-2xl ${
            feedback.type === 'correct' 
              ? 'bg-[#c5a059]/90 border-white/20 text-[#0a192f]' 
              : 'bg-red-900/90 border-red-500/50 text-white'
          }`}>
            <p className="text-xl md:text-2xl font-serif font-bold tracking-tight text-center">
              {feedback.type === 'correct' ? '✨ ARCHIVED' : '⚠️ RE-EXAMINE'}
            </p>
            <p className="mt-2 text-sm md:text-lg font-medium opacity-90 text-center">{feedback.message}</p>
          </div>
        </div>
      )}

      <div className="max-w-5xl w-full bg-[#112240]/50 backdrop-blur-md rounded-sm border border-white/5 overflow-hidden shadow-2xl relative">
        <div className="p-8 md:p-12">
          {gameState === 'start' && (
            <div className="py-20 text-center space-y-12 fade-up">
              <div className="relative inline-block">
                <span className="text-[120px] block mb-4 filter drop-shadow-[0_0_20px_rgba(197,160,89,0.3)]">🏛️</span>
                <span className="absolute -top-4 -right-12 bg-[#c5a059] text-[#0a192f] text-[10px] px-3 py-1 font-bold tracking-[0.2em] uppercase">Digital Archive</span>
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-serif font-black text-white tracking-tighter">부산 지리 기록 탐험</h1>
                <p className="text-[#c5a059] text-sm md:text-base tracking-[0.3em] font-medium uppercase">Explore the Geography of Memories</p>
              </div>
              <p className="text-slate-400 leading-relaxed max-w-xl mx-auto text-lg font-light">
                부산의 주요 거점에 새겨진 역사적 흔적을 추적합니다.<br/>
                실제 지도를 탐색하며 5개의 흩어진 기록물을 수집해 보십시오.
              </p>
              <button 
                onClick={() => setGameState('map')}
                className="bg-[#c5a059] hover:bg-[#d4b06a] text-[#0a192f] font-bold px-20 py-6 text-xl tracking-[0.3em] transition-all uppercase shadow-xl"
              >
                탐험 시작하기
              </button>
            </div>
          )}

          {gameState === 'map' && (
            <div className="space-y-8 fade-up">
              <header className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/10 pb-8">
                <div>
                  <h2 className="text-2xl font-serif text-white flex items-center gap-3">
                    <span className="text-[#c5a059]">📍</span> 실시간 기록 지도
                  </h2>
                  <p className="text-xs text-[#c5a059]/60 tracking-widest mt-1 uppercase">Select a point of interest on the map</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-white/30 tracking-widest uppercase mb-1">Archive Status</span>
                    <div className="flex gap-1.5">
                      {SPOTS.map(s => (
                        <div key={s.id} className={`w-6 h-1 rounded-full ${collected.includes(s.id) ? 'bg-[#c5a059]' : 'bg-white/10'}`}></div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-[#c5a059] text-[#0a192f] font-bold px-4 py-2 text-sm tracking-widest">
                    {collected.length} / {SPOTS.length}
                  </div>
                </div>
              </header>
              
              <div className="relative w-full aspect-[21/9] bg-[#0a192f] border border-white/5 min-h-[450px]">
                <div ref={mapContainerRef} className="w-full h-full opacity-100 transition-opacity" id="map"></div>
                <div className="absolute top-6 left-6 z-[20] bg-white/80 backdrop-blur-md p-4 border border-black/10 text-black/40 text-[10px] tracking-widest uppercase font-mono pointer-events-none">
                  SYSTEM ACTIVE: LAT_LNG_RADAR
                </div>
              </div>
            </div>
          )}

          {gameState === 'quiz' && selectedSpot && (
            <div className="space-y-12 py-4 fade-up">
              <div className="flex items-center justify-between border-b border-white/10 pb-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center text-4xl">
                    {selectedSpot.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-5xl font-serif font-black text-white">{selectedSpot.name}</h2>
                    <p className="text-[#c5a059] text-xs font-bold tracking-[0.4em] mt-2 uppercase">Verification in Progress</p>
                  </div>
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-[10px] text-white/20 font-mono">SPOT_ID: {selectedSpot.id.toUpperCase()}</p>
                  <p className="text-[10px] text-white/20 font-mono">COORD: {selectedSpot.lat}, {selectedSpot.lng}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
                {/* 퀴즈 섹션 */}
                <div className="bg-[#0a192f]/50 p-10 border-l-2 border-[#c5a059] flex flex-col">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="text-[#c5a059] text-xs font-bold tracking-widest uppercase">Inquiry</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif text-white mb-10 leading-snug font-bold">
                    {selectedSpot.quiz}
                  </h3>
                  <div className="space-y-4 mt-auto">
                    {selectedSpot.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className="w-full text-left bg-[#f5f5f0] hover:bg-white border-none p-6 text-[#020617] font-black text-xl transition-all flex justify-between items-center group shadow-lg"
                      >
                        <span className="tracking-tight">{idx + 1}. {option}</span>
                        <span className="text-[#c5a059] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 정보 아카이브 섹션 */}
                <div className="bg-[#112240]/40 p-10 border border-white/5 flex flex-col">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="text-white/20 text-xs font-bold tracking-widest uppercase">Reference Archive</span>
                  </div>
                  
                  {isLoading ? (
                    <div className="flex-grow flex flex-col items-center justify-center space-y-6">
                      <div className="w-12 h-12 border-2 border-[#c5a059]/20 border-t-[#c5a059] rounded-full animate-spin"></div>
                      <p className="text-[#c5a059] text-xs font-bold tracking-[0.3em] animate-pulse uppercase">Restoring Data...</p>
                    </div>
                  ) : (
                    <div className="flex-grow flex flex-col h-full">
                      <div className="bg-[#0a192f]/50 p-6 border border-white/5 mb-8 flex-grow overflow-y-auto max-h-[220px] scroll-smooth">
                        <div className="text-slate-300 text-lg md:text-xl leading-relaxed font-serif font-light whitespace-pre-line italic opacity-80">
                          {groundingInfo?.text || selectedSpot.history}
                        </div>
                      </div>
                      
                      {groundingInfo?.links && groundingInfo.links.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-[#c5a059]/60 uppercase tracking-widest px-1">Source Materials</p>
                          <div className="grid grid-cols-1 gap-2">
                            {groundingInfo.links.map((link, i) => (
                              <a 
                                key={i} 
                                href={link.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between bg-[#1e293b]/50 hover:bg-[#1e293b] p-4 border border-white/5 transition-all"
                              >
                                <div className="flex items-center gap-4 overflow-hidden">
                                  <span className="text-[#c5a059]">🌐</span>
                                  <p className="text-[11px] font-bold text-slate-300 truncate tracking-tight">{link.title}</p>
                                </div>
                                <span className="text-[#c5a059]/30 group-hover:text-[#c5a059] text-xs">↗</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 flex justify-center">
                <button 
                  onClick={() => setGameState('map')}
                  className="text-white/20 hover:text-[#c5a059] text-xs font-bold tracking-[0.4em] transition-all uppercase"
                >
                  [ Return to Map Interface ]
                </button>
              </div>
            </div>
          )}

          {gameState === 'finish' && (
            <div className="py-24 text-center space-y-12 fade-up">
              <span className="text-[120px] block filter drop-shadow-[0_0_30px_rgba(197,160,89,0.5)]">🏺</span>
              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-serif font-black text-white tracking-tighter">아카이브 복원 완료</h2>
                <p className="text-[#c5a059] text-sm md:text-base tracking-[0.4em] font-medium uppercase">All Historical Fragments Recovered</p>
              </div>
              <div className="bg-[#0a192f]/50 p-12 border border-[#c5a059]/20 max-w-2xl mx-auto shadow-2xl">
                <p className="text-slate-400 leading-relaxed text-xl md:text-2xl font-light font-serif italic">
                  "지도는 단순히 땅을 보여주는 것이 아니라, 그 땅 위에 겹겹이 쌓인 인간의 삶과 시간을 보여주는 거울입니다."
                </p>
              </div>
              <button 
                onClick={() => {
                  setCollected([]);
                  setGameState('start');
                  setGroundingInfo(null);
                }}
                className="bg-[#c5a059] text-[#0a192f] font-bold px-20 py-6 text-xl tracking-[0.3em] hover:bg-[#d4b06a] transition-all uppercase shadow-2xl"
              >
                새로운 조사 시작
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreasureHunt;
