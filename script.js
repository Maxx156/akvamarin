
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const closeBtns = document.querySelectorAll('.close');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginSubmit = document.getElementById('loginSubmit');
    const registerSubmit = document.getElementById('registerSubmit');
    const loginError = document.getElementById('loginError');
    const registerError = document.getElementById('registerError');
    const logoutBtn = document.getElementById('logoutBtn');
    const userGreeting = document.getElementById('userGreeting');
    const userNameSpan = document.getElementById('userName');
    const toast = document.getElementById('customToast');

    const buyModal = document.getElementById('buyModal');
    const buyModalTitle = document.getElementById('buyModalTitle');
    const buyEventInfo = document.getElementById('buyEventInfo');
    const ticketQuantity = document.getElementById('ticketQuantity');
    const totalPriceSpan = document.getElementById('totalPrice');
    const confirmBuy = document.getElementById('confirmBuy');
    const buyError = document.getElementById('buyError');

    let currentEventForBuy = null;

    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
    if (!localStorage.getItem('tickets')) {
        localStorage.setItem('tickets', JSON.stringify([]));
    }

    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    updateAuthUI();

    function showToast(message, isSuccess = true) {
        toast.textContent = message;
        toast.style.background = isSuccess ? 'linear-gradient(145deg, #1b7e9f, #0a2f44)' : '#ff6f61';
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'none';
            if (buyModal) buyModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
        if (e.target === buyModal) {
            buyModal.style.display = 'none';
        }
    });

    if (loginTab && registerTab) {
        loginTab.addEventListener('click', () => {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        });
        registerTab.addEventListener('click', () => {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        });
    }

    if (registerSubmit) {
        registerSubmit.addEventListener('click', () => {
            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value.trim();

            if (!name || !email || !password) {
                registerError.textContent = 'Все поля обязательны';
                return;
            }

            let users = JSON.parse(localStorage.getItem('users'));
            if (users.find(u => u.email === email)) {
                registerError.textContent = 'Пользователь с таким email уже существует';
                return;
            }

            const newUser = { name, email, password };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            currentUser = newUser;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateAuthUI();
            modal.style.display = 'none';
            clearAuthForms();
            showToast('Регистрация прошла успешно!');
        });
    }

    if (loginSubmit) {
        loginSubmit.addEventListener('click', () => {
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            if (!email || !password) {
                loginError.textContent = 'Введите email и пароль';
                return;
            }

            let users = JSON.parse(localStorage.getItem('users'));
            const user = users.find(u => u.email === email && u.password === password);
            if (!user) {
                loginError.textContent = 'Неверный email или пароль';
                return;
            }

            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateAuthUI();
            modal.style.display = 'none';
            clearAuthForms();
            showToast(`С возвращением, ${user.name}!`);
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            currentUser = null;
            localStorage.removeItem('currentUser');
            updateAuthUI();
            showToast('Вы вышли из аккаунта');
        });
    }

    function updateAuthUI() {
        if (currentUser) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (userGreeting) {
                userGreeting.style.display = 'flex';
                userNameSpan.textContent = currentUser.name;
            }
        } else {
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (userGreeting) userGreeting.style.display = 'none';
        }
    }

    function clearAuthForms() {
        const regName = document.getElementById('regName');
        const regEmail = document.getElementById('regEmail');
        const regPassword = document.getElementById('regPassword');
        const loginEmail = document.getElementById('loginEmail');
        const loginPassword = document.getElementById('loginPassword');
        if (regName) regName.value = '';
        if (regEmail) regEmail.value = '';
        if (regPassword) regPassword.value = '';
        if (loginEmail) loginEmail.value = '';
        if (loginPassword) loginPassword.value = '';
        if (loginError) loginError.textContent = '';
        if (registerError) registerError.textContent = '';
    }

    const buyButtons = document.querySelectorAll('.btn-buy');
    buyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const eventCard = e.target.closest('.event-card');
            if (!eventCard) return;

            const eventId = eventCard.dataset.eventId;
            const eventTitle = eventCard.dataset.eventTitle;
            const eventDate = eventCard.dataset.eventDate;
            const eventPrice = parseInt(eventCard.dataset.eventPrice);

            if (!currentUser) {
                modal.style.display = 'block';
                showToast('Для покупки необходимо войти в систему.', false);
                return;
            }

            currentEventForBuy = {
                id: eventId,
                title: eventTitle,
                date: eventDate,
                price: eventPrice
            };
            buyModalTitle.textContent = `Покупка билета: ${eventTitle}`;
            buyEventInfo.textContent = `Дата: ${eventDate} | Цена за билет: ${eventPrice} ₽`;
            ticketQuantity.value = 1;
            totalPriceSpan.textContent = eventPrice;
            buyError.textContent = '';
            buyModal.style.display = 'block';
        });
    });

    if (ticketQuantity) {
        ticketQuantity.addEventListener('input', () => {
            if (currentEventForBuy) {
                const qty = parseInt(ticketQuantity.value) || 1;
                totalPriceSpan.textContent = qty * currentEventForBuy.price;
            }
        });
    }

    if (confirmBuy) {
        confirmBuy.addEventListener('click', () => {
            if (!currentUser || !currentEventForBuy) {
                buyModal.style.display = 'none';
                return;
            }

            const qty = parseInt(ticketQuantity.value) || 1;
            if (qty < 1 || qty > 10) {
                buyError.textContent = 'Количество от 1 до 10';
                return;
            }

            let tickets = JSON.parse(localStorage.getItem('tickets')) || [];
            for (let i = 0; i < qty; i++) {
                const ticket = {
                    id: 'TICKET-' + Date.now() + '-' + i + '-' + Math.random().toString(36).substr(2, 5),
                    eventId: currentEventForBuy.id,
                    eventTitle: currentEventForBuy.title,
                    eventDate: currentEventForBuy.date,
                    price: currentEventForBuy.price,
                    userName: currentUser.name,
                    userEmail: currentUser.email,
                    purchaseDate: new Date().toISOString(),
                    seat: `Ряд ${Math.floor(Math.random() * 10) + 1}, Место ${Math.floor(Math.random() * 20) + 1}` // случайное место
                };
                tickets.push(ticket);
            }
            localStorage.setItem('tickets', JSON.stringify(tickets));

            buyModal.style.display = 'none';
            showToast(`Билет${qty > 1 ? 'ы' : ''} успешно куплен${qty > 1 ? 'ы' : ''}!`);

            if (window.location.pathname.includes('profile.html')) {
                loadUserTickets();
            }
        });
    }

    if (window.location.pathname.includes('profile.html')) {
        if (!currentUser) {
            window.location.href = 'index.html';
            showToast('Войдите в аккаунт', false);
        } else {
            loadUserTickets();
        }
    }

    function loadUserTickets() {
        const ticketsList = document.getElementById('ticketsList');
        const noTicketsMsg = document.getElementById('noTicketsMessage');
        if (!ticketsList) return;

        let allTickets = JSON.parse(localStorage.getItem('tickets')) || [];
        const userTickets = allTickets.filter(t => t.userEmail === currentUser.email);

        if (userTickets.length === 0) {
            ticketsList.innerHTML = '';
            noTicketsMsg.style.display = 'block';
        } else {
            noTicketsMsg.style.display = 'none';
            ticketsList.innerHTML = userTickets.map(ticket => `
                <div class="ticket-card">
                    <div class="ticket-header">
                        <span class="ticket-title">${ticket.eventTitle}</span>
                        <span class="ticket-id">${ticket.id}</span>
                    </div>
                    <div class="ticket-detail">
                        <i class="fas fa-calendar-alt"></i> ${ticket.eventDate}
                    </div>
                    <div class="ticket-detail">
                        <i class="fas fa-map-marker-alt"></i> ${ticket.seat}
                    </div>
                    <div class="ticket-detail">
                        <i class="fas fa-tag"></i> ${ticket.price} ₽
                    </div>
                    <div class="ticket-detail">
                        <i class="fas fa-clock"></i> Куплен: ${new Date(ticket.purchaseDate).toLocaleString()}
                    </div>
                    <div class="ticket-qr">
                        <i class="fas fa-qrcode"></i> <span style="font-size: 0.8rem;">QR-код билета</span>
                    </div>
                </div>
            `).join('');
        }
    }
});


