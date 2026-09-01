/**
 * IMAGE_DATA: 이미지의 제목과 태그(시리즈 구분용)를 관리하는 데이터베이스
 * 형식: "파일명": { title: "제목", tags: ["시리즈명"] }   예) "img/lips-01.avif": { title: "lips", tags: ["lips"] }
 */
const IMAGE_DATA = {
    // [walk] Series
    "img/walk-01.avif": { title: "plastic house" },
    "img/walk-02.avif": { title: "still life" },
    "img/walk-03.avif": { title: "play" },
    "img/walk-04.avif": { title: "portrait" },
    "img/walk-05.avif": { title: "CLT 3" },
    "img/walk-06.avif": { title: "sun 1" },
    "img/walk-07.avif": { title: "sun 2" },
    "img/walk-08.avif": { title: "portrait" },
    "img/walk-09.avif": { title: "liv in screen" },
    "img/walk-10.avif": { title: "self-portrait" },
    "img/walk-11.avif": { title: "tip" },
    "img/walk-12.avif": { title: "still life" },
    "img/walk-13.avif": { title: "liv in screen" },
    "img/walk-14.avif": { title: "portrait" },
    "img/walk-15.avif": { title: "breakfast" },
    "img/walk-16.avif": { title: "seungzae" },
    "img/walk-17.avif": { title: "portrait" },
    "img/walk-18.avif": { title: "still life" },
    "img/walk-19.avif": { title: "taped" },
    "img/walk-20.avif": { title: "taped" },
    "img/walk-21.avif": { title: "taped" },
    "img/walk-22.avif": { title: "taped" },
    "img/walk-23.avif": { title: "taped" },
    "img/walk-24.avif": { title: "taped" },
    "img/walk-25.avif": { title: "taped" },
    "img/walk-26.avif": { title: "taped" },
    "img/walk-27.avif": { title: "m" },
    "img/walk-28.avif": { title: "m" },
    "img/walk-29.avif": { title: "kids" },
    "img/walk-30.avif": { title: "warm juice" },
    "img/walk-31.avif": { title: "warm juice" },
    "img/walk-32.avif": { title: "warm juice" },
    "img/walk-33.avif": { title: "warm juice" },
    "img/walk-34.avif": { title: "warm juice" },
    "img/walk-35.avif": { title: "walls" },
    "img/walk-36.avif": { title: "walls" },
    "img/walk-37.avif": { title: "walls" },

    // [24] Series
    "img/24-01.avif": { title: "Breeze", tags: ["yt_breeze"] },
    "img/24-02.avif": { title: "Breeze", tags: ["yt_breeze"] },
    "img/24-03.avif": { title: "Breeze", tags: ["yt_breeze"] },
    "img/24-04.avif": { title: "Breeze", tags: ["yt_breeze"] },
    "img/24-05.avif": { title: "Breeze", tags: ["yt_breeze"] },
    "img/24-06.avif": { title: "March", tags: ["yt_march"] },
    "img/24-07.avif": { title: "March", tags: ["yt_march"] },
    "img/24-08.avif": { title: "March", tags: ["yt_march"] },
    "img/24-09.avif": { title: "March", tags: ["yt_march"] },
    "img/24-10.avif": { title: "March", tags: ["yt_march"] },
    "img/24-11.avif": { title: "March", tags: ["yt_march"] },
    "img/24-12.avif": { title: "March", tags: ["yt_march"] },
    "img/24-13.avif": { title: "March", tags: ["yt_march"] },
    "img/24-14.avif": { title: "March", tags: ["yt_march"] },
    "img/24-15.avif": { title: "March", tags: ["yt_march"] },
    "img/24-16.avif": { title: "March", tags: ["yt_march"] },
    "img/24-17.avif": { title: "March", tags: ["yt_march"] },
    "img/24-18.avif": { title: "March", tags: ["yt_march"] },
    "img/24-19.avif": { title: "하강Descending", tags: ["yt_descending"] },
    "img/24-20.avif": { title: "하강Descending", tags: ["yt_descending"] },
    "img/24-21.avif": { title: "하강Descending", tags: ["yt_descending"] },
    "img/24-22.avif": { title: "1/20", tags: ["yt_1_20"] },
    "img/24-23.avif": { title: "1/20", tags: ["yt_1_20"] },
    "img/24-24.avif": { title: "1/20", tags: ["yt_1_20"] },
    "img/24-25.avif": { title: "1/20", tags: ["yt_1_20"] },
    "img/24-26.avif": { title: "1/20", tags: ["yt_1_20"] },
    "img/24-27.avif": { title: "1/20", tags: ["yt_1_20"] },
    "img/24-28.avif": { title: "pot" },
    "img/24-29.avif": { title: "Two", tags: ["yt_two"] },
    "img/24-30.avif": { title: "Two", tags: ["yt_two"] },
    "img/24-31.avif": { title: "Two", tags: ["yt_two"] },
    "img/24-32.avif": { title: "Two", tags: ["yt_two"] },
    "img/24-33.avif": { title: "Two", tags: ["yt_two"] },
    "img/24-34.avif": { title: "Two", tags: ["yt_two"] },
    "img/24-35.avif": { title: "Two", tags: ["yt_two"] },

    // [ra4] Series
    "img/movingsphere/ra4-01.avif": { title: "jeff and daniela", tags: ["moving_sphere"] },
    "img/ra4-02.avif": { title: "ghost 1" },
    "img/movingsphere/ra4-03.avif": { title: "jeff 1", tags: ["moving_sphere", "sundimming"] },
    "img/ra4-04.avif": { title: "daniela", tags: ["sundimming"] },
    "img/ra4-05.avif": { title: "ghost 2" },
    "img/ra4-06.avif": { title: "jeff 2", tags: ["sundimming"] },
    "img/ra4-07.avif": { title: "triangle" },
    "img/ra4-08.avif": { title: "jeff 3", tags: ["sundimming"] },
    "img/movingsphere/ra4-09.avif": { title: "jeff 4", tags: ["moving_sphere", "sundimming"] },
    "img/ra4-10.avif": { title: "jeff 5", tags: ["sundimming"] },
    "img/ra4-11.avif": { title: "burnt" },
    "img/movingsphere/ra4-12.avif": { title: "hoyeong", tags: ["moving_sphere"] },
    "img/ra4-13.avif": { title: "feet in studio 1" },
    "img/ra4-14.avif": { title: "seoul" },
    "img/ra4-15.avif": { title: "CLT 1" },
    "img/movingsphere/ra4-16.avif": { title: "broken 1", tags: ["moving_sphere"] },
    "img/ra4-17.avif": { title: "self-portrait" },
    "img/movingsphere/ra4-18.avif": { title: "feet in studio 2", tags: ["moving_sphere"] },
    "img/ra4-19.avif": { title: "christmas 1" },
    "img/ra4-20.avif": { title: "christmas 2" },
    "img/ra4-21.avif": { title: "window(night)" },
    "img/ra4-22.avif": { title: "window(day) 1" },
    "img/movingsphere/ra4-23.avif": { title: "window(day) 2", tags: ["moving_sphere"] },
    "img/ra4-24.avif": { title: "lamp 1" },
    "img/ra4-25.avif": { title: "broken 2" },
    "img/ra4-26.avif": { title: "seoul" },
    "img/ra4-27.avif": { title: "seoul" },
    "img/ra4-28.avif": { title: "seoul" },
    "img/ra4-29.avif": { title: "CLT 2" },
    "img/ra4-30.avif": { title: "lamp 2" },
    "img/movingsphere/ra4-31.avif": { title: "101", tags: ["moving_sphere"] },
    "img/ra4-32.avif": { title: "noise 1 (day)" },
    "img/ra4-33.avif": { title: "noise 1 (night)" },
    "img/ra4-34.avif": { title: "noise 2 (day)" },
    "img/ra4-35.avif": { title: "noise 2 (night)" },
    "img/ra4-36.avif": { title: "seoul" },
    "img/movingsphere/ra4-37.avif": { title: "Legs(pixelated)", tags: ["moving_sphere"] },
    "img/movingsphere/ra4-38.avif": { title: "Sun", tags: ["moving_sphere"] },
    "img/movingsphere/ra4-39.avif": { title: "Sphere", tags: ["moving_sphere"] },
    "img/movingsphere/ra4-40.avif": { title: "Sahrah", tags: ["moving_sphere"] },
    "img/movingsphere/ra4-41.avif": { title: "Roof", tags: ["moving_sphere"] },
    "img/movingsphere/ra4-42.avif": { title: "Cup", tags: ["moving_sphere"] },
    "img/movingsphere/ra4-43.avif": { title: "Bottle", tags: ["moving_sphere"] },
    "img/movingsphere/ra4-44.avif": { title: "Flower", tags: ["moving_sphere"] },
    "img/movingsphere/ra4-45.avif": { title: "Jeff", tags: ["moving_sphere"] },
    "img/movingsphere/ra4-46.avif": { title: "Man in the Sphere", tags: ["moving_sphere"] },
    "img/movingsphere/ra4-47.avif": { title: "Plastic Eye", tags: ["moving_sphere"] },

    // [faces] Series
    "img/faces-01.avif": { title: "Delighted", tags: ["hwanhee"] },
    "img/faces-02.avif": { title: "SunDimming", tags: ["sundimming"] },
    "img/faces-03.avif": { title: "Delighted", tags: ["hwanhee"] },
    "img/faces-04.avif": { title: "C", tags: ["xinseha"] },
    "img/faces-05.avif": { title: "SunDimming", tags: ["sundimming"] },
    "img/faces-06.avif": { title: "Blues" },
    "img/faces-07.avif": { title: "Blurred" },
    "img/faces-08.avif": { title: "Blurred" },
    "img/faces-09.avif": { title: "C", tags: ["xinseha"] },
    "img/faces-10.avif": { title: "superposition" },
    "img/faces-11.avif": { title: "Yu" },
    "img/faces-12.avif": { title: "SunDimming", tags: ["sundimming"] },
    "img/faces-13.avif": { title: "fluid state", tags: ["fluid_state"] },
    "img/faces-14.avif": { title: "Delighted", tags: ["hwanhee"] },
    "img/faces-15.avif": { title: "C", tags: ["xinseha"] },
    "img/faces-17.avif": { title: "face" },
    "img/faces-18.avif": { title: "C", tags: ["xinseha"] },
    "img/faces-19.avif": { title: "Delighted - Pixel", tags: ["hwanhee"] },
    "img/faces-20.avif": { title: "SunDimming", tags: ["sundimming"] },
    "img/faces-21.avif": { title: "superposition" },
    "img/faces-22.avif": { title: "fluid state", tags: ["fluid_state"] },
    "img/faces-23.avif": { title: "face" },
    "img/faces-24.avif": { title: "SunDimming", tags: ["sundimming"] },
    "img/faces-25.avif": { title: "SunDimming", tags: ["sundimming"] },
    "img/faces-26.avif": { title: "C", tags: ["xinseha"] },
    "img/faces-27.avif": { title: "rabbit hole" },
    "img/faces-28.avif": { title: "alloy", tags: ["aria"] },
    "img/faces-29.avif": { title: "alloy", tags: ["aria"] },
    "img/faces-30.avif": { title: "alloy", tags: ["aria"] },
    "img/faces-31.avif": { title: "flesh", tags: ["aria"] },
    "img/faces-32.avif": { title: "flesh", tags: ["aria"] },
    "img/faces-33.avif": { title: "1/20", tags: ["yt_1_20", "20"] },
    "img/faces-34.avif": { title: "1/20", tags: ["yt_1_20", "20"] },
    "img/faces-35.avif": { title: "1/20", tags: ["yt_1_20", "20"] },
    "img/faces-36.avif": { title: "1/20", tags: ["yt_1_20", "20"] },
    "img/faces-37.avif": { title: "1/20", tags: ["yt_1_20", "20"] },
    "img/faces-38.avif": { title: "1/20", tags: ["yt_1_20", "20"] },
    "img/faces-39.avif": { title: "1/20", tags: ["yt_1_20", "20"] },
    "img/faces-40.avif": { title: "1/20", tags: ["yt_1_20", "20"] },
    "img/faces-41.avif": { title: "LIPS", tags: ["lips"] },
    "img/faces-42.avif": { title: "LIPS", tags: ["lips"] },
    "img/faces-43.avif": { title: "LIPS", tags: ["lips"] },
    "img/faces-44.avif": { title: "LIPS", tags: ["lips"] },
    "img/faces-45.avif": { title: "LIPS", tags: ["lips"] },
    "img/faces-46.avif": { title: "LIPS", tags: ["lips"] },
    "img/faces-47.avif": { title: "LIPS", tags: ["lips"] },
    "img/faces-48.avif": { title: "LIPS", tags: ["lips"] },
    "img/faces-49.avif": { title: "LIPS", tags: ["lips"] },
    "img/faces-50.avif": { title: "LIPS", tags: ["lips"] },
    "img/faces-51.avif": { title: "LIPS", tags: ["lips"] },
    "img/faces-52.avif": { title: "LIPS", tags: ["lips"] },
    "img/faces-53.avif": { title: "LIPS", tags: ["lips"] },
    "img/faces-54.avif": { title: "LIPS", tags: ["lips"] },
    "img/faces-55.avif": { title: "LIPS", tags: ["lips"] },
    "img/faces-56.avif": { title: "LIPS", tags: ["lips"] },
    "img/faces-57.avif": { title: "10" },
    "img/faces-58.avif": { title: "Le Mile SS26", tags: ["editorial_lemile"] },
    "img/faces-59.avif": { title: "Le Mile SS26", tags: ["editorial_lemile"] },
    "img/faces-60.avif": { title: "Le Mile SS26", tags: ["editorial_lemile"] },
    "img/faces-61.avif": { title: "Le Mile SS26", tags: ["editorial_lemile"] },
    "img/faces-62.avif": { title: "Le Mile SS26", tags: ["editorial_lemile"] },
    "img/faces-63.avif": { title: "Le Mile SS26", tags: ["editorial_lemile"] },
    "img/faces-64.avif": { title: "Le Mile SS26", tags: ["editorial_lemile"] },
    "img/faces-65.avif": { title: "Le Mile SS26", tags: ["editorial_lemile"] },
    "img/faces-66.avif": { title: "Le Mile SS26", tags: ["editorial_lemile"] },
    "img/faces-67.avif": { title: "Le Mile SS26", tags: ["editorial_lemile"] },
    "img/faces-68.avif": { title: "Le Mile SS26", tags: ["editorial_lemile"] },
    "img/faces-69.avif": { title: "Le Mile SS26", tags: ["editorial_lemile"] },
    "img/faces-70.avif": { title: "Le Mile SS26", tags: ["editorial_lemile"] },
    "img/faces-71.avif": { title: "Beurre Was Here Before You Noticed", tags: ["heigs"] },
    "img/faces-72.avif": { title: "Beurre Was Here Before You Noticed", tags: ["heigs"] },
    "img/faces-73.avif": { title: "Beurre Was Here Before You Noticed", tags: ["heigs"] },
    "img/faces-74.avif": { title: "Beurre Was Here Before You Noticed", tags: ["heigs"] },
    "img/faces-75.avif": { title: "Beurre Was Here Before You Noticed", tags: ["heigs"] },
    "img/faces-76.avif": { title: "Beurre Was Here Before You Noticed", tags: ["heigs"] },
    "img/faces-77.avif": { title: "Beurre Was Here Before You Noticed", tags: ["heigs"] },
    "img/faces-78.avif": { title: "Beurre Was Here Before You Noticed", tags: ["heigs"] },
    "img/faces-79.avif": { title: "Beurre Was Here Before You Noticed", tags: ["heigs"] },
    "img/faces-80.avif": { title: "Beurre Was Here Before You Noticed", tags: ["heigs"] },
    "img/faces-81.avif": { title: "hwanhee", tags: ["hwanhee"] },
    "img/faces-82.avif": { title: "hwanhee", tags: ["hwanhee"] },
    "img/faces-83.avif": { title: "hwanhee", tags: ["hwanhee"] },
    // faces-84.avif: 파일 없음(삭제됨) - 104번과 동일하게 건너뜀
    "img/faces-85.avif": { title: "hwanhee", tags: ["hwanhee"] },
    "img/faces-86.avif": { title: "hwanhee", tags: ["hwanhee"] },
    "img/faces-87.avif": { title: "hwanhee", tags: ["hwanhee"] },
    "img/faces-88.avif": { title: "hwanhee", tags: ["hwanhee"] },
    "img/faces-89.avif": { title: "hwanhee", tags: ["hwanhee"] },
    "img/faces-90.avif": { title: "hwanhee", tags: ["hwanhee"] },
    "img/faces-91.avif": { title: "hwanhee", tags: ["hwanhee"] },
    "img/faces-92.avif": { title: "hwanhee", tags: ["hwanhee"] },
    "img/faces-93.avif": { title: "hwanhee", tags: ["hwanhee"] },
    "img/faces-94.avif": { title: "hwanhee", tags: ["hwanhee"] },
    "img/faces-95.avif": { title: "hwanhee", tags: ["hwanhee"] },
    "img/faces-96.avif": { title: "hwanhee", tags: ["hwanhee"] },
    "img/faces-97.avif": { title: "hwanhee", tags: ["hwanhee"] },
    "img/faces-98.avif": { title: "hwanhee", tags: ["hwanhee"] },
    "img/faces-99.avif": { title: "hwanhee", tags: ["hwanhee"] },
    "img/faces-100.avif": { title: "hwanhee", tags: ["hwanhee"] },
    "img/faces-101.avif": { title: "hwanhee", tags: ["hwanhee"] },
    "img/faces-102.avif": { title: "hwanhee", tags: ["hwanhee"] },
    "img/faces-103.avif": { title: "hwanhee", tags: ["hwanhee"] },
    "img/faces-105.avif": { title: "parkdongsun", tags: ["parkdongsun"] },
    "img/faces-106.avif": { title: "parkdongsun", tags: ["parkdongsun"] },
    "img/faces-107.avif": { title: "parkdongsun", tags: ["parkdongsun"] },
    "img/faces-108.avif": { title: "parkdongsun", tags: ["parkdongsun"] },
    "img/faces-109.avif": { title: "parkdongsun", tags: ["parkdongsun"] },
    "img/faces-110.avif": { title: "parkdongsun", tags: ["parkdongsun"] },
    "img/faces-111.avif": { title: "parkdongsun", tags: ["parkdongsun"] },
    "img/faces-112.avif": { title: "parkdongsun", tags: ["parkdongsun"] },

    // [ann] Series (parkdongsun 9~16번을 분리한 별도 시리즈)
    "img/faces-113.avif": { title: "ann", tags: ["ann"] },
    "img/faces-114.avif": { title: "ann", tags: ["ann"] },
    "img/faces-115.avif": { title: "ann", tags: ["ann"] },
    "img/faces-116.avif": { title: "ann", tags: ["ann"] },
    "img/faces-117.avif": { title: "ann", tags: ["ann"] },
    "img/faces-118.avif": { title: "ann", tags: ["ann"] },
    "img/faces-119.avif": { title: "ann", tags: ["ann"] },
    "img/faces-120.avif": { title: "ann", tags: ["ann"] },

    "img/faces-121.avif": { title: "Inès 1", tags: ["ines"] },
    "img/faces-122.avif": { title: "Inès 2", tags: ["ines"] },
    "img/faces-123.avif": { title: "Inès 3", tags: ["ines"] },
    "img/faces-124.avif": { title: "Inès 4", tags: ["ines"] },
    "img/faces-125.avif": { title: "Inès 5", tags: ["ines"] },
    "img/faces-126.avif": { title: "Inès 6", tags: ["ines"] },
    "img/faces-127.avif": { title: "Inès 7", tags: ["ines"] },
    "img/faces-128.avif": { title: "chowoohyun 1", tags: ["chowoohyun"] },
    "img/faces-129.avif": { title: "chowoohyun 2", tags: ["chowoohyun"] },
    "img/faces-130.avif": { title: "chowoohyun 3", tags: ["chowoohyun"] },
    "img/faces-131.avif": { title: "chowooseok 1", tags: ["chowooseok"] },
    "img/faces-132.avif": { title: "chowooseok 2", tags: ["chowooseok"] },
    "img/faces-133.avif": { title: "chowooseok 3", tags: ["chowooseok"] },
    "img/faces-134.avif": { title: "chowooseok 4", tags: ["chowooseok"] },
    "img/faces-135.avif": { title: "chowooseok 5", tags: ["chowooseok"] },
    "img/faces-136.avif": { title: "Gyeongju", tags: ["gyeongju"] },
    "img/faces-137.avif": { title: "Ripple Effects 2 1", tags: ["ripple_effects_2"] },
    "img/faces-138.avif": { title: "Ripple Effects 2 2", tags: ["ripple_effects_2"] },
    "img/faces-139.avif": { title: "Ripple Effects 2 3", tags: ["ripple_effects_2"] },
    "img/faces-140.avif": { title: "Ripple Effects 2 4", tags: ["ripple_effects_2"] },
    "img/faces-141.avif": { title: "Ripple Effects 2 5", tags: ["ripple_effects_2"] },
    "img/faces-142.avif": { title: "Ripple Effects 2 6", tags: ["ripple_effects_2"] },

    // [dots] Series
    "img/dots-1.avif": { title: "Workroom", tags: ["dots"] },
    "img/dots-2.avif": { title: "Shoes", tags: ["dots"] },
    "img/dots-3.avif": { title: "Workroom", tags: ["dots"] },
    "img/dots-4.avif": { title: "Workroom", tags: ["dots"] },
    "img/dots-5.avif": { title: "Ceiling lamp", tags: ["dots"] },
    "img/dots-6.avif": { title: "Ceiling lamp", tags: ["dots"] },
    "img/dots-7.avif": { title: "Ceiling lamp", tags: ["dots"] },

    // 기본 시리즈 이름 매핑 (특정 제목이 없을 때 사용)
    "series_walk": "Walk Series",
    "series_ra4": "Moving Sphere",
    "series_24": "24 Series",
    "series_faces": "Faces Series",
    "series_dots": "dots"
};

