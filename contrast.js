// contrast.js — PC 텍스트(좌상단 정보, Works/About, 푸터)의 글자색을 검정/흰색으로 자동 전환.
// 판단 단위: 기본은 줄 단위(같은 줄의 단어는 같은 색), About 본문만 단어 단위.
// 단어 아래에 깔린 이미지의 밝기를 여러 지점에서 재고, 검정/흰색 중
// "가장 불리한 지점에서의 대비"가 더 큰 쪽을 고름 (얼룩진 배경에서도 덜 묻히도록).
// 대비 계산은 APCA(WCAG 3 후보 지각 대비 모델) — WCAG 2 공식은 중간톤/채도 높은
// 배경에서 검정을 과하게 고르는 경향이 있어 실제 가독성과 어긋남.
(function () {
    const LAYERS = [".d-info", ".d-nav", "footer"];
    const MAP_SIZE = 64;        // 이미지 밝기(APCA Y) 지도 해상도 (64x64)
    const SAMPLE_STEP = 8;      // 가로 샘플 간격(px) — 단위 폭에 비례해 샘플 수 결정
    const MIN_SAMPLES_X = 5;    // 단위 하나당 최소 가로 샘플 수
    const SAMPLES_Y = 2;        // 단위 하나당 세로 샘플 수
    const WORD_UNIT = ".d-about"; // 이 안의 텍스트만 단어 단위로 판단
    // 줄 단위 묶음 기준이 되는 블록 (같은 블록 + 같은 줄 높이 = 한 줄)
    const LINE_BLOCK = "p, .d-row, .d-nav-trigger, .d-link, .footer-controls, .footer-right";

    const mq = window.matchMedia("(max-width: 600px)");
    const lumaMaps = new Map(); // src -> Float32Array | "pending"
    let words = [];

    /* ===== 1. 텍스트를 단어 단위 span.lw로 쪼개기 (공백은 앞 단어에 붙여 밑줄이 이어지게) ===== */
    function wrapWords(root) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: (n) =>
                n.parentElement.closest(".lw") || !/\S/.test(n.nodeValue)
                    ? NodeFilter.FILTER_REJECT
                    : NodeFilter.FILTER_ACCEPT
        });
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach((node) => {
            const text = node.nodeValue;
            const frag = document.createDocumentFragment();
            const lead = text.match(/^\s*/)[0];
            if (lead) frag.appendChild(document.createTextNode(lead));
            text.slice(lead.length).match(/\S+\s*/g).forEach((w) => {
                const span = document.createElement("span");
                span.className = "lw";
                span.textContent = w;
                frag.appendChild(span);
            });
            node.replaceWith(frag);
        });
        return nodes.length > 0;
    }

    function collectWords() {
        words = [];
        LAYERS.forEach((sel) => {
            const el = document.querySelector(sel);
            if (el) words.push(...el.querySelectorAll(".lw"));
        });
    }

    /* ===== 2. 이미지 밝기 지도 (로드 시 1회 계산, src별 캐시) ===== */
    /* APCA 0.0.98G 상수 */
    const APCA = {
        trc: 2.4, r: 0.2126729, g: 0.7151522, b: 0.072175,
        normBG: 0.56, normTXT: 0.57, revTXT: 0.62, revBG: 0.65,
        blkThrs: 0.022, blkClmp: 1.414, scale: 1.14, loOffset: 0.027, loClip: 0.1
    };
    const clampY = (y) => (y > APCA.blkThrs ? y : y + Math.pow(APCA.blkThrs - y, APCA.blkClmp));
    const screenY = (r, g, b) => clampY(
        APCA.r * Math.pow(r / 255, APCA.trc) + APCA.g * Math.pow(g / 255, APCA.trc) + APCA.b * Math.pow(b / 255, APCA.trc)
    );
    const Y_BLACK = clampY(0);
    const Y_WHITE = 1;

    // 글자 Y / 배경 Y → |Lc| (0~약 108, 클수록 잘 읽힘)
    function apcaLc(txt, bg) {
        if (bg > txt) {
            const s = (Math.pow(bg, APCA.normBG) - Math.pow(txt, APCA.normTXT)) * APCA.scale;
            return s < APCA.loClip ? 0 : (s - APCA.loOffset) * 100;
        }
        const s = (Math.pow(bg, APCA.revBG) - Math.pow(txt, APCA.revTXT)) * APCA.scale;
        return s > -APCA.loClip ? 0 : -(s + APCA.loOffset) * 100;
    }

    function getLumaMap(img) {
        const src = img.currentSrc || img.src;
        if (!src) return null;
        const cached = lumaMaps.get(src);
        if (cached) return cached === "pending" ? null : cached;
        if (!img.complete || !img.naturalWidth) {
            lumaMaps.set(src, "pending");
            img.addEventListener("load", () => { lumaMaps.delete(src); schedule(); }, { once: true });
            return null;
        }
        try {
            const c = document.createElement("canvas");
            c.width = c.height = MAP_SIZE;
            const ctx = c.getContext("2d", { willReadFrequently: true });
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, MAP_SIZE, MAP_SIZE);
            const data = ctx.getImageData(0, 0, MAP_SIZE, MAP_SIZE).data;
            const map = new Float32Array(MAP_SIZE * MAP_SIZE);
            for (let i = 0; i < map.length; i++) {
                map[i] = screenY(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]);
            }
            lumaMaps.set(src, map);
            return map;
        } catch (e) {
            return null; // 캔버스 읽기 실패 시 흰 배경으로 간주
        }
    }

    /* ===== 3. 화면에 깔린 레이어 목록 (아래 → 위 순서) ===== */
    const isShown = (el) => el && getComputedStyle(el).display !== "none" && getComputedStyle(el).visibility !== "hidden";
    const inView = (r) => r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;

    function buildLayers() {
        const layers = []; // { rect, img } — img가 null이면 흰 면
        const pushImg = (img) => {
            const rect = img.getBoundingClientRect();
            if (inView(rect) && getComputedStyle(img).opacity !== "0") layers.push({ rect, img });
        };
        const pushWhite = (el) => {
            const rect = el.getBoundingClientRect();
            if (inView(rect)) layers.push({ rect, img: null });
        };

        document.querySelectorAll("#canvas-container img").forEach(pushImg);
        document.querySelectorAll(".credit-box-container:not(.hidden)").forEach(pushWhite);

        const fs = document.getElementById("fullscreen-container");
        if (isShown(fs)) {
            pushWhite(fs);
            const fsImg = document.getElementById("fullscreen-img");
            if (fsImg && fsImg.getAttribute("src")) pushImg(fsImg);
            const idx = document.getElementById("fs-index2-overlay");
            if (idx && idx.classList.contains("show")) {
                pushWhite(idx);
                idx.querySelectorAll("img").forEach(pushImg);
            }
        }
        return layers;
    }

    function lumaAt(x, y, layers) {
        for (let i = layers.length - 1; i >= 0; i--) {
            const { rect, img } = layers[i];
            if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) continue;
            if (!img) return 1;
            const map = getLumaMap(img);
            if (!map) return 1;
            const mx = Math.min(MAP_SIZE - 1, Math.floor(((x - rect.left) / rect.width) * MAP_SIZE));
            const my = Math.min(MAP_SIZE - 1, Math.floor(((y - rect.top) / rect.height) * MAP_SIZE));
            return map[my * MAP_SIZE + mx];
        }
        return 1; // 아무것도 없으면 흰 배경
    }

    /* ===== 4. 판단 단위 묶기: About은 단어별, 나머지는 줄별 ===== */
    function buildUnits() {
        const units = [];
        const lines = new Map();
        words.forEach((w) => {
            const rect = w.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            if (w.closest(WORD_UNIT)) {
                units.push({ els: [w], rects: [rect] });
                return;
            }
            const block = w.closest(LINE_BLOCK) || w.parentElement;
            let byTop = lines.get(block);
            if (!byTop) lines.set(block, (byTop = new Map()));
            const key = Math.round(rect.top);
            let unit = byTop.get(key);
            if (!unit) {
                unit = { els: [], rects: [] };
                byTop.set(key, unit);
                units.push(unit);
            }
            unit.els.push(w);
            unit.rects.push(rect);
        });
        return units;
    }

    /* ===== 5. 단위별 색 결정 ===== */
    function isDark(rects, layers) {
        let minBlack = Infinity, minWhite = Infinity;
        rects.forEach((r) => {
            const nx = Math.max(MIN_SAMPLES_X, Math.ceil(r.width / SAMPLE_STEP));
            for (let sx = 0; sx < nx; sx++) {
                for (let sy = 0; sy < SAMPLES_Y; sy++) {
                    const x = r.left + ((sx + 0.5) / nx) * r.width;
                    const y = r.top + ((sy + 0.5) / SAMPLES_Y) * r.height;
                    const bg = lumaAt(x, y, layers);
                    minBlack = Math.min(minBlack, apcaLc(Y_BLACK, bg));
                    minWhite = Math.min(minWhite, apcaLc(Y_WHITE, bg));
                }
            }
        });
        return minWhite > minBlack;
    }

    function update() {
        if (mq.matches || !words.length) return;
        const layers = buildLayers();
        buildUnits().forEach(({ els, rects }) => {
            const dark = layers.length > 0 && isDark(rects, layers);
            els.forEach((w) => {
                if (w.classList.contains("on-dark") !== dark) w.classList.toggle("on-dark", dark);
            });
        });
    }

    let queued = false;
    function schedule() {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
            queued = false;
            update();
        });
    }

    /* ===== 6. 초기화 & 갱신 트리거 ===== */
    function rewrapAll() {
        let changed = false;
        LAYERS.forEach((sel) => {
            const el = document.querySelector(sel);
            if (el && wrapWords(el)) changed = true;
        });
        if (changed) collectWords();
        schedule();
    }

    rewrapAll();

    // 카운터/Threshold 값처럼 내용이 바뀌는 텍스트는 다시 쪼갬
    const textObserver = new MutationObserver(rewrapAll);
    LAYERS.forEach((sel) => {
        const el = document.querySelector(sel);
        if (el) textObserver.observe(el, { childList: true, subtree: true, characterData: true });
    });

    // 이미지 생성/삭제, 풀스크린·인덱스 열고 닫기
    const layerObserver = new MutationObserver(schedule);
    const canvas = document.getElementById("canvas-container");
    if (canvas) layerObserver.observe(canvas, { childList: true });
    ["fullscreen-container", "fullscreen-img", "fs-index2-overlay"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) layerObserver.observe(el, { attributes: true, attributeFilter: ["class", "style", "src"] });
    });
    document.querySelectorAll(".credit-box-container").forEach((el) =>
        layerObserver.observe(el, { attributes: true, attributeFilter: ["class"] })
    );

    document.addEventListener("load", (e) => { if (e.target.tagName === "IMG") schedule(); }, true);
    document.addEventListener("transitionend", schedule, true);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    document.addEventListener("pointerover", schedule, { passive: true }); // 패널 열림 등 hover 상태 변화
})();
