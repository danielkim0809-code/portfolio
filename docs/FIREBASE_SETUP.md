# Firebase Hosting 연결 및 GitHub Actions 설정

현재 운영 프로젝트는 `portfolio-10340`, 사이트 주소는 https://portfolio-10340.web.app 입니다. 배포 계정은 `github-portfolio-deploy@portfolio-10340.iam.gserviceaccount.com`이며, 인증 키는 GitHub의 `FIREBASE_SERVICE_ACCOUNT` Secret에서 관리합니다. 아래는 새 환경 연결 및 인증 정보 재설정 절차입니다. 이미 작성한 `firebase.json`과 워크플로를 사용하므로 `firebase init`으로 파일을 다시 생성할 필요가 없습니다.

## 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트를 추가합니다.
2. 표시 이름은 자유롭게 정하되 **프로젝트 ID**를 기록합니다. 표시 이름과 프로젝트 ID는 다를 수 있습니다.
3. 이 정적 사이트에는 Google Analytics가 필수는 아닙니다.
4. 프로젝트의 **빌드 → Hosting**에서 시작 절차를 진행합니다. 이 구성은 Firebase **Hosting**을 사용합니다. App Hosting 백엔드는 만들 필요가 없습니다.

이후 설명의 `YOUR_PROJECT_ID`는 콘솔에서 확인한 실제 프로젝트 ID로 바꿉니다.

## 2. 로컬 프로젝트 JSON 생성

PowerShell:

```powershell
cd C:\dev\portfolio
npm.cmd ci
npm.cmd run firebase -- login --interactive
npm.cmd run firebase -- projects:list
npm.cmd run firebase:configure -- YOUR_PROJECT_ID
```

마지막 명령이 아래 형태의 `.firebaserc`를 자동 생성합니다. 프로젝트가 실제 존재하는지는 앞의 `projects:list` 결과로 확인하세요.

```json
{
  "projects": {
    "default": "YOUR_PROJECT_ID"
  }
}
```

`.firebaserc`는 로컬 설정으로 Git에서 제외됩니다. GitHub Actions는 별도의 저장소 변수로 프로젝트를 선택하므로 이 파일 없이도 배포합니다. `firebase.json`은 이미 생성되어 있으며 빌드 결과인 `dist/`만 배포합니다. 없는 경로는 `public/404.html`에서 복사된 404 페이지를 표시합니다.

로컬에서 최초 배포를 확인할 수 있습니다:

```powershell
npm.cmd run deploy
```

명령이 반환한 Hosting URL에서 확인합니다. 프로젝트 기본 사이트의 일반적인 주소는 `https://YOUR_PROJECT_ID.web.app`입니다.

로컬 Hosting 에뮬레이터로 먼저 확인하려면:

```powershell
npm.cmd run build
npm.cmd run firebase -- emulators:start --only hosting
```

접속 주소는 `http://127.0.0.1:5000`입니다.

## 3. GitHub 배포용 인증 JSON 발급

`docs/firebase-credentials.example.json`은 **구조 설명용이며 인증에 사용할 수 없습니다.** 실키는 Google이 발급해야 하며 임의로 생성한 문자열로 대체할 수 없습니다.

