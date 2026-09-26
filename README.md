# مساحتي — Goal Pages

تطبيق React + Vite باللغة العربية وواجهة RTL.

## التشغيل
```bash
npm install
npm run dev
```

## Firebase
1. أنشئ مشروعًا في Firebase.
2. فعّل Cloud Firestore.
3. انسخ `.env.example` إلى `.env.local` وأدخل بيانات Web App من Firebase.
4. شغّل `npm run dev`.

التطبيق يعمل بدون Firebase باستخدام localStorage، وعند وضع متغيرات Firebase ينتقل التخزين إلى Firestore.

### بنية البيانات
- `appMeta/main`: يحتوي `goal`.
- `pages/{pageId}`: يحتوي `title`, `description`, `createdAt`, `events[]`.

> لاحقًا يمكن إضافة Firebase Authentication، بحيث تصبح البيانات خاصة بكل مستخدم باستخدام `users/{uid}/...` وقواعد Firestore المناسبة.

## التقويم
تم استخدام FullCalendar داخليًا بدل تضمين Google Calendar، لأنه أسهل في دمج إنشاء الأحداث داخل التطبيق ولا يحتاج OAuth في النسخة الأولى. ويمكن لاحقًا إضافة Google Calendar API للمزامنة مع تقاويم المستخدم.
