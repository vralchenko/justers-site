/**
 * JUSTERS Messenger FAB — меню месенджерів
 */
(function () {
    'use strict';

    const MESSENGERS = [
        {
            name: 'Telegram',
            url: 'https://t.me/Justers_lawfirm',
            color: '#26A5E4',
            icon: 'fa-telegram',
            iconPrefix: 'fa-brands',
            label: 'Напишіть нам у Telegram'
        },
        {
            name: 'WhatsApp',
            url: 'https://wa.me/380673801777',
            color: '#25D366',
            icon: 'fa-whatsapp',
            iconPrefix: 'fa-brands',
            label: 'Напишіть нам у WhatsApp'
        },
        {
            name: 'Email',
            url: 'mailto:office@justers.com.ua',
            color: '#ffffff',
            icon: 'fa-envelope',
            iconPrefix: 'fa-solid',
            label: 'Напишіть нам на Email'
        }
    ];

    let isOpen = false;

    function init() {
        const overlay = document.createElement('div');
        overlay.className = 'messenger-overlay';
        overlay.addEventListener('click', toggle);

        const menu = document.createElement('div');
        menu.className = 'messenger-menu';

        MESSENGERS.forEach(function (m, i) {
            const a = document.createElement('a');
            a.href = m.url;
            a.className = 'messenger-item';
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.style.transitionDelay = '0s';
            a.setAttribute('data-index', i);

            const iconWrap = document.createElement('span');
            iconWrap.className = 'messenger-item-icon';
            iconWrap.style.color = m.color;

            const icon = document.createElement('i');
            icon.className = m.iconPrefix + ' ' + m.icon;
            iconWrap.appendChild(icon);

            const label = document.createElement('span');
            label.className = 'messenger-item-label';
            label.textContent = m.label;

            a.appendChild(iconWrap);
            a.appendChild(label);
            menu.appendChild(a);
        });

        const fab = document.createElement('div');
        fab.id = 'messenger-fab';
        fab.setAttribute('aria-label', 'Зв\'язатися з нами');
        fab.innerHTML = '<i class="fa-solid fa-comment-dots"></i>';
        fab.addEventListener('click', toggle);

        document.body.appendChild(overlay);
        document.body.appendChild(menu);
        document.body.appendChild(fab);

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isOpen) {
                toggle();
            }
        });
    }

    function toggle() {
        isOpen = !isOpen;

        var overlay = document.querySelector('.messenger-overlay');
        var menu = document.querySelector('.messenger-menu');
        var fab = document.getElementById('messenger-fab');
        var items = menu.querySelectorAll('.messenger-item');

        if (isOpen) {
            overlay.classList.add('active');
            menu.classList.add('active');
            fab.classList.add('active');
            fab.innerHTML = '<i class="fa-solid fa-xmark"></i>';

            items.forEach(function (item, i) {
                item.style.transitionDelay = (0.08 * i) + 's';
            });
        } else {
            overlay.classList.remove('active');
            menu.classList.remove('active');
            fab.classList.remove('active');
            fab.innerHTML = '<i class="fa-solid fa-comment-dots"></i>';

            items.forEach(function (item) {
                item.style.transitionDelay = '0s';
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
