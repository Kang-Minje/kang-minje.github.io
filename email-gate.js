// email-gate.js — 다운로드 전에 이메일 + 개인정보 처리방침 동의 받기 (PDF, 포트폴리오/CV)
// 다운로드 링크/버튼 자리에 밑줄 입력칸 "email ↓"과 그 아래 "□ I’ve read and agreed with the privacy policy"가 열림.
// 동의(□ → ■)해야 다운로드. Enter 또는 ↓ → 다운로드, Esc → 취소. "privacy policy" → 처리방침 전체 화면 (Esc / ← return).
// 한 번 적은 이메일(동의 포함)은 이 브라우저에만 기억해두고 다음부터는 묻지 않음.
(function () {
    const STORE_KEY = "km-download-email-v2";   // v2: 동의를 받은 뒤부터 기억 (이전 키는 동의 없이 저장된 것)
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const POLICY_DATE = "Effective 16 November 2026";
    const POLICY = [
        ["Who is responsible", [
            "This website belongs to Kang Minje, a photographer based in Seoul, who is responsible for the personal information collected here.",
            'For anything about your information, write to <a href="mailto:info@kangminje.com">info@kangminje.com</a>.'
        ]],
        ["What is collected", [
            "Only when you download a PDF or the portfolio / CV: your e-mail address, the date, and the name of the file.",
            "Nothing else is asked for. There are no accounts and no other forms on this website."
        ]],
        ["Why", [
            "To give you the file and to keep a record of who received it.",
            "Your address is not used for newsletters or advertising, and you will not be added to any mailing list."
        ]],
        ["How long it is kept", [
            "Until you ask for it to be removed; it is then deleted without delay."
        ]],
        ["Who else handles it", [
            "Your information is not sold or given to anyone else.",
            "The website runs on GitHub, and the download record is kept in Google Sheets; they handle it only to keep the website working. When you make a project PDF, the tools for it are loaded from cdnjs and jsDelivr, which receive basic connection details such as your IP address."
        ]],
        ["Cookies", [
            "This website sets no cookies and uses no advertising or tracking tools. Your browser remembers the e-mail address you entered, so you are not asked again; it stays in your browser."
        ]],
        ["Your rights", [
            "You can ask to see, correct or delete your information, or withdraw your agreement, at any time. Write to the address above; you will have an answer within ten days.",
            'If you are not satisfied with the answer, you can contact Korea’s Personal Information Protection Commission (<a href="https://www.privacy.go.kr" target="_blank" rel="noopener">privacy.go.kr</a>) or the data protection authority where you live.'
        ]],
        ["Changes", [
            "If this policy changes, the new version will be posted here with its date."
        ]]
    ];

    function remembered() {
        try { return localStorage.getItem(STORE_KEY) || ""; } catch (e) { return ""; }
    }
    function remember(email) {
        try { localStorage.setItem(STORE_KEY, email); localStorage.removeItem("km-download-email"); } catch (e) {}
    }

    /* ---------- privacy policy: full screen, over everything ---------- */
    let policyEl = null;
    function openPolicy() {
        if (!policyEl) {
            policyEl = document.createElement("div");
            policyEl.id = "km-privacy";
            policyEl.setAttribute("role", "dialog");
            policyEl.setAttribute("aria-label", "Privacy policy");
            policyEl.innerHTML =
                '<div class="km-privacy-in">' +
                '<button type="button" class="km-privacy-back">← return</button>' +
                '<h2>Privacy policy</h2><p class="km-privacy-date">' + POLICY_DATE + "</p>" +
                POLICY.map(([h, ps]) => "<h3>" + h + "</h3>" + ps.map((p) => "<p>" + p + "</p>").join("")).join("") +
                "</div>";
            policyEl.querySelector(".km-privacy-back").addEventListener("click", closePolicy);
            document.body.appendChild(policyEl);
        }
        policyEl.scrollTop = 0;
        policyEl.classList.add("on");
    }
    function closePolicy() {
        if (!policyEl || !policyEl.classList.contains("on")) return false;
        policyEl.classList.remove("on");
        if (open) open.form.querySelector("input").focus({ preventScroll: true });
        return true;
    }
    const inPolicy = (t) => !!(policyEl && policyEl.contains(t));
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && closePolicy()) { e.stopPropagation(); e.preventDefault(); }
    }, true);

    /* ---------- the gate ---------- */
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
                '<span class="eg-row">' +
                '<input type="email" name="email" placeholder="email" autocomplete="email" inputmode="email" aria-label="email for download">' +
                '<button type="submit" aria-label="download">↓</button>' +
                "</span>" +
                '<span class="eg-row eg-agree"><button type="button" class="eg-chk" aria-pressed="false"><span class="eg-box">□</span> I’ve read and agreed with the</button> <a href="#privacy" class="eg-pol">privacy policy</a></span>';
            const input = form.querySelector("input");
            const chk = form.querySelector(".eg-chk");
            const agreed = () => chk.getAttribute("aria-pressed") === "true";

            chk.addEventListener("click", () => {
                const on = !agreed();
                chk.setAttribute("aria-pressed", String(on));
                chk.querySelector(".eg-box").textContent = on ? "■" : "□";
                form.classList.remove("unagreed");
            });
            form.querySelector(".eg-pol").addEventListener("click", (e) => { e.preventDefault(); openPolicy(); });

            form.addEventListener("submit", (e) => {
                e.preventDefault();
                const email = input.value.trim();
                if (!EMAIL_RE.test(email)) {
                    form.classList.add("invalid");
                    input.focus();
                    return;
                }
                if (!agreed()) {                       // 동의 줄만 흐리게 깜빡
                    form.classList.remove("unagreed"); void form.offsetWidth; form.classList.add("unagreed");
                    return;
                }
                remember(email);
                close(email);
            });
            input.addEventListener("input", () => form.classList.remove("invalid"));
            input.addEventListener("keydown", (e) => {
                if (e.key === "Escape" && !(policyEl && policyEl.classList.contains("on"))) { e.stopPropagation(); close(null); }
            });

            anchor.style.display = "none";
            anchor.after(form);
            open = { form, anchor, resolve };
            setTimeout(() => input.focus(), 0);
        });
    };

    // 입력칸 밖을 누르면 취소 (처리방침을 읽는 중에는 그대로)
    document.addEventListener("pointerdown", (e) => {
        if (open && !open.form.contains(e.target) && !inPolicy(e.target)) close(null);
    }, true);

    // 포트폴리오 / CV zip (PC 좌상단): 이메일 받은 뒤 다운로드 + 기록
    document.addEventListener("click", async (e) => {
        const a = e.target.closest(".d-info a[download]");
        if (!a || !/CVandPortfolio\.zip$/i.test(a.getAttribute("href") || "")) return;
        if (a.dataset.gatePassed) { delete a.dataset.gatePassed; return; } // 이메일 받은 뒤 실제 다운로드 클릭
        e.preventDefault();
        const email = await window.requestEmail(a);
        if (!email) return;
        if (window.logDownload) window.logDownload({ file: a.getAttribute("download"), email });
        a.dataset.gatePassed = "1";
        a.click();
    });
})();
