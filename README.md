# JW Subtitle Extractor & Cleaner

A lightweight web-based utility designed specifically for readers, note-takers, and language learners. By simply pasting a JW official video sharing URL, the tool automatically executes intelligent dual-API routing and runs a **high-efficiency, line-by-line filtering engine** to distill cluttered subtitle files into clean, readable text.

## 🌟 Core Features

- **🚀 Dual-API Compatibility**: Fully upgraded URL interoperability. Seamlessly supports both legacy `docid` sharing links and modern URLs carrying a `?lank=...` parameter. The script detects URL characteristics on the fly and intelligently switches between api endpoints.
- **🎬 Accurate Metadata Retrieval**: Under the new LANK routing mode, the application dives deep into the response structure of the modern `mediator` API to extract the official, exact Chinese video title and render it dynamically on screen.
- **🧹 Regex Line Filter**:
  - Automatically evaporates `WEBVTT` headers, block IDs, and all timecode tracking data (`-->`).
  - Utilizes a meticulous **looping lines array approach** to evaluate text row by row. This method preserves natural paragraph breaks intended by the translation while completely purging redundant blank rows, yielding a highly legible article layout.
- **✨ One-Click Copy with Dynamic Feedback**: Integrates the modern Web `navigator.clipboard` API to deliver a smooth copying workflow, paired with responsive button UI state changes (instantly switching to "✨ Copied Successfully!" and resetting after 1.5 seconds).
- **🎨 Nordic Light Theme**: Features a crisp, minimalist, and bright color palette engineered to contrast starkly with the media player project, mitigating eye strain during extended reading, analysis, and curation sessions.

## 🛠️ Tech Stack

- **HTML5 / CSS3**: Responsive light typography, micro-control button layouts, and optimized scrollbars for the `<pre>` text preview area.
- **JavaScript (ES6+)**: Asynchronous network operations (`Async/Await`), URL parameter dissection via `URLSearchParams`, robust object path querying via `Array.prototype.filter/find`, Regular Expressions (Regex), and the Clipboard API.

## 🚀 Getting Started

1. Download or clone this repository to your local machine.
2. It is recommended to run `index.html` via a local web server like VS Code's **Live Server** to prevent local cross-origin file reading blocks during external subtitle fetching.
3. Input an official video URL (accepts legacy `docid` structures or modern variants with `?lank=...`).
4. Click the "Extract Subtitles" button. In less than half a second, the interface will present a polished, stripped-down layout of the video title and text.
5. Click the copy button to instantly place the cleaned text onto your clipboard, ready to be pasted into note-taking tools like Notion, Obsidian, or Microsoft Word.

===

# JW 純字幕擷取器 (JW Subtitle Extractor & Cleaner)

一個專為閱讀、做筆記與語言學習設計的輕量網頁工具。使用者只需貼上 JW 官方影片的分享網址，程式便會全自動進行新舊 API 智慧分流，並透過**「高效逐行過濾機制」**，將原本繁雜的字幕檔案提煉為乾淨、流暢的純文字文章。

## 🌟 核心特色

- **🚀 智慧網址雙軌支援 (Dual-API Compatibility)**：全面升級網址相容性！完美支援傳統 `docid` 分享網址與新型包含 `?lank=...` 的識別碼。後台會根據網址特徵自動分流，流暢對接新舊兩代官方 API。
- **🎬 新版標題精準撈取**：在 LANK 模式下，程式能深入新版 `mediator` API 的核心結構，直接在最上層提取官方最乾淨、正確的影片中文標題，並動態渲染於網頁畫面上。
- **🧹 極致文字清洗機 (Regex Line Filter)**：
  - 全自動蒸發 `WEBVTT` 標頭、區塊 ID 以及所有時間軸代碼（`-->`）。
  - 採用**逐行審查過濾法（Looping Lines Array）**，完美保留字幕本身的語意換行，同時徹底拔除所有多餘的空白行，提煉出最適合閱讀與筆記的純文字。
- **✨ 一鍵複製與動態反饋**：採用現代網頁 `navigator.clipboard` API 實現流暢的一鍵複製功能，並內建貼心的按鈕顏色與文字動態反饋（自動切換為「✨ 複製成功！」並於 1.5 秒後復原）。
- **🎨 北歐現代淺色調 (Nordic Light Theme)**：介面採用清爽、明亮的極簡淺色系設計，與播放器專案做出完美的視覺區隔，讓使用者在長時間專注閱讀與整理文本時，眼睛不易疲勞。

## 🛠️ 技術棧 (Tech Stack)

- **HTML5 / CSS3**：響應式淺色字型排版、微型控制按鈕設計、`pre` 文本框滾動條優化。
- **JavaScript (ES6+)**：Async/Await 異步網路請求、`URLSearchParams` 參數分析、強固的 `Array.prototype.filter/find` 欄位安全篩選、正則表達式（Regex）、剪貼簿 API（Clipboard API）。

## 🚀 如何使用

1. 將本專案下載或複製（Clone）到本機電腦。
2. 建議使用 VS Code 的 **Live Server** 擴充功能（或任何本機網頁伺服器）啟動 `index.html`（能有效避免原生網頁在請求外部字幕檔案時的本地跨域限制）。
3. 貼上 JW 網站的影片分享連結（支援傳統 `docid` 網址 或 新版包含 `?lank=...` 的網址）。
4. 點擊「擷取字幕」按鈕，即可瞬間獲得排版完美的純文字標題與字幕內容，點擊複製即可無縫黏貼至個人筆記軟體（如 Notion、Obsidian、Word）。