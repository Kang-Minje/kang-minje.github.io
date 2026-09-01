// mobile.js — 모바일(≤600px) 전용. 터치 한 번에 이미지 한 장만!
(function () {
    // 중복 실행 가드
    if (window.__KM_MOBILE_INIT__) return;
    window.__KM_MOBILE_INIT__ = true;

    const mq = window.matchMedia("(max-width: 600px)");
    let created = false;
    let stage, info, hint;
    let currentImg = null;

    // img 폴더 시리즈 자동 생성 (이름 기반으로 매핑 변경)
    const counts = {
        walk: 37,
        ra4: 47,
        "24": 35,
        faces: 120,
        dots: 7
    };
    const IMAGES = [];
    for (const [name, count] of Object.entries(counts)) {
        for (let i = 1; i <= count; i++) {
            if (name === "faces" && i === 104) continue;
            
            let path;
            if (name === "dots") {
                path = `img/dots-${i}.avif`;
            } else {
                const padIndex = String(i).padStart(2, "0");
                const msPath = `img/movingsphere/${name}-${padIndex}.avif`;
                if (typeof IMAGE_DATA !== "undefined" && IMAGE_DATA[msPath]) {
                    path = msPath;
                } else {
                    path = `img/${name}-${padIndex}.avif`;
                }
            }
            IMAGES.push(path);
        }
    }
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const toAssetSrc = (src) => (typeof window.assetSrc === "function") ? window.assetSrc(src) : src;

    function placeInsideViewport(el) {
        const vw = window.innerWidth,
            vh = window.innerHeight;
        const rect = el.getBoundingClientRect();
        const w = rect.width,
            h = rect.height;
        const maxLeft = Math.max(0, vw - w);
        const maxTop = Math.max(0, vh - h);
        el.style.left = (Math.random() * maxLeft) + "px";
        el.style.top = (Math.random() * maxTop) + "px";
    }

    function showRandomImage() {
        if (!created || !IMAGES.length) return;
        const img = new Image();
        img.className = "rand";
        img.decoding = "async";
        img.loading = "eager";
        img.onload = () => {
            stage.appendChild(img);
            requestAnimationFrame(() => {
                placeInsideViewport(img);
                if (currentImg && currentImg !== img) currentImg.remove();
                currentImg = img;
            });
        };
        img.src = toAssetSrc(pick(IMAGES));
    }

    let tapLocked = false;

    function onPointerDown(e) {
        if (tapLocked) return;

        // 꾹 누르는 대상이 cv-link라면 이미지 생성을 막음
        if (e.target.classList.contains('cv-link')) return;

        tapLocked = true;
        showRandomImage();
        setTimeout(() => {
            tapLocked = false;
        }, 300);
        e.preventDefault();
        e.stopPropagation();
    }

    function suppressGhostClick(e) {
        if (e.target.classList.contains('cv-link')) return; // 링크 클릭은 허용
        e.preventDefault();
        e.stopPropagation();
    }

    function buildMobileUI() {
        if (created) return;

        document.querySelectorAll(".m-info, .m-stage, .m-hint").forEach(n => n.remove());

        // 정보 레이어: 기존 텍스트 보존 + portfolio / cv 추가
        info = document.createElement("div");
        info.className = "m-info";
        // innerHTML에 기존 작가님 정보를 다시 정확히 넣었습니다.
        info.innerHTML = `
            <p class="name">Kang Minje</p>
            <div class="spacer"></div>
            <p>Photographer</p>
            <p>inner blue<br>erotic<br>youth</p>
            <div class="spacer"></div>
            <p>Seoul, Korea</p>
            <div class="spacer"></div>
            <div class="spacer"></div>
            <div class="spacer"></div>
            <a href="CV+Portfolio/KangMinje_CVandPortfolio.zip" id="cv-download" class="cv-link">→ portfolio / cv</a>
            <div class="spacer"></div>
            <p>info@kangminje.com<br>+82 10 9323 9432</p>
        `;

        // --- 꾹 누르기 다운로드 로직 ---
        const cvLink = info.querySelector("#cv-download");
        let pressTimer;

        cvLink.addEventListener("touchstart", (e) => {
            cvLink.classList.add("pressing");
            pressTimer = setTimeout(() => {
                const link = document.createElement('a');
                link.href = 'CV+Portfolio/KangMinje_CVandPortfolio.zip';
                link.download = 'KangMinje_CVandPortfolio.zip';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                cvLink.classList.remove("pressing");
            }, 1500);
        });

        const cancelPress = () => {
            clearTimeout(pressTimer);
            cvLink.classList.remove("pressing");
        };

        cvLink.addEventListener("touchend", cancelPress);
        cvLink.addEventListener("touchmove", cancelPress);
        cvLink.addEventListener("touchcancel", cancelPress);

        // 이미지 영역 및 힌트 생성
        stage = document.createElement("div");
        stage.id = "m-stage";
        stage.className = "m-stage";
        stage.setAttribute("aria-label", "image stage");

        hint = document.createElement("div");
        hint.className = "m-hint";

        document.body.append(info, stage, hint);

        window.addEventListener("pointerdown", onPointerDown, { passive: false });
        window.addEventListener("click", suppressGhostClick, true);
        window.addEventListener("resize", onResize, { passive: true });

        created = true;
    }

    function destroyMobileUI() {
        if (!created) return;
        if (currentImg) {
            currentImg.remove();
            currentImg = null;
        }
        info?.remove();
        stage?.remove();
        hint?.remove();
        window.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("click", suppressGhostClick, true);
        window.removeEventListener("resize", onResize);
        info = stage = hint = null;
        created = false;
    }

    function onResize() {
        if (created && currentImg) placeInsideViewport(currentImg);
    }

    function handleMQ(e) {
        if (e.matches) buildMobileUI();
        else destroyMobileUI();
    }

    handleMQ(mq);
    mq.addEventListener("change", handleMQ);
})();