function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

if (registerSubmit) {
    registerSubmit.addEventListener('click', () => {
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value.trim();

        registerError.textContent = '';

        if (!name || !email || !password) {
            registerError.textContent = 'Все поля обязательны';
            return;
        }
        if (!isValidEmail(email)) {
            registerError.textContent = 'Введите корректный email';
            return;
        }
        if (password.length < 6) {
            registerError.textContent = 'Пароль должен быть не менее 6 символов';
            return;
        }

        let users = JSON.parse(localStorage.getItem('users'));
        if (users.find(u => u.email === email)) {
            registerError.textContent = 'Пользователь с таким email уже существует';
            return;
        }

        const newUser = { name, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateAuthUI();
        modal.style.display = 'none';
        clearAuthForms();
        showToast('Регистрация прошла успешно!');
    });
}

if (loginSubmit) {
    loginSubmit.addEventListener('click', () => {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        loginError.textContent = '';

        if (!email || !password) {
            loginError.textContent = 'Введите email и пароль';
            return;
        }
        if (!isValidEmail(email)) {
            loginError.textContent = 'Введите корректный email';
            return;
        }

        let users = JSON.parse(localStorage.getItem('users'));
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
            loginError.textContent = 'Неверный email или пароль';
            return;
        }

        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateAuthUI();
        modal.style.display = 'none';
        clearAuthForms();
        showToast(`С возвращением, ${user.name}!`);
    });
}

const feedbackForm = document.getElementById('feedbackForm');
if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('feedbackName').value.trim();
        const email = document.getElementById('feedbackEmail').value.trim();
        const message = document.getElementById('feedbackMessage').value.trim();
        const errorEl = document.getElementById('feedbackError');

        if (!name || !email || !message) {
            errorEl.textContent = 'Все поля обязательны';
            return;
        }
        if (!isValidEmail(email)) {
            errorEl.textContent = 'Введите корректный email';
            return;
        }

        errorEl.textContent = '';
        showToast('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
        feedbackForm.reset();
    });
}