// Debounce function to limit scroll event frequency
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Preloader
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.style.opacity = "0";
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500);
  }
});

// Navbar Scroll Behavior
let lastScroll = 0;
const navbar = document.querySelector(".navbar");

window.addEventListener(
  "scroll",
  debounce(() => {
    const currentScroll = window.scrollY;
    if (currentScroll > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    lastScroll = currentScroll;
  }, 100)
);

// Hamburger Menu Toggle
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  hamburger.textContent = navLinks.classList.contains("active") ? "✕" : "☰";
});

// Smooth Scroll for Nav Links
document.querySelectorAll(".nav-links a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const href = this.getAttribute("href");
    if (href.includes("#")) {
      const targetId = href.split("#")[1];
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = href;
      }
    } else {
      window.location.href = href;
    }
    navLinks.classList.remove("active");
    hamburger.textContent = "☰";
  });
});

// Mortgage Calculator
document.addEventListener("DOMContentLoaded", () => {
  const mortgageForm = document.getElementById("mortgageForm");
  const resultCard = document.getElementById("result");
  const monthlyPaymentSpan = document.getElementById("monthlyPayment");

  if (mortgageForm) {
    // Handle form reset
    mortgageForm.addEventListener("reset", () => {
      if (resultCard) {
        resultCard.style.display = "none"; // Hide the result card
        monthlyPaymentSpan.textContent = "CAD $0"; // Reset the result text
      }
    });

    // Handle form submission (example logic)
    mortgageForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const loanAmount = parseFloat(
        document.getElementById("loanAmount").value
      );
      const interestRate = parseFloat(
        document.getElementById("interestRate").value
      );
      const loanTerm = parseFloat(document.getElementById("loanTerm").value);

      if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTerm)) {
        alert("Please enter valid numbers for all fields.");
        return;
      }

      // Calculate monthly payment
      const monthlyRate = interestRate / 100 / 12;
      const numberOfPayments = loanTerm * 12;
      const monthlyPayment =
        (monthlyRate * loanAmount) /
        (1 - Math.pow(1 + monthlyRate, -numberOfPayments));

      // Update the result card
      if (resultCard) {
        resultCard.style.display = "block"; // Show the result card
        monthlyPaymentSpan.textContent = `CAD $${monthlyPayment.toFixed(2)}`;
      }
    });
  }
});

// Image Modal
const modal = document.getElementById("imageModal");
if (modal) {
  const modalImg = document.getElementById("modalImage");
  const captionText = document.getElementById("caption");
  const closeModal = document.querySelector(".close");

  document.querySelectorAll(".carousel-item img").forEach((img) => {
    img.addEventListener("click", () => {
      modal.style.display = "flex";
      modalImg.src = img.src;
      captionText.textContent = img.alt;
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

// Back to Top Button
const backToTop = document.getElementById("backToTop");
window.addEventListener(
  "scroll",
  debounce(() => {
    if (window.scrollY > 300) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  }, 100)
);

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// CTA Overlay
const ctaOverlay = document.getElementById("ctaOverlay");
if (ctaOverlay) {
  window.addEventListener(
    "scroll",
    debounce(() => {
      if (window.scrollY > 300) {
        ctaOverlay.classList.add("visible");
      } else {
        ctaOverlay.classList.remove("visible");
      }
    }, 100)
  );
}

// Contact Form Submission
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    })
      .then(() => {
        document.getElementById("formResponse").textContent =
          "Message sent successfully!";
        document.getElementById("formResponse").classList.add("visible");
        form.reset();
        setTimeout(() => {
          document.getElementById("formResponse").classList.remove("visible");
        }, 3000);
      })
      .catch((error) => {
        document.getElementById("formResponse").textContent =
          "Error sending message.";
        document.getElementById("formResponse").classList.add("visible");
        console.error("Form submission error:", error);
      });
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".carousel");
  const prevButton = document.querySelector(".carousel-arrow.prev");
  const nextButton = document.querySelector(".carousel-arrow.next");

  let scrollPosition = 0;
  const itemWidth = carousel.querySelector(".carousel-item").clientWidth + 24; // Adjust for gap

  // Scroll to the next set of items
  nextButton.addEventListener("click", () => {
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    scrollPosition = Math.min(scrollPosition + itemWidth, maxScroll);
    carousel.style.transform = `translateX(-${scrollPosition}px)`;
  });

  // Scroll to the previous set of items
  prevButton.addEventListener("click", () => {
    scrollPosition = Math.max(scrollPosition - itemWidth, 0);
    carousel.style.transform = `translateX(-${scrollPosition}px)`;
  });
});
