
import React, { useState } from 'react';

type GameStep = 'start' | 'ingredient' | 'broth' | 'topping' | 'finish';

const MarketGame: React.FC = () => {
  const [step, setStep] = useState<GameStep>('start');
  const [choices, setChoices] = useState<string[]>([]);

  const handleChoice = (choice: string) => {
    setChoices([...choices, choice]);
    if (step === 'ingredient') setStep('broth');
    else if (step === 'broth') setStep('topping');
    else if (step === 'topping') setStep('finish');
  };

  const resetGame = () => {
    setStep('start');
    setChoices([]);
  };

  return (
    <div className="min-h-screen pastel-yellow p-6 pt-[118px] pb-40 flex flex-col items-center md:pt-[150px]">
      <div className="max-w-2xl w-full bg-white/90 backdrop-blur rounded-3xl shadow-xl overflow-hidden mt-[74px] mb-12">
        <div className="p-10 text-center">
          {step === 'start' && (
            <div className="space-y-8">
              <span className="text-8xl block mb-4">🍜</span>
              <h1 className="text-3xl font-jua text-amber-900">웅성웅성 시장통: 밀면 만들기</h1>
              <p className="text-slate-600 leading-relaxed">
                6.25 전쟁 때, 메밀이 귀해지자 피란민들이 구호 물품이었던 '밀가루'로 면을 뽑아 먹었던 것이 바로 밀면의 시작이었단다.<br/>
                할배랑 같이 맛있는 밀면 한 그릇 말아보겠나?
              </p>
              <button 
                onClick={() => setStep('ingredient')}
                className="bg-amber-400 hover:bg-amber-500 text-white font-jua px-10 py-5 rounded-2xl text-2xl shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                밀면 만들기 시작!
              </button>
            </div>
          )}

          {step === 'ingredient' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-jua text-amber-700">1단계: 면을 뽑아보자!</h2>
              <p className="text-slate-600">피란 시절, 귀한 메밀 대신 무엇을 섞어 면을 만들었을까?</p>
              <div className="grid grid-cols-2 gap-6 mt-4">
                <button onClick={() => handleChoice('밀가루')} className="bg-slate-50 p-8 rounded-2xl border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 transition-all font-jua text-lg">밀가루 (정답!)</button>
                <button onClick={() => handleChoice('초콜릿')} className="bg-slate-50 p-8 rounded-2xl border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 transition-all font-jua text-lg">초콜릿</button>
              </div>
            </div>
          )}

          {step === 'broth' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-jua text-amber-700">2단계: 육수를 부어보자!</h2>
              <p className="text-slate-600">부산 밀면의 핵심! 시원한 육수를 선택해봐.</p>
              <div className="grid grid-cols-2 gap-6 mt-4">
                <button onClick={() => handleChoice('한방 육수')} className="bg-slate-50 p-8 rounded-2xl border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 transition-all font-jua text-lg">한방 육수</button>
                <button onClick={() => handleChoice('뜨거운 커피')} className="bg-slate-50 p-8 rounded-2xl border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 transition-all font-jua text-lg">뜨거운 커피</button>
              </div>
            </div>
          )}

          {step === 'topping' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-jua text-amber-700">3단계: 고명을 얹어보자!</h2>
              <p className="text-slate-600">마지막으로 매콤한 양념과 고기를 얹으면 완성!</p>
              <div className="grid grid-cols-2 gap-6 mt-4">
                <button onClick={() => handleChoice('양념장')} className="bg-slate-50 p-8 rounded-2xl border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 transition-all font-jua text-lg">비법 양념장</button>
                <button onClick={() => handleChoice('사탕')} className="bg-slate-50 p-8 rounded-2xl border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 transition-all font-jua text-lg">알록달록 사탕</button>
              </div>
            </div>
          )}

          {step === 'finish' && (
            <div className="space-y-8">
              <span className="text-8xl block mb-4">✨🍜✨</span>
              <h2 className="text-3xl font-jua text-green-600">우와! 완성됐단다!</h2>
              <div className="bg-amber-50 p-8 rounded-2xl text-left border border-amber-100">
                <p className="text-slate-700 italic font-medium mb-4">"나만의 레시피: {choices.join(', ')}"</p>
                <p className="text-slate-800 leading-relaxed text-lg">
                  {choices.includes('밀가루') && choices.includes('한방 육수') && choices.includes('양념장') 
                    ? "아따~ 제대로 만들었네! 부산 사람 다 됐다! 이 밀면 한 그릇에 피란민들의 지혜와 회복의 힘이 담겨있단다. 다음엔 진짜 부산에 와서 한 그릇 묵자!"
                    : "어이쿠, 맛이 좀 희한하겠는데? 그래도 네가 정성껏 만들었으니 부산 바다가 널 반겨줄 끼다! 밀가루랑 한방 육수를 섞어야 진짜 밀면이 된단다."}
                </p>
              </div>
              <button 
                onClick={resetGame}
                className="bg-slate-800 text-white font-jua px-10 py-4 rounded-xl text-xl shadow-lg hover:bg-slate-700 transition-all"
              >
                다시 만들기
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="max-w-2xl w-full text-slate-500 text-sm bg-white/50 p-6 rounded-2xl backdrop-blur-sm border border-white/50 mb-8">
        <p className="font-bold mb-2">💡 부산 역사 상식:</p>
        밀면은 함경남도 함흥 출신의 피란민들이 부산의 우암동 등지에서 냉면의 메밀 대신 미군의 원조 품목이었던 밀가루를 활용해 고향의 맛을 재현하려 애쓰며 탄생한 '눈물과 희망'의 음식이란다.
      </div>
    </div>
  );
};

export default MarketGame;
