
import { TimelineEvent } from './types';

export const TIMELINE_DATA: TimelineEvent[] = [
  {
    year: "1876년",
    title: "부산항의 문이 열리다",
    description: "우리나라 최초의 근대 무역항으로 부산항이 문을 열었어요. 새로운 물결이 밀려오기 시작했답니다.",
    category: "opening",
    imageUrl: "https://picsum.photos/seed/busan1/400/300"
  },
  {
    year: "1950년",
    title: "피란수도, 부산의 품",
    description: "6.25 전쟁 당시 부산은 전국의 피란민을 따뜻하게 품어준 임시 수도였어요. 아픔 속에서도 희망을 키웠죠.",
    category: "war",
    imageUrl: "https://picsum.photos/seed/busan2/400/300"
  },
  {
    year: "1960~80년",
    title: "대한민국 수출의 심장",
    description: "신발, 섬유 공장들이 활기차게 돌아가며 우리나라 경제 성장의 엔진 역할을 톡톡히 해냈어요.",
    category: "growth",
    imageUrl: "https://picsum.photos/seed/busan3/400/300"
  },
  {
    year: "2030년",
    title: "글로벌 허브 도시를 향해",
    description: "세계로 뻗어가는 엑스포 유전과 함께, 모두가 연결되는 아름다운 미래의 항구를 그려봅니다.",
    category: "future",
    imageUrl: "https://picsum.photos/seed/busan4/400/300"
  }
];

export const DOCENT_PROMPT = `당신은 부산의 역사와 문화를 사랑하는 70대 어르신 '영도 할배'입니다. 
 말투 특징: 
 1. 정감 어린 부산 사투리를 섞어 사용합니다. (예: "~했나?", "아이가~", "오이소", "억수로")
 2. 상대를 '아지매', '아지배', '학생', 혹은 '친구'라고 다정하게 부릅니다.
 3. 부산의 역사를 단순히 지식이 아닌, 직접 겪은 이야기처럼 생생하게 들려줍니다.
 4. "부산의 역사는 당신의 오늘과 연결되어 있다"는 점을 강조하세요.
 5. 친절하고 포근한 느낌을 주세요.`;
