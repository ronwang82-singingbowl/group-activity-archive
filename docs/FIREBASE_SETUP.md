# 活動回憶館｜Firebase 設定筆記

目前這一版只實作 **公開活動讀取**，尚未實作成員投稿、Google 登入、管理員審核或照片上傳。沒有公開資料或沒有權限時，首頁會顯示清楚標記的示範活動。

## 已知專案
- Firebase Project ID: `group-activity-complete-life`
- Firestore default database
- Web App 連線資訊位於 `src/archiveData.js`
- GitHub Pages: `/group-activity-archive/`

Firebase 的網頁 apiKey 是客戶端識別資訊，不是管理權限憑證。**絕不可將 service account 私鑰放進 GitHub。**

## Firestore 公開讀取模型

建立 `events` 集合時，每個文件建議使用：

```js
{
  title: '活動標題',
  date: '2026-11-16',
  category: '相聚時光',
  introduction: '活動簡介',
  story: '活動完整文字紀錄',
  location: '活動地點（選填）',
  coverImage: 'https://.../cover.jpg',
  photos: ['https://.../photo1.jpg'],
  videoUrl: 'https://www.youtube.com/watch?v=...',
  status: 'published'
}
```

重要：只有經管理員審核並確定取得公開授權的內容才應被標記為 `published`。請**不要**在公開文件內存放私人聯絡資訊、未授權照片或內部備註。

前端使用 `where('status', '==', 'published')` 查詢，並不會要求列出所有未發布活動。

## 尚未設定：安全規則

建議將規則設計為 **僅允許所有人讀取 published 文件，所有寫入暫時拒絕**。以下是新專案 events 讀取示例（將來有其他 collection 時須合併並重新審核規則，切勿直接覆蓋既有資料規則）：

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /events/{eventId} {
      allow get, list: if resource.data.status == 'published';
      allow create, update, delete: if false;
    }
  }
}
```

**部署規則前應先測試**：公開查詢 published 能成功、單筆 draft 無法讀取、未登入無法寫入。Firebase Rules 並非用來過濾查詢結果，客戶端必須包含相符的 published 查詢條件。

投稿功能將另建 `submissions` 私有集合，受登入/擁有者/審核管理權限保護，**不可直接寫進 events**。公開圖片也須在圖片服務或 Storage 規則中另行控管。

## 驗收
1. GitHub Actions 執行 `npm install`、`npm run build`
2. 網站顯示搜尋與類別篩選，並可開啟活動詳情
3. Firestore 尚無已發布活動時仍顯示示範內容
4. 建立 published 文件並完成安全規則測試後，首頁切換成正式活動
5. 檢查桌機與手機，確認所有文字、圖片及按鈕正常
