// --- CONFIGURATION ---
const contentConfig = {
    magic: {
        title: "Magic Shows",
        prefix: "magic",
        imgCount: 3, 
        vidCount: 1  
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

// --- 0. CREATE LIGHTBOX (The Enlarge Viewer) ---
// We create this element dynamically so you don't have to edit HTML
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.classList.add('lightbox');
document.body.appendChild(lightbox);

// Click lightbox background to close it
lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
    lightbox.innerHTML = ''; // Clear content
});

function openLightbox(imgSrc) {
    lightbox.innerHTML = `<img src="${imgSrc}" alt="Enlarged View">`;
    lightbox.classList.add('active');
}


// --- 1. BUILD THE HERO SLIDESHOW ---
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


// --- 2. BUILD THE CATEGORY BOXES ---
const categoryContainer = document.getElementById('category-container');

Object.values(contentConfig).forEach((cat, index) => {
    
    // Create the Main Box
    const box = document.createElement('div');
    box.classList.add('category-box');
    box.id = `cat-${index}`;

    // Background Image
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

    // 2a. Inject Videos 
    for(let i=1; i<=cat.vidCount; i++) {
        let num = i.toString().padStart(2, '0');
        const item = document.createElement('div');
        item.classList.add('media-item');
        
        // Videos need to NOT close the drawer when clicked
        const vid = document.createElement('video');
        vid.controls = true;
        vid.innerHTML = `<source src="images/${cat.prefix}_vid${num}.mp4" type="video/mp4">`;
        
        // FIX: Stop propagation so drawer doesn't close on video click
        vid.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        item.appendChild(vid);
        mediaGrid.appendChild(item);
    }

    // 2b. Inject Images
    for(let i=1; i<=cat.imgCount; i++) {
        let num = i.toString().padStart(2, '0');
        const imgPath = `images/${cat.prefix}_img${num}.jpg`;
        
        const item = document.createElement('div');
        item.classList.add('media-item');
        
        const img = document.createElement('img');
        img.src = imgPath;
        img.alt = cat.title;

        // FIX: Add Click Event to Open Lightbox & Stop Drawer Closing
        img.addEventListener('click', function(e) {
            e.stopPropagation(); // <--- This stops the drawer from closing!
            openLightbox(imgPath); // <--- This opens the large image!
        });

        item.appendChild(img);
        mediaGrid.appendChild(item);
    }

    // Assemble the Box
    gallery.appendChild(mediaGrid);
    box.appendChild(bg);
    box.appendChild(header);
    box.appendChild(gallery);
    categoryContainer.appendChild(box);

    // Add Click Event to Expand/Collapse Drawer
    box.addEventListener('click', function() {
        // Close other boxes (optional - slicker feel)
        document.querySelectorAll('.category-box').forEach(b => {
            if(b !== this) b.classList.remove('open');
        });
        
        this.classList.toggle('open');
    });
});
