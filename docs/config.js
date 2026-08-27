// ============================================================
//  죽음의 멀리갈리 — 설정 파일
//  이 파일만 고치면 내용/방명록 연결을 바꿀 수 있어요.
// ============================================================

window.INVITE_CONFIG = {
  // ---- 행사 정보 ----
  event: {
    title: "죽음의 멀리갈리",
    host: "MK와 아이들",
    // 날짜/시간이 정해지면 아래를 채우세요. 비워두면 "미정"으로 표시됩니다.
    // 예: dateText: "2026년 9월 20일 (토) 오후 6시"
    dateText: "",
    place: "뚝섬 한강공원",
    // 지도 링크 (네이버/구글). 원하는 지점으로 바꿔도 됩니다.
    mapNaver: "https://map.naver.com/p/search/뚝섬한강공원",
    mapGoogle: "https://www.google.com/maps/search/?api=1&query=뚝섬한강공원",
    intro: "멀리갈리로 갈 때까지 가보기",
    dress: "작업복 & 보호대",
  },

  // ---- 포스터 ----
  // docs/ 안에 포스터 이미지를 넣고 파일명을 적으세요. (예: "poster.png", "poster.jpg")
  // 파일이 없거나 src를 비우면 아래 초대장 텍스트 화면으로 자동 대체됩니다.
  poster: {
    src: "poster.jpg",
    alt: "죽음의 멀리갈리 초대 포스터",
    download: true,      // 포스터 이미지 저장 링크 표시 여부
  },

  // ---- 방명록(Supabase) 연결 ----
  // 아직 Supabase를 안 만들었으면 그대로 두세요.
  // 비어 있으면 자동으로 "데모 모드"(이 브라우저에만 저장)로 동작합니다.
  supabase: {
    url: "",       // 예: "https://xxxxxxxx.supabase.co"
    anonKey: "",   // 예: "eyJhbGciOi...."
    table: "guestbook",
  },
};
