/* ===== DOM refs ===== */
const container = document.getElementById("canvas-container");
const thresholdValueEl = document.getElementById("threshold-value");
const imageCounterEl = document.getElementById("image-counter");

const fullscreenContainer = document.getElementById("fullscreen-container");
const fullscreenImg = document.getElementById("fullscreen-img");
const fsPrev = document.getElementById("fs-prev");
const fsNext = document.getElementById("fs-next");
const fsClose = document.getElementById("fs-close");
const fsIndexBtn = document.getElementById("fs-index-btn");
const creditBoxLeMile = document.getElementById("credit-box-lemile");
const creditBoxHeigs = document.getElementById("credit-box-heigs");

// Index2 overlay
const index2Overlay = document.getElementById("fs-index2-overlay");
const index2Grid = document.getElementById("fs-index2-grid");
const fsControls = document.getElementById("fs-controls");

/* ===== Config: 페이지-시리즈 매핑 및 개수 설정 ===== */
const SERIES_CONFIG = {
    walk: {
        key: "walk",
        count: 37
    },
    ra4: {
        key: "ra4",
        count: 47
    },
    "24": {
        key: "24",
        count: 35
    },
    faces: {
        key: "faces",
        count: 142
    }
};

/* ===== Helpers ===== */
const pad2 = (n) => String(n).padStart(2, "0");
const pad4 = (n) => String(n).padStart(4, "0");
const qs = new URLSearchParams(location.search);
const getPage = () => qs.get("page") || "walk";
const assetSrc = (src) => (src.startsWith("img/") && src.endsWith(".avif")) ? src.replace(/^img\//, "img/web/") : src;
window.assetSrc = assetSrc;

/* ===== State ===== */
let lastX = 0,
    lastY = 0;
let threshold = 160;
let spawnCount = 0;
const maxImagesOnScreen = 5;

let fullscreenActive = false;
let currentIndex = 0; // 현재 시리즈 배열 내 index
let images = []; // 현재 페이지(메뉴)에 해당하는 파일 리스트
let shuffledIndices = []; // 스폰할 때 사용할 셔플된 인덱스 배열

/* ===== Moving Sphere: 인덱스 그리드 전용 추가 에셋 (img/web 최적화 파이프라인 대상 아님) ===== */
const MOVING_SPHERE_INSTALLATION_VIEW = "img/movingsphere/movingsphere_installationview.avif";
const MOVING_SPHERE_STATEMENT_PDF = "img/movingsphere/movingsphere_statement.pdf";

/* ===== Helper to resolve correct image path (taking movingsphere directory into account) ===== */
function resolveImagePath(key, index) {
    const padIndex = pad2(index);
    const msPath = `img/movingsphere/${key}-${padIndex}.avif`;
    if (typeof IMAGE_DATA !== "undefined" && IMAGE_DATA[msPath]) {
        return msPath;
    }
    return `img/${key}-${padIndex}.avif`;
}

/* ===== Build images by page (Series or Tag) ===== */
function buildImagesFor(pageKey) {
    // 1. 우선 태그(세부 시리즈)인지 확인
    const taggedImages = getImagesByTag(pageKey);
    if (taggedImages.length > 0) {
        return taggedImages;
    }

    // 2. 태그가 없다면 기본 시리즈(walk, ra4 등) 설정 확인
    const cfg = SERIES_CONFIG[pageKey] || SERIES_CONFIG.walk;
    const arr = [];
    for (let i = 1; i <= cfg.count; i++) {
        if (cfg.key === "faces" && (i === 84 || i === 104)) continue;
        arr.push(resolveImagePath(cfg.key, i));
    }
    return arr;
}

/* ===== Build all images (A~E) ===== */
function buildAllImages() {
    const arr = [];
    Object.values(SERIES_CONFIG).forEach(({
        key,
        count
    }) => {
        for (let i = 1; i <= count; i++) {
            if (key === "faces" && (i === 84 || i === 104)) continue;
            arr.push(resolveImagePath(key, i));
        }
    });
    return arr;
}

function initSpawningOrder() {
    shuffledIndices = Array.from({ length: images.length }, (_, i) => i);
    for (let i = shuffledIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
    }
}

/* ===== Reset & UI ===== */
function resetCanvas() {
    container.innerHTML = "";
    spawnCount = 0;
    currentIndex = 0; // 초기화
    imageCounterEl.textContent = `${pad4(0)} / ${pad4(images.length)}`;
    thresholdValueEl.textContent = pad4(threshold);
}

const PHOTOSHOOT_TITLES = {
    "aria": "Aria",
    "sundimming": "SunDimming",
    "fluid_state": "fluid state",
    "hwanhee": "Hwanhee",
    "xinseha": "Xin Seha",
    "parkdongsun": "Park Dongsun",
    "ann": "Ann",
    "ines": "Inès",
    "chowoohyun": "chowoohyun",
    "chowooseok": "chowooseok",
    "ripple_effects_2": "Ripple Effects 2"
};

function buildPhotoshootThumbnails() {
    const shoots = ["aria", "sundimming", "fluid_state", "hwanhee", "xinseha", "parkdongsun", "ann", "ines", "chowoohyun", "chowooseok", "ripple_effects_2"];
    const arr = [];
    shoots.forEach(tag => {
        const tagged = getImagesByTag(tag);
        if (tagged.length > 0) {
            arr.push(tagged[0]);
        }
    });
    return arr;
}

function renderPhotoshootsGrid() {
    container.innerHTML = "";
    container.className = "photoshoots-layout";
    
    const shoots = ["aria", "sundimming", "fluid_state", "hwanhee", "xinseha", "parkdongsun", "ann", "ines", "chowoohyun", "chowooseok", "ripple_effects_2"];
    shoots.forEach(tag => {
        const taggedImages = getImagesByTag(tag);
        if (taggedImages.length === 0) return;
        
        const firstImgSrc = taggedImages[0];
        
        const item = document.createElement("div");
        item.className = "photoshoot-item";
        
        const img = document.createElement("img");
        img.src = assetSrc(firstImgSrc);
        img.loading = "lazy";
        img.decoding = "async";
        
        const title = document.createElement("div");
        title.className = "photoshoot-title";
        title.textContent = PHOTOSHOOT_TITLES[tag] || tag;
        
        item.appendChild(img);
        item.appendChild(title);
        
        item.addEventListener("click", () => {
            window.location.href = `?page=${tag}`;
        });
        
        container.appendChild(item);
    });
    
    updateCounter(-1);
}

function renderPhotoshootSeriesGrid(pageKey) {
    container.innerHTML = "";
    container.className = "photoshoot-series-layout";
    
    const taggedImages = getImagesByTag(pageKey);
    images = taggedImages; // Set active images array for fullscreen mode
    
    const fragment = document.createDocumentFragment();
    
    taggedImages.forEach((src, i) => {
        const item = document.createElement("div");
        item.className = "photoshoot-series-item";
        
        const img = document.createElement("img");
        img.src = assetSrc(src);
        img.loading = "lazy";
        img.decoding = "async";
        
        const counter = document.createElement("div");
        counter.className = "photoshoot-series-counter";
        counter.textContent = `${i + 1}/${taggedImages.length}`;
        
        item.appendChild(img);
        item.appendChild(counter);
        
        item.addEventListener("click", () => {
            openFullscreen(i);
        });
        
        fragment.appendChild(item);
    });
    
    container.appendChild(fragment);
    updateCounter(-1);
}

/* ===== Init by query ===== */
function initByQuery() {
    const page = getPage();
    
    // Reset container classes and height
    container.className = "";
    container.style.minHeight = "";
    
    // Editorial 상단 우측 크레딧 박스 제어
    creditBoxLeMile.classList.add("hidden");
    creditBoxHeigs.classList.add("hidden");

    if (page === "editorial_lemile") {
        creditBoxLeMile.classList.remove("hidden");
    } else if (page === "heigs") {
        creditBoxHeigs.classList.remove("hidden");
    }

    const isPhotoshootSeries = Object.keys(PHOTOSHOOT_TITLES).includes(page);

    if (page === "all" || page === "photoshoots" || isPhotoshootSeries) {
        document.body.classList.add("grid-mode");
        document.documentElement.classList.add("grid-mode"); // html 태그에도 추가
        if (page === "photoshoots") {
            images = buildPhotoshootThumbnails();
            renderPhotoshootsGrid();
        } else if (isPhotoshootSeries) {
            renderPhotoshootSeriesGrid(page);
        } else {
            images = buildAllImages();
            renderGrid();
        }
    } else {
        document.body.classList.remove("grid-mode");
        document.documentElement.classList.remove("grid-mode");
        images = (page === "all") ? buildAllImages() : buildImagesFor(page);
        initSpawningOrder();
        resetCanvas();
        
        // 태블릿인 경우 처음에 빈 페이지가 아니라 1번 이미지 스폰
        const isTouch = ('ontouchstart' in window || navigator.maxTouchPoints > 0);
        if (isTouch && images.length > 0) {
            spawnAt(0, 0, true);
        }
    }

    // Back navigation arrow (walk, ra4, 24, faces 제외)
    const backNav = document.getElementById("back-nav");
    if (backNav) {
        const hiddenPages = ["walk", "ra4", "24", "faces", "photoshoots"];
        if (hiddenPages.includes(page)) {
            backNav.style.display = "none";
        } else {
            backNav.style.display = "";
            // 기본: 메인 페이지 또는 사진촬영 시리즈 페이지로 돌아가기
            if (Object.keys(PHOTOSHOOT_TITLES).includes(page)) {
                backNav.href = "?page=photoshoots";
            } else {
                backNav.href = "?page=walk";
            }

            // 바로 이전 페이지로 가기 (history.back() 선호)
            backNav.onclick = function(e) {
                if (document.referrer && document.referrer.includes(window.location.hostname)) {
                    e.preventDefault();
                    window.history.back();
                }
            };
        }
    }
}

function renderGrid() {
    container.innerHTML = "";
    
    // Shuffle images for random order on each load
    const shuffledImages = [...images].sort(() => Math.random() - 0.5);

    const chunkSize = 24;
    let renderedCount = 0;
    const viewportWidth = window.innerWidth;
    
    // 4개의 가상 컬럼을 사용하여 이미지 중첩 최소화
    const columns = 4;
    const colWidth = viewportWidth / columns;
    const rowHeight = 450; // 각 행의 간격을 넓게 잡아 중첩 방지

    function renderNextBatch() {
        const batch = shuffledImages.slice(renderedCount, renderedCount + chunkSize);
        const fragment = document.createDocumentFragment();

        batch.forEach((src, batchIdx) => {
            const index = renderedCount + batchIdx;
            const col = index % columns;
            const row = Math.floor(index / columns);

            const img = document.createElement("img");
            img.src = assetSrc(src);
            img.loading = "lazy";
            img.decoding = "async";

            // 가로 크기: 120px ~ 화면 너비의 25% (너무 크면 안됨)
            const minW = 120;
            const maxW = Math.max(minW + 50, viewportWidth * 0.25);
            const w = Math.floor(Math.random() * (maxW - minW + 1)) + minW;

            // X 좌표: 컬럼 영역 내에서 랜덤 지터 부여
            const xMin = col * colWidth + 50;
            const xMax = (col + 1) * colWidth - w - 50;
            const x = Math.max(50, Math.floor(xMin + Math.random() * Math.max(10, xMax - xMin)));
            
            // Y 좌표: 행 기반으로 배치하되 과감하게 위아래로 흔듦
            const yBase = row * rowHeight + 150;
            const y = yBase + (Math.random() * (rowHeight - 100));

            img.style.setProperty("--x", `${x}px`);
            img.style.setProperty("--y", `${y}px`);
            img.style.setProperty("--w", `${w}px`);

            img.addEventListener("click", () => openFullscreenFromList(shuffledImages, index));
            fragment.appendChild(img);
        });

        container.appendChild(fragment);
        renderedCount += chunkSize;

        if (renderedCount < shuffledImages.length) {
            requestAnimationFrame(renderNextBatch);
        }
    }

    renderNextBatch();
    
    // 전체 높이 설정
    const totalRows = Math.ceil(images.length / columns);
    container.style.minHeight = `${totalRows * rowHeight + 1000}px`;
    
    // Grid 모드 초기화 시 카운터 표시
    updateCounter(-1);
}

// 셔플된 리스트에서 특정 시리즈만 필터링하여 풀스크린 열기
function openFullscreenFromList(list, index) {
    const selectedSrc = list[index];
    // HTML 태그(<a> 등)를 제거하고 순수 텍스트만 추출
    const rawTitle = getLabelFor(selectedSrc).replace(/<[^>]*>/g, "");
    
    // "noise 1 (day)" -> "noise", "broken 1" -> "broken"
    // 괄호와 숫자(어디에 있든)를 모두 제거하여 핵심 시리즈명 추출
    const baseTitle = rawTitle.replace(/\(.*?\)/g, "").replace(/\d+/g, "").trim().toLowerCase();
    
    let titleGroup = [];
    if (baseTitle === "" || /^\d+$/.test(rawTitle.trim())) {
        // 숫자로만 된 제목(예: "10")이거나 빈 제목인 경우 정확히 일치하는 것만 그룹함
        titleGroup = list.filter(src => {
            const t = getLabelFor(src).replace(/<[^>]*>/g, "").toLowerCase();
            return t === rawTitle.toLowerCase();
        });
    } else {
        // 본래 제목에서 괄호와 숫자를 떼어낸 베이스가 같으면 같은 시리즈로 간주
        titleGroup = list.filter(src => {
            const t = getLabelFor(src).replace(/<[^>]*>/g, "").toLowerCase();
            const b = t.replace(/\(.*?\)/g, "").replace(/\d+/g, "").trim().toLowerCase();
            return b === baseTitle;
        });
    }

    // 만약 제목으로 묶인 그룹이 1개보다 많다면 해당 그룹으로 네비게이션
    if (titleGroup.length > 1) {
        // 제목 순서대로 정렬 (CLT 1 -> CLT 2 -> CLT 3)
        titleGroup.sort((a, b) => {
            const tA = getLabelFor(a).replace(/<[^>]*>/g, "").toLowerCase();
            const tB = getLabelFor(b).replace(/<[^>]*>/g, "").toLowerCase();
            return tA.localeCompare(tB, undefined, { numeric: true, sensitivity: 'base' });
        });
        
        images = titleGroup;
        openFullscreen(titleGroup.indexOf(selectedSrc));
    } else {
        // 제목 그룹이 없으면 기존처럼 시리즈(파일명 앞자리) 단위로 필터링
        const filename = selectedSrc.substring(selectedSrc.lastIndexOf("/") + 1);
        const match = filename.match(/^([a-z0-9]+)-/);
        if (match) {
            const seriesKey = match[1];
            const seriesList = list.filter(src => {
                const fn = src.substring(src.lastIndexOf("/") + 1);
                return fn.startsWith(`${seriesKey}-`);
            });
            images = seriesList;
            openFullscreen(seriesList.indexOf(selectedSrc));
        } else {
            // 그 외의 경우 전체 리스트 유지
            images = list;
            openFullscreen(index);
        }
    }
}

initByQuery();

const isTouchDevice = ('ontouchstart' in window || navigator.maxTouchPoints > 0);

if (isTouchDevice) {
    const footerControls = document.querySelector(".footer-controls");
    if (footerControls) {
        footerControls.style.display = "none";
    }
}

/* ===== Mouse move spawn (disabled in fullscreen) ===== */
document.addEventListener("mousemove", (e) => {
    if (isTouchDevice) return; // 태블릿 등 터치 디바이스에서는 커서 이동 스폰 비활성화
    if (fullscreenActive || document.body.classList.contains("grid-mode")) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > threshold) {
        spawnAt(e.clientX, e.clientY);
        lastX = e.clientX;
        lastY = e.clientY;
    }
});

