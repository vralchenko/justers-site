document.addEventListener('DOMContentLoaded', () => {
    console.log('Justers site loaded at: ' + new Date().toLocaleTimeString());

    // Mobile Menu Toggle
    const burger = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav');
    const menuOverlay = document.getElementById('menuOverlay');

    function openMobileMenu() {
        if (!nav) return;
        nav.classList.add('active');
        if (menuOverlay) menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        if (!nav) return;
        nav.classList.remove('active');
        if (menuOverlay) menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (burger && nav) {
        burger.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close menu when clicking a nav link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });
    }

    // Close menu on overlay click
    if (menuOverlay) {
        menuOverlay.addEventListener('click', () => {
            closeMobileMenu();
        });
    }

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav && nav.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Close menu on resize above 960px
    window.addEventListener('resize', () => {
        if (window.innerWidth > 960 && nav && nav.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Header Scroll Effect
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Active Navigation Link
    const sections = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        // Update Page Indicators
        const indicators = document.querySelectorAll('.indicator-item');
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
            if (indicator.getAttribute('href') === `#${current}`) {
                indicator.classList.add('active');
            }
        });
    });

    // Scroll Indicator
    const scrollIndicator = document.getElementById('scrollIndicator');

    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const currentSection = getCurrentSection();
            const nextSection = getNextSection(currentSection);

            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });

        // Hide indicator on last page
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset + window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            if (scrollPosition >= documentHeight - 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });
    }

    function getCurrentSection() {
        let current = null;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop - 200) {
                current = section;
            }
        });
        return current;
    }

    function getNextSection(currentSection) {
        if (!currentSection) return sections[0];

        const sectionsArray = Array.from(sections);
        const currentIndex = sectionsArray.indexOf(currentSection);

        if (currentIndex < sectionsArray.length - 1) {
            return sectionsArray[currentIndex + 1];
        }

        return null;
    }

    // Smooth reveal animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe service items and other elements
    document.querySelectorAll('.service-item, .about-stat-item, .contact-block').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Modal Dialogs
    const consultationModal = document.getElementById('consultationModal');

    // Get all buttons that open modals
    const consultationBtns = document.querySelectorAll('.hero-cta .btn, .consult-btn-trigger');

    // Function to open modal
    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Function to close modal
    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Open consultation modal
    consultationBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            closeMobileMenu();
            openModal(consultationModal);
        });
    });



    // Status Modal
    const statusModal = document.getElementById('statusModal');
    const statusIcon = document.getElementById('statusIcon');
    const statusTitle = document.getElementById('statusTitle');
    const statusMessageText = document.getElementById('statusMessageText');
    const statusModalCloseBtn = document.getElementById('statusModalCloseBtn');

    function showStatusModal(isSuccess, title, message) {
        if (!statusModal) return;

        // Reset classes
        statusIcon.className = 'status-icon';
        statusIcon.classList.add(isSuccess ? 'success' : 'error');

        // icon content
        statusIcon.innerHTML = isSuccess ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-circle-exclamation"></i>';

        statusTitle.textContent = title;
        statusMessageText.textContent = message;

        openModal(statusModal);
    }

    // Close status modal button
    if (statusModalCloseBtn) {
        statusModalCloseBtn.addEventListener('click', () => {
            closeModal(statusModal);
        });
    }

    // Close modals when clicking overlay or close button
    // Include statusModal to fix close button not working
    [consultationModal, statusModal].forEach(modal => {
        if (!modal) return;

        const overlay = modal.querySelector('.modal-overlay');
        const closeBtn = modal.querySelector('.modal-close');

        if (overlay) {
            overlay.addEventListener('click', () => closeModal(modal));
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal(modal));
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal(consultationModal);
            closeModal(statusModal);
        }
    });

    // Phone number formatting
    function formatPhoneNumber(input) {
        let value = input.value;
        let digits = value.replace(/\D/g, '');

        // Handle deletion: if the user is clearing the prefix, let the field be empty
        // This solves the "can't delete" issue
        if (value.length < 4 && (digits === '3' || digits === '38' || digits === '')) {
            input.value = '';
            return;
        }

        // Strip the country code '38' if it's at the very beginning to avoid doubling
        if (digits.startsWith('38')) {
            digits = digits.substring(2);
        }

        // Limit to the 10-digit subscriber number (0XX XXX XX XX)
        digits = digits.substring(0, 10);

        if (digits.length === 0) {
            input.value = '+38 ';
            return;
        }

        // Construct the formatted string: +38 0XX XXX XX XX
        let formatted = '+38 ' + digits.substring(0, 3);
        if (digits.length >= 4) {
            formatted += ' ' + digits.substring(3, 6);
        }
        if (digits.length >= 7) {
            formatted += ' ' + digits.substring(6, 8);
        }
        if (digits.length >= 9) {
            formatted += ' ' + digits.substring(8, 10);
        }

        input.value = formatted;
    }

    // Apply phone formatting to all phone inputs
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', () => {
            formatPhoneNumber(input);
            clearError(input);
        });
        // Clear error on generic input
        input.addEventListener('input', () => clearError(input));
    });

    // Clear error function
    function clearError(input) {
        input.classList.remove('error');
        const wrapper = input.parentElement;
        if (wrapper.classList.contains('input-wrapper')) {
            const errorMsg = wrapper.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.classList.remove('active');
            }
        }
    }

    // Show error function
    function showError(input, message) {
        input.classList.add('error');
        const wrapper = input.parentElement;

        let errorMsg;
        if (wrapper.classList.contains('input-wrapper')) {
            errorMsg = wrapper.querySelector('.error-message');
            if (!errorMsg) {
                errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                wrapper.appendChild(errorMsg);
            }
            errorMsg.textContent = message;
            errorMsg.classList.add('active');
        } else {
            // If input is not wrapped, wrap it dynamically (fallback)
            const newWrapper = document.createElement('div');
            newWrapper.className = 'input-wrapper';
            input.parentNode.insertBefore(newWrapper, input);
            newWrapper.appendChild(input);

            errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = message;
            newWrapper.appendChild(errorMsg);

            // Re-focus to keep focus
            input.focus();

            setTimeout(() => errorMsg.classList.add('active'), 10);
        }
    }

    // Handle form submissions
    const consultationForm = document.getElementById('consultationForm');

    // Add novalidate to forms to disable browser validation
    if (consultationForm) consultationForm.setAttribute('novalidate', true);

    // Add input event listeners to clear errors on all inputs
    document.querySelectorAll('.modal-form input').forEach(input => {
        input.addEventListener('input', () => clearError(input));
    });



    function handleFormSubmit(e, modalToClose, formType) {
        e.preventDefault();
        const form = e.target;

        // Custom Validation
        let isValid = true;
        const inputs = form.querySelectorAll('input[required]');

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                showError(input, 'Це поле обов\'язкове для заповнення');
            } else if (input.type === 'tel' && input.value.replace(/\D/g, '').length < 12) { // 38 + 10 digits
                isValid = false;
                showError(input, 'Введіть коректний номер телефону');
            }
        });

        if (!isValid) return;

        const formData = new FormData(form);
        const name = formData.get('name');
        const phone = formData.get('phone');

        // Email details
        const emailTo = 'office@justers.io';

        // Show loading state and replace standard alerts with status modal
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.innerText : 'Надіслати';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerText = 'Відправка...';
        }

        fetch(`https://formsubmit.co/ajax/${emailTo}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: `Нова заявка: Консультація від ${name}`,
                _template: 'table',
                "Ім'я": name,
                "Телефон": phone,
                "Тип запиту": formType,
                "Джерело": "Сайт Justers"
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success === 'true' || data.success === true) {
                    closeModal(modalToClose);
                    showStatusModal(true, 'Успішно!', `Дякуємо, ${name}! Ваша заявка успішно відправлена. Ми зв'яжемося з вами найближчим часом.`);
                    form.reset();
                } else if (data.message && data.message.includes('Activation')) {
                    closeModal(modalToClose);
                    showStatusModal(true, 'Активація форми', `Будь ласка, перевірте пошту ${emailTo} та натисніть 'Activate Form' у щойно надісланому листі від FormSubmit. Це потрібно зробити лише один раз!`);
                    form.reset();
                } else {
                    showStatusModal(false, 'Помилка', 'Виникла помилка при відправці. Спробуйте пізніше.');
                }
            })
            .catch(error => {
                console.error(error);
                showStatusModal(false, 'Помилка сервера', 'Не вдалося відправити заявку. Спробуйте пізніше.');
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                }
            });
    }

    if (consultationForm) {
        consultationForm.addEventListener('submit', (e) => {
            handleFormSubmit(e, consultationModal, 'Консультація');
        });
    }

    // -------------------------
    // Service Detail Navigation
    // -------------------------
    const serviceData = {
        civil: {
            title: 'Цивільні справи',
            categories: [
                {
                    icon: 'fa-solid fa-scroll',
                    title: 'Спадкові спори',
                    items: [
                        'Встановлення факту прийняття спадщини',
                        'Поновлення строку для прийняття спадщини',
                        'Встановлення факту родинних відносин',
                        'Супровід оформлення спадщини',
                        'Оскарження заповітів, зміна черговості успадкування, виділення обов\'язкової частки',
                        'Встановлення юридичних фактів: родинних зв\'язків, перебування на утриманні, факту смерті'
                    ]
                },
                {
                    icon: 'fa-solid fa-house',
                    title: 'Майнові спори',
                    items: [
                        'Визнання права власності на нерухомість',
                        'Витребування майна з незаконного володіння',
                        'Поділ спільного майна',
                        'Спори щодо самочинного будівництва',
                        'Усунення перешкод у користуванні майном',
                        'Визнання правочину недійсним'
                    ]
                },
                {
                    icon: 'fa-solid fa-people-roof',
                    title: 'Сімейні правовідносини',
                    items: [
                        'Розірвання шлюбу закордоном',
                        'Стягнення аліментів',
                        'Визначення місця проживання дитини',
                        'Визначення порядку участі у вихованні дитини та встановлення графіку побачень',
                        'Позбавлення або поновлення батьківських прав'
                    ]
                },
                {
                    icon: 'fa-solid fa-file-invoice-dollar',
                    title: 'Зобов\'язальне право та стягнення боргів',
                    items: [
                        'Визнання кредитних договорів недійсними, скасування незаконних нарахувань',
                        'Стягнення заборгованості за розписками та договорами позики',
                        'Розробка індивідуальних договорів (купівлі-продажу, оренди, дарування, довічного утримання)'
                    ]
                },
                {
                    icon: 'fa-solid fa-scale-balanced',
                    title: 'Відшкодування шкоди',
                    items: [
                        'Стягнення моральної та матеріальної шкоди (ДТП, залиття квартири, неправомірні дії третіх осіб)',
                        'Захист честі, гідності та ділової репутації',
                        'Видалення недостовірної інформації з мережі, спростування'
                    ]
                },
                {
                    icon: 'fa-solid fa-building',
                    title: 'Житлове право',
                    items: [
                        'Супровід у програмі єВідновлення: від подання заявки до оскарження відмов',
                        'Захист житлових прав неповнолітніх',
                        'Права внутрішньо переміщених осіб (ВПО)',
                        'Вселення та виселення',
                        'Визнання особи такою, що втратила право користування житлом',
                        'Встановлення порядку користування житлом',
                        'Поділ житлового будинку в натурі та виділення частки'
                    ]
                }
            ]
        },
        criminal: {
            title: 'Кримінальні справи',
            categories: [
                {
                    icon: 'fa-solid fa-gavel',
                    title: 'Захист на досудовому розслідуванні',
                    items: [
                        'Участь адвоката під час допитів, обшуків, слідчих експериментів',
                        'Оскарження повідомлення про підозру',
                        'Оскарження запобіжних заходів (тримання під вартою, домашній арешт)',
                        'Збирання доказів на користь клієнта'
                    ]
                },
                {
                    icon: 'fa-solid fa-landmark',
                    title: 'Захист у суді',
                    items: [
                        'Представництво інтересів обвинуваченого в суді першої інстанції',
                        'Апеляційне та касаційне оскарження вироків',
                        'Угоди про визнання винуватості та примирення'
                    ]
                },
                {
                    icon: 'fa-solid fa-user-shield',
                    title: 'Захист прав потерпілих',
                    items: [
                        'Представництво інтересів потерпілого у кримінальному провадженні',
                        'Стягнення шкоди, завданої кримінальним правопорушенням',
                        'Цивільний позов у кримінальному провадженні'
                    ]
                }
            ]
        },
        commercial: {
            title: 'Господарські справи',
            categories: [
                {
                    icon: 'fa-solid fa-handshake',
                    title: 'Досудове врегулювання',
                    items: [
                        'Претензійна робота та переговори',
                        'Медіація у господарських спорах',
                        'Підготовка мирових угод'
                    ]
                },
                {
                    icon: 'fa-solid fa-briefcase',
                    title: 'Представництво у суді',
                    items: [
                        'Захист інтересів у господарських судах усіх інстанцій',
                        'Стягнення дебіторської заборгованості',
                        'Спори між учасниками юридичних осіб (корпоративні спори)'
                    ]
                },
                {
                    icon: 'fa-solid fa-file-contract',
                    title: 'Взаємодія з податковою',
                    items: [
                        'Оскарження податкових повідомлень-рішень',
                        'Супровід податкових перевірок',
                        'Захист від необґрунтованих донарахувань'
                    ]
                }
            ]
        },
        mobilization: {
            title: 'Мобілізація',
            categories: [
                {
                    icon: 'fa-solid fa-file-signature',
                    title: 'Взаємодія з ТЦК та СП',
                    items: [
                        'Супровід при проходженні ВЛК',
                        'Оскарження рішень ВЛК та ЦВЛК',
                        'Оскарження рішень ТЦК у судовому порядку'
                    ]
                },
                {
                    icon: 'fa-solid fa-shield',
                    title: 'Захист прав при мобілізації',
                    items: [
                        'Консультації щодо підстав для відстрочки',
                        'Оскарження незаконних дій посадових осіб ТЦК',
                        'Захист прав під час вручення повісток'
                    ]
                },
                {
                    icon: 'fa-solid fa-industry',
                    title: 'Бронювання персоналу',
                    items: [
                        'Супровід процедури бронювання працівників',
                        'Підготовка документів для критично важливих підприємств',
                        'Оскарження відмов у бронюванні'
                    ]
                }
            ]
        },
        appeal: {
            title: 'Оскарження рішень',
            categories: [
                {
                    icon: 'fa-solid fa-building-columns',
                    title: 'Адміністративне оскарження',
                    items: [
                        'Оскарження рішень, дій та бездіяльності органів державної влади',
                        'Оскарження рішень органів місцевого самоврядування',
                        'Спори з органами Міністерства внутрішніх справ'
                    ]
                },
                {
                    icon: 'fa-solid fa-scale-balanced',
                    title: 'Судове оскарження',
                    items: [
                        'Апеляційне оскарження судових рішень',
                        'Касаційне оскарження',
                        'Перегляд рішень за нововиявленими обставинами'
                    ]
                },
                {
                    icon: 'fa-solid fa-users',
                    title: 'Захист прав громадян',
                    items: [
                        'Спори з контролюючими органами',
                        'Оскарження штрафних санкцій',
                        'Захист від незаконних перевірок'
                    ]
                }
            ]
        },
        military: {
            title: 'Допомога військовослужбовцям та їх сім\'ям',
            categories: [
                {
                    icon: 'fa-solid fa-person-military-rifle',
                    title: 'Звільнення з військової служби',
                    items: [
                        'Підготовка рапортів та документів',
                        'Оскарження відмов у звільненні',
                        'Звільнення за станом здоров\'я'
                    ]
                },
                {
                    icon: 'fa-solid fa-hand-holding-dollar',
                    title: 'Компенсації та виплати',
                    items: [
                        'Допомога з отримання компенсацій',
                        'Виплати одноразової грошової допомоги (ОГД)',
                        'Виплати за травму, каліцтво, втрату працездатності'
                    ]
                },
                {
                    icon: 'fa-solid fa-heart',
                    title: 'Підтримка сімей',
                    items: [
                        'Захист прав членів сімей військовослужбовців',
                        'Допомога у отриманні статусу члена сім\'ї загиблого',
                        'Соціальні гарантії та пільги для сімей'
                    ]
                }
            ]
        }
    };

    const servicesGrid = document.getElementById('servicesGrid');
    const serviceDetail = document.getElementById('serviceDetail');
    const serviceDetailBack = document.getElementById('serviceDetailBack');
    const serviceDetailTitle = document.getElementById('serviceDetailTitle');
    const serviceDetailGrid = document.getElementById('serviceDetailGrid');
    const servicesIntro = document.querySelector('.services-intro');
    const servicesSectionTitle = document.querySelector('.services-page .section-title');

    function openServiceDetail(serviceId) {
        const data = serviceData[serviceId];
        if (!data) return;

        serviceDetailTitle.textContent = data.title;
        serviceDetailGrid.innerHTML = data.categories.map(cat => `
            <div class="service-detail-card">
                <div class="service-detail-card-icon"><i class="${cat.icon}"></i></div>
                <h3>${cat.title}</h3>
                <ul>${cat.items.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>
        `).join('');

        servicesGrid.style.display = 'none';
        servicesIntro.style.display = 'none';
        servicesSectionTitle.style.display = 'none';
        serviceDetail.style.display = 'block';
    }

    function closeServiceDetail() {
        serviceDetail.style.display = 'none';
        servicesGrid.style.display = '';
        servicesIntro.style.display = '';
        servicesSectionTitle.style.display = '';
    }

    if (servicesGrid) {
        servicesGrid.querySelectorAll('.service-item[data-service]').forEach(item => {
            item.addEventListener('click', () => {
                openServiceDetail(item.dataset.service);
                // Scroll to top of services section
                document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    if (serviceDetailBack) {
        serviceDetailBack.addEventListener('click', () => {
            closeServiceDetail();
        });
    }

    // -------------------------
    // Comments API Integration (Vercel Postgres)
    // -------------------------
    const commentForm = document.getElementById('commentForm');
    const commentsList = document.getElementById('commentsList');

    if (commentForm && commentsList) {
        // Extract article identifier from the hidden input
        const articleInput = commentForm.querySelector('input[name="article"]');
        const currentArticle = articleInput ? articleInput.value : null;

        if (currentArticle) {
            // Function to fetch and display comments
            const fetchComments = async () => {
                try {
                    const response = await fetch(`/api/comments?article=${currentArticle}`);
                    if (!response.ok) throw new Error('Помилка сервера. Дані можуть бути недоступні локально без Vercel CLI.');

                    const comments = await response.json();

                    if (comments.length === 0) {
                        commentsList.innerHTML = '<p style="color:var(--text-muted);font-size:14px;padding:10px 0;">Ще немає коментарів. Залишіть свій відгук першим!</p>';
                        return;
                    }

                    commentsList.innerHTML = comments.map(c => {
                        const dateText = new Date(c.created_at).toLocaleDateString('uk-UA', {
                            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        });
                        return `
                            <div class="comment-item">
                                <div class="comment-author">${c.author} <span class="comment-date">${dateText}</span></div>
                                <div class="comment-text">${c.comment_text}</div>
                            </div>
                        `;
                    }).join('');
                } catch (err) {
                    console.error("Помилка завантаження коментарів:", err);
                    commentsList.innerHTML = '<p style="color:var(--text-muted);font-size:14px;padding:10px 0;">Ще немає коментарів. Залишіть свій відгук першим!</p>';
                }
            };

            // Initial fetch
            fetchComments();

            // Function to post a new comment
            commentForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const submitBtn = commentForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerText;

                submitBtn.disabled = true;
                submitBtn.innerText = 'Відправка...';

                const authorInput = commentForm.querySelector('input[name="author"]');
                const textInput = commentForm.querySelector('textarea[name="text"]');

                try {
                    const response = await fetch('/api/comments', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            article: currentArticle,
                            author: authorInput.value,
                            text: textInput.value
                        })
                    });

                    if (response.ok) {
                        commentForm.reset();
                        await fetchComments(); // Refresh list to show new comment
                        showStatusModal(true, 'Успішно', 'Ваш коментар було успішно додано.');
                    } else {
                        showStatusModal(false, 'Помилка', 'Виникла помилка при збереженні коментаря.');
                    }
                } catch (err) {
                    console.error("Помилка відправки:", err);
                    showStatusModal(false, 'Помилка сервера', 'Сталася серверна помилка. Будь ласка, спробуйте пізніше.');
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                }
            });
        }
    }

});
