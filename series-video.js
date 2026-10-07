// series-video.js — 시리즈 페이지 영상 (fluidpaper.com과 같은 방식)
// 1) 영상은 그리드 맨 끝에 일반 사진 크기로 놓임 (소리 없이 반복 재생, 캡션 없음)
// 2) 끝까지 내려 썸네일이 화면 가운데 온 상태에서 더 내리면 "보려는 의도"로 보고 전체화면으로:
//    - minititle처럼 화면에 보이는 다른 사진들이 페이지 순서대로 하나씩 즉시 사라지고
//      (간격 합계 = min(600ms, 70ms × 개수)), 250ms 뒤
//    - 썸네일(이미 재생 중인 그 영상)이 첫 번째 타일 자리로 커짐 (GPU transform만 사용)
//    - 검정 바탕 위에 화면 높이 영상을 왼쪽부터 가로로 반복해 화면을 채움 (fluidpaper 타일)
// 3) 기본 음소거, 소리는 첫 번째 타일만 (unmute / mute). 모든 글자는 흰색
// 4) 썸네일에 마우스를 올려도 바로 전환 (스크롤 끝이 아니어도)
// 5) 위로 스크롤하거나 Esc → 원래 페이지로
(function () {
    const SERIES_VIDEOS = {
        // thumbFrom: 그리드 썸네일은 이 시점부터 반복 재생 (Sihun은 앞 2.3초가 검정)
        sihun: { src: "video/sihun.mp4", poster: "video/sihun-poster.jpg", aspect: 2040 / 1440, thumbFrom: 2.5 },
        leo: { src: "video/leo.mp4", poster: "video/leo-poster.jpg", aspect: 1080 / 1440 }
    };
    const EASE = "cubic-bezier(0.25, 0.46, 0.45, 0.94)"; // ease-out-quad
    const GROW_MS = 600;
    const STAGGER_PER = 70;    // minititle: 70ms × 개수
    const STAGGER_MAX = 600;   // minititle: 최대 600ms
    const STAGGER_PAUSE = 250; // minititle: 다 사라진 뒤 250ms
    const EXIT_SCROLL = 60;
    const PUSH = 150;

    const video = SERIES_VIDEOS[getPage()];
    if (!video || !container.classList.contains("photoshoot-series-layout")) return;
    if (window.matchMedia("(max-width: 600px)").matches) return;

    /* ===== 그리드 맨 끝의 영상 썸네일 ===== */
    const item = document.createElement("div");
    item.className = "photoshoot-series-item series-video-item";
    const thumb = document.createElement("video");
    Object.assign(thumb, { src: video.src, poster: video.poster, muted: true, loop: true, playsInline: true, preload: "auto" });
    thumb.defaultMuted = true;
    thumb.setAttribute("aria-label", "video");
    item.append(thumb); // 영상에는 캡션 없음
    // 사진과 높이가 다르므로 항상 혼자 한 행, 가운데 (세로 영상은 사진 한 칸 너비, 가로 영상은 두 칸 너비)
    item.style.justifySelf = "center";
    item.style.width = video.aspect > 1
        ? "calc(var(--series-col-w) * 2 + var(--series-gap))"
        : "var(--series-col-w)";
    container.appendChild(item);
    seriesEntries.push({ el: item, wide: video.aspect > 1, solo: true });

    // 썸네일은 검정 도입부를 건너뛰고 thumbFrom부터 반복
    const thumbFrom = video.thumbFrom || 0;
    const skipIntro = () => { if (thumbFrom && thumb.readyState >= 1 && thumb.currentTime < thumbFrom) thumb.currentTime = thumbFrom; };
    if (thumbFrom) {
        thumb.loop = false;
        ["loadedmetadata", "loadeddata", "play"].forEach((ev) => thumb.addEventListener(ev, skipIntro));
        thumb.addEventListener("ended", () => { thumb.currentTime = thumbFrom; thumb.play().catch(() => {}); });
        skipIntro();
    }
    layoutSeriesGrid();

    // 그리드 아래 여백: 맨 끝에서 썸네일이 화면 정중앙에 오도록 (그리드 자체 아래 여백은 없앰)
    container.style.paddingBottom = "0px";
    const runway = document.createElement("div");
    runway.className = "series-video-runway";
    container.after(runway);
    function sizeRunway() {
        const cur = runway.offsetHeight;
        const t = thumb.getBoundingClientRect();
        const thumbCenterDoc = t.top + scrollY + t.height / 2;
        const next = Math.max(0, cur + innerHeight / 2 - (document.documentElement.scrollHeight - thumbCenterDoc));
        if (Math.abs(next - cur) > 1) runway.style.height = `${next}px`;
    }
    new ResizeObserver(sizeRunway).observe(container);
    window.addEventListener("load", sizeRunway);

    /* ===== 전체화면 타일 (fluidpaper) ===== */
    const stage = document.createElement("div");
    stage.className = "series-video-stage";
    stage.setAttribute("aria-hidden", "true");
    document.body.appendChild(stage);

    const unmute = document.createElement("button");
    unmute.className = "series-video-sound";
    unmute.type = "button";
    unmute.textContent = "unmute";
    document.body.appendChild(unmute);

    let tiles = [];
    let muted = true;
    let active = false;
    let timers = [];
    let hidden = [];

    // 화면 높이에 맞춘 영상을 왼쪽부터 가로로 채울 만큼 (fluidpaper와 같은 계산). 한 번 만든 타일은 계속 재사용
    function buildTiles() {
        const needed = Math.max(1, Math.ceil(innerWidth / (innerHeight * video.aspect)));
        while (tiles.length < needed) {
            const el = document.createElement("video");
            el.muted = tiles.length === 0 ? muted : true; // 소리는 첫 번째 타일만
            el.defaultMuted = true;
            el.loop = true;
            el.playsInline = true;
            el.preload = "auto";
            el.poster = video.poster;
            el.src = video.src;
            el.style.width = `${innerHeight * video.aspect}px`; // 데이터가 오기 전에도 자리 확정
            el.addEventListener("canplay", () => { if (active && el.paused) el.play().catch(() => {}); });
            stage.appendChild(el);
            tiles.push(el);
            if (active) el.play().catch(() => {});
        }
        while (tiles.length > needed) {
            const el = tiles.pop();
            el.pause();
            el.remove();
        }
        tiles.forEach((el) => { el.style.width = `${innerHeight * video.aspect}px`; });
    }

    // 썸네일이 화면에 들어오면: 썸네일 재생 + 타일을 미리 만들어 받아둠 (전환 때 바로 재생되도록)
    new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
            thumb.play().catch(() => {});
            buildTiles();
        } else if (!active) {
            thumb.pause();
        }
    }).observe(thumb);

    /* ===== 전환 ===== */
    function later(fn, ms) {
        timers.push(setTimeout(fn, ms));
    }

    // 1단계 (minititle): 화면에 보이는 다른 사진들을 페이지 순서대로 하나씩 즉시 숨김
    function hideOthers() {
        const others = [...container.children].filter((el) => {
            if (el === item) return false;
            const r = el.getBoundingClientRect();
            return r.bottom > 0 && r.top < innerHeight;
        });
        const amount = Math.min(STAGGER_MAX, STAGGER_PER * others.length);
        const step = others.length > 1 ? amount / (others.length - 1) : 0;
        others.forEach((el, i) => later(() => { el.style.visibility = "hidden"; hidden.push(el); }, Math.round(step * i)));
        return amount;
    }

    function enter() {
        if (active) return;
        active = true;
        const amount = hideOthers();
        // 사진이 사라지는 동안 타일을 미리 맞는 장면으로 옮겨두고 멈춰둠 (커질 때 디코딩 부담이 없게)
        buildTiles();
        const lead = (amount + STAGGER_PAUSE + GROW_MS) / 1000;
        const startAt = thumb.duration ? (thumb.currentTime + lead) % thumb.duration : 0;
        tiles.forEach((el) => {
            el.pause();
            try { el.currentTime = startAt; } catch (e) {}
        });
        later(grow, amount + STAGGER_PAUSE);
    }

    // 2단계: 재생 중인 썸네일 자체가 첫 번째 타일 자리로 커짐 (transform만 → 부드럽게, 이 동안 다른 영상은 멈춤)
    function grow() {
        const from = thumb.getBoundingClientRect();
        const scale = innerHeight / from.height;
        item.classList.add("growing");
        thumb.style.transformOrigin = "0 0";
        thumb.style.transition = `transform ${GROW_MS}ms ${EASE}`;
        thumb.style.transform = `translate(${-from.left}px, ${-from.top}px) scale(${scale})`;

        document.body.classList.add("video-active"); // 검정 바탕 + 흰 글자
        stage.classList.add("show");

        // 다 커진 뒤에 타일 재생 시작 → 바로 타일로 교체
        later(() => {
            tiles.forEach((el) => el.play().catch(() => {}));
            stage.classList.add("tiles-in");
            thumb.style.visibility = "hidden";
        }, GROW_MS);
    }

    function exit() {
        if (!active) return;
        active = false;
        timers.forEach(clearTimeout);
        timers = [];
        hidden.forEach((el) => { el.style.visibility = ""; });
        hidden = [];
        tiles.forEach((el) => el.pause());
        stage.classList.remove("show", "tiles-in");
        document.body.classList.remove("video-active");
        item.classList.remove("growing");
        Object.assign(thumb.style, { transition: "none", transform: "", visibility: "" });
        thumb.play().catch(() => {});
    }

    /* ===== 의도 확인: 맨 끝(썸네일이 가운데)에서 더 내리려고 하면 ===== */
    const atBottom = () => scrollY + innerHeight >= document.documentElement.scrollHeight - 2;
    let push = 0;
    let pushTimer = null;
    let enteredAt = 0;
    function addPush(amount) {
        if (active || !atBottom()) { push = 0; return; }
        push += amount;
        clearTimeout(pushTimer);
        pushTimer = setTimeout(() => { push = 0; }, 600);
        if (push >= PUSH) { push = 0; enteredAt = scrollY; enter(); }
    }
    // 썸네일에 마우스를 올려도 (스크롤 끝이 아니어도) 바로 전환. 스크롤하다 스치는 경우는 제외하려고 잠깐(HOVER_MS) 머물면 시작
    const HOVER_MS = 200;
    let hoverTimer = null;
    thumb.addEventListener("pointerenter", (e) => {
        if (e.pointerType === "touch" || active) return;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => { enteredAt = scrollY; enter(); }, HOVER_MS);
    });
    thumb.addEventListener("pointerleave", () => clearTimeout(hoverTimer));

    window.addEventListener("wheel", (e) => {
        if (active) { if (e.deltaY < -20) exit(); return; }
        if (e.deltaY > 0) addPush(e.deltaY);
    }, { passive: true });
    let touchY = null;
    window.addEventListener("touchstart", (e) => { touchY = e.touches[0].clientY; }, { passive: true });
    window.addEventListener("touchmove", (e) => {
        if (touchY === null) return;
        const dy = touchY - e.touches[0].clientY;
        if (active && dy < -20) exit();
        else if (dy > 0) addPush(dy * 2);
        touchY = e.touches[0].clientY;
    }, { passive: true });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") { exit(); return; }
        if (["ArrowDown", "PageDown", " ", "End"].includes(e.key) && atBottom() && !active) { e.preventDefault(); enteredAt = scrollY; enter(); }
        if (["ArrowUp", "PageUp", "Home"].includes(e.key) && active) exit();
    });
    window.addEventListener("scroll", () => {
        if (active) {
            if (scrollY < enteredAt - EXIT_SCROLL) exit();
            return;
        }
        if (scrollY + innerHeight > document.documentElement.scrollHeight - innerHeight * 1.5) sizeRunway();
    }, { passive: true });

    unmute.addEventListener("click", () => {
        muted = !muted;
        tiles.forEach((el, i) => { el.muted = i === 0 ? muted : true; });
        unmute.textContent = muted ? "unmute" : "mute";
    });
    window.addEventListener("resize", () => {
        sizeRunway();
        if (active) buildTiles();
    });
})();