/* ===== Touch spawn for tablets ===== */
container.addEventListener("pointerdown", (e) => {
    if (!isTouchDevice) return;
    if (fullscreenActive || document.body.classList.contains("grid-mode")) return;
    
    // 이미지를 터치한 경우 전체화면 진입해야 하므로 스폰 무시
    if (e.target.tagName === "IMG") return;

    // 이전 이미지 미리 찾기
    const prevImages = Array.from(container.querySelectorAll("img"));
    
    // 중앙에 새 이미지 스폰
    spawnAt(0, 0, true);
    
    // 방금 스폰된 새 이미지
    const newImg = container.lastElementChild;
    
    if (newImg && newImg.tagName === "IMG") {
        // 로드 완료 시 이전 이미지들 삭제 (깜빡임 방지)
        if (newImg.complete) {
            prevImages.forEach(img => img.remove());
        } else {
            newImg.addEventListener("load", () => {
                prevImages.forEach(img => img.remove());
            });
        }
    }
});

/* ===== Spawn image at position (sequential, loop) ===== */
function spawnAt(x, y, isCentered = false) {
    const originalIndex = (shuffledIndices && shuffledIndices.length > 0) ? shuffledIndices[currentIndex] : currentIndex;
    const img = document.createElement("img");
    img.src = assetSrc(images[originalIndex]);
    img.style.position = "absolute";
    
    if (isCentered) {
        img.style.left = "50%";
        img.style.top = "50%";
        img.style.transform = "translate(-50%, -50%)";
    } else {
        img.style.left = `${x - 100}px`;
        img.style.top = `${y - 150}px`;
    }
    img.style.maxWidth = "600px";
    img.style.maxHeight = "600px";
    img.style.width = "auto";
    img.style.height = "auto";
    img.style.objectFit = "contain";
    img.style.zIndex = 2;

    img.addEventListener("click", () => openFullscreen(originalIndex));

    container.appendChild(img);

    // Limit to 5 images on screen (except in grid-mode)
    if (!document.body.classList.contains("grid-mode")) {
        const spawnedImages = container.querySelectorAll("img");
        if (spawnedImages.length > 5) {
            spawnedImages[0].remove();
        }
    }

    // 카운터/인덱스/제목 업데이트
    updateCounter(originalIndex);
    currentIndex = (currentIndex + 1) % images.length;
}

