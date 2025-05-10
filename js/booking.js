document.addEventListener('DOMContentLoaded', () => {
  const currentUser = localStorage.getItem('username');
  const teacherSelect = document.getElementById('teacher');
  const slotList = document.getElementById('available-slots');
  const bookingContainer = document.getElementById('student-bookings');

  function loadSlots() {
    const teacher = teacherSelect.value;
    slotList.innerHTML = '';

    if (!teacher) return;

    const key = `schedule_slots_${teacher}`;
    const slots = JSON.parse(localStorage.getItem(key)) || [];

    const freeSlots = slots.filter(s => s.status === 'free');

    if (freeSlots.length === 0) {
      slotList.innerHTML = '<p>Нет свободных слотов у выбранного преподавателя.</p>';
      return;
    }

    freeSlots.forEach((slot, index) => {
      const card = document.createElement('div');
      card.className = 'slot-card';
      card.innerHTML = `
        <div class="slot-info">
          📘 <strong>${slot.subject}</strong><br>
          🗓 ${slot.date} &nbsp;&nbsp; 🕒 ${slot.time}
        </div>
        <button onclick="bookSlot('${teacher}', ${index})">Записаться</button>
      `;
      slotList.appendChild(card);
    });
  }

  function bookSlot(teacher, index) {
    const key = `schedule_slots_${teacher}`;
    const slots = JSON.parse(localStorage.getItem(key)) || [];

    if (slots[index].status === 'free') {
      slots[index].status = 'booked';
      slots[index].student = currentUser;
      localStorage.setItem(key, JSON.stringify(slots));
      alert('Вы успешно записались!');
      loadSlots();
      loadMyBookings();
    }
  }

  function cancelBooking(teacher, date, time) {
    const key = `schedule_slots_${teacher}`;
    let slots = JSON.parse(localStorage.getItem(key)) || [];

    slots = slots.map(slot => {
      if (
        slot.date === date &&
        slot.time === time &&
        slot.student === currentUser
      ) {
        return { ...slot, status: 'free', student: '' };
      }
      return slot;
    });

    localStorage.setItem(key, JSON.stringify(slots));
    loadSlots();
    loadMyBookings();
  }

  function loadMyBookings() {
    bookingContainer.innerHTML = '';
    const allKeys = Object.keys(localStorage).filter(key => key.startsWith('schedule_slots_'));
    let mySlots = [];

    allKeys.forEach(key => {
      const teacher = key.replace('schedule_slots_', '');
      const slots = JSON.parse(localStorage.getItem(key)) || [];

      slots.forEach(slot => {
        if (slot.student === currentUser) {
          mySlots.push({ ...slot, teacher });
        }
      });
    });

    if (mySlots.length === 0) {
      bookingContainer.innerHTML = '<p>Вы пока не записались на занятия.</p>';
      return;
    }

    mySlots.forEach(slot => {
      const div = document.createElement('div');
      div.className = 'booking-card';
      div.innerHTML = `
        <div class="teacher">👨‍🏫 ${slot.teacher}</div>
        <div class="subject">📘 ${slot.subject}</div>
        <div class="datetime">🗓 ${slot.date} &nbsp;&nbsp; 🕒 ${slot.time}</div>
        <button class="cancel-btn" onclick="cancelBooking('${slot.teacher}', '${slot.date}', '${slot.time}')">Отменить</button>
      `;
      bookingContainer.appendChild(div);
    });
  }

  window.bookSlot = bookSlot;
  window.cancelBooking = cancelBooking;

  loadMyBookings();
});
