const hero = document.querySelector('.hero');
const placeholder = document.querySelector('.hero-placeholder');
const portfolio = document.querySelector('.portfolio');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const rect = placeholder.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;

      // Set hero’s new size/position to match placeholder
      hero.style.top = rect.top + scrollY + "px";
      hero.style.left = rect.left + "px";
      hero.style.width = rect.width + "px";
      hero.style.height = rect.height + "px";

      hero.classList.add('shrink');
    } else {
      // Reset hero back to full screen
      hero.removeAttribute("style");  // clear inline styles
      hero.classList.remove('shrink');
    }
  });
}, { threshold: 0.3 });

observer.observe(portfolio);