function updateCounter(idx) {
    if (idx < 0) {
        imageCounterEl.innerHTML = `0000 / ${pad4(images.length)}`;
    } else {
        imageCounterEl.innerHTML = `${pad4(idx + 1)} / ${pad4(images.length)}`;
    }
}

/* ===== Threshold controls ===== */
document.getElementById("decrease-threshold").addEventListener("click", () => {
    threshold = Math.max(10, threshold - 10);
    thresholdValueEl.textContent = pad4(threshold);
});
document.getElementById("increase-threshold").addEventListener("click", () => {
    threshold += 10;
    thresholdValueEl.textContent = pad4(threshold);
});

/* ===== Fullscreen logic ===== */
/* ✅ 인라인 opacity/transform을 건드리지 않고 CSS 클래스만 토글
      -> 인라인이 CSS를 덮어쓰던 문제 해결 */
/* ✅ 이미지 제목 노출 포함된 FS 업데이트 로직 */
function openFullscreen(index) {
    fullscreenActive = true;
    currentIndex = index;

    fullscreenImg.src = assetSrc(images[currentIndex]);
    fullscreenContainer.style.display = "flex";
    requestAnimationFrame(() => {
        fullscreenContainer.classList.add("show");
    });
    // 제목 업데이트
    imageCounterEl.innerHTML = getLabelFor(images[currentIndex]);
}

