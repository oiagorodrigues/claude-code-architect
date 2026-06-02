document.addEventListener('DOMContentLoaded', function() {
  const progressFill = document.getElementById('progress-fill');
  const progressLabel = document.getElementById('progress-label');

  function updateProgress() {
    const checks = document.querySelectorAll('.check-col');
    const doneCount = document.querySelectorAll('.check-col.done').length;
    const total = checks.length;
    const pct = total ? Math.round((doneCount / total) * 100) : 0;
    progressFill.style.width = pct + '%';
    progressLabel.textContent = `${doneCount} de ${total} tópicos`;
    checks.forEach((check) => {
      check.setAttribute('aria-pressed', check.classList.contains('done'));
    });

    try {
      localStorage.setItem(
        'cca-progress-v2',
        JSON.stringify(Array.from(checks).map((check) => check.classList.contains('done')))
      );
    } catch (error) {
      // Ignore storage errors in private mode or if blocked by the browser.
    }
  }

  function loadProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem('cca-progress-v2'));
      if (Array.isArray(saved)) {
        const checks = document.querySelectorAll('.check-col');
        saved.forEach((isDone, index) => {
          const check = checks[index];
          if (check && isDone) {
            check.classList.add('done');
          }
        });
      }
    } catch (error) {
      // Ignore invalid stored state.
    }

    updateProgress();
  }

  document.querySelectorAll('.week-header[data-toggle]').forEach((button) => {
    const targetId = button.dataset.toggle;
    const targetSection = document.getElementById(targetId);
    if (!targetSection) return;
    button.setAttribute('aria-controls', targetId);
    const isOpen = targetSection.classList.contains('open');
    button.setAttribute('aria-expanded', isOpen);
    button.addEventListener('click', () => {
      targetSection.classList.toggle('open');
      const isOpenNow = targetSection.classList.contains('open');
      button.setAttribute('aria-expanded', isOpenNow);
    });
  });

  document.querySelectorAll('.check-col').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      button.classList.toggle('done');
      updateProgress();
    });

    button.addEventListener('keydown', (event) => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        button.click();
      }
    });
  });

  loadProgress();
});