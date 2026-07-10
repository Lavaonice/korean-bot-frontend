/* =====================================================================
   Brevity Companion — Shared Localization Layer (en / ko)
   ---------------------------------------------------------------------
   Loaded on every page (in <head>, after theme.js). Provides:

     - t(key, vars)        -> translated string for the current language
     - getLang()           -> "en" | "ko"
     - applyLang(lang)     -> paints every [data-i18n] element, sets
                             <html lang>, and fires "brevity:langchange"
     - setLang(lang)       -> persists + applies + fires event

   How pages opt in:
     • Add <script src="i18n.js"></script> in <head> (after theme.js).
     • Mark static text with  data-i18n="some.key"   (textContent is set).
       The brand name is a reserved key:  data-i18n="brand"
       -> "Brevity Companion" / "브리비티 컴패니언".
     • <title> may also carry data-i18n.
     • Dynamic (JS-built) strings should call t("key") and re-render on
       the "brevity:langchange" window event.

   Brand rule: "Brevity Companion" is rendered as a Korean-script
   TRANSLITERATION (브리비티 컴패니언), NOT a meaning translation. Other
   proper nouns / product / tech terms (Kimchi Points, PhonePe, Supabase,
   Yonsei, Google, Cloudflare, Hugging Face) stay in English.
   ===================================================================== */
