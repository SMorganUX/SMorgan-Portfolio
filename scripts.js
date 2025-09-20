const hero = document.querySelector('.hero');
const placeholder = document.querySelector('.hero-placeholder');
const portfolio = document.querySelector('.portfolio');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const rect = placeholder.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;

      // Set hero's new size/position to match placeholder
      hero.style.top = rect.top + scrollY + "px";
      hero.style.left = rect.left + "px";
      hero.style.width = rect.width + "px";
      hero.style.height = rect.height + "px";

      hero.classList.add('shrink');
    } else {
      // Only reset if scrolled back above the portfolio
      if (window.scrollY < portfolio.offsetTop) {
        hero.removeAttribute("style");  // clear inline styles
        hero.classList.remove('shrink');
      }
      // Else: stay shrunk when scrolling down past portfolio
    }
  });
}, { threshold: 0.3 });

observer.observe(placeholder);

    // Smooth scrolling for navigation links
document.querySelectorAll('.nav-list a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
  });
});

// Scroll to Top Button Functionality
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
// Smooth scroll to top when button is clicked
scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
