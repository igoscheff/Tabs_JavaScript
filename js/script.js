window.addEventListener('DOMContentLoaded', function () {

    'use strict';

    ///////////////////////// Табы /////////////////////////

    //Получение объектов со страницы (табы, родитель табов, контент табов)
    let tab = document.querySelectorAll('.info-header-tab'),
        info = document.querySelector('.info-header'),
        tabContent = document.querySelectorAll('.info-tabcontent');

    //Функция скрытия табов
    function hideTabContent(a) {
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    }

    //Вызов функции скрытия табов, оставляя только первый элемент
    hideTabContent(1);

    //Функция показа табов
    function showTabContent(a) {
        if (tabContent[a].classList.contains('hide')) {
            tabContent[a].classList.remove('hide');
            tabContent[a].classList.add('show');
        }
    }

    //Обработчик событий для родителя табов, делегирующий события табам
    info.addEventListener('click', function (event) {
        let target = event.target;

        if (target && target.classList.contains('info-header-tab')) {
            for (let i = 0; tab.length; i++) {
                if (target === tab[i]) {
                    hideTabContent(0);
                    showTabContent(i);
                    break;
                }
            }
        }
    });

    ///////////////////////// Таймер /////////////////////////

    //Дата окончания таймера
    let deadline = '2020-02-13';

    //Функция вазвращающая интервал до окончания таймера
    function getTimeRemaining(endtime) {
        let t = Date.parse(endtime) - Date.parse(new Date()),
            seconds = Math.floor((t / 1000) % 60),
            minutes = Math.floor((t / 1000 / 60) % 60),
            hours = Math.floor(t / 1000 / 60 / 60);

        return {
            'total': t,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    //Функция установки и обнавления времени
    function setClock(id, endtime) {
        let timer = document.getElementById(id),
            hours = timer.querySelector('.hours'),
            minutes = timer.querySelector('.minutes'),
            seconds = timer.querySelector('.seconds'),
            timeInterval = setInterval(updateClock, 1000);

        function updateClock() {
            let t = getTimeRemaining(endtime);
            hours.textContent = t.hours < 10 ? '0' + t.hours : t.hours;
            minutes.textContent = t.minutes < 10 ? '0' + t.minutes : t.minutes;
            seconds.textContent = t.seconds < 10 ? '0' + t.seconds : t.seconds;

            if (t.total <= 0) {
                clearInterval(timeInterval);
                hours.textContent = '00';
                minutes.textContent = '00';
                seconds.textContent = '00';
            }
        }
    }

    //Вызов функции установки и обнавления времени
    setClock('timer', deadline);

    ///////////////////////// Модальное окно /////////////////////////

    let moreBtn = document.querySelector('.more'),
        closeBtn = document.querySelector('.popup-close'),
        overlay = document.querySelector('.overlay');

    moreBtn.addEventListener('click', () => {
        if (overlay.style.display !== 'block') {
            overlay.style.display = 'block';
            //Запрет на прокрутку страницы
            document.body.style.overflow = 'hidden';
        }
    });

    closeBtn.addEventListener('click', () => {
        if (overlay.style.display === 'block') {
            overlay.style.display = 'none';
            //Отмена запрета на прокрутку страницы
            document.body.style.overflow = '';
        }
    });

    //Модали для табов, делегирование без повторов

    let sectionInfo = document.querySelector('.info'),
        tabBtns = sectionInfo.querySelectorAll('.description-btn');

    sectionInfo.addEventListener('click', function (event) {
        tabBtns.forEach(function (item) {
            if (event.target === item) {
                if (overlay.style.display !== 'block') {
                    overlay.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                }
            }
        });
    });

    ///////////////////////// Форма /////////////////////////

    //Создаем объект сообщений пользователю
    let message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с вами свяжемся!',
        failure: 'Что-то пошло не так...'
    };

    //Получаем и создаем необходимые объекты со страницы и создаем div вывода сообщений
    let form = document.querySelector('.main-form'),
        inputs = form.querySelectorAll('input'),
        //Создаем объект нашей формы 1
        form1 = {
            form: form,
            inputs: inputs
        },
        contactForm = document.getElementById('form'),
        contactInputs = contactForm.querySelectorAll('input'),
        //Создаем объект нашей формы 2
        form2 = {
            form: contactForm,
            inputs: contactInputs
        },
        //Создаем объект конфигурации запроса
        requestCfg = {
            type: 'POST',
            url: 'server.php',
            headerName: 'Content-type',
            headerValue: 'application/json; charset=utf-8'
        },
        //Создаем HTML объект вывода сообщений пользователю
        statusMessage = document.createElement('div');
        //Добавляем класс нашему объекту сообщений пользователю
        statusMessage.classList.add('status');

    //Создаем функцию отправки форм
    function formSend(form, requestCfg) {
        //Навешиваем обработчик события submit на форму. Важно! Именно на форму а не кнопку!
        form.form.addEventListener('submit', function (e) {
            e.preventDefault(); //меняем стандартное поведение браузера
            form.form.appendChild(statusMessage); //Добавляем объект на страницу

            //Создаем объект данных с формы
            let formDate = {};
            //Заполняем его данными из наших инпутов
            for (let i = 0; i < form.inputs.length; i++) {
                formDate[form.inputs[i].type] = form.inputs[i].value;
            }
            //Преобразуем данные с формы в JSON строку
            let jsonDate = JSON.stringify(formDate);

            function postDate(date) { //Создаем функцию пост запроса к серверу
                return new Promise(function (resolve, reject) { //Создаем промис
                    let request = new XMLHttpRequest(); //Создаем объект запроса
                    request.open(requestCfg.type, requestCfg.url); //Открываем запрос
                    request.setRequestHeader(requestCfg.headerName, requestCfg.headerValue); //Заголовок запроса
                    //Навешиваем обработчик события при смене ready state на наш запрос, слушаем статусы запроса
                    request.onreadystatechange = function () {
                        //4 статус DONE, запрос прошел успешно
                        //0 = UNSENT, 1 = OPENED, 2 = HEADERS_RECEIVED, 3 = LOADING
                        if (request.readyState < 4) {
                            resolve()
                        } else if (request.readyState === 4) {
                            if (request.status === 200) {
                                resolve()
                            } else {
                                reject()
                            }
                        }
                    };
                    //Отправляем наши данные на сервер
                    request.send(date);
                })
            } //End postDate

            //Функция отчистки инпутов формы
            function clearInputs() {
                for (let i = 0; i < form.inputs.length; i++) {
                    form.inputs[i].value = '';
                }
            }

            //Вызываем функцию запроса к серверу с нашими JSON данными с формы
            postDate(jsonDate)
                //Дальше отрабатывает промис
                .then(() => statusMessage.innerHTML = message.success)
                .catch(() => statusMessage.innerHTML = message.failure)
                .finally(clearInputs)
        })
    } //End formSend

    //Вызываем функции отпрвки формы для 2 наших форм
    formSend(form1, requestCfg);
    formSend(form2, requestCfg);

    ///////////////////////// Слайдер /////////////////////////

    //Получаем все необходимые объекты со страницы
    let slideIndex = 1,
        slides = document.querySelectorAll('.slider-item'),
        prev = document.querySelector('.prev'),
        next = document.querySelector('.next'),
        dotsWrap = document.querySelector('.slider-dots'),
        dots = dotsWrap.querySelectorAll('.dot'),
        interval = true,
        intervalMs = 2000;

    //Функция показа слайдов
    function showSlides(n) {
        //Сначала скрываем все слайды и делаем dots не активными
        slides.forEach(item => item.style.display = 'none');
        dots.forEach(item => item.classList.remove('dot-active'));
        //А теперь показываем n слайд и делаем активной точку n, учитывая что слайд индекс начинается с 1 а коллекции с 0
        slides[n - 1].style.display = 'block';
        dots[n - 1].classList.add('dot-active');
    }

    //Показываем слайд по умолчанию (1)
    showSlides(slideIndex);

    //Функция выбора следующего слайда, учитывающая количество слайдов и их цикличность
    function nextSlide(n) {
        n++;
        if (n > slides.length) n = 1;
        showSlides(n);
        slideIndex = n;
    }

    //Функция выбора предыдущего слайда, учитывающая количество слайдов и их цикличность
    function prevSlide(n) {
        n--;
        if (n < 1) n = slides.length;
        showSlides(n);
        slideIndex = n;
    }

    //Обработчик на кнопку
    next.addEventListener('click', () => {
        nextSlide(slideIndex);
    });

    //Обработчик на кнопку
    prev.addEventListener('click', () => {
        prevSlide(slideIndex);
    });

    //Обработчик на dots с делегацией и логикой
    dotsWrap.addEventListener('click',event => {
        for (let i = 0; i < dots.length; i++) {
            if (dots[i] === event.target) showSlides(i + 1);
        }
    });

    //Автоматическое перелистывание слайдов
    if (interval === true) {
        setInterval(() => { nextSlide(slideIndex) }, intervalMs);
    }

    ///////////////////////// Калькулятор /////////////////////////

    let persons = document.querySelectorAll('.counter-block-input')[0],
        restDays = document.querySelectorAll('.counter-block-input')[1],
        place = document.getElementById('select'),
        totalValue = document.getElementById('total'),
        personSum = 0,
        daySum = 0,
        total = 0;

    totalValue.innerHTML = total + " €";

    persons.addEventListener('input', function () {
        personSum = +this.value;
        total = (daySum * personSum) * 100;

        if (restDays.value === '') {
            totalValue.innerHTML = 0 + " €";
        } else {
            totalValue.innerHTML = total + " €";
        }
    });

    restDays.addEventListener('input', function () {
        daySum = +this.value;
        total = (daySum * personSum) * 100;

        if (persons.value === '') {
            totalValue.innerHTML = 0 + " €";
        } else {
            totalValue.innerHTML = total + " €";
        }
    });

    place.addEventListener('change', function () {
        if (restDays.value === '' || persons.value === '') {
            totalValue.innerHTML = 0 + " €";
        } else {
            let a = total;
            totalValue.innerHTML = a * this.options[this.selectedIndex].value + " €";
        }
    });

});