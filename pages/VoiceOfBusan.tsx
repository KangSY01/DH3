
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';

const VoiceOfBusan: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: '어서오이소! 내는 영도에서 평생을 보낸 할배라 한다. 부산 역사에 대해 궁금한 거 있으면 뭐든 물어보그라. 아는 대로 다 말해줄게!' }
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
    <div className="min-h-screen bg-pink-50 p-4 pt-[118px] pb-48 flex flex-col md:pt-[150px]">
      <div className="max-w-2xl mx-auto w-full flex-grow flex flex-col bg-white rounded-3xl shadow-lg overflow-hidden border border-pink-100 mt-[50px]">
        <header className="bg-pink-100 p-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm border border-pink-200">👴</div>
          <div>
            <h1 className="text-2xl font-jua text-pink-700">영도 할배 (AI 도슨트)</h1>
            <p className="text-sm text-pink-500">정감 넘치는 부산 이야기를 들어보세요</p>
          </div>
        </header>

        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-6 space-y-6 min-h-[400px]"
        >
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-5 rounded-3xl ${
                m.role === 'user' 
                  ? 'bg-pink-500 text-white rounded-tr-none shadow-md' 
                  : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200 shadow-sm'
              }`}>
                <p className="text-sm md:text-base leading-relaxed">{m.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-50 p-4 rounded-3xl animate-pulse text-slate-400 text-xs italic">
                할배가 옛날 생각을 떠올리는 중...
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="할배한테 궁금한 걸 물어보세요..."
            className="flex-grow bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm md:text-base focus:outline-none focus:ring-4 focus:ring-pink-100 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-2xl font-jua text-lg transition-all disabled:opacity-50 shadow-md active:scale-95"
          >
            보내기
          </button>
        </div>
      </div>
      <div className="text-center mt-6 px-4">
        <p className="text-[11px] text-slate-400 leading-relaxed">
          ※ 영도 할배 AI는 인공지능 기술을 활용하며, 답변에 역사적 오류가 있을 수 있으니 재미있게 참고만 해주세요.<br/>
          부산의 따뜻한 정을 느끼는 대화가 되길 바랍니다.
        </p>
      </div>
    </div>
  );
};

export default VoiceOfBusan;