function closeFullscreen() {
    fullscreenActive = false;
    fullscreenContainer.classList.remove("show");
    if (fsControls) fsControls.style.display = "";
    closeIndex2();
    setTimeout(() => {
        fullscreenContainer.style.display = "none";
        fullscreenImg.src = "";
        
        // 탐색 종료 후 다시 카운터 표기로 복구
        const page = getPage();
        if (page === "photoshoots") {
            images = buildPhotoshootThumbnails();
            updateCounter(-1);
        } else {
            updateCounter(currentIndex);
        }
    }, 380);
}

// 화면 좌/우 터치(클릭) 시 Prev/Next 네비게이션
fullscreenContainer.addEventListener("click", (e) => {
    if (!fullscreenActive) return;
    
    // 만약 fs-controls 내부 요소나 다른 버튼 등을 클릭한 경우 무시
    if (e.target.closest("#fs-controls") || e.target.closest("#fs-index2-overlay")) return;
    
    const clickX = e.clientX;
    const windowWidth = window.innerWidth;
    
    if (clickX < windowWidth / 2) {
        // Prev
        currentIndex = (currentIndex - 1 + images.length) % images.length;
    } else {
        // Next
        currentIndex = (currentIndex + 1) % images.length;
    }
    updateFSContent();
});

// ✅ FS 네비게이션 시 제목 업데이트
function updateFSContent() {
    fullscreenImg.src = assetSrc(images[currentIndex]);
    imageCounterEl.innerHTML = getLabelFor(images[currentIndex]);
    
    // 다음/이전 이미지 프리로딩 (지연 시간 방지)
    preloadNextAndPrev();
}

