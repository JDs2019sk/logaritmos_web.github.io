AOS.init({
  duration: 800,
  once: true,
});

const numberInput = document.getElementById("numberInput");
const baseInput = document.getElementById("baseInput");
const baseSlider = document.getElementById("baseSlider");
const baseValue = document.getElementById("baseValue");
const errorMessage = document.querySelector(".error-message");
const canvas = document.getElementById("logChart");
const scrollTopBtn = document.querySelector(".scroll-top");

function calculateLog(number, base) {
  return Math.log(number) / Math.log(base);
}

function generateLogPoints(base, numPoints = 1000) {
  const points = [];
  const xMin = 0.01;
  const xMax = 30;

  for (let i = 0; i <= numPoints; i++) {
    const x = xMin + (i / numPoints) * (xMax - xMin);
    const y = calculateLog(x, base);
    points.push({ x, y });
  }
  return points;
}

class LogarithmChart {
  constructor(ctx) {
    this.ctx = ctx;
    this.chart = null;
    this.initialize(2);
  }

  initialize(base) {
    const data = generateLogPoints(base);
    const config = {
      type: "line",
      data: {
        datasets: [
          {
            label: `log${base}(x)`,
            data: data,
            borderColor: "#4f46e5",
            borderWidth: 3,
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: "#4f46e5",
            pointHoverBorderColor: "#ffffff",
            pointHoverBorderWidth: 2,
          },

          {
            label: "Eixo X",
            data: [
              { x: 0, y: 0 },
              { x: 30, y: 0 },
            ],
            borderColor: "#e5e7eb",
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
            hidden: false,
          },

          {
            label: "Eixo Y",
            data: [
              { x: 1, y: -10 },
              { x: 1, y: 10 },
            ],
            borderColor: "#e5e7eb",
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0,
            hidden: false,
          },

          {
            label: "Ponto (1,0)",
            data: [{ x: 1, y: 0 }],
            pointBackgroundColor: "#f59e0b",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
            showLine: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 20,
            right: 30,
            bottom: 20,
            left: 30,
          },
        },
        animation: {
          duration: 1000,
          easing: "easeInOutQuart",
        },
        scales: {
          x: {
            type: "linear",
            position: "bottom",
            min: 0,
            max: 30,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
              drawBorder: false,
            },
            ticks: {
              stepSize: 2,
              padding: 10,
              color: "#666",
              font: {
                size: 12,
                weight: 500,
              },
            },
            title: {
              display: true,
              text: "x",
              padding: 20,
              color: "#4f46e5",
              font: {
                size: 16,
                weight: "bold",
              },
            },
          },
          y: {
            min: -10,
            max: 10,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
              drawBorder: false,
            },
            ticks: {
              stepSize: 2,
              padding: 10,
              color: "#666",
              font: {
                size: 12,
                weight: 500,
              },
            },
            title: {
              display: true,
              text: "y = logb(x)",
              padding: 20,
              color: "#4f46e5",
              font: {
                size: 16,
                weight: "bold",
              },
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: "top",
            align: "center",
            labels: {
              boxWidth: 15,
              padding: 20,
              font: {
                size: 13,
                weight: 500,
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            titleColor: "#1f2937",
            bodyColor: "#1f2937",
            borderColor: "#e5e7eb",
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: function (context) {
                if (context.dataset.label.includes("Eixo")) return null;
                const x = context.parsed.x.toFixed(2);
                const y = context.parsed.y.toFixed(2);
                return `(${x}, ${y})`;
              },
            },
          },
        },
        interaction: {
          intersect: false,
          mode: "nearest",
        },
      },
    };

    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(this.ctx, config);
  }

  update(base) {
    const data = generateLogPoints(base);
    this.chart.data.datasets[0].label = `log${base}(x)`;
    this.chart.data.datasets[0].data = data;
    this.chart.update("none");
  }
}

const logChart = new LogarithmChart(canvas);

function validateInputs(number, base) {
  if (number <= 0 || base <= 1) {
    errorMessage.style.display = "block";
    return false;
  }
  errorMessage.style.display = "none";
  return true;
}

numberInput.addEventListener("input", () => {
  const number = parseFloat(numberInput.value);
  const base = parseFloat(baseInput.value);

  if (validateInputs(number, base)) {
    const result = calculateLog(number, base);
  }
});

baseInput.addEventListener("input", () => {
  const base = parseFloat(baseInput.value);
  baseSlider.value = base.toFixed(1);
  baseValue.textContent = base.toFixed(1);
  logChart.update(base);
});

baseSlider.addEventListener("input", (e) => {
  const base = parseFloat(e.target.value);
  baseInput.value = base.toFixed(1);
  baseValue.textContent = base.toFixed(1);
  logChart.update(base);
});

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollTopBtn.classList.add("visible");
  } else {
    scrollTopBtn.classList.remove("visible");
  }
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

logChart.update(2);

document.querySelectorAll("section").forEach((section) => {
  section.addEventListener("mouseenter", () => {
    section.classList.add("animate");
  });
});

document.querySelectorAll("nav a, .header-buttons a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href").slice(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const headerButtons = document.querySelectorAll(".header-buttons .button");

  headerButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const href = this.getAttribute("href");
      const targetSection = document.querySelector(href);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  const buttons = document.querySelectorAll(".button");
  buttons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });
});

baseSlider.min = "1.1";
baseSlider.max = "10";
baseSlider.step = "0.1";
