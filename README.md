# مساحتي — Google Calendar + Firebase

هذا الإصدار يستخدم Google Calendar واحدًا للمستخدم في جميع الصفحات، ويستخدم Firebase Authentication وFirestore لحفظ الهدف والصفحات الخاصة بالمستخدم.

## تشغيل محلي
npm install
npm run dev

## Build / Netlify
Build command: `npm run build`
Publish directory: `dist`
يوجد `netlify.toml` و`public/_redirects` جاهزان.

## Firebase
فعّل:
- Authentication > Sign-in method > Google
- Firestore Database

أضف Web App في Firebase وانسخ قيمها إلى متغيرات البيئة `VITE_FIREBASE_*`.

## Google Calendar
فعّل Google Calendar API في Google Cloud.
يستخدم التطبيق OAuth من Firebase Google Sign-In مع scope:
`https://www.googleapis.com/auth/calendar`
ثم يستدعي تقويم `primary` للمستخدم.

مهم: Service Account JSON الذي تم توفيره للاختبار لا يجب وضعه في المتصفح أو داخل `VITE_*`. هذا النوع من المفاتيح سري ويجب أن يبقى على الخادم فقط. كذلك API key يجب تقييده في Google Cloud على موقعك وواجهة Calendar API.

\n## Firebase / Google Calendar test configuration\n
The test build contains the supplied Firebase Web App configuration and Google Calendar API key.
Do NOT put a Firebase Admin SDK service-account private key in `src/` or any browser-exposed environment variable.
For the real deployment, replace the test Firebase Web App values and Calendar API key with your own values.
Enable Google sign-in in Firebase Authentication and enable Google Calendar API in Google Cloud.
Add your Netlify domain to Firebase Authentication > Settings > Authorized domains.
