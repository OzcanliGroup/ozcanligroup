// --- CONFIGURATION ---
// Update these numbers as you add files to your images folder.
const contentConfig = {
    magic: {
        title: "Magic Shows",
        prefix: "magic",
        imgCount: 3, // You have magic_img01.jpg, 02, 03
        vidCount: 1  // You have magic_vid01.mp4
    },
    car: {
        title: "Beetle Painting",
        prefix: "car",
        imgCount: 3,
        vidCount: 0
    },
    vr: {
        title: "VR & Planetarium",
        prefix: "VR",
        imgCount: 2,
        vidCount: 0
    },
    workshop: {
        title: "Creative Workshops",
        prefix: "wshop",
        imgCount: 2,
        vidCount: 0
    }
};

// --- 1. BUILD THE HERO SLIDESHOW ---
// We grab img01 and img02 from every category for the top slider
const slideshowContainer = document.getElementById('hero-slideshow');
const slideImages = [];

Object.values(contentConfig).forEach(cat => {
    // Try to add img01 and img02 for the slideshow
    if(cat.imgCount >= 1) slideImages.push(`images/${cat.prefix}_img01.jpg`);
    if(cat.imgCount >= 2) slideImages.push(`images/${cat.prefix}_img02.jpg`);
});

// Create HTML for slides
slideImages.forEach((src, index) => {
    const div = document.createElement('div');
    div.classList.add('slide');
    if (index === 0) div.classList.add('active'); // First one active
    div.style.backgroundImage = `url('${src}')`;
    slideshowContainer.appendChild(div);
});

// Run the Slideshow
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}, 5000); // Change every 5 seconds


// --- 2. BUILD THE CATEGORY BOXES ---
const categoryContainer = document.getElementById('category-container');

Object.values(contentConfig).forEach((cat, index) => {
    
    // Create the Main Box
    const box = document.createElement('div');
    box.classList.add('category-box');
    box.id = `cat-${index}`;

    // Background Image (Always uses img01 as thumbnail)
    const bg = document.createElement('div');
    bg.classList.add('cat-bg');
    bg.style.backgroundImage = `url('images/${cat.prefix}_img01.jpg')`;

    // Title Header
    const header = document.createElement('div');
    header.classList.add('cat-header');
    header.innerHTML = `<h2>${cat.title}</h2>`;

    // Hidden Gallery Container
    const gallery = document.createElement('div');
    gallery.classList.add('cat-gallery');
    const mediaGrid = document.createElement('div');
    mediaGrid.classList.add('media-grid');

    // 2a. Inject Videos First
    for(let i=1; i<=cat.vidCount; i++) {
        // Helper to format number as '01', '02'
        let num = i.toString().padStart(2, '0');
        const item = document.createElement('div');
        item.classList.add('media-item');
        item.innerHTML = `
            <video controls>
                <source src="images/${cat.prefix}_vid${num}.mp4" type="video/mp4">
            </video>`;
        mediaGrid.appendChild(item);
    }

    // 2b. Inject Images Second
    for(let i=1; i<=cat.imgCount; i++) {
        let num = i.toString().padStart(2, '0');
        const item = document.createElement('div');
        item.classList.add('media-item');
        item.innerHTML = `<img src="images/${cat.prefix}_img${num}.jpg" alt="${cat.title}">`;
        mediaGrid.appendChild(item);
    }

    // Assemble the Box
    gallery.appendChild(mediaGrid);
    box.appendChild(bg);
    box.appendChild(header);
    box.appendChild(gallery);
    categoryContainer.appendChild(box);

    // Add Click Event to Expand
    box.addEventListener('click', function() {
        // Toggle the 'open' class
        this.classList.toggle('open');
    });
});