/**
 * 전/후 이미지를 백그라운드에서 로드하여 끊김 없는 감상 지원
 */
function preloadNextAndPrev() {
    const nextIdx = (currentIndex + 1) % images.length;
    const prevIdx = (currentIndex - 1 + images.length) % images.length;

    const nextImg = new Image();
    nextImg.src = assetSrc(images[nextIdx]);

    const prevImg = new Image();
    prevImg.src = assetSrc(images[prevIdx]);
}

fsPrev.addEventListener("click", () => {
    if (!fullscreenActive) return;
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateFSContent();
});
fsNext.addEventListener("click", () => {
    if (!fullscreenActive) return;
    currentIndex = (currentIndex + 1) % images.length;
    updateFSContent();
});
fsClose.addEventListener("click", () => {
    if (!fullscreenActive) return;
    closeFullscreen();
});

/* ===== 좌측 하단 'Kang Minje' → 랜딩페이지 이동 ===== */
const footerHome = document.getElementById("footer-home");
if (footerHome) {
    footerHome.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = window.location.pathname;
    });
}

document.body.classList.add('spawn-cursor');
setTimeout(() => document.body.classList.remove('spawn-cursor'), 200);

/* ===== 보안: 우클릭 및 드래그 금지 (이미지 보호) ===== */
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
}, false);

