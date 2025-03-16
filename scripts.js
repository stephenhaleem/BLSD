document.addEventListener("DOMContentLoaded", () => {
  // Preloader
  window.addEventListener("load", () => {
    gsap.to("#preloader", {
      opacity: 0,
      duration: 1,
      onComplete: () => {
        document.getElementById("preloader").style.display = "none";
      },
    });
  });

  // Header Animations
  gsap.from(".header-content h1", {
    y: -100,
    opacity: 0,
    duration: 1.5,
    ease: "power3.out",
  });
  gsap.from(".header-content p", {
    y: 100,
    opacity: 0,
    duration: 1.5,
    delay: 0.5,
    ease: "power3.out",
  });
  gsap.from(".cta-button", {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 1,
    ease: "power3.out",
  });

  // Parallax Background
  const isMobile = window.innerWidth <= 768;
  gsap.to(".parallax-bg", {
    yPercent: isMobile ? 0 : 0,
    ease: "none",
    scrollTrigger: {
      trigger: "header",
      scrub: true,
    },
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
      if (navLinks.classList.contains("active")) {
        // Slide in menu from left with delayed animations for each link
        gsap.fromTo(
          navLinks,
          { x: "-100%", opacity: 0 },
          { x: "0%", opacity: 1, duration: 0.5, ease: "power2.out" }
        );
        gsap.fromTo(
          navLinks.children,
          { x: -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1, // 0.1s delay between each child
            ease: "power2.out",
          }
        );
      } else {
        // Slide out menu when closing
        gsap.to(navLinks, {
          x: "-100%",
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    });
    // Accessibility: Toggle menu with Enter or Space key
    hamburger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        navLinks.classList.toggle("active");
        gsap.fromTo(
          navLinks,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );
      }
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
      });
    });
  }

  // Calculator Animation Function
  function animateResult(resultCard) {
    gsap.fromTo(
      resultCard,
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: "back.out(1.7)" }
    );
  }

  // Calculator Logic and Event Listener
  const calcForm = document.getElementById("mortgageForm");
  const calcButton = calcForm
    ? calcForm.querySelector('button[type="submit"]')
    : null;

  if (!calcForm) {
    console.error(
      'Mortgage form not found! Ensure the form has id="mortgageForm".'
    );
    return;
  }

  if (!calcButton) {
    console.error("Submit button not found in the form!");
    return;
  }

  // Primary event listener on form submission
  calcForm.addEventListener("submit", (e) => {
    e.preventDefault();
    calculateMortgage();
  });

  // Fallback event listener on button click
  calcButton.addEventListener("click", (e) => {
    e.preventDefault();
    calculateMortgage();
  });

  function calculateMortgage() {
    console.log("Calculating mortgage...");

    // Get and validate inputs
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

    // Calculate monthly payment
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const monthlyPayment =
      (monthlyRate * loanAmount) /
      (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
    const result = isNaN(monthlyPayment) ? "Error" : monthlyPayment.toFixed(2);

    console.log("Monthly Payment:", monthlyPayment, "Result:", result);

    // Update the result
    const resultCard = document.getElementById("result");
    if (resultCard) {
      const resultSpan = resultCard.querySelector("span");
      if (resultSpan) {
        const displayText =
          result === "Error" ? "Calculation Error" : "CAD $" + result;
        console.log("Setting textContent to:", displayText);
        resultSpan.textContent = displayText;
        animateResult(resultCard);
      } else {
        console.error("Result span not found!");
      }
    } else {
      console.error("Result card not found!");
    }
  }

  // Bio Animation
  gsap.from(".bio-img", {
    rotationX: isMobile ? 180 : 360,
    scale: 0,
    duration: isMobile ? 1 : 1.5,
    ease: "elastic.out(1, 0.5)",
    scrollTrigger: { trigger: "#bio" },
  });
  gsap.from(".bio p", {
    x: -200,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    scrollTrigger: { trigger: "#bio" },
  });

  // Gallery Animation
  gsap.utils.toArray(".carousel-item").forEach((item, i) => {
    gsap.from(item, {
      x: 300,
      opacity: 0,
      duration: 1,
      delay: i * 0.2,
      scrollTrigger: { trigger: "#gallery" },
    });

    if (!isMobile) {
      item.addEventListener("mouseenter", () => {
        gsap.to(item, { scale: 1.1, duration: 0.5 });
        gsap.to(
          gsap.utils.toArray(".carousel-item").filter((el) => el !== item),
          { filter: "brightness(0.5)", duration: 0.5 }
        );
      });
      item.addEventListener("mouseleave", () => {
        gsap.to(item, { scale: 1, duration: 0.5 });
        gsap.to(".carousel-item", { filter: "brightness(1)", duration: 0.5 });
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
    if (currentIndex > maxIndex) currentIndex = maxIndex; // Prevent over-scrolling
    carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
  }

  function showNext() {
    if (currentIndex < items.length - 1) {
      currentIndex++;
    } else {
      currentIndex = 0; // Loop back to start
    }
    updateCarousel();
  }

  function showPrev() {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = items.length - 1; // Loop to end
    }
    updateCarousel();
  }

  // Add arrow buttons dynamically
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

    // Initial setup
    updateCarousel();

    // Adjust on window resize
    window.addEventListener("resize", updateCarousel);

    // Swipe Support for Mobile
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
  const themeToggleButton = document.getElementById("themeToggle");

  if (modal && modalImage && closeModal) {
    document.querySelectorAll(".carousel-item img").forEach((img) => {
      img.addEventListener("click", () => {
        modal.style.display = "flex";
        modalImage.src = img.src;
        if (themeToggleButton) {
          themeToggleButton.style.display = "none"; // Hide the theme toggle button
        }
      });
    });

    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
      if (themeToggleButton) {
        themeToggleButton.style.display = "block"; // Show the theme toggle button
      }
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
        if (themeToggleButton) {
          themeToggleButton.style.display = "block"; // Show the theme toggle button
        }
      }
    });
  }

  // Contact Form Submission
  const contactForm = document.getElementById("contactForm");
  const formResponse = document.getElementById("formResponse");

  if (contactForm && formResponse) {
    // Animate form elements on load
    gsap.from(".form-group", {
      opacity: 0,
      y: 50,
      stagger: 0.2,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#contact",
        start: "top 80%",
      },
    });

    // Handle form submission
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;

      // Simple validation
      if (name && email && message) {
        gsap.to(".submit-btn", {
          scale: 1.1,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
        });
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

    // Accessibility: Allow Enter or Space key to trigger back-to-top
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
