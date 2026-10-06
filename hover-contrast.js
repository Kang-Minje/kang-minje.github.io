// hover-contrast.js — PC에서 링크/메뉴에 hover했을 때, 그 글자 뒤 사진이 어두우면 흰색으로 표시.
// 평소 글자는 항상 검정. hover 중인 요소 하나만 판단함.
(function () {
    const TARGETS = ".d-info a, .d-nav-trigger, .d-nav a.d-row, .d-nav .other-link:not(.other-link-jagook), footer button, footer .footer-link";
    const MAP_SIZE = 64;     // 이미지 밝기(APCA Y) 지도 해상도
    const SAMPLE_STEP = 8;   // 가로 샘플 간격(px)
    const SAMPLES_Y = 2;

    const mq = window.matchMedia("(max-width: 600px)");
    const lumaMaps = new Map(); // src -> Float32Array | "pending"
    let current = null;

    /* ===== 밝기 계산: APCA(WCAG 3 후보 지각 대비 모델) ===== */
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

    // 글자 Y / 배경 Y → |Lc| (클수록 잘 읽힘)
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
            img.addEventListener("load", () => { lumaMaps.delete(src); evaluate(); }, { once: true });
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

    /* ===== 화면에 깔린 레이어 (아래 → 위) ===== */
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

    /* ===== hover 중인 요소 판단: 글자가 실제로 있는 영역만 샘플링 ===== */
    function isDarkBehind(el) {
        const layers = buildLayers();
        if (!layers.length) return false;
        const range = document.createRange();
        range.selectNodeContents(el);
        let minBlack = Infinity, minWhite = Infinity;
        [...range.getClientRects()].forEach((r) => {
            if (r.width < 1 || r.height < 1) return;
            const nx = Math.max(3, Math.ceil(r.width / SAMPLE_STEP));
            for (let sx = 0; sx < nx; sx++) {
                for (let sy = 0; sy < SAMPLES_Y; sy++) {
                    const bg = lumaAt(r.left + ((sx + 0.5) / nx) * r.width, r.top + ((sy + 0.5) / SAMPLES_Y) * r.height, layers);
                    minBlack = Math.min(minBlack, apcaLc(Y_BLACK, bg));
                    minWhite = Math.min(minWhite, apcaLc(Y_WHITE, bg));
                }
            }
        });
        return minWhite > minBlack;
    }

    function evaluate() {
        if (!current) return;
        current.classList.toggle("hover-dark", !mq.matches && isDarkBehind(current));
    }

    function setCurrent(el) {
        if (el === current) return;
        if (current) current.classList.remove("hover-dark");
        current = el;
        evaluate();
    }

    document.addEventListener("pointerover", (e) => {
        if (e.pointerType === "touch") return;
        setCurrent(e.target.closest(TARGETS));
    });
    document.addEventListener("pointerout", (e) => {
        if (current && !current.contains(e.relatedTarget)) setCurrent(null);
    });

    // hover 중에 뒤 사진이 바뀌는 경우(커서 따라 새 이미지 생성, 풀스크린 전환 등) 다시 판단
    const canvas = document.getElementById("canvas-container");
    if (canvas) new MutationObserver(evaluate).observe(canvas, { childList: true });
    window.addEventListener("scroll", evaluate, { passive: true });
})();