/**
 * 특정 태그에 대응하는 페이지 링크 매핑
 */
const TAG_PAGES = {
    "moving_sphere": "?page=moving_sphere",
    "dots": "?page=dots",
    "20": "?page=20",
    "lips": "?page=lips",
    "hwanhee": "?page=photoshoots",
    "parkdongsun": "?page=photoshoots",
    "ann": "?page=photoshoots",
    "ines": "?page=photoshoots",
    "chowoohyun": "?page=photoshoots",
    "chowooseok": "?page=photoshoots",
    "ripple_effects_2": "?page=photoshoots",
    "sundimming": "?page=photoshoots",
    "aria": "?page=photoshoots",
    "fluid_state": "?page=photoshoots",
    "xinseha": "?page=photoshoots",
    "blue_spring": "?page=blue_spring",
    "editorial_lemile": "?page=editorial_lemile",
    "heigs": "?page=heigs",
    "yt_two": "https://youtu.be/0RxL0-cDxK0?si=a2dnodyOsHDhDMSt",
    "yt_breeze": "https://youtu.be/nIgW9cxhXgU?si=L859rPPLxTmX-Uea",
    "yt_march": "https://youtu.be/MndVT9BRslQ?si=3FjlSM7ZwAxpq-nY",
    "yt_descending": "https://youtu.be/roxdWhdhR4M?si=I7vE6ATKzVeDQfB4",
    "yt_1_20": "https://www.youtube.com/@kangminjedotfilm"
};

