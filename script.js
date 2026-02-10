// --- CONFIGURATION ---
const contentConfig = {
    magic: {
        title: "Magic Shows",
        prefix: "magic",
        imgCount: 1, 
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
let currentLbImages = []; 

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
function openLightbox(index, imageList) {
    currentLbIndex = index;
    currentLbImages = imageList;
    updateLightboxImage();
    lightbox.classList.add('active');
}

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
        lightbox.classList.remove('active');
    }
});

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

document.getElementById('lb-next').addEventListener('click', (e) => {
    e.stopPropagation(); 
    showNext();
});

document.getElementById('lb-prev').addEventListener('click', (e) => {
    e.stopPropagation(); 
    showPrev();
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'Escape') lightbox.classList.remove('active');
});

// SWIPE FUNCTIONALITY
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
    const threshold = 50; 
    if (touchEndX < touchStartX - threshold) showNext(); 
    if (touchEndX > touchStartX + threshold) showPrev(); 
}


// --- MAIN SITE LOGIC ---

// 1. BUILD HERO SLIDESHOW (UPDATED: ONLY 1 IMAGE PER CATEGORY)
const slideshowContainer = document.getElementById('hero-slideshow');
const slideImages = [];

Object.values(contentConfig).forEach(cat => {
    // Only grab the first image (img01)
    if(cat.imgCount >= 1) slideImages.push(`images/${cat.prefix}_img01.jpg`);
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
    
    // Collect images for lightbox
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
    bg.style.backgroundImage = `url('${categoryImages[0]}')`; 

    // Header with Arrow
    const header = document.createElement('div');
    header.classList.add('cat-header');
    header.innerHTML = `
        <h2>${cat.title}</h2>
        <span class="cat-arrow">▼</span>
    `;

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

        img.addEventListener('click', function(e) {
            e.stopPropagation(); 
            openLightbox(imgIndex, categoryImages); 
        });

        item.appendChild(img);
        mediaGrid.appendChild(item);
    });

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

// --- PARTNERSHIP MODAL LOGIC ---
const partnerBtn = document.getElementById('partnerBtn');
const contactModal = document.getElementById('contact-modal');
const closeModal = document.querySelector('.close-modal');

if(partnerBtn) {
    partnerBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        contactModal.classList.add('active');
    });
}

if(closeModal) {
    closeModal.addEventListener('click', () => {
        contactModal.classList.remove('active');
    });
}

window.addEventListener('click', (e) => {
    if (e.target === contactModal) {
        contactModal.classList.remove('active');
    }
});