document.addEventListener("dragstart", (e) => {
    if (e.target.nodeName === "IMG") {
        e.preventDefault();
    }
}, false);


/* ===== Index2: 현재 시리즈 그리드 보기 ===== */
/**
 * 현재 fullscreen에서 보고 있는 images 배열을 그리드(인덱스2)로 보여줌
 * 인덱스1(드롭업 메뉴)과 다른 별도 오버레이
 */
function openIndex2() {
    if (!fullscreenActive || images.length === 0) return;

    renderIndex2();
    index2Overlay.classList.add("show");
    if (fsControls) fsControls.style.display = "none";
}

function closeIndex2() {
    index2Overlay.classList.remove("show");
    if (fsControls) fsControls.style.display = "";
}

// 브레이크포인트별 그리드 컬럼 수 (style.css의 #fs-index2-grid 미디어쿼리와 반드시 일치해야 함)
function getIndexColumnCount() {
    if (window.innerWidth <= 600) return 2;
    if (window.innerWidth <= 900) return 3;
    return 4;
}

// row 번호로 시드를 주는 결정적 pseudo-random(0~1).
// Math.random() 대신 사용해서, 이미지가 늦게 로드되어 재배치(scheduleRelayout)가
// 여러 번 일어나도 같은 행은 같은 리듬(빈 칸 위치)을 유지하도록 함.
function seededRandom(seed) {
    const x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
}

