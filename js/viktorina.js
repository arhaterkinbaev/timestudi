function checkQuiz() {
    const correctAnswers = {
        q1: "220",
        q2: "трансформатор",
        q3: "Ом",
        q4: "анод",
        q5: "диод",
        q6: "ватт",
        q7: "резистор",
        q8: "кремний",
        q9: "мАч",
        q10: "Литий-ион"
    };
    
    let score = 0;
    let total = Object.keys(correctAnswers).length;
    
    for (let key in correctAnswers) {
        let selected = document.querySelector(`input[name="${key}"]:checked`);
        let allOptions = document.querySelectorAll(`input[name="${key}"]`);
        
        allOptions.forEach(option => {
            option.parentElement.style.backgroundColor = ""; // Сброс цвета перед проверкой
        });
        
        allOptions.forEach(option => {
            if (option.value === correctAnswers[key]) {
                option.parentElement.style.backgroundColor = "#27ae60"; // Зеленый фон для правильного ответа
            }
        });
        
        if (selected && selected.value !== correctAnswers[key]) {
            selected.parentElement.style.backgroundColor = "#c0392b"; // Красный фон для неправильного ответа
        }
        
        if (selected && selected.value === correctAnswers[key]) {
            score++;
        }
    }
    
    document.getElementById("quiz-result").textContent = `Ваш результат: ${score} из ${total}`;
}