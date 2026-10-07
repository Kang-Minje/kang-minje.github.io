// log.js — 다운로드 로그 (익명). 다운로드가 일어날 때마다 구글 시트에 한 줄씩 기록.
// 기록 항목: 시간(시트에서 기록), 종류(pdf / portfolio-cv), 이메일(다운로드 전에 입력받음, email-gate.js),
// 프로젝트, 파일명, 장수, 페이지 주소, 브라우저 언어, 들어온 경로
//
// LOG_ENDPOINT: 구글 시트의 Apps Script를 "웹 앱"으로 배포하면 나오는 주소 (https://script.google.com/macros/s/…/exec)
// 비어 있으면 아무것도 보내지 않음.
(function () {
    const LOG_ENDPOINT = "https://script.google.com/macros/s/AKfycbze-y8QftbgDj6RoKZdu6zdjL3CP9ZtIhbVmLaNaBd1ESeEJmO9ODF-efdcIkqlpnQ_/exec";

    window.logDownload = function (entry) {
        if (!LOG_ENDPOINT) return;
        const data = {
            type: entry.type || "",
            email: entry.email || "",
            project: entry.project || "",
            file: entry.file || "",
            pages: entry.pages || "",
            page: location.pathname + location.search,
            lang: navigator.language || "",
            ref: document.referrer || ""
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

    // 포트폴리오 / CV zip 다운로드 기록은 email-gate.js(PC)와 mobile.js(모바일)에서 이메일과 함께 보냄
})();
