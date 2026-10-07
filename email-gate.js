// email-gate.js — 다운로드 전에 이메일 받기 (PDF, 포트폴리오/CV)
// 다운로드 링크/버튼 자리에 밑줄 입력칸 "email ↓"이 그 자리에서 열림. Enter 또는 ↓ → 다운로드, Esc → 취소.
// 한 번 적은 이메일은 이 브라우저에 기억해두고 다음부터는 묻지 않음.
(function () {
    const STORE_KEY = "km-download-email";
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function remembered() {
        try { return localStorage.getItem(STORE_KEY) || ""; } catch (e) { return ""; }
    }
    function remember(email) {
        try { localStorage.setItem(STORE_KEY, email); } catch (e) {}
    }

    let open = null; // 열려 있는 입력칸 { form, anchor, resolve }

    function close(result) {
        if (!open) return;
        const { form, anchor, resolve } = open;
        open = null;
        form.remove();
        anchor.style.display = "";
        resolve(result);
    }

    // anchor 자리에 입력칸을 열고, 이메일(또는 취소 시 null)을 돌려줌
    window.requestEmail = function (anchor, opts = {}) {
        const saved = remembered();
        if (saved) return Promise.resolve(saved);
        if (open) close(null);

        return new Promise((resolve) => {
            const form = document.createElement("form");
            form.className = "email-gate" + (opts.className ? " " + opts.className : "");
            form.noValidate = true;
            form.innerHTML =
                '<input type="email" name="email" placeholder="email" autocomplete="email" inputmode="email" aria-label="email for download">' +
                '<button type="submit" aria-label="download">↓</button>';
            const input = form.querySelector("input");

            form.addEventListener("submit", (e) => {
                e.preventDefault();
                const email = input.value.trim();
                if (!EMAIL_RE.test(email)) {
                    form.classList.add("invalid");
                    input.focus();
                    return;
                }
                remember(email);
                close(email);
            });
            input.addEventListener("input", () => form.classList.remove("invalid"));
            input.addEventListener("keydown", (e) => {
                if (e.key === "Escape") { e.stopPropagation(); close(null); }
            });

            anchor.style.display = "none";
            anchor.after(form);
            open = { form, anchor, resolve };
            setTimeout(() => input.focus(), 0);
        });
    };

    // 입력칸 밖을 누르면 취소
    document.addEventListener("pointerdown", (e) => {
        if (open && !open.form.contains(e.target)) close(null);
    }, true);

    // 포트폴리오 / CV zip (PC 좌상단): 이메일 받은 뒤 다운로드 + 기록
    document.addEventListener("click", async (e) => {
        const a = e.target.closest(".d-info a[download]");
        if (!a || !/CVandPortfolio\.zip$/i.test(a.getAttribute("href") || "")) return;
        if (a.dataset.gatePassed) { delete a.dataset.gatePassed; return; } // 이메일 받은 뒤 실제 다운로드 클릭
        e.preventDefault();
        const email = await window.requestEmail(a);
        if (!email) return;
        if (window.logDownload) window.logDownload({ type: "portfolio-cv", file: a.getAttribute("download"), email });
        a.dataset.gatePassed = "1";
        a.click();
    });
})();
