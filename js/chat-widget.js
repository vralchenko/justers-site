/**
 * JUSTERS Chat Widget — RAG-помічник
 * Client-side пошук по базі знань сайту
 */

(function () {
    'use strict';

    // ===== БАЗА ЗНАНЬ =====
    const JUSTERS_KB = [
        {
            id: 'about',
            category: 'Про нас',
            keywords: ['про нас', 'хто', 'компан', 'фірм', 'адвокат', 'юрист', 'justers', 'джастерс', 'асоціац', 'команд'],
            question: 'Хто такі JUSTERS?',
            answer: 'JUSTERS — сучасне адвокатське об\'єднання, що надає якісну правову підтримку у цивільних, кримінальних, адміністративних та господарських справах. Ми поєднуємо багаторічний досвід з інноваційним підходом для ефективного захисту ваших прав.',
            links: [{ text: 'Про нас', url: '#about' }]
        },
        {
            id: 'contacts',
            category: 'Контакти',
            keywords: ['контакт', 'телефон', 'адрес', 'пошт', 'email', 'зателефон', 'подзвон', 'звязат', 'звязок', 'написат', 'офіс', 'місто', 'чернігів', 'де знаход'],
            question: 'Як з вами зв\'язатися?',
            answer: '📍 Адреса: м. Чернігів, вул. Гетьмана Полуботка, 8а\n📞 Телефони: +38 067 380 17 77, +38 067 456 00 11\n📧 Email: office@justers.io\n\nТакож ми є у Telegram, Instagram, Facebook та WhatsApp.',
            links: [{ text: 'Контакти', url: '#contacts' }]
        },
        {
            id: 'consultation',
            category: 'Консультація',
            keywords: ['консультац', 'записат', 'замовит', 'звернут', 'заявк', 'форм', 'ціна', 'вартіст', 'скільки кошту', 'безкоштовн', 'платн'],
            question: 'Як отримати консультацію?',
            answer: 'Ви можете залишити заявку на консультацію прямо на сайті — натисніть кнопку «Отримати консультацію», вкажіть ім\'я та телефон, і ми зв\'яжемося з вами найближчим часом.\n\nТакож можете зателефонувати: +38 067 380 17 77.',
            links: [{ text: 'Отримати консультацію', url: '#contacts' }]
        },
        {
            id: 'criminal',
            category: 'Послуги',
            keywords: ['кримінал', 'злочин', 'підозр', 'обвинувач', 'слідств', 'прокурор', 'вирок', 'арешт', 'затриман'],
            question: 'Кримінальні справи',
            answer: 'Ми здійснюємо захист прав та інтересів у кримінальних провадженнях на всіх стадіях процесу — від досудового розслідування до апеляції та касації. Забезпечуємо кваліфікований адвокатський захист.',
            links: [{ text: 'Послуги', url: '#services' }]
        },
        {
            id: 'civil',
            category: 'Послуги',
            keywords: ['цивільн', 'майн', 'спадк', 'спадщин', 'житлов', 'сімейн', 'розлучен', 'аліменти', 'поділ'],
            question: 'Цивільні справи',
            answer: 'Представляємо інтереси клієнтів у майнових, спадкових, житлових та сімейних спорах. Допомагаємо вирішити спори як у досудовому порядку, так і в суді.',
            links: [{ text: 'Послуги', url: '#services' }]
        },
        {
            id: 'commercial',
            category: 'Послуги',
            keywords: ['господарськ', 'комерційн', 'бізнес', 'підприємств', 'податков', 'податк', 'контракт', 'договір'],
            question: 'Господарські справи',
            answer: 'Надаємо послуги з досудового врегулювання спорів, представництва та захисту у суді, а також взаємодії з податковою службою. Комплексний юридичний супровід бізнесу.',
            links: [{ text: 'Послуги', url: '#services' }]
        },
        {
            id: 'mobilization',
            category: 'Послуги',
            keywords: ['мобіліз', 'тцк', 'військкомат', 'повістк', 'влк', 'цвлк', 'бронюван', 'призов', 'відстрочк', 'непридатн', 'придатн', 'розшук'],
            question: 'Мобілізація та ТЦК',
            answer: 'Допомагаємо з питаннями мобілізації:\n• Взаємодія з ТЦК та СП\n• Захист прав при мобілізації\n• Супровід при проходженні ВЛК\n• Оскарження рішень до ЦВЛК ЗСУ та судів\n• Питання бронювання персоналу\n\nМаємо значний досвід у цій категорії справ.',
            links: [
                { text: 'Послуги', url: '#services' },
                { text: 'Стаття: дії ТЦК', url: 'publication-tck-court.html' }
            ]
        },
        {
            id: 'appeal',
            category: 'Послуги',
            keywords: ['оскарж', 'рішен', 'бездіяльн', 'орган', 'держав', 'посадов', 'мвс', 'поліц', 'незаконн'],
            question: 'Оскарження рішень',
            answer: 'Оскаржуємо рішення, дії чи бездіяльність органів державної влади та їх посадових осіб, включаючи органи Міністерства внутрішніх справ. Захищаємо ваші права у адміністративних судах.',
            links: [{ text: 'Послуги', url: '#services' }]
        },
        {
            id: 'military',
            category: 'Послуги',
            keywords: ['військов', 'звільнен', 'служб', 'компенсац', 'огд', 'виплат', 'травм', 'каліцтв', 'інвалідн', 'працездатн', 'поранен', 'контузі', 'демобіліз'],
            question: 'Допомога військовослужбовцям',
            answer: 'Надаємо правову допомогу військовослужбовцям та їх сім\'ям:\n• Звільнення з військової служби\n• Отримання компенсацій та виплат ОГД\n• Виплати за травму, каліцтво\n• Втрата працездатності на війні\n\nЗнаємо всі нюанси військового законодавства.',
            links: [
                { text: 'Послуги', url: '#services' },
                { text: 'Стаття: відмова у виплаті ОГД', url: 'publication-ogd-denial.html' },
                { text: 'Колонка: права військових 2026', url: 'publication-personal-column.html' }
            ]
        },
        {
            id: 'stats',
            category: 'Про нас',
            keywords: ['досвід', 'стаж', 'рок', 'скільки справ', 'успішн', 'статистик', 'результат', 'виграш'],
            question: 'Який у вас досвід?',
            answer: 'JUSTERS має значний досвід юридичної практики:\n• 15+ років досвіду\n• 80%+ успішних справ\n• 1000+ проведених консультацій\n\nМи поєднуємо досвід, ефективність та високий рівень сервісу.',
            links: [{ text: 'Про нас', url: '#about' }]
        },
        {
            id: 'article-tck',
            category: 'Публікації',
            keywords: ['тцк', 'розшук', 'протиправн', 'суд', 'судов', 'практик', 'оголошен'],
            question: 'Стаття: протиправні дії ТЦК',
            answer: 'У нашій статті «Визнання протиправними дій ТЦК та СП з оголошення особи в розшук» ми розглядаємо судову практику щодо оскарження незаконних дій територіальних центрів комплектування.',
            links: [{ text: 'Читати статтю', url: 'publication-tck-court.html' }]
        },
        {
            id: 'article-ogd',
            category: 'Публікації',
            keywords: ['огд', 'відмов', 'виплат', 'інвалідн', 'грошов', 'довічн', 'забезпечен'],
            question: 'Стаття: відмова у виплаті ОГД',
            answer: 'Стаття «Відмова у виплаті ОГД за інвалідність: чому та як оскаржити?» допоможе розібратись у причинах відмов та способах їх оскарження. Містить практичні поради для військовослужбовців.',
            links: [{ text: 'Читати статтю', url: 'publication-ogd-denial.html' }]
        },
        {
            id: 'article-column',
            category: 'Публікації',
            keywords: ['колонк', 'прав', 'військов', '2026', 'закон', 'зміни'],
            question: 'Колонка: права військових у 2026',
            answer: 'В особистій колонці «Захист прав військовослужбовців у 2026 році» розглядаємо актуальні зміни законодавства та як вони впливають на захист прав військових.',
            links: [{ text: 'Читати колонку', url: 'publication-personal-column.html' }]
        },
        {
            id: 'reviews',
            category: 'Відгуки',
            keywords: ['відгук', 'відзив', 'рекомендац', 'рейтинг', 'google', 'оцінк', 'думк', 'клієнт'],
            question: 'Де подивитись відгуки?',
            answer: 'Відгуки наших клієнтів можна переглянути на сайті у розділі «Відгуки», а також на нашій сторінці Google Reviews. Ми пишаємось довірою наших клієнтів!',
            links: [{ text: 'Відгуки', url: '#reviews' }]
        },
        {
            id: 'publications',
            category: 'Публікації',
            keywords: ['публікац', 'статт', 'блог', 'матеріал', 'новин', 'читат'],
            question: 'Де знайти ваші публікації?',
            answer: 'Наші статті та публікації доступні у розділі «Публікації». Ми пишемо про актуальні правові теми: мобілізацію, права військових, судову практику та інше.',
            links: [{ text: 'Усі публікації', url: 'publications.html' }]
        }
    ];

    // ===== ПОШУК =====
    function searchKB(query) {
        if (!query || query.trim().length < 2) return [];

        var q = query.toLowerCase().trim();
        var words = q.split(/\s+/).filter(function (w) { return w.length >= 2; });
        var results = [];

        for (var i = 0; i < JUSTERS_KB.length; i++) {
            var item = JUSTERS_KB[i];
            var score = 0;

            // Пошук по keywords (найвища вага)
            for (var k = 0; k < item.keywords.length; k++) {
                var kw = item.keywords[k];
                for (var w = 0; w < words.length; w++) {
                    if (kw.indexOf(words[w]) !== -1 || words[w].indexOf(kw) !== -1) {
                        score += 10;
                    }
                }
                if (kw.indexOf(q) !== -1 || q.indexOf(kw) !== -1) {
                    score += 15;
                }
            }

            // Пошук по question (середня вага)
            var questionLower = item.question.toLowerCase();
            if (questionLower.indexOf(q) !== -1) {
                score += 8;
            }
            for (var w2 = 0; w2 < words.length; w2++) {
                if (questionLower.indexOf(words[w2]) !== -1) {
                    score += 3;
                }
            }

            // Пошук по answer (низька вага)
            var answerLower = item.answer.toLowerCase();
            for (var w3 = 0; w3 < words.length; w3++) {
                if (answerLower.indexOf(words[w3]) !== -1) {
                    score += 1;
                }
            }

            if (score > 0) {
                results.push({ item: item, score: score });
            }
        }

        results.sort(function (a, b) { return b.score - a.score; });
        return results.slice(0, 3);
    }

    // ===== UI =====
    function initChatWidget() {
        // HTML віджету
        var html = '' +
            '<div id="justers-chat-fab" aria-label="Відкрити чат">' +
            '  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.2L4 17.2V4H20V16Z" fill="currentColor"/>' +
            '    <path d="M7 9H17V11H7V9ZM7 5H17V7H7V5ZM7 13H14V15H7V13Z" fill="currentColor"/>' +
            '  </svg>' +
            '</div>' +
            '<div id="justers-chat-window">' +
            '  <div id="justers-chat-header">' +
            '    <div class="justers-chat-header-info">' +
            '      <span class="justers-chat-header-title">JUSTERS</span>' +
            '      <span class="justers-chat-header-sub">Онлайн-помічник</span>' +
            '    </div>' +
            '    <button id="justers-chat-reset" aria-label="На початок" title="На початок">' +
            '      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>' +
            '    </button>' +
            '    <button id="justers-chat-close" aria-label="Закрити чат">&times;</button>' +
            '  </div>' +
            '  <div id="justers-chat-messages"></div>' +
            '  <div id="justers-chat-input-area">' +
            '    <input type="text" id="justers-chat-input" placeholder="Напишіть ваше питання..." autocomplete="off" />' +
            '    <button id="justers-chat-send" aria-label="Надіслати">' +
            '      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/></svg>' +
            '    </button>' +
            '  </div>' +
            '</div>';

        var container = document.createElement('div');
        container.id = 'justers-chat-widget';
        container.innerHTML = html;
        document.body.appendChild(container);

        // Елементи
        var fab = document.getElementById('justers-chat-fab');
        var chatWindow = document.getElementById('justers-chat-window');
        var closeBtn = document.getElementById('justers-chat-close');
        var messagesEl = document.getElementById('justers-chat-messages');
        var inputEl = document.getElementById('justers-chat-input');
        var sendBtn = document.getElementById('justers-chat-send');
        var resetBtn = document.getElementById('justers-chat-reset');
        var isOpen = false;
        var hasInteracted = false;

        function updateResetBtn() {
            resetBtn.style.display = hasInteracted ? 'flex' : 'none';
        }
        updateResetBtn();

        // Звук відкриття чату
        var chatOpenSound = new Audio('audio/chat-open.wav');
        chatOpenSound.volume = 0.5;

        function openChat() {
            isOpen = true;
            chatWindow.classList.add('open');
            fab.classList.add('hidden');
            chatOpenSound.currentTime = 0;
            chatOpenSound.play().catch(function () {});
            inputEl.focus();
            if (messagesEl.children.length === 0) {
                showWelcome();
            }
        }

        function closeChat() {
            isOpen = false;
            chatWindow.classList.remove('open');
            fab.classList.remove('hidden');
        }

        function resetChat() {
            messagesEl.innerHTML = '';
            hasInteracted = false;
            updateResetBtn();
            showWelcome();
            inputEl.focus();
        }

        function showWelcome() {
            addBotMessage('Вітаю! Я онлайн-помічник JUSTERS. Оберіть тему або напишіть своє питання:');
            addChips([
                { text: 'Послуги', query: 'які послуги ви надаєте' },
                { text: 'Мобілізація', query: 'мобілізація' },
                { text: 'Контакти', query: 'контакти' },
                { text: 'Публікації', query: 'публікації' }
            ]);
        }

        function addBotMessage(text, links) {
            var msgDiv = document.createElement('div');
            msgDiv.className = 'justers-chat-msg justers-chat-bot';

            var content = document.createElement('div');
            content.className = 'justers-chat-msg-content';

            // Конвертуємо \n у <br> та • у маркери
            var formatted = text
                .replace(/\n/g, '<br>')
                .replace(/📍/g, '<span class="justers-chat-icon">📍</span>')
                .replace(/📞/g, '<span class="justers-chat-icon">📞</span>')
                .replace(/📧/g, '<span class="justers-chat-icon">📧</span>');
            content.innerHTML = formatted;

            msgDiv.appendChild(content);

            if (links && links.length > 0) {
                var linksDiv = document.createElement('div');
                linksDiv.className = 'justers-chat-links';
                for (var i = 0; i < links.length; i++) {
                    var a = document.createElement('a');
                    a.href = links[i].url;
                    a.textContent = links[i].text;
                    a.className = 'justers-chat-link';
                    if (links[i].url.indexOf('.html') !== -1 && links[i].url.indexOf('#') !== 0) {
                        a.target = '_self';
                    }
                    linksDiv.appendChild(a);
                }
                msgDiv.appendChild(linksDiv);
            }

            messagesEl.appendChild(msgDiv);
            scrollToBottom();
        }

        function addUserMessage(text) {
            var msgDiv = document.createElement('div');
            msgDiv.className = 'justers-chat-msg justers-chat-user';

            var content = document.createElement('div');
            content.className = 'justers-chat-msg-content';
            content.textContent = text;

            msgDiv.appendChild(content);
            messagesEl.appendChild(msgDiv);
            scrollToBottom();
        }

        function addChips(chips) {
            var chipsDiv = document.createElement('div');
            chipsDiv.className = 'justers-chat-chips';
            for (var i = 0; i < chips.length; i++) {
                (function (chip) {
                    var btn = document.createElement('button');
                    btn.className = 'justers-chat-chip';
                    btn.textContent = chip.text;
                    btn.addEventListener('click', function () {
                        handleQuery(chip.query, chip.text);
                        chipsDiv.remove();
                    });
                    chipsDiv.appendChild(btn);
                })(chips[i]);
            }
            messagesEl.appendChild(chipsDiv);
            scrollToBottom();
        }

        function scrollToBottom() {
            messagesEl.scrollTop = messagesEl.scrollHeight;
        }

        function handleQuery(query, displayText) {
            hasInteracted = true;
            updateResetBtn();
            addUserMessage(displayText || query);

            var results = searchKB(query);

            if (results.length > 0) {
                var best = results[0];
                addBotMessage(best.item.answer, best.item.links);

                // Якщо є ще релевантні результати, покажемо chips
                if (results.length > 1) {
                    var moreChips = [];
                    for (var i = 1; i < results.length; i++) {
                        moreChips.push({
                            text: results[i].item.question,
                            query: results[i].item.question
                        });
                    }
                    addChips(moreChips);
                }
            } else {
                addBotMessage(
                    'На жаль, я не знайшов відповіді на ваше питання. Зверніться до нас напряму — ми із задоволенням допоможемо!\n\n📞 +38 067 380 17 77\n📧 office@justers.io',
                    [
                        { text: 'Контакти', url: '#contacts' },
                        { text: 'Telegram', url: 'https://t.me/Justers_lawfirm' }
                    ]
                );
            }
        }

        function handleSend() {
            var query = inputEl.value.trim();
            if (!query) return;
            inputEl.value = '';
            handleQuery(query);
        }

        // Event listeners
        fab.addEventListener('click', openChat);
        closeBtn.addEventListener('click', closeChat);
        resetBtn.addEventListener('click', resetChat);
        sendBtn.addEventListener('click', handleSend);

        inputEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isOpen) {
                closeChat();
            }
        });
    }

    // Ініціалізація
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatWidget);
    } else {
        initChatWidget();
    }
})();
