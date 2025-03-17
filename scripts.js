document.addEventListener("DOMContentLoaded", () => {
  // Preloader
  window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      preloader.style.opacity = 0;
      setTimeout(() => {
        preloader.style.display = "none";
      }, 500);
    }
  });

  // Navigation Bar Scroll Effect
  const navbar = document.querySelector(".navbar");
  const header = document.querySelector("header");

  function onScroll() {
    if (window.scrollY > header.offsetHeight) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", onScroll);
  onScroll(); // Initialize the state on page load

  // Smooth Scrolling for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70, // Adjust for fixed navbar height
          behavior: "smooth",
        });
      }
    });
  });

  // Hamburger Menu Toggle
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });

    // Accessibility: Toggle menu with Enter or Space key
    hamburger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        navLinks.classList.toggle("active");
      }
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
      });
    });
  }

  // Calculator Logic and Event Listener
  const calcForm = document.getElementById("mortgageForm");
  const resultCard = document.getElementById("result");

  if (calcForm && resultCard) {
    calcForm.addEventListener("reset", () => {
      const resultSpan = resultCard.querySelector("span");
      if (resultSpan) {
        resultSpan.textContent = "CAD $0";
      }
    });

    calcForm.addEventListener("submit", (e) => {
      e.preventDefault();
      calculateMortgage();
    });

    const calcButton = calcForm.querySelector('button[type="submit"]');
    if (calcButton) {
      calcButton.addEventListener("click", (e) => {
        e.preventDefault();
        calculateMortgage();
      });
    }
  }

  function calculateMortgage() {
    console.log("Calculating mortgage...");

    const loanAmountInput = document.getElementById("loanAmount");
    const interestRateInput = document.getElementById("interestRate");
    const loanTermInput = document.getElementById("loanTerm");

    if (!loanAmountInput || !interestRateInput || !loanTermInput) {
      console.error("One or more input elements not found!");
      alert("Form inputs are missing. Please reload the page.");
      return;
    }

    const loanAmount = parseFloat(loanAmountInput.value);
    const interestRate = parseFloat(interestRateInput.value);
    const loanTerm = parseFloat(loanTermInput.value);

    console.log("Inputs:", { loanAmount, interestRate, loanTerm });

    if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTerm)) {
      alert("Please enter valid numbers for all fields.");
      return;
    }

    if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
      alert("Please enter positive numbers for all fields.");
      return;
    }

    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const monthlyPayment =
      (monthlyRate * loanAmount) /
      (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
    const result = isNaN(monthlyPayment) ? "Error" : monthlyPayment.toFixed(2);

    console.log("Monthly Payment:", monthlyPayment, "Result:", result);

    const resultSpan = resultCard.querySelector("span");
    if (resultSpan) {
      const displayText =
        result === "Error" ? "Calculation Error" : "CAD $" + result;
      console.log("Setting textContent to:", displayText);
      resultSpan.textContent = displayText;
      resultCard.style.display = "block";
      // Refresh AOS to trigger animation on result card
      if (typeof AOS !== "undefined") AOS.refresh();
    } else {
      console.error("Result span not found!");
    }
  }
  // Add 'loaded' class to carousel items when images load
  const carouselItems = document.querySelectorAll(".carousel-item img");
  carouselItems.forEach((img) => {
    // If the image is already loaded (e.g., cached), add the class immediately
    if (img.complete) {
      img.closest(".carousel-item").classList.add("loaded");
    } else {
      // Otherwise, wait for the load event
      img.addEventListener("load", () => {
        img.closest(".carousel-item").classList.add("loaded");
      });
    }
  });
  // Preload images when they’re near the viewport
  const lazyImages = document.querySelectorAll(".carousel-item picture img");
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.src; // Trigger loading
          observer.unobserve(img);
        }
      });
    },
    { rootMargin: "200px" }
  );

  lazyImages.forEach((img) => observer.observe(img));

  // Ensure AOS animations wait for images to load
  const carouselImages = document.querySelectorAll(
    ".carousel-item picture img"
  );
  carouselImages.forEach((img) => {
    img.addEventListener("load", () => {
      if (typeof AOS !== "undefined") AOS.refresh();
    });
  });

  // Add 'loaded' class to carousel items when images load
  carouselImages.forEach((img) => {
    if (img.complete) {
      img.closest(".carousel-item").classList.add("loaded");
    } else {
      img.addEventListener("load", () => {
        img.closest(".carousel-item").classList.add("loaded");
      });
      // Handle error case (e.g., broken image URL)
      img.addEventListener("error", () => {
        img.closest(".carousel-item").classList.add("loaded");
      });
    }
  });
  // Carousel Navigation with Arrows and Swipe Support
  const carousel = document.querySelector(".carousel");
  const items = document.querySelectorAll(".carousel-item");
  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;
  const swipeThreshold = 50;

  function updateCarousel() {
    const itemWidth =
      items[0].clientWidth + parseFloat(getComputedStyle(carousel).gap || "0");
    const totalWidth = carousel.clientWidth;
    const maxIndex = Math.floor(
      (items.length * itemWidth - totalWidth) / itemWidth
    );
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
  }

  function showNext() {
    if (currentIndex < items.length - 1) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateCarousel();
  }

  function showPrev() {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = items.length - 1;
    }
    updateCarousel();
  }

  if (carousel) {
    const prevButton = document.createElement("button");
    prevButton.className = "carousel-arrow prev";
    prevButton.innerHTML = "←";
    const nextButton = document.createElement("button");
    nextButton.className = "carousel-arrow next";
    nextButton.innerHTML = "→";
    carousel.parentElement.insertBefore(prevButton, carousel);
    carousel.parentElement.appendChild(nextButton);

    prevButton.addEventListener("click", showPrev);
    nextButton.addEventListener("click", showNext);

    updateCarousel();
    window.addEventListener("resize", updateCarousel);

    carousel.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
    });

    carousel.addEventListener("touchmove", (e) => {
      touchEndX = e.touches[0].clientX;
    });

    carousel.addEventListener("touchend", () => {
      const swipeDistance = touchStartX - touchEndX;
      if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
          showNext();
        } else {
          showPrev();
        }
      }
    });
  }

  // Image Modal Functionality
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const closeModal = document.querySelector(".close");

  if (modal && modalImage && closeModal) {
    document.querySelectorAll(".carousel-item img").forEach((img) => {
      img.addEventListener("click", () => {
        modal.style.display = "flex";
        modalImage.src = img.src;
      });
    });

    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }

  // Contact Form Submission
  const contactForm = document.getElementById("contactForm");
  const formResponse = document.getElementById("formResponse");

  if (contactForm && formResponse) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;

      if (name && email && message) {
        formResponse.textContent =
          "Thank you for your message! We will get back to you soon.";
        formResponse.classList.add("visible");
        setTimeout(() => {
          formResponse.classList.remove("visible");
          contactForm.reset();
        }, 3000);
      } else {
        formResponse.textContent = "Please fill out all fields.";
        formResponse.classList.add("visible");
        setTimeout(() => formResponse.classList.remove("visible"), 3000);
      }
    });
  }

  // Back to Top Button
  const backToTopButton = document.getElementById("backToTop");
  if (backToTopButton) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add("visible");
      } else {
        backToTopButton.classList.remove("visible");
      }
    });

    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    backToTopButton.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    });
  }

  // CTA Overlay on Scroll
  const ctaOverlay = document.getElementById("ctaOverlay");
  const gallerySection = document.getElementById("gallery");
  const footer = document.querySelector("footer");

  if (ctaOverlay && gallerySection && footer) {
    window.addEventListener("scroll", () => {
      const galleryBottom = gallerySection.getBoundingClientRect().bottom;
      const footerTop = footer.getBoundingClientRect().top;
      if (
        galleryBottom < window.innerHeight &&
        footerTop > window.innerHeight
      ) {
        ctaOverlay.classList.add("visible");
      } else {
        ctaOverlay.classList.remove("visible");
      }
    });
  }
});
