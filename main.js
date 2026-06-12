document.addEventListener('DOMContentLoaded', () => {
    const extractBtn = document.getElementById('extractBtn');
    const copyBtn = document.getElementById('copyBtn');
    const urlInput = document.getElementById('videoUrl'); 
    const resultSection = document.getElementById('resultSection');
    const subtitlePreview = document.getElementById('subtitlePreview');
    const videoTitleDisplay = document.getElementById('videoTitleDisplay'); // 抓取標題欄位

    extractBtn.addEventListener('click', async () => {
        const rawUrl = urlInput.value.trim();

        // 1. 強固的 ID 抓取術
        let videoId = "";
        let idParamName = "";
        const docidMatch = rawUrl.match(/docid=(\d+)/) || rawUrl.match(/docid-(\d+)/);
        
        if (docidMatch) {
            videoId = docidMatch[1];
            idParamName = "docid";
        } else {
            const urlParts = rawUrl.split('?');
            if (urlParts.length >= 2) {
                const urlParams = new URLSearchParams(urlParts[1]);
                videoId = urlParams.get('lank');
                idParamName = "lank";
            }
        }

        if (!videoId) {
            alert("網址裡找不到正確的影片識別碼。");
            return;
        }

        // 2. 請求官方 API
        const apiTarget = `https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?${idParamName}=${videoId}&output=json&fileformat=m4v%2Cmp4&alllangs=1&langwritten=CH`;

        try {
            extractBtn.disabled = true;
            extractBtn.textContent = "擷取中...";
            
            const response = await fetch(apiTarget);
            if (!response.ok) throw new Error(`API 錯誤: ${response.status}`);
            const data = await response.json();
            
            let chineseFilesData = data.files['CH'];
            if (!chineseFilesData) {
                alert("找不到這部影片的中文版本資料！");
                return;
            }

            // 3. 處理延遲載入
            if (chineseFilesData.__deferred) {
                const deferredCHResponse = await fetch(chineseFilesData.__deferred);
                const deferredCHData = await deferredCHResponse.json();
                chineseFilesData = deferredCHData.files['CH'];
            }

            // 4. 鎖定字幕網址與影片真實標題
            let finalSubtitleUrl = "";
            let videoTitle = "未命名影片";
            
            const chMp4Files = chineseFilesData.MP4 || chineseFilesData.mp4;
            if (chMp4Files && chMp4Files.length > 0) {
                const firstChVideo = chMp4Files[0];
                if (firstChVideo.title) {
                    videoTitle = firstChVideo.title; // 成功獲取影片標題
                }
                if (firstChVideo.subtitles && firstChVideo.subtitles.url) {
                    finalSubtitleUrl = firstChVideo.subtitles.url;
                }
            }
            if (!finalSubtitleUrl && chineseFilesData.subtitles && chineseFilesData.subtitles.vtt) {
                finalSubtitleUrl = chineseFilesData.subtitles.vtt[0].fileSelect;
            }

            if (!finalSubtitleUrl) {
                alert("找不到這部影片的中文字幕檔。");
                return;
            }

            // 將標題呈現在網頁畫面上
            videoTitleDisplay.textContent = `🎬 ${videoTitle}`;

            // 5. 下載字幕並進行精準清洗
            const subResponse = await fetch(finalSubtitleUrl);
            if (!subResponse.ok) throw new Error("下載字幕內容失敗。");
            
            let originalLines = await subResponse.text();

            // ============【核心修正：精準逐行過濾機】============
            // 先將整篇文字拆成「一行一行」的陣列來各自處理
            let lines = originalLines.split(/\r?\n/);
            let cleanLines = [];

            for (let line of lines) {
                let trimmed = line.trim();

                // 1. 跳過 WEBVTT 標頭
                if (trimmed.includes("WEBVTT")) continue;
                
                // 2. 跳過包含 --> 的時間軸行
                if (trimmed.includes("-->")) continue;
                
                // 3. 跳過純數字的區塊 ID (例如單獨一行的 1, 2, 3)
                if (/^\d+$/.test(trimmed)) continue;
                
                // 4. 跳過原本就是空行的行
                if (trimmed === "") continue;

                // 只要不是以上四種垃圾資料，就把它當作珍貴的「純字幕」，放入陣列中
                cleanLines.push(trimmed);
            }

            // 5. 終極合體：用「一個換行」把每句字幕重新黏起來，確保有換行，但絕對沒有多餘空白行！
            let finalCleanText = cleanLines.join("\n");

            // 渲染至畫面
            subtitlePreview.textContent = finalCleanText;

            // 顯示結果區塊
            resultSection.style.display = "block";
            
        } catch (error) {
            console.error(error);
            alert(`執行失敗: ${error.message}`);
        } finally {
            extractBtn.disabled = false;
            extractBtn.textContent = "擷取字幕";
        }
    });

    // 6. 一鍵複製功能
    copyBtn.addEventListener('click', async () => {
        const textToCopy = subtitlePreview.textContent;
        if (!textToCopy) {
            alert("沒有文字可以複製！");
            return;
        }

        try {
            await navigator.clipboard.writeText(textToCopy);
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "✨ 複製成功！";
            copyBtn.style.backgroundColor = "#e94560";
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.backgroundColor = "#2a9d8f";
            }, 1500);
        } catch (err) {
            console.error(err);
            alert("複製失敗，請手動全選文字複製。");
        }
    });
});