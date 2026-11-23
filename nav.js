/* nav.js — 메인(index.html)과 Prints 페이지가 함께 쓰는 데스크톱 상단 메뉴 스크립트
   1) Prints 링크 실제 너비를 --prints-w로 → Works·About·Prints 간격이 같고 Prints 우측 여백 = 이름 좌측 여백
   2) About 키워드 hover 이미지
   3) Works / About 드롭다운 컨트롤러 */

const navIsAboutMode = () => document.documentElement.classList.contains("about-mode");

(function measurePrints() {
    const link = document.querySelector(".d-nav-prints");
    if (!link) return;
    const set = () => {
        const w = link.getBoundingClientRect().width;
        if (w) document.documentElement.style.setProperty("--prints-w", w + "px");
    };
    set();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(set);
})();

/* ===== About 키워드 hover 이미지 =====
   About 본문의 키워드(.d-word[data-img])에 올리면 화면 중앙에 해당 사진을 띄움.
   data-full이 있는 키워드(가로 사진)는 브라우저 전체 크기로. 글자는 항상 사진 위.
   애니메이션 없이 바로 교체, 사진은 다음 사진이 뜨거나 About이 닫힐 때까지 유지. */
(function () {
    const box = document.getElementById("word-image");
    const about = document.querySelector(".d-about");
    if (!box || !about) return;
    const img = box.querySelector("img");
    let preloaded = false;
    let shownKey = null;
    let token = 0;

    const srcFor = (key) => {
        const m = key.match(/^(.+)-(\d+)$/);
        if (!m) return "";
        // 메인(script.js)에서는 기존 경로 규칙, 다른 페이지(Prints 등)에서는 /img/web 절대경로
        return (typeof assetSrc === "function" && typeof resolveImagePath === "function")
            ? assetSrc(resolveImagePath(m[1], Number(m[2])))
            : `/img/web/${m[1]}-${m[2]}.avif`;
    };

    // 처음 About 텍스트에 다가갈 때 키워드 사진을 미리 받아둠 (hover 즉시 표시)
    function preload() {
        if (preloaded) return;
        preloaded = true;
        new Set([...about.querySelectorAll(".d-word")].map((w) => w.dataset.img))
            .forEach((key) => { new Image().src = srcFor(key); });
    }

    // 다음 사진이 준비(디코딩)된 뒤에 바꿔 끼움 → 사진 사이에 흰 화면이 끼지 않음.
    // 커서를 떼도 사진은 남아 있고, 다음 키워드에서 바로 교체됨.
    function show(word) {
        const key = word.dataset.img;
        if (key === shownKey) return;
        const t = ++token;
        const next = new Image();
        next.src = srcFor(key);
        const apply = () => {
            if (t !== token) return; // 그 사이 다른 키워드로 옮겨갔으면 무시
            img.src = next.src;
            // 브라우저 전체 크기는 가로 사진만 (세로는 너무 잘림)
            box.classList.toggle("full", word.hasAttribute("data-full") && next.naturalWidth > next.naturalHeight);
            box.classList.add("show");
            shownKey = key;
        };
        // 로드 → 디코딩까지 기다린 뒤 교체 (디코딩이 지연되는 환경 대비 최대 150ms만 대기)
        const loaded = next.complete ? Promise.resolve() : new Promise((r) => { next.onload = next.onerror = r; });
        loaded
            .then(() => Promise.race([
                next.decode ? next.decode().catch(() => {}) : null,
                new Promise((r) => setTimeout(r, 150))
            ]))
            .then(apply);
    }

    // About 텍스트가 닫힐 때만 사진을 내림
    function hide() {
        token++;
        shownKey = null;
        box.classList.remove("show");
    }

    about.addEventListener("pointerenter", preload);
    about.addEventListener("pointerover", (e) => {
        if (e.pointerType === "touch") return;
        const word = e.target.closest(".d-word");
        if (word) show(word);
    });
    // About 패널이 닫히면(또는 Works가 열려 가려지면) 사진도 함께 닫음
    const aboutItem = about.closest(".d-nav-item");
    const worksItem = document.querySelector(".d-nav-works");
    const panelShown = () =>
        aboutItem.classList.contains("open") ||
        (aboutItem.classList.contains("has-current") && !worksItem.classList.contains("open"));
    new MutationObserver(() => {
        if (!panelShown()) hide();
    }).observe(document.querySelector(".d-nav"), { subtree: true, attributes: true, attributeFilter: ["class"] });
    if (navIsAboutMode()) preload();
})();


