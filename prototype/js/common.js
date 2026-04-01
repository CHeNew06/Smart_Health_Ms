/* Tab switching */
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    const btns = tabGroup.querySelectorAll('.tab-btn');
    const contentId = tabGroup.dataset.target;
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (contentId) {
          const parent = document.getElementById(contentId);
          if (parent) {
            parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            const target = parent.querySelector('#' + btn.dataset.tab);
            if (target) target.classList.add('active');
          }
        } else {
          const container = tabGroup.parentElement;
          container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
          const target = container.querySelector('#' + btn.dataset.tab);
          if (target) target.classList.add('active');
        }
      });
    });
  });
}

/* Toggle switches */
function initToggles() {
  document.querySelectorAll('.toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
    });
  });
}

/* Checkboxes */
function initCheckboxes() {
  document.querySelectorAll('.checkbox').forEach(cb => {
    cb.addEventListener('click', () => {
      cb.classList.toggle('checked');
      if (cb.classList.contains('checked')) {
        cb.innerHTML = '<i class="fas fa-check" style="font-size:12px"></i>';
      } else {
        cb.innerHTML = '';
      }
      updateTaskProgress();
    });
  });
}

/* Task progress */
function updateTaskProgress() {
  const boxes = document.querySelectorAll('.task-list .checkbox');
  const checked = document.querySelectorAll('.task-list .checkbox.checked');
  const progressBar = document.querySelector('.task-progress-fill');
  const progressText = document.querySelector('.task-progress-text');
  if (progressBar && boxes.length) {
    const pct = Math.round((checked.length / boxes.length) * 100);
    progressBar.style.width = pct + '%';
    if (progressText) progressText.textContent = checked.length + '/' + boxes.length;
  }
}

/* Modal */
function showModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('show');
}

function hideModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('show');
}

/* Verification code countdown */
function startCountdown(btn) {
  let seconds = 60;
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.style.opacity = '0.6';
  btn.textContent = seconds + 's';
  const timer = setInterval(() => {
    seconds--;
    btn.textContent = seconds + 's';
    if (seconds <= 0) {
      clearInterval(timer);
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.opacity = '1';
    }
  }, 1000);
}

/* Health score ring chart */
function drawHealthRing(canvasId, score) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  const center = size / 2;
  const radius = center - 15;
  const lineWidth = 12;

  ctx.clearRect(0, 0, size, size);

  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.stroke();

  let color = '#10B981';
  if (score < 60) color = '#EF4444';
  else if (score < 75) color = '#F59E0B';
  else if (score < 90) color = '#3B82F6';

  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (score / 100) * Math.PI * 2;

  ctx.beginPath();
  ctx.arc(center, center, radius, startAngle, endAngle);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.fillStyle = '#1F2937';
  ctx.font = 'bold 36px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(score, center, center - 8);

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '12px -apple-system, sans-serif';
  ctx.fillText('综合评分', center, center + 20);
}

/* Trend chart using Chart.js */
function drawTrendChart(canvasId, config) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return;

  return new Chart(canvas, {
    type: 'line',
    data: {
      labels: config.labels || [],
      datasets: config.datasets || []
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: config.showLegend || false, position: 'top', labels: { font: { size: 11 } } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: {
          grid: { color: '#F3F4F6' },
          ticks: { font: { size: 11 } },
          min: config.yMin,
          max: config.yMax
        }
      },
      elements: {
        line: { tension: 0.3, borderWidth: 2 },
        point: { radius: 4, hoverRadius: 6 }
      }
    }
  });
}

/* Dropdown select */
function initDropdowns() {
  document.querySelectorAll('.dropdown-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const menu = btn.nextElementSibling;
      document.querySelectorAll('.dropdown-menu.show').forEach(m => {
        if (m !== menu) m.classList.remove('show');
      });
      menu.classList.toggle('show');
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
  });

  document.querySelectorAll('.dropdown-menu .dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      const menu = item.closest('.dropdown-menu');
      const toggle = menu.previousElementSibling;
      toggle.querySelector('.dropdown-text').textContent = item.textContent;
      menu.classList.remove('show');
      if (item.dataset.mode) {
        document.querySelectorAll('.mode-content').forEach(c => c.classList.remove('active'));
        const target = document.getElementById(item.dataset.mode);
        if (target) target.classList.add('active');
      }
    });
  });
}

/* Page init */
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initToggles();
  initCheckboxes();
  initDropdowns();
});