// 이미지 순서를 유지한 채 grid-column/grid-row를 직접 계산해 배치.
// - 세로 사진은 1칸, 가로 사진은 2칸을 차지하되, 한 행에 가로 사진이 두 장 이상 들어가지 않도록 강제로 다음 행으로 넘김.
// - 4칸 기준 그리드에서는 리듬을 위해 한 행에 3칸만 채우고 1칸은 항상 비워둠
//   (가로 1장 + 세로 1장, 또는 세로 3장의 조합만 허용).
// - 비는 칸의 위치는 매번 우측 고정이 아니라, 행마다 맨앞/사이/맨뒤 중 랜덤하게 바뀜.
function layoutIndexEntries(entries, cols) {
    const rowCapacity = cols >= 4 ? cols - 1 : cols;
    const useRhythm = cols >= 4;
    let row = 1;
    let idx = 0;
    let prevInsertion = null;

    while (idx < entries.length) {
        // 1) 이 행에 들어갈 아이템들을 그리디하게 결정 (기존과 동일한 제약: 캡시티/가로 1장 규칙)
        const rowEntries = [];
        let used = 0;
        let rowHasWide = false;
        while (idx < entries.length) {
            const e = entries[idx];
            const span = e.wide ? Math.min(2, cols) : 1;
            const wideConflict = e.wide && rowHasWide;
            if (used > 0 && (used + span > rowCapacity || wideConflict)) break;
            rowEntries.push({ el: e.el, span });
            used += span;
            if (e.wide) rowHasWide = true;
            idx++;
        }

        // 2) 빈 칸(gap)을 이 행의 아이템들 사이 어디에 끼워넣을지 결정
        //    (아이템 순서/좌우 순서는 항상 유지 - gap만 앞/중간/뒤로 이동)
        const gapSize = cols - used;
        let insertionPoints = [rowEntries.length]; // 기본: 맨 뒤
        if (useRhythm && gapSize > 0) {
            insertionPoints = [];
            for (let i = 0; i <= rowEntries.length; i++) insertionPoints.push(i);
        }

        let chosenInsertion = insertionPoints[Math.floor(seededRandom(row) * insertionPoints.length)];
        if (insertionPoints.length > 1 && chosenInsertion === prevInsertion) {
            const alt = insertionPoints.filter((p) => p !== prevInsertion);
            chosenInsertion = alt[Math.floor(seededRandom(row + 0.5) * alt.length)];
        }
        prevInsertion = chosenInsertion;

        // 3) 실제 grid-column 배치
        let col = 1;
        rowEntries.forEach(({ el, span }, i) => {
            if (i === chosenInsertion) col += gapSize;
            el.style.gridColumn = `${col} / span ${span}`;
            el.style.gridRow = String(row);
            col += span;
        });

        row += 1;
    }

    return row - 1; // 마지막으로 사용된 행 번호
}