/* ===== Desktop 우측 메뉴(Works / About) 컨트롤러 =====
   CSS :hover 대신 상태를 하나만 두어 두 패널이 동시에 열리지 않게 함.
   - 닫힌 상태에서 트리거에 올리면 즉시 열림
   - 다른 메뉴가 열려 있을 때는 트리거 위에 잠깐(SWITCH_DELAY) 머물거나 트리거 아래로 내려가야 전환
     → 옆으로 스치기만 해서는 바뀌지 않음
   - 전환 시 이전 패널은 페이드 없이 즉시 숨김
   - 메뉴 영역(트리거+패널)을 벗어나도 CLOSE_DELAY 동안은 유지 → 다시 들어오면 그대로
   - 마우스·펜은 hover, 터치는 트리거 탭으로 열고 닫기, 바깥 탭으로 닫기
   - About은 클릭하면 About 페이지(?page=about)로 이동: 이미지가 서서히 사라진 뒤 이동
     (터치는 열린 상태에서 한 번 더 탭) */
(function () {
    const nav = document.querySelector(".d-nav");
    if (!nav) return;
    const items = [...nav.querySelectorAll(".d-nav-item")];
    const CLOSE_DELAY = 400;
    const SWITCH_DELAY = 120;
    let active = null;
    let closeTimer = null;
    let switchTimer = null;
    let pendingItem = null;
    let lastPointerType = "mouse";
    // 마우스뿐 아니라 펜(와콤·사이드카 등)도 hover로 취급. 터치만 탭 방식
    const isHoverPointer = (e) => e.pointerType !== "touch";

    function setActive(item) {
        clearTimeout(closeTimer);
        clearTimeout(switchTimer);
        pendingItem = null;
        if (item === active) return;
        if (active) {
            const prev = active.querySelector(".d-panel");
            // 전환이면 즉시 숨김, 완전히 닫는 경우엔 페이드
            if (item) prev.classList.add("instant");
            active.classList.remove("open");
            if (item) {
                void prev.offsetWidth;
                prev.classList.remove("instant");
            }
        }
        active = item;
        if (item) item.classList.add("open");
    }

    items.forEach((item) => {
        const trigger = item.querySelector(".d-nav-trigger");

        // 트리거 진입: pointerenter + pointermove(이미 트리거 위에 커서가 있던 경우 대비)
        const onTriggerHover = (e) => {
            if (!isHoverPointer(e)) return;
            if (active === item) {
                clearTimeout(closeTimer);
            } else if (!active) {
                setActive(item);
            } else if (pendingItem !== item) {
                clearTimeout(switchTimer);
                pendingItem = item;
                switchTimer = setTimeout(() => setActive(item), SWITCH_DELAY);
            }
        };
        trigger.addEventListener("pointerenter", onTriggerHover);
        trigger.addEventListener("pointermove", onTriggerHover);
        trigger.addEventListener("pointerleave", (e) => {
            // 전환 대기 중 트리거 아래(자기 패널 쪽)로 빠져나가면 의도가 분명하므로 바로 전환
            if (pendingItem === item && e.clientY >= trigger.getBoundingClientRect().bottom - 1) {
                setActive(item);
            } else {
                clearTimeout(switchTimer);
                pendingItem = null;
            }
        });

        item.addEventListener("pointerenter", (e) => {
            if (!isHoverPointer(e) || item !== active) return;
            clearTimeout(closeTimer);
        });
        item.addEventListener("pointerleave", (e) => {
            if (!isHoverPointer(e) || item !== active) return;
            clearTimeout(closeTimer);
            closeTimer = setTimeout(() => setActive(null), CLOSE_DELAY);
        });

        trigger.addEventListener("click", (e) => {
            // 실제 링크가 있는 트리거(About → ?page=about)는 클릭 시 이동.
            // 터치에서는 첫 탭은 메뉴 열기, 열린 상태에서 다시 탭하면 이동
            const hasPage = trigger.getAttribute("href") !== "#";
            if (hasPage && (lastPointerType !== "touch" || active === item)) {
                e.preventDefault();
                if (navIsAboutMode()) return; // 이미 About 페이지
                // 메인 밖(Prints 등)에서는 바로 이동
                if (!document.getElementById("canvas-container")) {
                    location.href = trigger.getAttribute("href");
                    return;
                }
                // 전환: 이미지 페이드아웃 후 이동
                document.documentElement.classList.add("about-mode", "about-entering");
                setTimeout(() => { location.href = trigger.getAttribute("href"); }, 500);
                return;
            }
            e.preventDefault();
            if (lastPointerType !== "touch") setActive(item);
            else setActive(active === item ? null : item);
        });
    });

    document.addEventListener("pointerdown", (e) => {
        lastPointerType = e.pointerType || "mouse";
        if (!e.target.closest(".d-nav")) setActive(null);
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setActive(null);
    });
    // 뒤로가기(bfcache)로 돌아왔을 때 이전에 열려 있던 상태가 남지 않도록 초기화
    window.addEventListener("pageshow", (e) => {
        if (e.persisted) setActive(null);
    });
})();
