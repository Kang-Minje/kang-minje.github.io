// pdf.js — 프로젝트 PDF 만들기 (우측 상단 "↓ pdf")
// 클릭하면 지금 보고 있는 프로젝트의 사진으로 PDF를 만들어 내려받음. 라이브러리는 클릭할 때만 불러옴.
//
// 레이아웃 (포트폴리오 PDF와 같은 판형):
// - 페이지 630 × 480 pt
// - 표지: 좌상단 42pt 여백, Pretendard Medium / ExtraBold 8pt (굵기로만 위계)
// - 사진 페이지: 텍스트 없음, 14pt 여백 안에서 최대 크기로 가운데
// - 세로 사진이 연달아 나오면 한 페이지에 두 장, 항상 같은 높이 (14pt 간격, 가운데 정렬)
// - 마지막 장: 포트폴리오의 마지막 페이지 (CV+Portfolio/KangMinje_Portfolio_end.pdf)
(function () {
    const button = document.getElementById("d-pdf");
    if (!button) return;

    const PAGE_W = 630;
    const PAGE_H = 480;
    const COVER_MARGIN = 42;
    const PHOTO_MARGIN = 14;
    const PHOTO_GAP = 14;
    const FONT_SIZE = 8;
    const LINE = 10;            // 8pt 글자의 줄 간격
    const GROUP_GAP = 20;       // 표지 문단 사이 (두 줄)
    const JPEG_MAX = 2000;      // 사진 긴 변 최대 px
    const JPEG_QUALITY = 0.85;

    const LIBS = [
        "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js",
        "https://cdn.jsdelivr.net/npm/@pdf-lib/fontkit@1.1.1/dist/fontkit.umd.min.js"
    ];
    // Pretendard를 TTF로 변환 + 표지에 쓰는 글자(라틴·숫자·문장부호·강민제)만 남긴 파일 (각 약 38KB)
    const FONT_MEDIUM = "fonts/Pretendard-Medium-subset.ttf";
    const FONT_BOLD = "fonts/Pretendard-ExtraBold-subset.ttf";
    const END_PAGE = "CV+Portfolio/KangMinje_Portfolio_end.pdf";

    let busy = false;

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            if ([...document.scripts].some((s) => s.src === src)) return resolve();
            const s = document.createElement("script");
            s.src = src;
            s.onload = resolve;
            s.onerror = () => reject(new Error("load failed: " + src));
            document.head.appendChild(s);
        });
    }

    const fetchBytes = (url) => fetch(url).then((r) => {
        if (!r.ok) throw new Error(r.status + " " + url);
        return r.arrayBuffer();
    });

    // AVIF → JPEG (pdf-lib은 JPEG/PNG만 넣을 수 있음)
    function toJpeg(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const scale = Math.min(1, JPEG_MAX / Math.max(img.naturalWidth, img.naturalHeight));
                const c = document.createElement("canvas");
                c.width = Math.round(img.naturalWidth * scale);
                c.height = Math.round(img.naturalHeight * scale);
                const ctx = c.getContext("2d");
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, c.width, c.height);
                ctx.drawImage(img, 0, 0, c.width, c.height);
                c.toBlob((blob) => blob.arrayBuffer().then((buf) =>
                    resolve({ bytes: buf, w: c.width, h: c.height })), "image/jpeg", JPEG_QUALITY);
            };
            img.onerror = () => reject(new Error("image failed: " + src));
            img.src = src;
        });
    }

    // 현재 프로젝트 정보: Works 목록의 현재 행(제목 / 연도 / 매체)
    function projectInfo() {
        const row = findCurrentWorksRow();
        const cols = row ? [...row.querySelectorAll(":scope > span:not(.d-back)")].map((s) => s.textContent.trim()) : [];
        return { title: cols[0] || getPage(), year: cols[1] || "", media: cols[2] || "" };
    }

    // 시퀀스: 연달아 나오면 한 페이지에 작게 한 줄로 (같은 높이)
    const SEQUENCES = [
        ["faces-105", "faces-106", "faces-107", "faces-108", "faces-109", "faces-110"]
    ];
    const sequenceOf = (name) => SEQUENCES.find((seq) => seq.includes(name));

    // 사진 순서대로 페이지 묶기: 시퀀스는 한 페이지에, 그 외 세로 사진 두 장이 연달아 나오면 한 페이지에
    function groupPages(photos) {
        const pages = [];
        for (let i = 0; i < photos.length; i++) {
            const a = photos[i];
            const seq = sequenceOf(a.name);
            if (seq) {
                const group = [a];
                while (photos[i + 1] && seq.includes(photos[i + 1].name)) group.push(photos[++i]);
                pages.push(group);
                continue;
            }
            const b = photos[i + 1];
            if (a.h > a.w && b && b.h > b.w && !sequenceOf(b.name)) {
                pages.push([a, b]);
                i++;
            } else {
                pages.push([a]);
            }
        }
        return pages;
    }

    function drawPhotoPage(pdf, group) {
        const page = pdf.addPage([PAGE_W, PAGE_H]);
        const availW = PAGE_W - PHOTO_MARGIN * 2;
        const availH = PAGE_H - PHOTO_MARGIN * 2;
        // 모든 사진 같은 높이: 가로 합(높이 1 기준) + 간격이 들어가는 가장 큰 높이
        const ratioSum = group.reduce((sum, p) => sum + p.w / p.h, 0);
        const gaps = PHOTO_GAP * (group.length - 1);
        const h = Math.min(availH, (availW - gaps) / ratioSum);
        const totalW = ratioSum * h + gaps;
        let x = (PAGE_W - totalW) / 2;
        const y = (PAGE_H - h) / 2;
        group.forEach((p) => {
            const w = (p.w / p.h) * h;
            page.drawImage(p.image, { x, y, width: w, height: h });
            x += w + PHOTO_GAP;
        });
    }

    function drawCover(pdf, fonts, info, count) {
        const page = pdf.addPage([PAGE_W, PAGE_H]);
        const black = PDFLib.rgb(0x11 / 255, 0x11 / 255, 0x11 / 255);
        let y = PAGE_H - COVER_MARGIN - FONT_SIZE; // 첫 줄 기준선
        const groups = [
            [[info.title, fonts.bold], [info.year, fonts.medium], [info.media, fonts.medium], [`${count} photographs`, fonts.medium]],
            [["강민제 Kang Minje", fonts.bold], ["photographer", fonts.medium]]
        ];
        groups.forEach((lines, gi) => {
            if (gi > 0) y -= GROUP_GAP - LINE;
            lines.filter(([text]) => text).forEach(([text, font]) => {
                page.drawText(text, { x: COVER_MARGIN, y, size: FONT_SIZE, font, color: black });
                y -= LINE;
            });
        });
    }

    async function makePdf(email) {
        if (busy) return;
        busy = true;
        const label = button.textContent;
        const setLabel = (t) => { button.textContent = t; };
        try {
            setLabel("↓ pdf …");
            await Promise.all(LIBS.map(loadScript));

            const info = projectInfo();
            const sources = buildImagesFor(getPage()).map(assetSrc);

            const [medium, bold, endBytes] = await Promise.all([
                fetchBytes(FONT_MEDIUM), fetchBytes(FONT_BOLD), fetchBytes(END_PAGE)
            ]);

            const pdf = await PDFLib.PDFDocument.create();
            pdf.registerFontkit(fontkit);
            pdf.setTitle(`${info.title}${info.year ? " " + info.year : ""} — Kang Minje`);
            pdf.setAuthor("Kang Minje");
            const fonts = {
                medium: await pdf.embedFont(medium),
                bold: await pdf.embedFont(bold)
            };

            const photos = [];
            for (let i = 0; i < sources.length; i++) {
                setLabel(`↓ pdf ${i + 1}/${sources.length}`);
                const jpg = await toJpeg(sources[i]);
                const name = sources[i].split("/").pop().replace(/\.avif$/, "");
                photos.push({ name, w: jpg.w, h: jpg.h, image: await pdf.embedJpg(jpg.bytes) });
            }

            drawCover(pdf, fonts, info, photos.length);
            groupPages(photos).forEach((group) => drawPhotoPage(pdf, group));

            const endDoc = await PDFLib.PDFDocument.load(endBytes);
            const [endPage] = await pdf.copyPages(endDoc, [0]);
            pdf.addPage(endPage);

            const bytes = await pdf.save();
            // "2025 -" → "2025", "2021 - 2026" → "2021-2026"
            const year = info.year.replace(/\s*-\s*/g, "-").replace(/-$/, "");
            const name = `KangMinje_${info.title}${year ? "_" + year : ""}`
                .replace(/[^A-Za-z0-9가-힣_-]+/g, "_").replace(/_+/g, "_").replace(/_$/, "");
            if (window.logDownload) {
                window.logDownload({ type: "pdf", email, project: `${info.title}${year ? " " + year : ""}`, file: `${name}.pdf`, pages: pdf.getPageCount() });
            }
            const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
            const a = document.createElement("a");
            a.href = url;
            a.download = `${name}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => URL.revokeObjectURL(url), 10000);
        } catch (err) {
            console.error(err);
            alert("Could not create the PDF. Please try again.");
        } finally {
            setLabel(label);
            busy = false;
        }
    }

    // 이메일을 받은 뒤 PDF 생성 (email-gate.js)
    button.addEventListener("click", async (e) => {
        e.preventDefault();
        if (busy) return;
        const email = window.requestEmail ? await window.requestEmail(button, { className: "d-pdf-gate" }) : "";
        if (email === null) return;
        makePdf(email);
    });
})();