/**
 * 특정 이미지의 제목(Title)을 가져옵니다. 
 * 링크가 가능한 태그가 있다면 <a> 태그를 포함하여 반환합니다.
 */
function getLabelFor(src) {
    let title = "Untitled";
    let tags = [];

    if (IMAGE_DATA[src]) {
        title = IMAGE_DATA[src].title || title;
        tags = IMAGE_DATA[src].tags || [];
    } else {
        // 파일명에서 시리즈 키 추출 (예: img/walk-01.avif -> walk)
        const match = src.match(/img\/([a-z0-9]+)-/);
        if (match) {
            const key = match[1];
            title = IMAGE_DATA[`series_${key}`] || title;
        }
    }

    // 링크 가능한 태그가 있는지 확인
    const linkTag = tags.find(tag => TAG_PAGES[tag]);

    // 현재 페이지 파라미터 확인
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get("page") || "walk";

    // ra4 탭에서는 링크를 생성하지 않음
    if (linkTag && pageParam !== "ra4") {
        const url = TAG_PAGES[linkTag];
        const isExternal = url.startsWith("http");
        const target = isExternal ? 'target="_blank"' : "";
        return `<a href="${url}" ${target} class="footer-link">${title}</a>`;
    }

    return title;
}

/**
 * 특정 태그(Series)에 해당하는 모든 이미지 리스트를 가져옵니다.
 */
function getImagesByTag(tag) {
    return Object.keys(IMAGE_DATA).filter(path => {
        const data = IMAGE_DATA[path];
        return data && data.tags && data.tags.includes(tag);
    });
}
