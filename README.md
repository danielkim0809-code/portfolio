# Daniel Kim · Portfolio

Vite와 JavaScript로 만든 반응형 포트폴리오 시작 페이지입니다. Firebase Hosting을 사용하며 GitHub Actions로 빌드와 배포를 자동화합니다.

**실제 작업 경로:** `C:\dev\portfolio`

**저장소:** https://github.com/danielkim0809-code/portfolio

## 로컬 실행

Node.js 24 이상을 사용합니다. PowerShell 실행 정책으로 `npm`이 차단되면 `npm.cmd`를 사용하세요.

```powershell
cd C:\dev\portfolio
npm.cmd ci
npm.cmd run dev
```

표시되는 로컬 주소를 엽니다. 기본값은 `http://127.0.0.1:5173`입니다.

```powershell
npm.cmd run build      # 배포 파일을 dist/에 생성
npm.cmd run preview    # 빌드 결과 미리보기
```

## Firebase 최초 설정

**[Firebase 연결 및 CI/CD 가이드](docs/FIREBASE_SETUP.md)**를 순서대로 따라가세요.

1. Firebase 프로젝트를 생성하고 Hosting을 시작합니다.
2. `npm.cmd run firebase:configure -- 실제-프로젝트-ID`로 로컬 `.firebaserc`를 생성합니다.
3. 배포용 서비스 계정의 실제 JSON 키를 발급합니다.
4. GitHub에 Secret `FIREBASE_SERVICE_ACCOUNT`와 Variable `FIREBASE_PROJECT_ID`를 등록합니다.
5. GitHub Actions에서 `CI and Firebase Hosting`을 수동 실행하거나 `main`에 푸시합니다.

Firebase 프로젝트 ID가 등록되기 전에는 빌드만 실행되고 배포 작업은 건너뜁니다. 등록 후에는 인증 정보 누락·불일치를 배포 오류로 표시합니다. 저장소에 설정을 올리는 것만으로 Firebase 프로젝트가 생성되지는 않습니다.

## CI/CD 흐름

```text
Pull request → npm ci → Vite build → 빌드 결과 보관
main push    → npm ci → Vite build → 빌드 결과 보관 → Firebase Hosting live 배포
```

PR에서는 빌드 검증만 합니다. 배포는 `main`에서만 진행하며, PR 미리보기 배포는 포함하지 않습니다. 빌드한 동일한 `dist` 아티팩트를 배포합니다.

## 내용 수정

| 파일                                     | 수정할 내용                                            |
| ---------------------------------------- | ------------------------------------------------------ |
| `index.html`                             | 이름, 소개, 연락 링크, 제목·메타 설명                  |
| `src/content.js`                         | 프로젝트 제목, 설명, 태그, GitHub 주소                 |
| `src/style.css`                          | 색상, 간격, 반응형 레이아웃                            |
| `public/favicon.svg`                     | 파비콘                                                 |
| `firebase.json`                          | Hosting 디렉터리, 캐시·응답 헤더, 로컬 에뮬레이터 포트 |
| `.firebaserc.example`                    | 로컬 프로젝트 설정 JSON 예시                           |
| `docs/firebase-credentials.example.json` | 인증 JSON 구조 예시. 인증 불가                         |
| `.github/workflows/firebase-hosting.yml` | GitHub Actions 빌드·배포 설정                          |

두 번째 프로젝트는 **레이아웃용 예시**입니다. 실적을 의미하지 않으며 실제 작업으로 교체하세요. 연락처는 제공된 GitHub 프로필을 사용합니다. 글꼴은 Google Fonts를 사용하고 네트워크 연결이 없으면 시스템 글꼴로 표시됩니다.

현재 구성은 정적 홈페이지 + Firebase Hosting입니다. Firestore, Authentication, Analytics 및 서버 API는 아직 사용하지 않으므로 브라우저용 Firebase SDK 설정은 필요하지 않습니다. 나중에 추가할 때 웹 앱 설정을 별도로 연결하세요.

## 변경 사항 올리기

```powershell
git add .
git commit -m "Update portfolio"
git push origin main
```

실제 서비스 계정 JSON은 GitHub Secret에만 넣으세요. `.env`, `.firebaserc`, `secrets/`와 일반적인 서비스 계정 키 파일명은 `.gitignore`로 제외합니다. 실키를 `public/` 또는 `src/`에 넣으면 안 됩니다.