(function () {
    "use strict";

    var SETTINGS_KEY = "brevity_settings";

    /* ---------------- Dictionary ---------------- */
    var I18N = {
        en: {
            "brand": "Brevity Companion",

            /* Shared sidebar */
            "menu": "Menu",
            "nav.practice": "Practice Hub",
            "nav.store": "Kimchi Points Store",
            "nav.profile": "My Profile",
            "nav.about": "About Engine",
            "nav.privacy": "Privacy Policy",
            "nav.terms": "Terms of Service",
            "nav.refund": "Refund Policy",
            "nav.logout": "Log Out",

            /* Login (index.html) */
            "login.title": "Login - Brevity Companion",
            "login.subtitle": "Log in to continue your Korean journey",
            "login.email": "Email Address",
            "login.password": "Password",
            "login.enter": "Enter Platform",
            "login.newStudent": "New student?",
            "login.createAccount": "Create Account",
            "login.terms": "Terms of Service",
            "login.privacy": "Privacy Policy",
            "login.legalFooter": "By clicking Enter Platform, you acknowledge agreement to our",
            "login.and": "&",
            "login.fillCreds": "Please fill out both credentials fields.",
            "login.authenticating": "Authenticates session...",
            "login.failed": "Login Failed: ",

            /* Dashboard */
            "dash.title": "Brevity Companion - Dashboard",
            "dash.selectMode": "Select your evaluation mode",
            "dash.kpWarning": "Not enough Kimchi Points! (10 KP required per session).",
            "dash.topUp": "Top up here",
            "dash.casual": "Casual Mode",
            "dash.casualDesc": "Relaxed practice, perfect for initial vocabulary familiarization.",
            "dash.practice": "Practice Mode",
            "dash.practiceDesc": "Structured drills and exercises based on specific textbook chapters.",
            "dash.viva": "Viva Simulator",
            "dash.vivaDesc": "A real-time oral exam spanning a custom cluster of chapters.",
            "dash.enter": "Enter (-10 KP)",
            "dash.setup": "Setup (-10 KP)",
            "dash.noticeboard": "Noticeboard",
            "dash.close": "Close",
            "dash.noNotices": "No new notices.",
            "dash.notice.welcome.title": "Welcome to Brevity Companion!",
            "dash.notice.welcome.body": "Practice Korean with AI-driven evaluation across Casual, Practice, and Viva modes. Earn streaks and track your progress.",
            "dash.notice.kp.title": "10 KP per session",
            "dash.notice.kp.body": "Each practice session costs 10 Kimchi Points. Top up anytime from the Kimchi Points Store.",
            "dash.notice.profile.title": "Complete your profile",
            "dash.notice.profile.body": "Add your city and institute in My Profile to personalize your learning experience.",

            /* Store */
            "store.title": "Store - Brevity Companion",
            "store.heading": "Store",
            "store.topUpHeading": "Kimchi Points Top-Up",
            "store.adminTitle": "Admin Account — Unlimited Access",
            "store.adminNote": "You have infinite Kimchi Points and no session gating. No top-up required.",
            "store.supportEngine": "Support the Brevity Engine and unlock practice time",
            "store.f1": "Bypass 36-minute cooldown locks",
            "store.f2": "Unrestricted audio generation",
            "store.f3": "Access advanced Viva chapter clusters",
            "store.f4": "Prioritized server routing (Zero Lag)",
            "store.f5": "Directly support cloud infrastructure",
            "store.f6": "Unlock premium vocabulary analytics",
            "store.addKP": "Add Kimchi Points",
            "store.premiumHeading": "Brevity Premium",
            "store.premiumBadge": "Premium Pass",
            "store.weeklyPass": "Weekly Premium Pass",
            "store.premiumDesc": "Skip the queue and practice without interruption. Premium gives you priority server routing and removes the standard cooldown lock for 7 days.",
            "store.tag.fasterQueue": "Faster queue joining",
            "store.tag.noCooldown": "No 36-min cooldown",
            "store.tag.priorityRouting": "Priority routing",
            "store.getPremium": "Get Premium",
            "store.billedOnce": "billed once, valid 7 days",
            "store.checkout": "Checkout",
            "store.checkoutSub": "Review your order before paying",
            "store.confirmTopUp": "Confirm Top-Up",
            "store.confirmTopUpSub": "Kimchi Points are added to your account instantly after payment.",
            "store.confirmPremium": "Confirm Premium Pass",
            "store.confirmPremiumSub": "Premium activates instantly and lasts 7 days from purchase.",
            "store.total": "Total",
            "store.payPhonePe": "Pay with PhonePe",
            "store.modalNote": "You'll be redirected to PhonePe to complete payment securely. Your balance updates automatically once payment is confirmed.",
            "store.cancel": "Cancel",
            "store.payLaunching": "Online payments are launching shortly — we're finishing PhonePe merchant verification. Please check back soon!",
            "store.orderKP": "{n} Kimchi Points",
            "store.orderPremium": "Brevity Premium (7 days)",

            /* About */
            "about.title": "About - Brevity Companion",
            "about.heading": "The Engineering Behind Brevity",
            "about.subtitle": "Bridging Data Science and High-Level Linguistics",
            "about.videoPlaceholder": "Project Showcase Video Placeholder",
            "about.card1Title": "Asynchronous Architecture",
            "about.card1Body": "Built on a serverless pipeline utilizing asyncio.gather to concurrently process Whisper STT and Google TTS, keeping conversational latency under one second.",
            "about.card2Title": "Linguistic Boundaries",
            "about.card2Body": "Proprietary JSON-driven data mapping strictly confines the AI's vocabulary limits, forcing output that aligns with standard Korean textbook curriculums.",

            /* Connect / Session */
            "connect.title": "Brevity Companion - Korean Tutor",
            "connect.initTitle": "Initializing Session...",
            "connect.initSub": "Please wait while we prepare your AI instructor.",
            "connect.step1": "Verifying Subscription",
            "connect.step2": "Reserving Execution Slot",
            "connect.step3": "Loading Yonsei Curriculum",
            "connect.step4": "Compiling AI Prompt (Pre-computing)",
            "connect.step5": "Connecting Speech Recognition",
            "connect.serverBusy": "Server is busy",
            "connect.queueWait": "You are in the queue. Waiting for a slot to free up...",
            "connect.micBlocked": "Microphone blocked",
            "connect.micAllow": "Allow mic access in your browser to use voice chat, then reload this page.",
            "connect.ready": "Ready!",
            "connect.entering": "Entering classroom...",
            "connect.slotOpened": "A slot opened up! Preparing your lesson.",
            "connect.end": "End",
            "connect.tapMic": "Tap the mic or press Space to speak",
            "connect.holdMic": "Hold the mic to speak",
            "connect.spacebar": "Press Spacebar or Enter to start/stop",
            "connect.spacebarHtml": "Press <strong>Spacebar</strong> or <strong>Enter</strong> to start/stop",
            "connect.micNotAvail": "Microphone not available",
            "connect.transcribing": "Transcribing & thinking...",
            "connect.listening": "Listening... Release to send",
            "connect.recError": "Error: Could not start recording",
            "connect.confirmEnd": "Are you sure you want to end this session?",
            "connect.mode.practice": "Practice Mode",
            "connect.mode.viva": "Viva Mode",
            "connect.mode.casual": "Casual Mode",
            "connect.session": "Session",
            "connect.position": "Position: #",

            /* Practice setup */
            "practice.title": "Brevity Companion - Practice Setup",
            "practice.heading": "Practice Mode",
            "practice.sub": "Structured drills for a specific chapter",
            "practice.instruction": "Select the chapter you want to practice. The AI tutor will focus strictly on the grammar and vocabulary introduced in this lesson.",
            "practice.selectChapter": "Select a chapter to begin...",
            "practice.back": "⟵ Back to Modes",
            "practice.start": "Start Audio Drills",
            "practice.chapter": "Chapter {n}",
            "practice.notEnough": "Not enough Kimchi Points. Please top up in the store.",

            /* Casual setup */
            "casual.title": "Brevity Companion - Casual Setup",
            "casual.heading": "Casual Mode",
            "casual.sub": "Freestyle conversation practice",
            "casual.instruction": "Is there a specific topic, scenario, or vocabulary you'd like to talk about today? (Optional)",
            "casual.placeholder": "e.g., Let's practice ordering food at a restaurant, or ask me questions about my weekend...",
            "casual.back": "⟵ Back to Modes",
            "casual.start": "Start Audio Chat",
            "casual.notEnough": "Not enough Kimchi Points. Please top up in the store.",

            /* Viva setup */
            "viva.title": "Brevity Companion - Viva Setup",
            "viva.heading": "Viva Simulator",
            "viva.sub": "Configure your exam boundaries",
            "viva.instruction": "Select the chapters you want to be tested on. The AI will strictly limit its vocabulary to this cluster.",
            "viva.back": "⟵ Back to Modes",
            "viva.start": "Start Audio Exam",
            "viva.chapter": "Chapter {n}",
            "viva.notEnough": "Not enough Kimchi Points. Please top up in the store.",

            /* Profile */
            "profile.title": "Profile - Brevity Companion",
            "profile.accountDetails": "Account Details",
            "profile.fullName": "Full Name",
            "profile.fullNameHint": "Shown across the platform",
            "profile.email": "Email Address",
            "profile.emailHint": "Used for login & reminders",
            "profile.password": "Password",
            "profile.passwordHint": "Change your login password",
            "profile.avatar": "Avatar",
            "profile.avatarHint": "Upload a photo or pick a color",
            "profile.uploadImage": "Upload Image",
            "profile.removePhoto": "Remove Photo",
            "profile.gender": "Gender",
            "profile.genderRequired": "Required",
            "profile.gender.prefer": "Prefer not to say",
            "profile.gender.female": "Female",
            "profile.gender.male": "Male",
            "profile.gender.nonbinary": "Non-binary",
            "profile.gender.other": "Other",
            "profile.dob": "Date of Birth",
            "profile.dobRequired": "Required",
            "profile.city": "City / Hometown",
            "profile.cityRequired": "Required",
            "profile.institute": "Institute / School",
            "profile.instituteHint": "Optional — where you study",
            "profile.planSub": "Plan & Subscription",
            "profile.freePlan": "Free Plan",
            "profile.freePlanDesc": "Enjoy casual practice with a starter balance of Kimchi Points. Upgrade for unlimited sessions and chapter clusters.",
            "profile.managePlan": "Manage Plan",
            "profile.learningPref": "Learning Preferences",
            "profile.dailyGoal": "Daily Goal",
            "profile.dailyGoalHint": "Target practice minutes per day",
            "profile.interfaceLang": "Interface Language",
            "profile.interfaceLangHint": "Language of menus and hints",
            "profile.darkMode": "Dark Mode",
            "profile.darkModeHint": "Switch the whole app to a dark theme",
            "profile.streakAlerts": "Study Streak Alerts",
            "profile.streakAlertsHint": "Celebrate milestones with the mascot",
            "profile.autoAudio": "Auto-play Voice",
            "profile.autoAudioHint": "Speak feedback aloud automatically (TTS)",
            "profile.progress": "Your Progress",
            "profile.stats.sessions": "Sessions",
            "profile.stats.chapters": "Chapters Done",
            "profile.stats.streak": "Day Streak",
            "profile.session": "Session",
            "profile.logoutConfirm": "End your current session and return to the login screen.",
            "profile.adminAccess": "Admin Access",
            "profile.adminInfinite": "Infinite Kimchi Points — never runs out",
            "profile.adminNoGating": "No session gating or cooldown restrictions",
            "profile.adminNoLimit": "No time limit — account never expires",
            "profile.adminKP": "KIMCHI POINTS",
            "profile.lang.en": "English",
            "profile.lang.ko": "한국어 (Korean)",
            "profile.saveName": "Save",
            "profile.saveCity": "Save",
            "profile.saveInstitute": "Save",
            "profile.changePassword": "Change Password",

            /* Signup */
            "signup.title": "Create Account",
            "signup.subtitle": "Sign up to start practicing Korean",
            "signup.fullName": "Full Name",
            "signup.email": "Email Address",
            "signup.password": "Password",
            "signup.confirmPassword": "Confirm Password",
            "signup.gender": "Gender",
            "signup.dob": "Date of Birth",
            "signup.city": "City / Hometown",
            "signup.institute": "Institute / School",
            "signup.instituteOpt": "(optional)",
            "signup.aboutYou": "About You",
            "signup.ageConsent": "I represent and warrant that I am 18 years of age or older and possess the full legal capacity to accept our platform's",
            "signup.aiConsent": "I consent to my voice recordings and text inputs being transmitted and processed by third-party AI models (STT speech capture, TTS voice streams, and LLM evaluations) to handle engine feedback per our",
            "signup.submit": "Create Account",
            "signup.alreadyStudent": "Already a student?",
            "signup.login": "Log In",
            "signup.requiredFields": "Please complete the required fields marked in red.",
            "signup.consentRequired": "You must check both boxes to confirm your age and accept the AI data routing disclosures.",
            "signup.creating": "Creating account…",
            "signup.success": "Registration successful! Please check your email to confirm your account.",
            "signup.failed": "Registration failed: ",

            /* Profile toasts / messages */
            "msg.nameEmpty": "Name cannot be empty.",
            "msg.noEmail": "No email on file.",
            "msg.resetSent": "Password reset link sent to your email ✓",
            "msg.resetError": "Error: ",
            "msg.prefUpdated": "Preference updated ✓",
            "msg.saved": "Saved ✓",
            "msg.photoRemoved": "Photo removed ✓",
            "msg.avatarUpdated": "Avatar updated ✓",
            "msg.colorUpdated": "Avatar color updated ✓",
            "msg.imageTooBig": "Image must be under 2 MB.",

            /* Legal pages */
            "legal.privacy.title": "Privacy Policy",
            "legal.terms.title": "Terms of Service",
            "legal.refund.title": "Cancellation & Refund Policy",
            "legal.backDashboard": "← Back to Dashboard",
            "legal.back": "← Back",
            "legal.lastUpdated": "Last updated on",
            "legal.readCarefully": "READ CAREFULLY",
            "legal.importantNotice": "⚠️ IMPORTANT NOTICE — UTILITY POINT AND PREMIUM SALES ARE GENERALLY FINAL",

            /* Privacy section titles */
            "privacy.s1": "1. Introduction",
            "privacy.s2": "2. Eligibility and Age Restrictions",
            "privacy.s2_1": "2.1 Minimum Age Requirements",
            "privacy.s2_2": "2.2 Account Holder Representations",
            "privacy.s2_3": "2.3 Underage Account Violations",
            "privacy.s3": "3. Information We Collect",
            "privacy.s3_1": "3.1 Account and Identity Data",
            "privacy.s3_2": "3.2 Application Activity Data",
            "privacy.s3_3": "3.3 Kimchi Points Economy Data",
            "privacy.s3_4": "3.4 Payment Information",
            "privacy.s3_5": "3.5 Technical and Device Data",
            "privacy.s3_6": "3.6 Audio, Voice, and AI Interaction Data — Explicit Consent Required",
            "privacy.s3_7": "3.7 Cookies and Local Storage",
            "privacy.s4": "4. How We Use Your Data",
            "privacy.s5": "5. Third-Party Services and International Data Transfers",
            "privacy.s5_1": "5.1 AI and Automated Service Outputs",
            "privacy.s6": "6. Storage and Retention",
            "privacy.s7": "7. Data Rights of Users",
            "privacy.s8": "8. Data Security",
            "privacy.s9": "9. Children's Data and Age Verification Policy",
            "privacy.s10": "10. Grievance Redressal and Compliance Contact",
            "privacy.s11": "11. Research and Analytics",
            "privacy.s12": "12. Disclaimer of Warranties",
            "privacy.s13": "13. Limitation of Liability",
            "privacy.s14": "14. Indemnification",
            "privacy.s15": "15. Changes to This Policy",
            "privacy.s16": "16. Governing Law and Jurisdiction",
            "privacy.s17": "17. Severability",
            "privacy.s18": "18. Contact Us",
            "privacy.contact.entity": "Platform Entity:",
            "privacy.contact.address": "Registered Address:",
            "privacy.contact.email": "Email:",
            "privacy.contact.jurisdiction": "Primary Jurisdiction:",
            "privacy.contact.officer": "Grievance Officer:",

            /* Terms section titles */
            "terms.s1": "1. Acceptance of Agreement",
            "terms.s2": "2. Age Eligibility & Account Security",
            "terms.s3": "3. Virtual Token Economy (Kimchi Points)",
            "terms.s4": "4. Premium Membership Tier & Priority Queue Processing",
            "terms.s5": "5. Mandatory Session Cooldown Locks & Temporary Restrictions",
            "terms.s6": "6. Payment Processing Policy",
            "terms.s7": "7. Cancellation & Refund Policy",
            "terms.s8": "8. Acceptable Use, Anti-Cheat, & Intellectual Property",
            "terms.s9": "9. Suspension and Termination",
            "terms.s10": "10. Disclaimer of Warranties & Limitation of Liability",
            "terms.s11": "11. Indemnification",
            "terms.s12": "12. Force Majeure",
            "terms.s13": "13. Dispute Resolution and Arbitration",
            "terms.s14": "14. Grievance Redressal Officer",
            "terms.s15": "15. Governing Law and Jurisdiction",
            "terms.s16": "16. Amendments to These Terms",
            "terms.s17": "17. Entire Agreement and Severability",
            "terms.s18": "18. No Waiver",

            /* Refund section titles */
            "refund.s1": "1. Digital Goods & Non-Refundability",
            "refund.s2": "2. Eligible Scenarios for Refunds",
            "refund.s3": "3. Refund Request Timeframes & Process",
            "refund.s4": "4. Refund Processing",
            "refund.s5": "5. Cancellations",
            "refund.s6": "6. Contact Information"
        },

        ko: {
            "brand": "브리비티 컴패니언",

            /* Shared sidebar */
            "menu": "메뉴",
            "nav.practice": "연습 허브",
            "nav.store": "김치 포인트 상점",
            "nav.profile": "내 프로필",
            "nav.about": "엔진 소개",
            "nav.privacy": "개인정보 처리방침",
            "nav.terms": "서비스 이용약관",
            "nav.refund": "환불 정책",
            "nav.logout": "로그아웃",

            /* Login */
            "login.title": "로그인 - 브리비티 컴패니언",
            "login.subtitle": "한국어 학습을 이어가려면 로그인하세요",
            "login.email": "이메일 주소",
            "login.password": "비밀번호",
            "login.enter": "플랫폼 입장",
            "login.newStudent": "신규 회원이신가요?",
            "login.createAccount": "계정 만들기",
            "login.terms": "서비스 이용약관",
            "login.privacy": "개인정보 처리방침",
            "login.legalFooter": "플랫폼 입장을 클릭하면 당사의 다음 약관에 동의하는 것으로 간주됩니다",
            "login.and": "&",
            "login.fillCreds": "이메일과 비밀번호를 모두 입력해 주세요.",
            "login.authenticating": "세션 인증 중...",
            "login.failed": "로그인 실패: ",

            /* Dashboard */
            "dash.title": "브리비티 컴패니언 - 대시보드",
            "dash.selectMode": "평가 모드를 선택하세요",
            "dash.kpWarning": "김치 포인트가 부족합니다! (세션당 10 KP 필요)",
            "dash.topUp": "여기서 충전",
            "dash.casual": "자유 대화 모드",
            "dash.casualDesc": "편안한 연습으로 기초 어휘 익히기에 알맞습니다.",
            "dash.practice": "연습 모드",
            "dash.practiceDesc": "교재 챕터를 바탕으로 한 구조화된 문제와 연습.",
            "dash.viva": "구술 시험 시뮬레이터",
            "dash.vivaDesc": "선택한 챕터 묶음을 아우르는 실시간 구술 시험.",
            "dash.enter": "입장 (-10 KP)",
            "dash.setup": "설정 (-10 KP)",
            "dash.noticeboard": "공지사항",
            "dash.close": "닫기",
            "dash.noNotices": "새 공지가 없습니다.",
            "dash.notice.welcome.title": "브리비티 컴패니언에 오신 것을 환영합니다!",
            "dash.notice.welcome.body": "자유 대화, 연습, 구술 모드에서 AI 평가로 한국어를 연습하세요. 연속 출석을 쌓고 진행 상황을 확인할 수 있습니다.",
            "dash.notice.kp.title": "세션당 10 KP",
            "dash.notice.kp.body": "연습 세션은 회당 10 김치 포인트가 듭니다. 언제든 김치 포인트 상점에서 충전하세요.",
            "dash.notice.profile.title": "프로필을 완성하세요",
            "dash.notice.profile.body": "내 프로필에서 도시와 학교를 추가해 학습 경험을 맞춤 설정하세요.",

            /* Store */
            "store.title": "상점 - 브리비티 컴패니언",
            "store.heading": "상점",
            "store.topUpHeading": "김치 포인트 충전",
            "store.adminTitle": "관리자 계정 — 무제한 이용",
            "store.adminNote": "무한 김치 포인트와 세션 제한이 없습니다. 충전이 필요 없습니다.",
            "store.supportEngine": "브리비티 엔진을 후원하고 연습 시간을 잠금 해제하세요",
            "store.f1": "36분 쿨다운 잠금 우회",
            "store.f2": "제한 없는 오디오 생성",
            "store.f3": "고급 구술 챕터 클러스터 이용",
            "store.f4": "우선 서버 라우팅 (지연 없음)",
            "store.f5": "클라우드 인프라 직접 후원",
            "store.f6": "프리미엄 어휘 분석 잠금 해제",
            "store.addKP": "김치 포인트 추가",
            "store.premiumHeading": "브리비티 프리미엄",
            "store.premiumBadge": "프리미엄 패스",
            "store.weeklyPass": "주간 프리미엄 패스",
            "store.premiumDesc": "대기열을 건너뛰고 끊김 없이 연습하세요. 프리미엄은 우선 서버 라우팅을 제공하고 7일간 표준 쿨다운 잠금을 해제합니다.",
            "store.tag.fasterQueue": "빠른 대기열 참여",
            "store.tag.noCooldown": "36분 쿨다운 없음",
            "store.tag.priorityRouting": "우선 라우팅",
            "store.getPremium": "프리미엄 이용",
            "store.billedOnce": "한 번 결제, 7일 유효",
            "store.checkout": "결제",
            "store.checkoutSub": "결제 전 주문을 확인하세요",
            "store.confirmTopUp": "충전 확인",
            "store.confirmTopUpSub": "결제 후 김치 포인트가 계정에 즉시 추가됩니다.",
            "store.confirmPremium": "프리미엄 패스 확인",
            "store.confirmPremiumSub": "프리미엄은 즉시 활성화되며 구매일로부터 7일간 유지됩니다.",
            "store.total": "합계",
            "store.payPhonePe": "PhonePe로 결제",
            "store.modalNote": "안전한 결제를 위해 PhonePe로 이동합니다. 결제가 확인되면 잔액이 자동으로 업데이트됩니다.",
            "store.cancel": "취소",
            "store.payLaunching": "온라인 결제가 곧 시작됩니다 — PhonePe 가맹점 인증을 마무리하는 중입니다. 잠시 후 다시 확인해 주세요!",
            "store.orderKP": "김치 포인트 {n}개",
            "store.orderPremium": "브리비티 프리미엄 (7일)",

            /* About */
            "about.title": "소개 - 브리비티 컴패니언",
            "about.heading": "브리비티의 기술",
            "about.subtitle": "데이터 과학과 고급 언어학의 연결",
            "about.videoPlaceholder": "프로젝트 소개 영상 자리",
            "about.card1Title": "비동기 아키텍처",
            "about.card1Body": "asyncio.gather를 활용하는 서버리스 파이프라인으로 Whisper STT와 Google TTS를 동시에 처리하여 대화 지연을 1초 미만으로 유지합니다.",
            "about.card2Title": "언어적 경계",
            "about.card2Body": "독자적인 JSON 기반 데이터 매핑이 AI의 어휘 범위를 엄격히 제한하여, 표준 한국어 교재 커리큘럼에 맞는 결과만 내도록 합니다.",

            /* Connect / Session */
            "connect.title": "브리비티 컴패니언 - 한국어 튜터",
            "connect.initTitle": "세션 초기화 중...",
            "connect.initSub": "AI 강사 준비를 위해 잠시 기다려 주세요.",
            "connect.step1": "구독 확인 중",
            "connect.step2": "실행 슬롯 예약 중",
            "connect.step3": "연세 커리큘럼 불러오는 중",
            "connect.step4": "AI 프롬프트 컴파일 중 (사전 계산)",
            "connect.step5": "음성 인식 연결 중",
            "connect.serverBusy": "서버 사용 중",
            "connect.queueWait": "대기열에 있습니다. 슬롯이 비기를 기다리는 중...",
            "connect.micBlocked": "마이크 차단됨",
            "connect.micAllow": "음성 채팅을 사용하려면 브라우저에서 마이크 권한을 허용한 후 페이지를 새로고침하세요.",
            "connect.ready": "준비 완료!",
            "connect.entering": "교실로 입장 중...",
            "connect.slotOpened": "슬롯이 열렸습니다! 수업을 준비하는 중...",
            "connect.end": "종료",
            "connect.tapMic": "마이크를 탭하거나 스페이스를 눌러 말하기",
            "connect.holdMic": "마이크를 누른 채 말하기",
            "connect.spacebar": "시작/정지를 위해 스페이스 또는 엔터 누르기",
            "connect.spacebarHtml": "시작/정지를 위해 <strong>스페이스</strong> 또는 <strong>엔터</strong> 누르기",
            "connect.micNotAvail": "마이크 사용 불가",
            "connect.transcribing": "변환 및 사고 중...",
            "connect.listening": "듣는 중... 놓으면 전송",
            "connect.recError": "오류: 녹음을 시작할 수 없습니다",
            "connect.confirmEnd": "이 세션을 종료하시겠습니까?",
            "connect.mode.practice": "연습 모드",
            "connect.mode.viva": "구술 모드",
            "connect.mode.casual": "자유 대화 모드",
            "connect.session": "세션",
            "connect.position": "순번: #",

            /* Practice setup */
            "practice.title": "브리비티 컴패니언 - 연습 설정",
            "practice.heading": "연습 모드",
            "practice.sub": "특정 챕터를 위한 구조화된 연습",
            "practice.instruction": "연습할 챕터를 선택하세요. AI 튜터는 이 과정에서 다루는 문법과 어휘에만 strictly 집중합니다.",
            "practice.selectChapter": "시작할 챕터를 선택하세요...",
            "practice.back": "⟵ 모드로 돌아가기",
            "practice.start": "오디오 연습 시작",
            "practice.chapter": "챕터 {n}",
            "practice.notEnough": "김치 포인트가 부족합니다. 상점에서 충전해 주세요.",

            /* Casual setup */
            "casual.title": "브리비티 컴패니언 - 자유 대화 설정",
            "casual.heading": "자유 대화 모드",
            "casual.sub": "자유 형식 대화 연습",
            "casual.instruction": "오늘 특정 주제, 상황, 또는 어휘로 이야기하고 싶은 것이 있나요? (선택 사항)",
            "casual.placeholder": "예: 식당에서 주문하는 연습을 해보거나, 주말에 한 일을 물어보세요...",
            "casual.back": "⟵ 모드로 돌아가기",
            "casual.start": "오디오 채팅 시작",
            "casual.notEnough": "김치 포인트가 부족합니다. 상점에서 충전해 주세요.",

            /* Viva setup */
            "viva.title": "브리비티 컴패니언 - 구술 설정",
            "viva.heading": "구술 시험 시뮬레이터",
            "viva.sub": "시험 범위 설정",
            "viva.instruction": "시험을 볼 챕터를 선택하세요. AI는 이 묶음의 어휘로만 strictly 답합니다.",
            "viva.back": "⟵ 모드로 돌아가기",
            "viva.start": "오디오 시험 시작",
            "viva.chapter": "챕터 {n}",
            "viva.notEnough": "김치 포인트가 부족합니다. 상점에서 충전해 주세요.",

            /* Profile */
            "profile.title": "프로필 - 브리비티 컴패니언",
            "profile.accountDetails": "계정 정보",
            "profile.fullName": "이름",
            "profile.fullNameHint": "플랫폼 전반에 표시됨",
            "profile.email": "이메일 주소",
            "profile.emailHint": "로그인 및 알림에 사용",
            "profile.password": "비밀번호",
            "profile.passwordHint": "로그인 비밀번호 변경",
            "profile.avatar": "프로필 사진",
            "profile.avatarHint": "사진 업로드 또는 색상 선택",
            "profile.uploadImage": "이미지 업로드",
            "profile.removePhoto": "사진 삭제",
            "profile.gender": "성별",
            "profile.genderRequired": "필수",
            "profile.gender.prefer": "밝히지 않음",
            "profile.gender.female": "여성",
            "profile.gender.male": "남성",
            "profile.gender.nonbinary": "논바이너리",
            "profile.gender.other": "기타",
            "profile.dob": "생년월일",
            "profile.dobRequired": "필수",
            "profile.city": "도시 / 고향",
            "profile.cityRequired": "필수",
            "profile.institute": "학교 / 기관",
            "profile.instituteHint": "선택 사항 — 재학 중인 곳",
            "profile.planSub": "요금제 및 구독",
            "profile.freePlan": "무료 플랜",
            "profile.freePlanDesc": "시작 김치 포인트로 자유롭게 연습하세요. 무제한 세션과 챕터 클러스터를 위해 업그레이드할 수 있습니다.",
            "profile.managePlan": "요금제 관리",
            "profile.learningPref": "학습 환경 설정",
            "profile.dailyGoal": "일일 목표",
            "profile.dailyGoalHint": "하루 목표 연습 시간",
            "profile.interfaceLang": "인터페이스 언어",
            "profile.interfaceLangHint": "메뉴 및 안내 언어",
            "profile.darkMode": "다크 모드",
            "profile.darkModeHint": "앱 전체를 다크 테마로 전환",
            "profile.streakAlerts": "학습 연속 알림",
            "profile.streakAlertsHint": "마스코트와 함께 성장 축하",
            "profile.autoAudio": "음성 자동 재생",
            "profile.autoAudioHint": "피드백을 음성으로 자동 재생(TTS)",
            "profile.progress": "나의 진행 상황",
            "profile.stats.sessions": "세션",
            "profile.stats.chapters": "완료한 챕터",
            "profile.stats.streak": "연속 출석",
            "profile.session": "세션",
            "profile.logoutConfirm": "현재 세션을 종료하고 로그인 화면으로 돌아갑니다.",
            "profile.adminAccess": "관리자 권한",
            "profile.adminInfinite": "무한 김치 포인트 — 절대 소진되지 않음",
            "profile.adminNoGating": "세션 제한이나 쿨다운 없음",
            "profile.adminNoLimit": "기한 없음 — 계정은 만료되지 않음",
            "profile.adminKP": "김치 포인트",
            "profile.lang.en": "English",
            "profile.lang.ko": "한국어 (Korean)",
            "profile.saveName": "저장",
            "profile.saveCity": "저장",
            "profile.saveInstitute": "저장",
            "profile.changePassword": "비밀번호 변경",

            /* Signup */
            "signup.title": "계정 만들기",
            "signup.subtitle": "가입하고 한국어 연습을 시작하세요",
            "signup.fullName": "이름",
            "signup.email": "이메일 주소",
            "signup.password": "비밀번호",
            "signup.confirmPassword": "비밀번호 확인",
            "signup.gender": "성별",
            "signup.dob": "생년월일",
            "signup.city": "도시 / 고향",
            "signup.institute": "학교 / 기관",
            "signup.instituteOpt": "(선택)",
            "signup.aboutYou": "내 소개",
            "signup.ageConsent": "본인은 만 18세 이상이며 당사 플랫폼의 다음 약관을 수락할 법적 능력이 있음을 진술합니다",
            "signup.aiConsent": "본인은 음성 녹음 및 텍스트 입력이 당사의 다음 방침에 따라 엔진 피드백 처리를 위해 제3자 AI 모델(STT 음성 캡처, TTS 음성 스트림, LLM 평가)로 전송·처리되는 것에 동의합니다",
            "signup.submit": "계정 만들기",
            "signup.alreadyStudent": "이미 회원이신가요?",
            "signup.login": "로그인",
            "signup.requiredFields": "빨간색으로 표시된 필수 항목을 입력해 주세요.",
            "signup.consentRequired": "연령 확인과 AI 데이터 라우팅 고지를 위해 두 항목을 모두 체크해야 합니다.",
            "signup.creating": "계정 생성 중…",
            "signup.success": "가입이 완료되었습니다! 이메일을 확인하여 계정을 인증해 주세요.",
            "signup.failed": "가입 실패: ",

            /* Profile toasts / messages */
            "msg.nameEmpty": "이름을 비워둘 수 없습니다.",
            "msg.noEmail": "등록된 이메일이 없습니다.",
            "msg.resetSent": "비밀번호 재설정 링크를 이메일로 보냈습니다 ✓",
            "msg.resetError": "오류: ",
            "msg.prefUpdated": "설정이 업데이트되었습니다 ✓",
            "msg.saved": "저장되었습니다 ✓",
            "msg.photoRemoved": "사진이 삭제되었습니다 ✓",
            "msg.avatarUpdated": "프로필 사진이 업데이트되었습니다 ✓",
            "msg.colorUpdated": "프로필 색상이 업데이트되었습니다 ✓",
            "msg.imageTooBig": "이미지는 2 MB 미만이어야 합니다.",

            /* Legal pages */
            "legal.privacy.title": "개인정보 처리방침",
            "legal.terms.title": "서비스 이용약관",
            "legal.refund.title": "취소 및 환불 정책",
            "legal.backDashboard": "← 대시보드로 돌아가기",
            "legal.back": "← 돌아가기",
            "legal.lastUpdated": "최종 업데이트",
            "legal.readCarefully": "주의해서 읽어주세요",
            "legal.importantNotice": "⚠️ 중요 안내 — 유틸리티 포인트 및 프리미엄 판매는 원칙적으로 확정적입니다",

            /* Privacy section titles */
            "privacy.s1": "1. 소개",
            "privacy.s2": "2. 자격 요건 및 연령 제한",
            "privacy.s2_1": "2.1 최소 연령 요건",
            "privacy.s2_2": "2.2 계정 보유자 진술",
            "privacy.s2_3": "2.3 미성년자 계정 위반",
            "privacy.s3": "3. 수집하는 정보",
            "privacy.s3_1": "3.1 계정 및 신원 데이터",
            "privacy.s3_2": "3.2 앱 활동 데이터",
            "privacy.s3_3": "3.3 김치 포인트 경제 데이터",
            "privacy.s3_4": "3.4 결제 정보",
            "privacy.s3_5": "3.5 기술 및 기기 데이터",
            "privacy.s3_6": "3.6 오디오, 음성 및 AI 상호작용 데이터 — 명시적 동의 필요",
            "privacy.s3_7": "3.7 쿠키 및 로컬 저장소",
            "privacy.s4": "4. 데이터 이용 방식",
            "privacy.s5": "5. 제3자 서비스 및 국외 데이터 전송",
            "privacy.s5_1": "5.1 AI 및 자동화된 서비스 출력",
            "privacy.s6": "6. 보관 및 보존",
            "privacy.s7": "7. 사용자의 데이터 권리",
            "privacy.s8": "8. 데이터 보안",
            "privacy.s9": "9. 아동 데이터 및 연령 확인 정책",
            "privacy.s10": "10. 불만 처리 및 준수 연락처",
            "privacy.s11": "11. 연구 및 분석",
            "privacy.s12": "12. 면책 조항",
            "privacy.s13": "13. 책임의 제한",
            "privacy.s14": "14. 손해 배상",
            "privacy.s15": "15. 본 방침의 변경",
            "privacy.s16": "16. 준거법 및 관할",
            "privacy.s17": "17. 분리 가능성",
            "privacy.s18": "18. 문의하기",
            "privacy.contact.entity": "플랫폼 법인:",
            "privacy.contact.address": "등록 주소:",
            "privacy.contact.email": "이메일:",
            "privacy.contact.jurisdiction": "주 관할:",
            "privacy.contact.officer": "불만 처리 담당자:",

            /* Terms section titles */
            "terms.s1": "1. 계약의 수락",
            "terms.s2": "2. 연령 자격 및 계정 보안",
            "terms.s3": "3. 가상 토큰 경제 (김치 포인트)",
            "terms.s4": "4. 프리미엄 회원 등급 및 우선 대기열 처리",
            "terms.s5": "5. 의무 세션 쿨다운 잠금 및 임시 제한",
            "terms.s6": "6. 결제 처리 정책",
            "terms.s7": "7. 취소 및 환불 정책",
            "terms.s8": "8. 허용되는 사용, 부정행위 방지 및 지식재산권",
            "terms.s9": "9. 정지 및 종료",
            "terms.s10": "10. 면책 조항 및 책임의 제한",
            "terms.s11": "11. 손해 배상",
            "terms.s12": "12. 불가항력",
            "terms.s13": "13. 분쟁 해결 및 중재",
            "terms.s14": "14. 불만 처리 담당자",
            "terms.s15": "15. 준거법 및 관할",
            "terms.s16": "16. 본 약관의 개정",
            "terms.s17": "17. 전체 합의 및 분리 가능성",
            "terms.s18": "18. 권리 포기 불가",

            /* Refund section titles */
            "refund.s1": "1. 디지털 상품 및 환불 불가",
            "refund.s2": "2. 환불 대상 사례",
            "refund.s3": "3. 환불 요청 기한 및 절차",
            "refund.s4": "4. 환불 처리",
            "refund.s5": "5. 취소",
            "refund.s6": "6. 연락처 정보"
        }
    };

    /* ---------------- Helpers ---------------- */
    function loadSettings() {
        try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; }
        catch (e) { return {}; }
    }
    function getLang() {
        var s = loadSettings();
        return s.uiLanguage === "ko" ? "ko" : "en";
    }
    function setLang(lang) {
        lang = lang === "ko" ? "ko" : "en";
        var s = loadSettings();
        s.uiLanguage = lang;
        try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch (e) {}
        applyLang(lang);
    }
    function dict(lang) { return I18N[lang] || I18N.en; }

    // t("key") or t("key", { n: 5 }) — fills {n}-style placeholders.
    function t(key, vars) {
        var lang = getLang();
        var str = dict(lang)[key];
        if (str === undefined) str = dict("en")[key];      // fall back to English
        if (str === undefined) return key;                 // missing key -> show key
        if (vars) {
            str = str.replace(/\{(\w+)\}/g, function (m, name) {
                return vars[name] !== undefined ? vars[name] : m;
            });
        }
        return str;
    }

    // Paint every [data-i18n] element for the given language.
    function applyLang(lang) {
        lang = lang === "ko" ? "ko" : "en";
        document.documentElement.setAttribute("lang", lang);
        var nodes = document.querySelectorAll("[data-i18n]");
        for (var i = 0; i < nodes.length; i++) {
            var el = nodes[i];
            var key = el.getAttribute("data-i18n");
            if (key === "brand") {
                el.textContent = dict(lang).brand;
            } else {
                el.textContent = t(key);
            }
        }
        // Placeholders (inputs/textareas) carry data-i18n-ph.
        var ph = document.querySelectorAll("[data-i18n-ph]");
        for (var j = 0; j < ph.length; j++) {
            ph[j].setAttribute("placeholder", t(ph[j].getAttribute("data-i18n-ph")));
        }
        // Let page scripts re-render dynamic (JS-built) content.
        document.dispatchEvent(new CustomEvent("brevity:langchange", { detail: lang }));
    }

    // Public API
    window.BREVITY_I18N = I18N;
    window.t = t;
    window.getLang = getLang;
    window.setLang = setLang;
    window.applyLang = applyLang;

    // Apply on load. Pages that build dynamic content should also listen for
    // "brevity:langchange" and re-render.
    function boot() {
        applyLang(getLang());
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
})();