function renderIndex2() {
    index2Grid.innerHTML = "";
    const fragment = document.createDocumentFragment();
    const isMovingSphere = getPage() === "moving_sphere";
    const entries = []; // [{ el, wide }] - layoutIndexEntries가 참조
    let relayoutQueued = false;

    // 이미지가 늦게 로드되어 가로/세로가 뒤늦게 확정되면 전체 배치를 다시 계산
    function scheduleRelayout() {
        if (relayoutQueued) return;
        relayoutQueued = true;
        requestAnimationFrame(() => {
            relayoutQueued = false;
            layoutIndexEntries(entries, getIndexColumnCount());
        });
    }

    function makeItem(src, activeIndex, counterText, altText, extraClass, useAssetSrc, onClick) {
        const item = document.createElement("div");
        item.className = extraClass ? `idx2-item ${extraClass}` : "idx2-item";
        if (activeIndex === currentIndex) item.classList.add("active");

        const img = document.createElement("img");
        img.src = useAssetSrc ? assetSrc(src) : src;
        img.loading = "lazy";
        img.decoding = "async";
        img.alt = altText;

        const entry = { el: item, wide: false };
        const applyOrientation = () => {
            const nowWide = img.naturalWidth > img.naturalHeight;
            if (nowWide !== entry.wide) {
                entry.wide = nowWide;
                scheduleRelayout();
            }
        };
        if (img.complete && img.naturalWidth) {
            entry.wide = img.naturalWidth > img.naturalHeight;
        } else {
            img.addEventListener("load", applyOrientation);
        }

        item.appendChild(img);

        const counter = document.createElement("div");
        counter.className = "idx2-counter";
        counter.textContent = counterText;
        item.appendChild(counter);

        item.addEventListener("click", onClick);

        entries.push(entry);
        fragment.appendChild(item);
        return item;
    }

    images.forEach((src, i) => {
        const altText = getLabelFor(src).replace(/<[^>]*>/g, "");
        const item = makeItem(src, i, `${i + 1}/${images.length}`, altText, null, true, () => {
            currentIndex = i;
            updateFSContent();
            closeIndex2();
        });

        // Hover 시: 푸터 우측 카운터 부분에 해당 이미지 제목 표시
        item.addEventListener("mouseenter", () => {
            imageCounterEl.innerHTML = getLabelFor(src);
        });
        item.addEventListener("mouseleave", () => {
            if (images[currentIndex]) {
                imageCounterEl.innerHTML = getLabelFor(images[currentIndex]);
            }
        });
    });

    index2Grid.appendChild(fragment);
    layoutIndexEntries(entries, getIndexColumnCount());

    // Moving Sphere 시리즈 전용: 그리드 한참 아래에 installation view를 4칸 전체 폭으로 크게 표시
    // (일반 이미지 배열/Prev-Next 순환 및 위 배치 로직에는 포함되지 않는 별도 항목)
    if (isMovingSphere) {
        const installItem = document.createElement("div");
        installItem.className = "idx2-item idx2-installation";

        const img = document.createElement("img");
        img.src = assetSrc(MOVING_SPHERE_INSTALLATION_VIEW);
        img.loading = "lazy";
        img.decoding = "async";
        img.alt = "installation view";
        installItem.appendChild(img);

        const counter = document.createElement("div");
        counter.className = "idx2-counter";
        counter.textContent = "installation view";
        installItem.appendChild(counter);

        installItem.addEventListener("click", () => {
            fullscreenImg.src = assetSrc(MOVING_SPHERE_INSTALLATION_VIEW);
            imageCounterEl.textContent = "installation view";
            closeIndex2();
        });

        index2Grid.appendChild(installItem);

        // installation view보다 한참 아래, 그리드 최하단에 statement.pdf 링크
        const statementLink = document.createElement("a");
        statementLink.className = "idx2-statement-link";
        statementLink.href = MOVING_SPHERE_STATEMENT_PDF;
        statementLink.target = "_blank";
        statementLink.rel = "noopener";
        statementLink.textContent = "→ statement.pdf";
        index2Grid.appendChild(statementLink);
    }
}

// 브레이크포인트가 바뀌면(창 크기 조절) 컬럼 수에 맞춰 배치를 다시 계산
let indexResizeTimer = null;
window.addEventListener("resize", () => {
    if (!index2Overlay.classList.contains("show")) return;
    clearTimeout(indexResizeTimer);
    indexResizeTimer = setTimeout(renderIndex2, 150);
});

// fs-index-btn 이벤트
if (fsIndexBtn) {
    fsIndexBtn.addEventListener("click", () => {
        openIndex2();
    });
}

// ESC 키로 index2 닫기
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        if (index2Overlay.classList.contains("show")) {
            closeIndex2();
        } else if (fullscreenActive) {
            closeFullscreen();
        }
    }
});

/* ===== Credit Box Tablet Toggle ===== */
const creditBoxes = document.querySelectorAll(".credit-box-container");
creditBoxes.forEach(box => {
    box.addEventListener("click", () => {
        if (isTouchDevice) {
            box.classList.toggle("active");
        }
    });
});
