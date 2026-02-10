// --- CONFIGURATION ---
const contentConfig = {
    magic: {
        title: "Magic Shows",
        prefix: "magic",
        imgCount: 2, 
        vidCount: 1  
    },
    car: {
        title: "Car Painting",
        prefix: "car",
        imgCount: 4,
        vidCount: 2
    },
    vr: {
        title: "VR & Planetarium",
        prefix: "VR",
        imgCount: 2,
        vidCount: 1
    },
    workshop: {
        title: "Creative Workshops",
        prefix: "wshop",
        imgCount: 2,
        vidCount: 5
    }
};

// --- LIGHTBOX VARIABLES ---
let currentLbIndex = 0;
let currentLbImages = []; // Stores the list of images for the active category

// --- 0. CREATE LIGHTBOX DOM ---
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.classList.add('lightbox');
lightbox.innerHTML = `
    <div class="lightbox-content">
        <span class="lb-arrow lb-prev" id="lb-prev">&#10094;</span>
        <img id="lb-img" src="" alt="">
        <span class="lb-arrow lb-next" id="lb-next">&#10095;</span>
    </div>
`;
document.body.appendChild(lightbox);

const lbImg = document.getElementById('lb-img');

// --- LIGHTBOX LOGIC ---

// 1. Open Function
function openLightbox(index, imageList) {
    currentLbIndex = index;
    currentLbImages = imageList;
    updateLightboxImage();
    lightbox.classList.add('active');
}

// 2. Close Function (Only closes if you click the background, NOT the image)
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
        lightbox.classList.remove('active');
    }
});

// 3. Navigation Functions
function showNext() {
    currentLbIndex = (currentLbIndex + 1) % currentLbImages.length;
    updateLightboxImage();
}

function showPrev() {
    currentLbIndex = (currentLbIndex - 1 + currentLbImages.length) % currentLbImages.length;
    updateLightboxImage();
}

function updateLightboxImage() {
    lbImg.src = currentLbImages[currentLbIndex];
}

// 4. Event Listeners for Nav
document.getElementById('lb-next').addEventListener('click', (e) => {
    e.stopPropagation(); // Don't close box
    showNext();
});

document.getElementById('lb-prev').addEventListener('click', (e) => {
    e.stopPropagation(); // Don't close box
    showPrev();
});

// 5. Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'Escape') lightbox.classList.remove('active');
});

// 6. SWIPE FUNCTIONALITY (Mobile)
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

lightbox.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const threshold = 50; // Minimum distance to count as swipe
    if (touchEndX < touchStartX - threshold) showNext(); // Swiped Left
    if (touchEndX > touchStartX + threshold) showPrev(); // Swiped Right
}


// --- MAIN SITE LOGIC ---

// 1. BUILD HERO SLIDESHOW
const slideshowContainer = document.getElementById('hero-slideshow');
const slideImages = [];

Object.values(contentConfig).forEach(cat => {
    if(cat.imgCount >= 1) slideImages.push(`images/${cat.prefix}_img01.jpg`);
    if(cat.imgCount >= 2) slideImages.push(`images/${cat.prefix}_img02.jpg`);
});

slideImages.forEach((src, index) => {
    const div = document.createElement('div');
    div.classList.add('slide');
    if (index === 0) div.classList.add('active'); 
    div.style.backgroundImage = `url('${src}')`;
    slideshowContainer.appendChild(div);
});

let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

if(slides.length > 0) {
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000); 
}


// 2. BUILD CATEGORY BOXES
const categoryContainer = document.getElementById('category-container');

Object.values(contentConfig).forEach((cat, index) => {
    
    // Collect all images for this category upfront for the lightbox
    const categoryImages = [];
    for(let i=1; i<=cat.imgCount; i++) {
        let num = i.toString().padStart(2, '0');
        categoryImages.push(`images/${cat.prefix}_img${num}.jpg`);
    }

    // Create Main Box
    const box = document.createElement('div');
    box.classList.add('category-box');
    box.id = `cat-${index}`;

    const bg = document.createElement('div');
    bg.classList.add('cat-bg');
    bg.style.backgroundImage = `url('${categoryImages[0]}')`; // Use first image as cover

    const header = document.createElement('div');
    header.classList.add('cat-header');
    header.innerHTML = `<h2>${cat.title}</h2>`;

    const gallery = document.createElement('div');
    gallery.classList.add('cat-gallery');
    const mediaGrid = document.createElement('div');
    mediaGrid.classList.add('media-grid');

    // 2a. Inject Videos 
    for(let i=1; i<=cat.vidCount; i++) {
        let num = i.toString().padStart(2, '0');
        const item = document.createElement('div');
        item.classList.add('media-item');
        
        const vid = document.createElement('video');
        vid.controls = true;
        vid.innerHTML = `<source src="images/${cat.prefix}_vid${num}.mp4" type="video/mp4">`;
        
        // Videos just play, they don't open lightbox
        vid.addEventListener('click', (e) => e.stopPropagation());

        item.appendChild(vid);
        mediaGrid.appendChild(item);
    }

    // 2b. Inject Images
    categoryImages.forEach((imgSrc, imgIndex) => {
        const item = document.createElement('div');
        item.classList.add('media-item');
        
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = cat.title;

        // Click opens lightbox at correct index
        img.addEventListener('click', function(e) {
            e.stopPropagation(); 
            openLightbox(imgIndex, categoryImages); 
        });

        item.appendChild(img);
        mediaGrid.appendChild(item);
    });

    // Assemble Box
    gallery.appendChild(mediaGrid);
    box.appendChild(bg);
    box.appendChild(header);
    box.appendChild(gallery);
    categoryContainer.appendChild(box);

    // Expand/Collapse Logic
    box.addEventListener('click', function() {
        document.querySelectorAll('.category-box').forEach(b => {
            if(b !== this) b.classList.remove('open');
        });
        this.classList.toggle('open');
    });
});
