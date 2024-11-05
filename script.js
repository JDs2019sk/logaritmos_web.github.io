// Configuração do Chart.js
Chart.defaults.font.family =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
Chart.defaults.font.size = 12;

// Função para gerar pontos do gráfico logarítmico
function generateLogPoints(base, numPoints = 200) {
  const points = [];
  const xMin = 0.1;
  const xMax = 10;
  for (let i = 0; i < numPoints; i++) {
    const x = xMin + (i / numPoints) * (xMax - xMin);
    const y = Math.log(x) / Math.log(base);
    points.push({ x, y });
  }
  return points;
}

// Classe para gerenciar o gráfico
class LogarithmChart {
  constructor() {
    this.chart = null;
    this.ctx = document.getElementById("logChart").getContext("2d");
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
            borderColor: "#2563eb",
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 500,
        },
        scales: {
          x: {
            type: "linear",
            position: "bottom",
            title: {
              display: true,
              text: "x",
              font: {
                size: 14,
                weight: "bold",
              },
            },
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
          },
          y: {
            type: "linear",
            title: {
              display: true,
              text: "y",
              font: {
                size: 14,
                weight: "bold",
              },
            },
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
          },
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              usePointStyle: true,
              padding: 20,
            },
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: function (context) {
                return `y = ${context.parsed.y.toFixed(3)}`;
              },
            },
          },
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

// Classe para gerenciar a calculadora
class LogarithmCalculator {
  constructor() {
    this.numberInput = document.getElementById("numberInput");
    this.baseInput = document.getElementById("baseInput");
    this.calculateBtn = document.getElementById("calculateBtn");
    this.result = document.getElementById("calculatorResult");

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.calculateBtn.addEventListener("click", () => this.calculate());

    // Adiciona evento de Enter nos inputs
    [this.numberInput, this.baseInput].forEach((input) => {
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.calculate();
        }
      });
    });

    // Validação em tempo real
    [this.numberInput, this.baseInput].forEach((input) => {
      input.addEventListener("input", () => {
        this.validateInput(input);
      });
    });
  }

  validateInput(input) {
    const value = parseFloat(input.value);
    if (isNaN(value) || value <= 0) {
      input.classList.add("error");
      return false;
    }
    if (input === this.baseInput && value === 1) {
      input.classList.add("error");
      return false;
    }
    input.classList.remove("error");
    return true;
  }

  calculate() {
    if (
      !this.validateInput(this.numberInput) ||
      !this.validateInput(this.baseInput)
    ) {
      this.showError(
        "Por favor, insira valores válidos (números positivos, base ≠ 1)"
      );
      return;
    }

    const number = parseFloat(this.numberInput.value);
    const base = parseFloat(this.baseInput.value);

    try {
      const result = Math.log(number) / Math.log(base);
      this.showResult(result, number, base);
    } catch (error) {
      this.showError("Erro ao calcular o logaritmo");
    }
  }

  showResult(result, number, base) {
    this.result.innerHTML = `
            <div class="formula">
                log<sub>${base}</sub>(${number}) = ${result.toFixed(4)}
            </div>
            <div class="additional-info">
                <p>Outros logaritmos do número ${number}:</p>
                <ul>
                    <li>ln(${number}) = ${Math.log(number).toFixed(4)}</li>
                    <li>log<sub>10</sub>(${number}) = ${Math.log10(
      number
    ).toFixed(4)}</li>
                    <li>log<sub>2</sub>(${number}) = ${Math.log2(
      number
    ).toFixed(4)}</li>
                </ul>
            </div>
        `;
    this.result.classList.remove("error");
  }

  showError(message) {
    this.result.innerHTML = `<div class="error-message">${message}</div>`;
    this.result.classList.add("error");
  }
}

// Classe para gerenciar exercícios
class ExerciseManager {
  constructor() {
    this.setupExercises();
  }

  setupExercises() {
    document.querySelectorAll(".exercise").forEach((exercise) => {
      const solutionBtn = exercise.querySelector(".toggle-solution");
      const solution = exercise.querySelector(".solution");

      if (solutionBtn && solution) {
        solutionBtn.addEventListener("click", () => {
          const isHidden = solution.style.display === "none";
          solution.style.display = isHidden ? "block" : "none";
          solutionBtn.textContent = isHidden
            ? "Ocultar Solução"
            : "Ver Solução";

          if (isHidden) {
            solution.style.opacity = "0";
            setTimeout(() => {
              solution.style.opacity = "1";
            }, 10);
          }
        });
      }
    });
  }
}

// Inicialização do aplicativo
document.addEventListener("DOMContentLoaded", () => {
  // Inicializa o gráfico
  const chart = new LogarithmChart();
  chart.initialize(2);

  // Configura o slider da base
  const baseSlider = document.getElementById("baseSlider");
  const baseValue = document.getElementById("baseValue");

  baseSlider.addEventListener("input", (e) => {
    const base = parseFloat(e.target.value);
    baseValue.textContent = base.toFixed(1);
    chart.update(base);
  });

  // Inicializa a calculadora
  const calculator = new LogarithmCalculator();

  // Inicializa o gerenciador de exercícios
  const exerciseManager = new ExerciseManager();

  // Adiciona smooth scroll para navegação
  document.querySelectorAll("nav a").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});
