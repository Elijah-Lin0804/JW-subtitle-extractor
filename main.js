document.addEventListener('DOMContentLoaded', () => {
    const extractBtn = document.getElementById('extractBtn');
    const copyBtn = document.getElementById('copyBtn');
    const urlInput = document.getElementById('videoUrl'); 
    const resultSection = document.getElementById('resultSection');
    const subtitlePreview = document.getElementById('subtitlePreview');
    const videoTitleDisplay = document.getElementById('videoTitleDisplay'); 

    extractBtn.addEventListener('click', async () => {
        const rawUrl = urlInput.value.trim();

        // ============【1. 超級強固的 ID 抓取術】============
        let videoId = "";
        let apiType = ""; 

        const docidMatch = rawUrl.match(/docid=(\d+)/) || rawUrl.match(/docid-(\d+)/);
        
        if (docidMatch) {
            videoId = docidMatch[1];
            apiType = "docid"; 
            console.log(`【網址解析】偵測到 docid: ${videoId}`);
        } else {
            const urlParts = rawUrl.split('?');
            if (urlParts.length >= 2) {
                const urlParams = new URLSearchParams(urlParts[1]);
                videoId = urlParams.get('lank');
                if (videoId) {
                    apiType = "lank"; 
                    console.log(`【網址解析】偵測到 lank: ${videoId}`);
                }
            }
        }

        if (!videoId) {
            alert("網址裡找不到正確的影片識別碼。");
            return;
        }

        // 宣告準備用來裝最終成果的籃子
        let finalSubtitleUrl = "";
        let videoTitle = "未命名影片";

        try {
            extractBtn.disabled = true;
            extractBtn.textContent = "擷取中...";

            // ============【2 & 3. 智慧分流請求官方 API 與處理延遲】============
            if (apiType === "lank") {
                // 🌟 【全新 LANK 路線】直接敲中文大門獲取字幕與真實標題
                const apiTarget = `https://b.jw-cdn.org/apis/mediator/v1/media-items/CH/${videoId}?clientType=www`;
                console.log(`正在請求新版中文 API: ${apiTarget}`);

                const response = await fetch(apiTarget);
                if (!response.ok) throw new Error(`新版 API 錯誤代碼: ${response.status}`);
                const data = await response.json();

                if (data.media && data.media[0]) {
                    // 撈取最上層的精準中文標題
                    if (data.media[0].title) {
                        videoTitle = data.media[0].title;
                    }

                    // 撈取中文字幕網址
                    if (data.media[0].files) {
                        const chFiles = data.media[0].files;
                        // 優先找有自帶 subtitles 的物件，找不到就抓第一個
                        const targetChVideo = chFiles.find(f => f.subtitles && f.subtitles.url) || chFiles[0];
                        if (targetChVideo && targetChVideo.subtitles && targetChVideo.subtitles.url) {
                            finalSubtitleUrl = targetChVideo.subtitles.url;
                        }
                    }
                }
            } 
            else {
                // 🔒 【原本的 DOCID 路線】完全保留原本運作完美的舊版邏輯
                const apiTarget = `https://b.jw-cdn.org/apis/pub-media/GETPUBMEDIALINKS?docid=${videoId}&output=json&fileformat=m4v%2Cmp4&alllangs=1&langwritten=CH`;
                console.log(`正在請求舊版 API: ${apiTarget}`);

                const response = await fetch(apiTarget);
                if (!response.ok) throw new Error(`舊版 API 錯誤代碼: ${response.status}`);
                const data = await response.json();

                let chineseFilesData = data.files['CH'];
                if (!chineseFilesData) {
                    alert("找不到這部影片的中文版本資料！");
                    return;
                }

                // 處理延遲載入
                if (chineseFilesData.__deferred) {
                    const deferredCHResponse = await fetch(chineseFilesData.__deferred);
                    const deferredCHData = await deferredCHResponse.json();
                    chineseFilesData = deferredCHData.files['CH'];
                }

                // 鎖定舊版字幕網址與標題
                const chMp4Files = chineseFilesData.MP4 || chineseFilesData.mp4;
                if (chMp4Files && chMp4Files.length > 0) {
                    const firstChVideo = chMp4Files[0];
                    if (firstChVideo.title) {
                        videoTitle = firstChVideo.title; 
                    }
                    if (firstChVideo.subtitles && firstChVideo.subtitles.url) {
                        finalSubtitleUrl = firstChVideo.subtitles.url;
                    }
                }
                if (!finalSubtitleUrl && chineseFilesData.subtitles && chineseFilesData.subtitles.vtt) {
                    finalSubtitleUrl = chineseFilesData.subtitles.vtt[0].fileSelect;
                }
            }

            // 安全防護：確保有拿到字幕網址
            if (!finalSubtitleUrl) {
                alert("找不到這部影片的中文字幕檔。");
                return;
            }

            // 將標題呈現在網頁畫面上
            videoTitleDisplay.textContent = `🎬 ${videoTitle}`;

            // ============【4. 下載字幕並進行精準清洗（你原本超棒的清洗機）】============
            console.log(`正在從網路下載真實字幕檔: ${finalSubtitleUrl}`);
            const subResponse = await fetch(finalSubtitleUrl);
            if (!subResponse.ok) throw new Error("下載字幕內容失敗。");
            
            let originalLines = await subResponse.text();

            // 精準逐行過濾
            let lines = originalLines.split(/\r?\n/);
            let cleanLines = [];

            for (let line of lines) {
                let trimmed = line.trim();

                if (trimmed.includes("WEBVTT")) continue;
                if (trimmed.includes("-->")) continue;
                if (/^\d+$/.test(trimmed)) continue;
                if (trimmed === "") continue;

                cleanLines.push(trimmed);
            }

            // 終極合體
            let finalCleanText = cleanLines.join("\n");

            // 渲染至畫面
            subtitlePreview.textContent = finalCleanText;
            resultSection.style.display = "block";
            
        } catch (error) {
            console.error(error);
            alert(`執行失敗: ${error.message}`);
        } finally {
            extractBtn.disabled = false;
            extractBtn.textContent = "擷取字幕";
        }
    });

    // ============【5. 一鍵複製功能（維持原樣）】============
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