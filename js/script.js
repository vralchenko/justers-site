document.addEventListener('DOMContentLoaded', () => {
    console.log('Justers site loaded at: ' + new Date().toLocaleTimeString());

    // Mobile Menu Toggle
    const burger = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
        });

        // Close menu when clicking a link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
            });
        });
    }

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
        const subject = encodeURIComponent(`Нова заявка: ${formType} від ${name}`);
        const body = encodeURIComponent(`Деталі заявки:\n\nІм'я: ${name}\nТелефон: ${phone}\nТип: ${formType}\n\nПовідомлення надіслано з сайту Justers.`);

        // Create and trigger mailto link
        const mailtoLink = `mailto:${emailTo}?subject=${subject}&body=${body}`;
        window.location.href = mailtoLink;

        // UI Feedback
        closeModal(modalToClose);
        showStatusModal(true, 'Успішно!', `Дякуємо, ${name}! Ваша поштова програма відкриється для підтвердження відправки листа.`);
        form.reset();
    }

    if (consultationForm) {
        consultationForm.addEventListener('submit', (e) => {
            handleFormSubmit(e, consultationModal, 'Консультація');
        });
    }


});
