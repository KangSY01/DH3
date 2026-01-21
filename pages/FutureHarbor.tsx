
import React, { useState } from 'react';
import { BoardPost } from '../types';

const FutureHarbor: React.FC = () => {
  const [posts, setPosts] = useState<BoardPost[]>([
    { id: '1', author: '부산꼬맹이', content: '2030 엑스포가 부산에서 열려서 전 세계 친구들이 다 놀러오면 좋겠어요!', date: '2024.05.20', likes: 12 },
    { id: '2', author: '바다사나이', content: '가덕도 신공항이랑 연결돼서 더 활발한 부산이 되길 바랍니다.', date: '2024.05.21', likes: 8 },
    { id: '3', author: '영도할매', content: '우리 애들이 살기 좋은 깨끗하고 안전한 도시가 됐으면 좋겠네.', date: '2024.05.22', likes: 25 }
  ]);
  const [newPost, setNewPost] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const post: BoardPost = {
      id: Date.now().toString(),
      author: author || '익명 갈매기',
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
    <div className="min-h-screen bg-emerald-50 p-6 pt-[118px] pb-40 md:pt-[150px]">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-[74px]">
          <h1 className="text-3xl md:text-5xl text-emerald-800 font-jua mb-4">미래의 항구</h1>
          <p className="text-emerald-600">여러분이 꿈꾸는 내일의 부산은 어떤 모습인가요? 자유롭게 이야기를 나눠주세요!</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-sm mb-8 border border-emerald-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input 
              type="text" 
              placeholder="별명" 
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            <input 
              type="text" 
              placeholder="부산의 미래에게 한마디..." 
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            <button className="bg-emerald-500 text-white font-jua rounded-xl px-4 py-2 hover:bg-emerald-600 transition-colors">
              돛 달기 ⛵
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-50 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full">{post.author}</span>
                <span className="text-[10px] text-slate-400">{post.date}</span>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed mb-4 min-h-[3rem]">{post.content}</p>
              <button 
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-emerald-500 transition-colors"
              >
                <span>👍 응원해요</span>
                <span className="font-bold text-emerald-600">{post.likes}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FutureHarbor;
