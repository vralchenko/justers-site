document.addEventListener('DOMContentLoaded', () => {
    console.log('Justers site loaded');

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
    const callbackModal = document.getElementById('callbackModal');

    // Get all buttons that open modals
    const consultationBtn = document.querySelector('.hero-cta .btn-primary');
    const callbackBtn = document.querySelector('.call-btn-mockup');

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
    if (consultationBtn) {
        consultationBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(consultationModal);
        });
    }

    // Open callback modal
    if (callbackBtn) {
        callbackBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(callbackModal);
        });
    }

    // Close modals when clicking overlay or close button
    [consultationModal, callbackModal].forEach(modal => {
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
            closeModal(callbackModal);
        }
    });

    // Phone number formatting
    function formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');

        // Remove leading 38 if present
        if (value.startsWith('38')) {
            value = value.substring(2);
        }

        // Limit to 10 digits
        value = value.substring(0, 10);

        // Format as + 38 (XX) XX XX XXX
        let formatted = '+ 38';
        if (value.length > 0) {
            formatted += ' (' + value.substring(0, 2);
        }
        if (value.length >= 3) {
            formatted += ') ' + value.substring(2, 4);
        }
        if (value.length >= 5) {
            formatted += ' ' + value.substring(4, 6);
        }
        if (value.length >= 7) {
            formatted += ' ' + value.substring(6, 10);
        }

        input.value = formatted;
    }

    // Apply phone formatting to all phone inputs
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', () => formatPhoneNumber(input));
        input.addEventListener('focus', function () {
            if (this.value === '') {
                this.value = '+ 38 (';
            }
        });
    });

    // Handle form submissions
    const consultationForm = document.getElementById('consultationForm');
    const callbackForm = document.getElementById('callbackForm');

    // IMPORTANT: Replace 'YOUR_FORMSPREE_ID' with your actual Formspree form ID
    // Register at https://formspree.io/ to get one.
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mzdaddny';

    function handleFormSubmit(e, modalToClose, formType) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;

        // Show loading state
        submitBtn.textContent = 'Надсилаю...';
        submitBtn.disabled = true;

        const formData = new FormData(form);

        // Add form type to data so you know which form was filled
        formData.append('_subject', `Нова заявка: ${formType} (${formData.get('name')})`);

        fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    const name = formData.get('name');
                    alert(`Дякуємо, ${name}! Ваша заявка успішно надіслана. Ми зв'яжемося з вами найближчим часом.`);
                    closeModal(modalToClose);
                    form.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            alert(data["errors"].map(error => error["message"]).join(", "));
                        } else {
                            alert('Сталася помилка при відправці форми. Спробуйте пізніше або зателефонуйте нам.');
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Сталася помилка. Перевірте підключення до інтернету та спробуйте ще раз.');
            })
            .finally(() => {
                // Restore button state
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
    }

    if (consultationForm) {
        consultationForm.addEventListener('submit', (e) => {
            handleFormSubmit(e, consultationModal, 'Консультація');
        });
    }

    if (callbackForm) {
        callbackForm.addEventListener('submit', (e) => {
            handleFormSubmit(e, callbackModal, 'Зворотній дзвінок');
        });
    }
});
