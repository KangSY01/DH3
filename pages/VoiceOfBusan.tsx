
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';

const VoiceOfBusan: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: '어서오이소. 내는 영도에서 평생을 보낸 할배라 한다. 부산의 굽이굽이 서린 역사와 내 삶의 조각들을 자네에게 들려주고 싶구만. 궁금한 게 있다면 편하게 물어보그라.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    const response = await geminiService.chatWithHalbae(userMsg, history);
    setMessages(prev => [...prev, { role: 'model', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a192f] p-4 pt-[118px] pb-48 flex flex-col md:pt-[150px] transition-colors duration-1000">
      <div className="max-w-3xl mx-auto w-full flex-grow flex flex-col bg-[#112240]/50 backdrop-blur-md rounded-sm border border-white/5 overflow-hidden shadow-2xl">
        
        {/* 아카이브 헤더 */}
        <header className="border-b border-white/10 p-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-[#c5a059] flex items-center justify-center text-3xl bg-[#0a192f] z-10 relative">
                👴
              </div>
              <div className="absolute inset-0 bg-[#c5a059] blur-xl opacity-20"></div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">영도 할배 <span className="text-[#c5a059] font-light ml-2">구술 아카이브</span></h1>
              <p className="text-[#c5a059]/60 text-xs tracking-[0.2em] font-medium mt-1 uppercase">Digital Humanities AI Docent</p>
            </div>
          </div>
          <div className="hidden md:block">
            <span className="text-[10px] text-white/30 font-mono">RECORDING STATUS: LIVE</span>
          </div>
        </header>

        {/* 대화 기록 섹션 */}
        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-8 space-y-10 min-h-[500px] scroll-smooth"
        >
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} fade-up`}>
              <div className={`relative max-w-[85%] md:max-w-[75%] p-6 md:p-8 ${
                m.role === 'user' 
                  ? 'bg-[#1e293b] text-slate-200 border-l border-white/10' 
                  : 'bg-[#0a192f]/80 text-[#f5f5f0] border-l-2 border-[#c5a059]'
              }`}>
                {m.role === 'model' && (
                  <span className="absolute -top-6 left-0 text-[10px] font-bold text-[#c5a059] tracking-widest uppercase">Oral History</span>
                )}
                {m.role === 'user' && (
                  <span className="absolute -top-6 right-0 text-[10px] font-bold text-slate-500 tracking-widest uppercase">Inquiry</span>
                )}
                <p className="text-lg md:text-xl leading-relaxed font-light font-serif">
                  {m.content}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start fade-up">
              <div className="bg-transparent py-4 text-[#c5a059] text-xs font-medium tracking-[0.3em] flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-[#c5a059] animate-bounce"></div>
                  <div className="w-1 h-1 bg-[#c5a059] animate-bounce delay-75"></div>
                  <div className="w-1 h-1 bg-[#c5a059] animate-bounce delay-150"></div>
                </div>
                기억을 복원하는 중...
              </div>
            </div>
          )}
        </div>

        {/* 입력창 인터페이스 */}
        <div className="p-8 border-t border-white/10 bg-[#0a192f]/50 flex flex-col gap-4">
          <div className="flex gap-4">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="역사적 질문이나 기억을 공유해 주세요..."
              className="flex-grow bg-[#112240] border border-white/10 text-white rounded-none px-6 py-4 text-lg focus:outline-none focus:border-[#c5a059]/50 transition-all placeholder:text-white/20 font-serif"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="bg-[#c5a059] hover:bg-[#d4b06a] text-[#0a192f] px-10 py-4 font-bold text-sm tracking-widest transition-all disabled:opacity-30 uppercase"
            >
              RECORD
            </button>
          </div>
          <div className="flex justify-between items-center px-1">
            <p className="text-[9px] text-white/20 font-medium uppercase tracking-[0.2em]">
              Interacting with generative AI archive
            </p>
            <div className="flex gap-4 text-[9px] text-[#c5a059]/40 uppercase tracking-widest font-bold">
              <span>Busan Archive</span>
              <span>•</span>
              <span>Since 1876</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-12 text-center opacity-40">
        <p className="text-[10px] text-slate-400 leading-relaxed font-medium tracking-wider uppercase">
          본 서비스는 디지털 인문학 연구의 일환으로 생성형 AI를 활용하고 있습니다.<br/>
          제공되는 구술 정보는 역사적 사료와 대조를 통한 확인이 필요할 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default VoiceOfBusan;
