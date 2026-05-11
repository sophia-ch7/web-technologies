document.addEventListener("DOMContentLoaded", () => {
  function initCarousel(selector, userConfig = {}) {
    const container = document.querySelector(selector);

    if (!container) return;

    const config = {
      images: [],
      duration: 500,
      autoplay: false,
      autoplayInterval: 3000,
      showArrows: true,
      showDots: true,
      ...userConfig,
    };

    if (config.images.length === 0) return;

    let currentIndex = 0;
    let timer = null;

    let track, prevBtn, nextBtn, dotsContainer;
    let dots = [];

    function buildDOM() {
      container.setAttribute("tabindex", "0");

      track = document.createElement("div");
      track.className = "carousel-track";
      track.style.transition = `transform ${config.duration}ms ease-in-out`;

      config.images.forEach((src) => {
        const slide = document.createElement("div");
        slide.className = "carousel-slide";
        slide.style.backgroundImage = `url('${src}')`;
        track.appendChild(slide);
      });
      container.appendChild(track);

      if (config.showArrows) {
        prevBtn = document.createElement("button");
        prevBtn.className = "slider-arrow arrow-prev";
        prevBtn.innerHTML = "&#10094;";

        nextBtn = document.createElement("button");
        nextBtn.className = "slider-arrow arrow-next";
        nextBtn.innerHTML = "&#10095;";

        container.appendChild(prevBtn);
        container.appendChild(nextBtn);
      }

      if (config.showDots) {
        dotsContainer = document.createElement("div");
        dotsContainer.className = "slider-dots";

        dots = config.images.map((_, index) => {
          const dot = document.createElement("div");
          dot.className = `dot ${index === 0 ? "active" : ""}`;
          dot.dataset.index = index;
          dotsContainer.appendChild(dot);
          return dot;
        });
        container.appendChild(dotsContainer);
      }
    }

    function updateSlider() {
      const slideWidth = container.clientWidth;
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

      if (config.showDots) {
        dots.forEach((dot) => dot.classList.remove("active"));
        dots[currentIndex].classList.add("active");
      }
    }

    function next() {
      currentIndex = (currentIndex + 1) % config.images.length;
      updateSlider();
    }

    function prev() {
      currentIndex =
        (currentIndex - 1 + config.images.length) % config.images.length;
      updateSlider();
    }

    function goTo(index) {
      currentIndex = index;
      updateSlider();
    }

    function startAutoplay() {
      if (!timer) {
        timer = setInterval(() => next(), config.autoplayInterval);
      }
    }

    function stopAutoplay() {
      clearInterval(timer);
      timer = null;
    }

    function setupEvents() {
      if (config.showArrows) {
        nextBtn.addEventListener("click", next);
        prevBtn.addEventListener("click", prev);
      }

      if (config.showDots) {
        dotsContainer.addEventListener("click", (e) => {
          if (e.target.classList.contains("dot")) {
            goTo(parseInt(e.target.dataset.index, 10));
          }
        });
      }

      if (config.autoplay) {
        container.addEventListener("mouseenter", stopAutoplay);
        container.addEventListener("mouseleave", startAutoplay);
      }

      container.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      });

      window.addEventListener("resize", updateSlider);
    }

    buildDOM();
    setupEvents();

    if (config.autoplay) {
      startAutoplay();
    }
  }

  const myImages = [
    "https://rixos.ua/wp-content/uploads/2022/01/pexels-kostiantyn-stupak-190340.jpg",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
  ];

  initCarousel("#my-slider", {
    images: myImages,
    duration: 600,
    autoplay: true,
    autoplayInterval: 3000,
    showArrows: true,
    showDots: true,
  });
});
