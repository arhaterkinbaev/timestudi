document.addEventListener('DOMContentLoaded', () => {
  const teacherName = localStorage.getItem('username');
  const key = `schedule_slots_${teacherName}`;
  const slots = JSON.parse(localStorage.getItem(key)) || [];
  const container = document.getElementById('teacher-bookings-list');

  const booked = slots.filter(s => s.status === 'booked');

  if (booked.length === 0) {
    container.innerHTML = '<p>Пока ни один ученик не записался.</p>';
    return;
  }

  booked.forEach(slot => {
    const div = document.createElement('div');
    div.className = 'booking-card';
    div.innerHTML = `
      <div><strong>Предмет:</strong> ${slot.subject}</div>
      <div><strong>Ученик:</strong> ${slot.student}</div>
      <div><strong>Дата:</strong> ${slot.date}</div>
      <div><strong>Время:</strong> ${slot.time}</div>
    `;
    container.appendChild(div);
  });
});
