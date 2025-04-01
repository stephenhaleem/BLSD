document.addEventListener("DOMContentLoaded", () => {
  // Debounce function to limit scroll event frequency
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

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

  window.addEventListener("scroll", debounce(onScroll, 10));
  onScroll();

  // Parallax Effect for Hero Section
  window.addEventListener(
    "scroll",
    debounce(() => {
      const scrollPosition = window.scrollY;
      const parallaxBg = document.querySelector(".parallax-bg");
      if (parallaxBg) {
        parallaxBg.style.backgroundPositionY = `${30 + scrollPosition * 0.2}%`;
      }
    }, 10)
  );

  // Smooth Scrolling for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70,
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

    hamburger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        navLinks.classList.toggle("active");
      }
    });

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
      resultSpan.textContentments.textContent = displayText;
      resultCard.style.display = "block";
      if (typeof AOS !== "undefined") AOS.refresh();
    } else {
      console.error("Result span not found!");
    }
  }

  // Add 'loaded' class to carousel items when images load
  const carouselItems = document.querySelectorAll(".carousel-item img");
  carouselItems.forEach((img) => {
    if (img.complete) {
      img.closest(".carousel-item").classList.add("loaded");
    } else {
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
          img.src = img.src;
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

  carouselImages.forEach((img) => {
    if (img.complete) {
      img.closest(".carousel-item").classList.add("loaded");
    } else {
      img.addEventListener("load", () => {
        img.closest(".carousel-item").classList.add("loaded");
      });
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
      items[0].offsetWidth + parseFloat(getComputedStyle(carousel).gap || "0");
    const totalWidth = carousel.clientWidth;
    const maxIndex = Math.max(
      0,
      items.length - Math.floor(totalWidth / itemWidth)
    );
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;
    carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    carousel.style.transition = "transform 0.5s ease";
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
    window.addEventListener(
      "scroll",
      debounce(() => {
        if (window.scrollY > 300) {
          backToTopButton.classList.add("visible");
        } else {
          backToTopButton.classList.remove("visible");
        }
      }, 10)
    );

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

  // CTA Overlay on Scroll (Visible on all sections except contact)
  const ctaOverlay = document.getElementById("ctaOverlay");
  const contactSection = document.getElementById("contact");
  const sections = document.querySelectorAll("section:not(#contact)");

  if (ctaOverlay) {
    window.addEventListener(
      "scroll",
      debounce(() => {
        const scrollPosition = window.scrollY + window.innerHeight;
        const contactTop =
          contactSection.getBoundingClientRect().top + window.scrollY;
        let isVisible = false;

        sections.forEach((section) => {
          const sectionTop =
            section.getBoundingClientRect().top + window.scrollY;
          const sectionBottom = sectionTop + section.offsetHeight;
          if (
            scrollPosition > sectionTop &&
            window.scrollY < sectionBottom - 100
          ) {
            isVisible = true;
          }
        });

        if (scrollPosition > contactTop) {
          ctaOverlay.classList.remove("visible");
        } else if (isVisible) {
          ctaOverlay.classList.add("visible");
        } else {
          ctaOverlay.classList.remove("visible");
        }
      }, 10)
    );
  }
});
