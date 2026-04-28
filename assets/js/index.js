// ^ Write your JavaScript code here
var sections = document.querySelectorAll("section");
var navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {
    var current = "";
    sections.forEach(section => {
        var sectionTop = section.offsetTop;
        var sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }
    });
});


var themeToggle = document.getElementById("theme-toggle-button");

themeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
});


var filterButtons = document.querySelectorAll(".portfolio-filter");
var portfolioItems = document.querySelectorAll(".portfolio-item");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    var filter = button.dataset.filter;


    filterButtons.forEach(btn => {
      btn.classList.remove(
        "active",
        "bg-linear-to-r",
        "from-primary",
        "to-secondary",
        "text-white",
        "hover:shadow-lg",
        "hover:shadow-primary/50"
      );

      btn.classList.add(
        "bg-white",
        "dark:bg-slate-800",
        "text-slate-600",
        "dark:text-slate-300",
        "border",
        "border-slate-300",
        "dark:border-slate-700"
      );

      btn.setAttribute("aria-pressed", "false");
    });

    button.classList.add(
      "active",
      "bg-linear-to-r",
      "from-primary",
      "to-secondary",
      "text-white",
      "hover:shadow-lg",
      "hover:shadow-primary/50"
    );

    button.classList.remove(
      "bg-white",
      "dark:bg-slate-800",
      "text-slate-600",
      "dark:text-slate-300",
      "border",
      "border-slate-300",
      "dark:border-slate-700"
    );

    button.setAttribute("aria-pressed", "true");


    portfolioItems.forEach(item => {
      if (filter === "all" || item.dataset.category === filter) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  });
});


var settingsToggle = document.getElementById("settings-toggle");
var settingsSidebar = document.getElementById("settings-sidebar");
var closeSettings = document.getElementById("close-settings");

settingsToggle.addEventListener("click", () => {
    settingsSidebar.classList.toggle("translate-x-full"); 
    var isOpen = !settingsSidebar.classList.contains("translate-x-full");
    settingsToggle.setAttribute("aria-expanded", isOpen);
});

closeSettings.addEventListener("click", () => {
    settingsSidebar.classList.add("translate-x-full"); 
    settingsToggle.setAttribute("aria-expanded", false);
});

var fontOptions = document.querySelectorAll(".font-option");

fontOptions.forEach(option => {
    option.addEventListener("click", () => {
 
        fontOptions.forEach(opt => {
            opt.classList.remove("active");
            opt.setAttribute("aria-checked", "false");
        });

    
        option.classList.add("active");
        option.setAttribute("aria-checked", "true");

        
        var selectedFont = option.dataset.font;
        document.documentElement.style.setProperty('--main-font', selectedFont);
        document.body.style.fontFamily = selectedFont;
    });
});

var colors = [
  { name: "Purple Blue", primary: "#6366f1", secondary: "#8b5cf6", gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)" },
  { name: "Pink Orange", primary: "#ec4899", secondary: "#f97316", gradient: "linear-gradient(135deg, #ec4899, #f97316)" },
  { name: "Green Emerald", primary: "#10b981", secondary: "#059669", gradient: "linear-gradient(135deg, #10b981, #059669)" },
  { name: "Blue Cyan", primary: "#3b82f6", secondary: "#06b6d4", gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)" },
  { name: "Red Rose", primary: "#ef4444", secondary: "#f43f5e", gradient: "linear-gradient(135deg, #ef4444, #f43f5e)" },
  { name: "Amber Orange", primary: "#f59e0b", secondary: "#ea580c", gradient: "linear-gradient(135deg, #f59e0b, #ea580c)" }
];

var themeColorsGrid = document.getElementById("theme-colors-grid");


colors.forEach((color, index) => {
  var btn = document.createElement("button");
  btn.className = "w-12 h-12 rounded-full cursor-pointer transition-transform hover:scale-110 border-2 border-slate-200 dark:border-slate-700 hover:border-primary shadow-sm";
  btn.title = color.name;
  btn.dataset.primary = color.primary;
  btn.dataset.secondary = color.secondary;
  btn.style.background = color.gradient;

  if(index === 0){
    btn.classList.add('ring-2','ring-primary','ring-offset-2','ring-offset-white','dark:ring-offset-slate-900');
    document.documentElement.style.setProperty('--color-primary', color.primary);
    document.documentElement.style.setProperty('--color-secondary', color.secondary);
  }

  btn.addEventListener("click", () => {
    document.documentElement.style.setProperty('--color-primary', color.primary);
    document.documentElement.style.setProperty('--color-secondary', color.secondary);

    var allBtns = themeColorsGrid.querySelectorAll("button");
    allBtns.forEach(b => b.classList.remove('ring-2','ring-primary','ring-offset-2','ring-offset-white','dark:ring-offset-slate-900'));

    btn.classList.add('ring-2','ring-primary','ring-offset-2','ring-offset-white','dark:ring-offset-slate-900');
  });

  themeColorsGrid.appendChild(btn);
});
var resetBtn = document.getElementById("reset-settings");
resetBtn.addEventListener("click", () => {
    
    fontOptions.forEach(opt => {
        opt.classList.remove("active");
        opt.setAttribute("aria-checked", "false");
    });
    var defaultFontOption = document.querySelector(".font-option[data-font='tajawal']");
    if(defaultFontOption){
        defaultFontOption.classList.add("active");
        defaultFontOption.setAttribute("aria-checked", "true");
        document.documentElement.style.setProperty('--main-font', 'tajawal');
        document.body.style.fontFamily = 'tajawal';
    }

    
    var defaultColorBtn = document.querySelector("#theme-colors-grid button[data-primary='#6366f1']");
    if(defaultColorBtn) defaultColorBtn.click();
});

var scrollToTopBtn = document.getElementById("scroll-to-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) { 
    scrollToTopBtn.classList.remove("opacity-0", "invisible");
    scrollToTopBtn.classList.add("opacity-100", "visible");
  } else {
    scrollToTopBtn.classList.remove("opacity-100", "visible");
    scrollToTopBtn.classList.add("opacity-0", "invisible");
  }
});


scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth" 
  });
});




const carousel = document.getElementById("testimonials-carousel");
const cards = document.querySelectorAll(".testimonial-card");
const nextBtn = document.getElementById("next-testimonial");
const prevBtn = document.getElementById("prev-testimonial");
const indicators = document.querySelectorAll(".carousel-indicator");

let currentIndex = 0;
const totalCards = cards.length;

function updateCarousel() {
  const cardWidth = cards[0].offsetWidth;
  carousel.style.transform = `translateX(${currentIndex * cardWidth}px)`;
  setActiveIndicator(currentIndex);
}


function setActiveIndicator(activeIndex) {
  indicators.forEach((dot, index) => {
    if (index === activeIndex) {
      dot.classList.add("bg-accent", "scale-125","active");
      dot.classList.remove("bg-slate-400");
      dot.setAttribute("aria-selected", "true");
    } else {
      dot.classList.remove("bg-accent", "scale-125","active");
      dot.classList.add("bg-slate-400");
      dot.setAttribute("aria-selected", "false");
    }
  });
}

nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex >= totalCards) currentIndex = 0;
  updateCarousel();
});


prevBtn.addEventListener("click", () => {
  currentIndex--;
  if (currentIndex < 0) currentIndex = totalCards - 1;
  updateCarousel();
});

indicators.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentIndex = index;
    updateCarousel();
  });
});

window.addEventListener("resize", updateCarousel);
updateCarousel();
