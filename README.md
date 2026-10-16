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

## 연결된 Firebase 환경

- 운영 사이트: https://portfolio-10340.web.app
- Firebase 프로젝트 및 Hosting 사이트 ID: `portfolio-10340`
- 로컬 설정: `.firebaserc` (Git 제외)
- GitHub Actions Variable: `FIREBASE_PROJECT_ID`
- GitHub Actions Secret: `FIREBASE_SERVICE_ACCOUNT`
- 배포용 서비스 계정: `github-portfolio-deploy@portfolio-10340.iam.gserviceaccount.com`

`main`에 푸시하면 빌드를 거쳐 위 Hosting 사이트에 배포합니다. Google 계정으로 직접 배포할 때는 `npm.cmd run deploy`를 사용합니다.

다른 PC의 로컬 설정은 아래처럼 생성합니다:

```powershell
npm.cmd run firebase:configure -- portfolio-10340
npm.cmd run firebase -- login --interactive
```

자격 증명 교체와 새 환경 연결은 **[Firebase 연결 및 CI/CD 가이드](docs/FIREBASE_SETUP.md)**를 참고하세요. 인증 JSON은 GitHub Secret에 저장하며 소스에 포함하지 않습니다.

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
