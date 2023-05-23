const carousel = document.querySelector(".carousel"),
    firstImg = carousel.querySelectorAll("img")[0],
    arrowIcons = document.querySelectorAll(".wrapper i"),
    points = document.querySelectorAll('.point');

let isDragStart = false,
    isDragging = false,
    prevPageX,
    prevScrollLeft = 0,
    positionDiff = 0,
    imageWidth = firstImg.offsetWidth,
    scrollDirection = 0;

const updateActivePoint = () => {
    const scrollLeft = carousel.scrollLeft;
    const activePointIndex = Math.round(scrollLeft / imageWidth);

    // Remove active class from all points
    points.forEach((point) => {
        point.classList.remove('active');
    });

    // Add active class to the current active point
    points[activePointIndex].classList.add('active');
};

points.forEach((point) => {
    point.addEventListener('click', () => {
        const pointId = parseInt(point.id);
        carousel.scrollLeft = imageWidth * (pointId - 1);
        setTimeout(() => updateActivePoint(), 200);
    });
});

const showHideIcons = () => {
    let scrollWidth = carousel.scrollWidth - carousel.clientWidth;
    arrowIcons[0].style.display = carousel.scrollLeft === 0 ? "none" : "block";
    arrowIcons[1].style.display =
        carousel.scrollLeft === scrollWidth ? "none" : "block";
};

arrowIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
        carousel.scrollLeft +=
            icon.id === "left" ? -imageWidth : imageWidth;
        setTimeout(() => showHideIcons(), 550);
        updateActivePoint();
    });
});

const autoSlide = () => {
    // if there is no image left to scroll then return from here
    if (positionDiff > 0) {
        carousel.scrollLeft -= imageWidth;
    } else {
        carousel.scrollLeft += imageWidth;
    }
}

const dragStart = (e) => {
    // updatating global variables value on mouse down event
    isDragStart = true;
    prevPageX = e.pageX || e.touches[0].pageX;
    prevScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    // scrolling images/carousel to left according to mouse pointer
    if (!isDragStart) return;
    e.preventDefault();
    isDragging = true;
    carousel.classList.add("dragging");
    positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
    carousel.scrollLeft = prevScrollLeft - positionDiff;
}

const dragStop = async () => {
    isDragStart = false;
    carousel.classList.remove("dragging");

    if (!isDragging) return;
    isDragging = false;
    await autoSlide();
    setTimeout(() => showHideIcons(), 550);
}

const handleScroll = () => {
    const currentScrollLeft = carousel.scrollLeft;
    if (currentScrollLeft > prevScrollLeft) {
        scrollDirection = 1; // Scrolling to the right
    } else if (currentScrollLeft < prevScrollLeft) {
        scrollDirection = -1; // Scrolling to the left
    }
    prevScrollLeft = currentScrollLeft;
    setTimeout(() => showHideIcons(), 550);
    updateActivePoint();
};

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("touchstart", dragStart);

document.addEventListener("mousemove", dragging);
carousel.addEventListener("touchmove", dragging);

document.addEventListener("mouseup", dragStop);
carousel.addEventListener("touchend", dragStop);

carousel.addEventListener("scroll", handleScroll);

showHideIcons();
updateActivePoint();

setInterval(() => {
    const scrollWidth = carousel.scrollWidth - carousel.clientWidth;
    if (carousel.scrollLeft === scrollWidth) {
        // Reached the end, scroll back to the beginning
        carousel.scrollLeft = 0;
    } else {
        // Scroll to the next image
        carousel.scrollLeft += imageWidth;
    }
    setTimeout(() => showHideIcons(), 550);
    updateActivePoint();
}, 5000);
