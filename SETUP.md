# 배포 & 방명록 설정 가이드

초대장 사이트는 `docs/` 폴더입니다. (`index.html`, `config.js`, `bell.png`, `cards/`, `chars/`, `faces_char/`)
> 폴더 이름을 `docs`로 둔 이유: 저장소 **전체를 push해도** GitHub Pages가 `/docs`를 사이트 루트로 바로 인식하기 때문. (다른 호스팅도 Root/Output을 `docs`로 지정하면 됨)

지금 상태로도 **바로 동작**하며, 방명록은 "데모 모드"(각자 브라우저에만 저장)로 켜져 있어요.

---

## A. 로컬에서 미리보기

```bash
cd docs
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000 접속
```

> ⚠️ `index.html`을 파일로 더블클릭(`file://`)하면 이미지가 안 뜰 수 있어요. 꼭 위처럼 서버로 여세요.

---

## B. 배포하기 (저장소 전체 push)

사이트는 **정적 파일**이라 아무 정적 호스팅에나 올리면 됩니다. 핵심은 **`docs/`를 사이트 루트로 인식**시키는 것.

### 옵션 1 — GitHub Pages (저장소가 **public**일 때 무료)

1. GitHub에서 새 저장소 생성 — 예: `mulligalli`
2. **저장소 전체**(`invi/`)를 그대로 올립니다.
   ```bash
   cd /Users/museong/Desktop/invi
   git init && git add . && git commit -m "죽음의 멀리갈리 초대장"
   git branch -M main
   git remote add origin https://github.com/<아이디>/mulligalli.git
   git push -u origin main
   ```
3. 저장소 → **Settings → Pages** → Source: `Deploy from a branch` → Branch: `main` / **`/docs`** → **Save**
4. 1~2분 뒤 `https://<아이디>.github.io/mulligalli/` 주소 생성. 끝!

> GitHub Pages는 **public 저장소**만 무료로 발행됩니다. private로 두고 싶으면 옵션 2를 쓰거나 GitHub Pro(유료)가 필요해요.

### 옵션 2 — Vercel / Netlify / Cloudflare Pages (**private 저장소도 무료**)

저장소 전체를 push한 뒤, 배포 설정에서 **루트 폴더를 `docs`로** 지정하면 됩니다.
- **Vercel**: Project → Settings → **Root Directory** = `docs` (Framework: Other, Build Command 비움)
- **Netlify**: Build & deploy → **Publish directory** = `docs`
- **Cloudflare Pages**: **Build output directory** = `docs` (Build command 비움)

> 어느 경우든 **완성된 초대장 페이지 자체는 공개 URL**입니다(손님이 링크로 열어야 하니까). "저장소 private"는 소스코드가 안 보인다는 의미일 뿐이에요. repo엔 시크릿이 없고(anon 키는 공개용) 실제 인물 사진도 포함돼 있지 않습니다.

---

## C. 방명록을 Supabase로 연결 (공용 저장)

데모 모드는 각자 브라우저에만 저장돼서 서로 안 보여요. 아래로 진짜 공용 방명록을 만듭니다.

### 1) 프로젝트 만들기
1. https://supabase.com 가입 → **New project** 생성 (Region: `Northeast Asia (Seoul)` 추천)
2. 비밀번호는 아무거나 정하고 생성 (1~2분 소요)

### 2) 테이블 만들기
좌측 **SQL Editor** → New query → 아래 붙여넣고 **Run**:

```sql
create table if not exists guestbook (
  id uuid primary key default gen_random_uuid(),
  nickname text not null check (char_length(nickname) between 1 and 20),
  message  text not null check (char_length(message)  between 1 and 300),
  created_at timestamptz not null default now()
);

alter table guestbook enable row level security;

-- 누구나 읽기 가능
create policy "read all" on guestbook
  for select using (true);

-- 누구나 작성 가능 (수정/삭제는 불가)
create policy "insert all" on guestbook
  for insert with check (true);
```

### 3) 연결 키 넣기
1. Supabase 좌측 **Project Settings → API** 에서:
   - `Project URL`  (예: `https://abcd1234.supabase.co`)
   - `anon public` 키 (아주 긴 문자열)
2. `docs/config.js` 의 `supabase` 부분을 채웁니다:

```js
supabase: {
  url: "https://abcd1234.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1Ni...",   // anon public 키
  table: "guestbook",
},
```

3. 저장 후 다시 배포(파일 교체)하면 방명록이 공용으로 바뀝니다.
   - 페이지 하단의 "데모 모드" 문구가 사라지면 연결 성공.

> `anon` 키는 공개돼도 되는 키예요(브라우저용). RLS 정책이 있어서 읽기/쓰기만 되고 함부로 지울 수 없습니다.

---

## D. 나중에 내용 바꾸기

`docs/config.js` 한 곳에서 수정합니다.
- **날짜/시간 확정** 시: `event.dateText`에 입력 (예: `"2026년 9월 20일 (토) 오후 6시"`). 비워두면 "미정 · 추후 공지"로 표시.
- 장소(`event.place`), 지도 링크(`event.mapNaver`/`event.mapGoogle`), 드레스코드(`event.dress`), 주최자(`event.host`)도 여기서 변경.
- 제목/부제("죽음의 멀리갈리" / "멀리갈리로 갈 때까지 가보기")는 `docs/index.html`에 하드코딩되어 있어요.

---

## E. 이미지 에셋 (참고)

`docs/`의 이미지는 모두 배경 제거(누끼)된 PNG이고, `assets/`의 원본 3개로 재생성할 수 있습니다.

| 배포 파일 | 원본 | 만드는 법 |
|-----------|------|-----------|
| `chars/` (전신 캐릭터 10) | `assets/char_ref.png` | 그리드 셀별로 잘라 rembg 배경제거 |
| `faces_char/` (폭죽용 얼굴 10) | `chars/*` | 머리 영역 원형 크롭(256px) |
| `cards/` (과일 카드 4) | `assets/cards.png` | 흰 카드 영역 세그멘테이션 |
| `bell.png` (할리갈리 종) | `assets/bell.jpg` | rembg 배경제거 |

> 재생성 파이프라인 상세는 `PRD.md` 3장 참고. (필요 라이브러리: rembg, Pillow, numpy, scipy)

---

## 파일 구조

```
invi/                     ← 저장소 루트 (전체 push)
├─ .gitignore
├─ docs/                  ← 사이트 루트 (GitHub Pages = /docs, 그 외 = Root/Output=docs)
│  ├─ index.html          ← 초대장 본체(오프닝 애니메이션 + 방명록, 전부 인라인)
│  ├─ config.js           ← 행사 정보 & Supabase 키
│  ├─ bell.png            ← 할리갈리 종
│  ├─ cards/              ← 과일 카드 4 (banana, lime, plum, straw)
│  ├─ chars/              ← 전신 캐릭터 10
│  └─ faces_char/         ← 폭죽용 얼굴 10
├─ assets/            ← 재생성용 원본(비배포): char_ref.png, cards.png, bell.jpg
├─ PRD.md                 ← 제품 요구사항(현재 버전 재현용)
└─ SETUP.md               ← 이 문서
```
