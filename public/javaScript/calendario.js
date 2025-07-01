document.addEventListener('DOMContentLoaded', function () {
    const monthYear = document.getElementById('month-year');
    const daysContainer = document.getElementById('days');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');

    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    let currentDate = new Date();
    let today = new Date();

    // Função principal para renderizar o calendário
    async function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();

        monthYear.textContent = `${months[month]} ${year}`;
        daysContainer.innerHTML = '';

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
        const lastDayOfLastMonth = new Date(year, month, 0).getDate();

        // Preenche dias do mês anterior
        for (let i = firstDayOfMonth; i > 0; i--) {
            const el = createDayElement(lastDayOfLastMonth - i + 1, true);
            daysContainer.appendChild(el);
        }

        // Preenche dias do mês atual
        for (let i = 1; i <= lastDayOfMonth; i++) {
            const isToday = i === today.getDate() &&
                            month === today.getMonth() &&
                            year === today.getFullYear();
            const el = createDayElement(i, false, isToday);
            daysContainer.appendChild(el);
        }

        // Preenche dias do próximo mês
        const total = firstDayOfMonth + lastDayOfMonth;
        const remainder = total % 7;
        for (let i = 1; i <= (remainder ? 7 - remainder : 0); i++) {
            const el = createDayElement(i, true);
            daysContainer.appendChild(el);
        }

        // Depois de desenhar todas as divs, marca os feriados
        await marcarFeriados(year, month);
    }

    function createDayElement(dayNumber, isFade, isToday = false) {
        const dayElement = document.createElement('div');
        const span = document.createElement('span');
        span.textContent = dayNumber;
        dayElement.appendChild(span);
        if (isFade) dayElement.classList.add('fade');
        if (isToday) span.classList.add('today');
        dayElement.addEventListener('click', () => {
            if (!isFade) console.log(`Clicou em ${dayNumber}/${months[currentDate.getMonth()]}/${currentDate.getFullYear()}`);
        });
        return dayElement;
    }
    
    // Busca feriados do backend e adiciona a classe 'holiday'
    async function marcarFeriados(ano, mes) {
        try {
            const res = await fetch(`/feriados/${ano}`);
            const feriados = await res.json();
    
            document.querySelectorAll('.days div:not(.fade)').forEach(diaEl => {
                const diaNum = parseInt(diaEl.textContent, 10);
                const iso = new Date(ano, mes, diaNum).toISOString().split('T')[0];
    
                if (feriados.some(f => f.date === iso)) {
                    diaEl.querySelector('span').classList.add('holiday');
                }
            });
        } catch (err) {
            console.error('Erro ao carregar feriados:', err);
        }
    }
    

    prevButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    nextButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    // render inicial
    renderCalendar(currentDate);

    // Atualiza “hoje” em tempo real
    setInterval(() => {
        const now = new Date();
        if (now.getDate() !== today.getDate() ||
            now.getMonth() !== today.getMonth() ||
            now.getFullYear() !== today.getFullYear()) {
            today = now;
            renderCalendar(currentDate);
        }
    }, 60000);
});
