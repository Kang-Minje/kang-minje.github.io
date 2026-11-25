// log.js — 다운로드 기록. 다운로드가 일어날 때마다 구글 시트("다운로드 기록 — 강민제 (kangminje.com)")에 한 줄씩.
// 기록 항목: 날짜(시트에서 기록), 파일명 — 이것만. 이메일은 더 이상 묻지 않음 (email-gate.js 제거, 2026-11-25)
//
// LOG_ENDPOINT: 구글 시트의 Apps Script를 "웹 앱"으로 배포하면 나오는 주소 (https://script.google.com/macros/s/…/exec)
// 비어 있으면 아무것도 보내지 않음.
(function () {
    const LOG_ENDPOINT = "https://script.google.com/macros/s/AKfycbze-y8QftbgDj6RoKZdu6zdjL3CP9ZtIhbVmLaNaBd1ESeEJmO9ODF-efdcIkqlpnQ_/exec";

    window.logDownload = function (entry) {
        if (!LOG_ENDPOINT) return;
        const data = {
            email: entry.email || "",
            file: entry.file || ""
        };
        try {
            // text/plain + no-cors: 브라우저가 사전 확인(preflight) 없이 바로 보냄, 페이지를 떠나도 전송 유지
            fetch(LOG_ENDPOINT, {
                method: "POST",
                mode: "no-cors",
                keepalive: true,
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify(data)
            }).catch(() => {});
        } catch (e) {}
    };

    // 포트폴리오 / CV zip (PC 좌상단): 바로 다운로드, 파일명만 기록. 모바일은 mobile.js에서 기록
    document.addEventListener("click", (e) => {
        const a = e.target.closest(".d-info a[download]");
        if (a && /CVandPortfolio\.zip$/i.test(a.getAttribute("href") || "")) window.logDownload({ file: a.getAttribute("download") });
    });
})();
