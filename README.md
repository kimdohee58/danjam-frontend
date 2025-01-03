# 단잠 front: 벤치마킹 - Airbnb

## 프로젝트 개요
이 프로젝트는 Airbnb를 벤치마킹하여 개발한 웹 애플리케이션입니다. React와 Spring Boot를 분리하여 프론트엔드와 백엔드를 각각 개발하며, 사용자가 쉽게 예약하고 관리할 수 있는 플랫폼을 구현했습니다.
- 기간 : 24.08.01 ~ 24.08.19 (약 3주)
- 인원 : 5명
- 담당 기능
  - DB 초기 세팅
  - 데이터 크롤링
  - 협업 툴 관리
  - 회원가입/로그인
  - 숙소 검색 및 필터링

## 주요 기능
- **로그인 기능**: 로그인은 FormLogin을 통해 구현됩니다.
- **검색 및 필터링 기능**: 예약 정보를 기반으로 숙소를 검색하고 필터링할 수 있습니다.
- **예약 시스템**: 캘린더와 날짜 선택 기능을 통해 예약을 관리할 수 있습니다.
- **관리 시스템**: 예약 현황을 확인하고 관리하는 기능을 제공합니다.
- **반응형 디자인**: Styled Components를 활용하여 반응형 웹을 구현했습니다.

## 기술 스택
### 1. **백엔드**:
   - **Spring Boot**: 안정적인 REST API 서버 구현
   - **Gradle**: 빌드 도구로 Gradle을 사용하여 프로젝트 관리
   - **MySQL**: 데이터베이스 관리
   - **Spring Security**: 로그인 및 인증을 위한 보안 관리 (FormLogin)
   - **JPA**: 데이터베이스 ORM을 위한 JPA 사용

### 2. **프론트엔드**:
   - **React**: UI를 위한 JavaScript 라이브러리
   - **Styled Components** : 스타일링을 위한 CSS 라이브러리
   - **react-calendar**: 예약 날짜를 선택할 수 있는 캘린더 컴포넌트
   - **react-datepicker**: 날짜 선택을 위한 라이브러리
   - **date-fns**: 날짜를 처리하기 위한 유틸리티 라이브러리

## 설치 방법

### 1. **백엔드 (Spring Boot)**
1. 레포지토리 클론하기:
   ```bash
   git clone https://github.com/kimdohee58/danjam-backend.git
   ```
2. 프로젝트 디렉토리로 이동:
   ```bash
   cd danjam-backend
   ```
3. Gradle 빌드:
   ```bash
   ./gradlew build
   ```
4. MySQL 설정: Docker 리포지토리에서 이미지를 가져와 설정을 완료합니다.
   ```
   docker pull kimdohee58/danjam-backend:1.0
   ```
5. 서버 실행:
   ```bash
   ./gradlew bootRun
   ```
### 2. **프론트엔드 (React)**
1. 레포지토리 클론하기:
   ```bash
   git clone https://github.com/kimdohee58/danjam-front.git
   ```
2. 프로젝트 디렉토리로 이동:
   ```bash
   cd danjam-front
   ```
3. 의존성 설치:
   ```bash
   npm install
   ```
4. 서버 실행:
   ```bash
   npm start
   ```
5. 캘린더 및 날짜 선택 기능 설치
- react-calendar 설치:
   ```bash
   npm install react-calendar
   ```
- react-datepicker 설치:
   ```bash
   npm install react-datepicker
   ```
- date-fns 설치:
   ```bash
   npm install date-fns
   ```

## 사용법
서버가 실행되면 웹 브라우저에서 아래 주소로 접속할 수 있습니다:

- http://localhost:3000 (프론트엔드)
- http://localhost:8080 (백엔드)

## 문의
프로젝트에 대해 질문이 있거나 피드백을 주고 싶다면 kimdohee58@gmail.com으로 연락 주세요.
