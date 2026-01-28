
import React, { useState } from 'react';
import { BoardPost } from '../types';

const FutureHarbor: React.FC = () => {
  const [posts, setPosts] = useState<BoardPost[]>([
    { id: '1', author: '부산꼬맹이', content: '2030 엑스포가 부산에서 열려서 전 세계 친구들이 다 놀러오면 좋겠어요! 세계인이 사랑하는 부산이 되길 꿈꿉니다.', date: '2024.05.20', likes: 12 },
    { id: '2', author: '바다사나이', content: '가덕도 신공항과 연결되어 세계 물류의 중심지로 도약하는 부산의 역동적인 미래를 응원합니다.', date: '2024.05.21', likes: 8 },
    { id: '3', author: '영도할매', content: '우리 후손들이 살기 좋은 깨끗하고 안전한 도시, 정과 사랑이 넘치는 따뜻한 부산으로 남았으면 좋겠네.', date: '2024.05.22', likes: 25 }
  ]);
  const [newPost, setNewPost] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const post: BoardPost = {
      id: Date.now().toString(),
      author: author || '무명 기록자',
      content: newPost,
      date: new Date().toLocaleDateString(),
      likes: 0
    };

    setPosts([post, ...posts]);
    setNewPost('');
    setAuthor('');
  };

  const handleLike = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  return (
    <div className="min-h-screen bg-[#0a192f] p-6 pt-[140px] pb-40 md:p-12 md:pt-[180px] transition-all duration-1000">
      <div className="max-w-4xl mx-auto">
        <header className="mb-20 text-left border-l-2 border-[#c5a059] pl-8 fade-up">
          <span className="text-[#c5a059] text-xs font-bold mb-4 block tracking-[0.5em] uppercase">Future Vision Archive</span>
          <h1 className="text-6xl md:text-8xl text-white mb-8 font-serif font-black tracking-tighter">미래의 부산</h1>
          <p className="text-slate-400 text-xl md:text-2xl font-light max-w-2xl leading-relaxed">
            여러분이 꿈꾸는 내일의 부산은 어떤 모습인가요?<br/>
            시민의 목소리로 채워가는 새로운 역사의 한 페이지입니다.
          </p>
        </header>

        {/* 제언 입력창 */}
        <div className="bg-[#112240] p-10 rounded-sm border border-white/5 mb-20 fade-up shadow-2xl">
          <h2 className="text-[#c5a059] text-sm font-bold mb-8 tracking-[0.2em] uppercase font-serif">Add Your Vision</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <input 
                type="text" 
                placeholder="필명" 
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="bg-[#0a192f] border border-white/10 text-white rounded-none px-6 py-4 text-lg focus:outline-none focus:border-[#c5a059]/50 transition-all placeholder:text-white/20 font-serif"
              />
              <input 
                type="text" 
                placeholder="부산의 미래에게 전하는 메시지..." 
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="md:col-span-2 bg-[#0a192f] border border-white/10 text-white rounded-none px-6 py-4 text-lg focus:outline-none focus:border-[#c5a059]/50 transition-all placeholder:text-white/20 font-serif"
              />
              <button className="bg-[#c5a059] text-[#0a192f] font-bold px-6 py-4 hover:bg-[#d4b06a] transition-all tracking-[0.2em] uppercase text-sm">
                ARCHIVE ⛵
              </button>
            </div>
            <p className="text-[10px] text-white/20 uppercase tracking-widest font-medium">
              Your message will be preserved in the digital humanities vision archive.
            </p>
          </form>
        </div>

        {/* 기록물 리스트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post, idx) => (
            <div 
              key={post.id} 
              className="bg-[#112240]/40 p-10 border-b border-white/5 hover:bg-[#112240] transition-all group flex flex-col justify-between"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div>
                <div className="flex justify-between items-center mb-10">
                  <span className="text-[#c5a059] text-xs font-bold bg-[#c5a059]/10 px-4 py-1.5 rounded-none border border-[#c5a059]/30 tracking-widest">
                    {post.author}
                  </span>
                  <span className="text-[10px] text-white/20 font-mono tracking-tighter">{post.date}</span>
                </div>
                <p className="text-white text-xl md:text-2xl leading-relaxed font-serif font-light mb-12 min-h-[5rem] group-hover:text-slate-100">
                  "{post.content}"
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-8 border-t border-white/5">
                <button 
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-3 text-[11px] font-bold text-[#c5a059]/60 hover:text-[#c5a059] transition-all uppercase tracking-widest"
                >
                  <span className="text-lg">✨</span> 응원하기
                </button>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-serif font-black text-[#c5a059]">{post.likes}</span>
                  <span className="text-[10px] text-white/20 uppercase font-bold tracking-tighter">Support</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto mt-32 text-center opacity-40">
        <p className="text-[10px] text-slate-400 leading-relaxed font-medium tracking-wider uppercase">
          미래의 부산 비전 아카이브는 시민의 상상력과 소망을 소중히 보존합니다.<br/>
          함께 그려나가는 부산의 내일은 오늘의 우리가 남기는 가장 빛나는 유산입니다.
        </p>
      </div>
    </div>
  );
};

export default FutureHarbor;