1. [Google Cloud 서비스 계정](https://console.cloud.google.com/iam-admin/serviceaccounts)을 열고, 상단에서 같은 Firebase 프로젝트를 선택합니다.
2. 전용 서비스 계정을 생성합니다. 예: `github-portfolio-deploy`.
3. 이 사이트의 live Hosting 배포에 필요한 역할을 부여합니다:
   - **Firebase Hosting 관리자** (`roles/firebasehosting.admin`)
   - **API 키 뷰어** (`roles/serviceusage.apiKeysViewer`)
   - **서비스 사용량 소비자** (`roles/serviceusage.serviceUsageConsumer`)
4. 계정 상세 → **키 → 키 추가 → 새 키 만들기 → JSON**에서 다운로드합니다.
5. 다운로드한 JSON 전체를 다음 단계의 GitHub Secret 값으로 등록합니다.

현재 구성은 Auth와 서버 재작성을 사용하지 않습니다. 추후 PR 미리보기와 Firebase Auth를 함께 사용하면 인증 도메인 등록에 추가 역할이 필요할 수 있으므로 [Firebase 배포 Action의 서비스 계정 안내](https://github.com/FirebaseExtended/action-hosting-deploy/blob/main/docs/service-account.md)를 확인하세요.

인증 JSON은 `private_key`가 포함된 비밀입니다. 다운로드 폴더 등 저장소 밖에서 관리하고, 채팅·커밋·웹 소스·`public/`에 넣지 마세요. 조직 정책에서 서비스 계정 키 생성을 금지하는 경우 관리자가 Workload Identity Federation 기반 인증을 구성해야 합니다. 이 워크플로는 JSON 키 방식을 사용합니다.

## 4. GitHub Secret과 Variable 등록

[저장소 Actions 설정](https://github.com/danielkim0809-code/portfolio/settings/secrets/actions)에서 아래 값을 등록합니다. 저장소의 **Settings → Secrets and variables → Actions** 메뉴입니다.

| 구분                                | 이름                       | 값                                          |
| ----------------------------------- | -------------------------- | ------------------------------------------- |
| Secrets → New repository secret     | `FIREBASE_SERVICE_ACCOUNT` | 다운로드한 서비스 계정 JSON의 **전체 내용** |
| Variables → New repository variable | `FIREBASE_PROJECT_ID`      | 실제 Firebase 프로젝트 ID                   |

JSON 경로, 파일명 또는 웹 앱의 `apiKey`를 Secret에 넣으면 인증되지 않습니다. 발급한 JSON의 `project_id`와 Variable 값은 같아야 합니다. `GITHUB_TOKEN`은 GitHub가 제공하므로 따로 생성할 필요가 없습니다.

저장소 Actions가 비활성화되어 있으면 Settings → Actions → General에서 활성화합니다. 배포에는 `FirebaseExtended/action-hosting-deploy`가 실행 가능해야 합니다.

## 5. 첫 자동 배포

1. [저장소 Actions](https://github.com/danielkim0809-code/portfolio/actions)를 엽니다.
2. `CI and Firebase Hosting` → **Run workflow** → `main`을 선택해 실행합니다.
3. `Build portfolio`와 `Deploy live site`가 모두 성공하는지 확인합니다.
4. 배포 로그 및 실행 Summary에 표시된 URL을 엽니다.

이후에는 `main`에 푸시하거나 PR을 병합하면 자동 배포합니다. PR에서는 인증 키를 사용하지 않고 빌드만 검증합니다. 수동 실행도 `main`에서만 배포됩니다.

프로젝트 ID가 아직 없으면 빌드만 성공하고 배포는 **skipped**입니다. 이를 배포 성공으로 해석하면 안 됩니다. ID 등록 이후 Secret이 누락·불일치하면 배포가 실패하며 오류 메시지를 표시합니다. 변수나 Secret 변경만으로 새 실행이 생기지는 않으므로 **Run workflow**를 눌러주세요.

## 6. 자주 발생하는 문제

| 증상                              | 확인할 항목                                                                               |
| --------------------------------- | ----------------------------------------------------------------------------------------- |
| Deploy가 skipped                  | Repository Variable `FIREBASE_PROJECT_ID`가 있는지, 실행 브랜치가 `main`인지 확인         |
| 인증 JSON 오류                    | Secret에 실제 JSON 전체를 등록했는지 확인. 예시 JSON은 인증 불가                          |
| 프로젝트 불일치                   | JSON의 `project_id`와 Variable을 비교                                                     |
| 403 / permission denied           | 선택한 프로젝트, 서비스 계정의 Hosting 관리자·API 키 뷰어 역할, 콘솔의 API 활성 상태 확인 |
| Hosting site가 없음               | Firebase Console의 Hosting 시작 절차와 최초 로컬 배포를 완료                              |
| npm.ps1 실행 정책 오류            | 이 문서처럼 `npm.cmd` 사용                                                                |
| push 인증 또는 workflow 권한 오류 | Git 자격 증명을 다시 인증. PAT를 쓰면 저장소 쓰기 및 workflow 변경 권한 확인              |
| 홈페이지 내용이 예시 상태         | `index.html`, `src/content.js`를 편집한 뒤 푸시                                           |

배포 이력과 롤백은 Firebase Console의 Hosting 릴리스 화면에서 관리할 수 있습니다. 커스텀 도메인은 Hosting의 도메인 연결 메뉴에서 추가합니다.

## 공식 문서

- [Firebase Hosting 시작하기](https://firebase.google.com/docs/hosting/quickstart)
- [GitHub Actions 연동](https://firebase.google.com/docs/hosting/github-integration)
- [Hosting JSON 설정](https://firebase.google.com/docs/hosting/full-config)
- [배포 Action의 서비스 계정 설정](https://github.com/FirebaseExtended/action-hosting-deploy/blob/main/docs/service-account.md)
