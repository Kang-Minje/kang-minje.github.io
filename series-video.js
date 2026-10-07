// series-video.js — 시리즈 페이지 영상 (fluidpaper.com과 같은 방식)
// 1) 영상은 그리드 맨 끝에 일반 사진 크기로 놓임 (소리 없이 반복 재생, 캡션 없음)
// 2) 끝까지 내려 썸네일이 화면 가운데 온 상태에서 더 내리면 "보려는 의도"로 보고 전체화면으로:
//    - minititle처럼 화면에 보이는 다른 사진들이 페이지 순서대로 하나씩 즉시 사라지고
//      (간격 합계 = min(600ms, 70ms × 개수)), 250ms 뒤
//    - 썸네일(이미 재생 중인 그 영상)이 첫 번째 타일 자리로 커짐 (GPU transform만 사용)
//    - 검정 바탕 위에 화면 높이 영상을 왼쪽부터 가로로 반복해 화면을 채움 (fluidpaper 타일)
// 3) 기본 음소거, 소리는 첫 번째 타일만 (unmute / mute). 모든 글자는 흰색
// 4) 위로 스크롤하거나 Esc → 원래 페이지로
(function () {
    const SERIES_VIDEOS = {
        sihun: { src: "video/sihun.mp4", poster: "video/sihun-poster.jpg", aspect: 2040 / 1440 },
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
    item.append(thumb);
    container.appendChild(item);
    seriesEntries.push({ el: item, wide: video.aspect > 1 });
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
        later(grow, amount + STAGGER_PAUSE);
    }

    // 2단계: 재생 중인 썸네일 자체가 첫 번째 타일 자리로 커짐 (transform만 → 부드럽게, 다시 로드 없음)
    function grow() {
        buildTiles();
        // 타일은 보이지 않는 상태로 미리 재생 시작 → 커지기가 끝날 때 썸네일과 같은 장면에서 이어짐
        const startAt = (thumb.currentTime + GROW_MS / 1000) % (thumb.duration || Infinity);
        tiles.forEach((el) => {
            try { el.currentTime = startAt; } catch (e) {}
            el.play().catch(() => {});
        });

        const from = thumb.getBoundingClientRect();
        const scale = innerHeight / from.height;
        item.classList.add("growing");
        thumb.style.transformOrigin = "0 0";
        thumb.style.transition = `transform ${GROW_MS}ms ${EASE}`;
        thumb.style.transform = `translate(${-from.left}px, ${-from.top}px) scale(${scale})`;

        document.body.classList.add("video-active"); // 검정 바탕 + 흰 글자
        stage.classList.add("show");

        later(() => {
            stage.classList.add("tiles-in"); // 타일 등장 (이미 재생 중)
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
