document.addEventListener('DOMContentLoaded', () => {
  const teacherName = localStorage.getItem('username') || 'Преподаватель';
  const storageKey = `schedule_slots_${teacherName}`;
  const slotList = document.getElementById('slot-list');
  const subjectGrid = document.getElementById('subject-selection');
  let selectedSubject = null;

  let slots = JSON.parse(localStorage.getItem(storageKey)) || [];

  // Отобразить список слотов
  function renderSlots() {
    slotList.innerHTML = '';

    if (slots.length === 0) {
      slotList.innerHTML = '<p>Пока нет добавленных слотов.</p>';
      return;
    }

    slots.forEach((slot, index) => {
      const div = document.createElement('div');
      div.className = 'slot';
      div.innerHTML = `
        <span><strong>${slot.subject}</strong> — ${slot.date} в ${slot.time} (${teacherName})</span>
        <button class="delete-btn" onclick="deleteSlot(${index})">Удалить</button>
      `;
      slotList.appendChild(div);
    });
  }

  // Добавить новый слот
  window.addSlot = function () {
    const date = document.getElementById('slot-date').value;
    const time = document.getElementById('slot-time').value;

    if (!selectedSubject) {
      alert('Пожалуйста, выберите предмет!');
      return;
    }
    if (!date || !time) {
      alert('Выберите дату и время!');
      return;
    }

    const newSlot = {
      subject: selectedSubject,
      date,
      time,
      teacher: teacherName,
      status: 'free'
    };

    slots.push(newSlot);
    localStorage.setItem(storageKey, JSON.stringify(slots));
    renderSlots();

    // Очистка формы
    document.getElementById('slot-date').value = '';
    document.getElementById('slot-time').value = '';
  };

  // Удаление слота
  window.deleteSlot = function (index) {
    slots.splice(index, 1);
    localStorage.setItem(storageKey, JSON.stringify(slots));
    renderSlots();
  };

  // Выбор предмета
  subjectGrid.addEventListener('click', (e) => {
    const item = e.target.closest('.logo-item');
    if (!item) return;

    const allItems = document.querySelectorAll('.logo-item');
    allItems.forEach(el => el.classList.remove('active'));

    item.classList.add('active');
    selectedSubject = item.dataset.title;
  });

  // Начальный рендер
  renderSlots();
});
