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
    }

    //Получаем необходимые объекты со страницы и создаем div вывода сообщений
    let form = document.querySelector('.main-form'),
        input = form.querySelectorAll('input'),
        statusMessage = document.createElement('div');

    statusMessage.classList.add('status');

    //Навешиваем обработчик события submit на форму. Важно! Именно на форму а не кнопку!
    form.addEventListener('submit',(event) =>{
        event.preventDefault(); //меняем стандартное поведение браузера
        form.appendChild(statusMessage); //Добавляем объект на страницу

        //Создаем объект запроса
        let request = new XMLHttpRequest();
        request.open('POST', 'server.php'); //Открываем запрос
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8'); //Заголовок запроса

        //Получаем объект данных с формы типа FormDate, указывая объект нашей формы form
        let formDate = new FormData(form);

        //Создаем обычный объект для наших данных формы, так как FormDate имеет много лишних данных и нам не подходит
        let objForm = {};

        //Заполняем наш объект данными из FormDate
        formDate.forEach((value, key) => {
            objForm[key] = value;
        });

        //Преобразуем наш объект в строку JSON
        let json = JSON.stringify(objForm);

        //Отправляем наш json на сервер
        request.send(json);

        //Навешиваем обработчик на наш запрос, слушаем статусы запроса
        request.addEventListener("readystatechange", () => {
            //4 статус DONE, запрос прошел успешно
            //0 = UNSENT, 1 = OPENED, 2 = HEADERS_RECEIVED, 3 = LOADING
            if (request.readyState < 4) {
                statusMessage.innerHTML = message.loading;
            } else if (request.readyState === 4) {
                statusMessage.innerHTML = message.success;
            } else {
                statusMessage.innerHTML = message.failure;
            }
        });

        //Очищаем все инпуты нашей формы
        for (let i = 0; i < input.length; i++) {
            input[i].value = '';
        }

    });

    //Еще одна форма
    let contactForm = document.getElementById('form'),
        contactInput = contactForm.querySelectorAll('input');

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        contactForm.appendChild(statusMessage);

        let request = new XMLHttpRequest();
        request.open('POST', 'server.php');
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        let objForm = {
            email: '',
            phone: ''
        };

        objForm.email = contactInput[0].value;
        objForm.phone = contactInput[1].value;

        request.send(JSON.stringify(objForm));

        request.addEventListener("readystatechange", () => {
            if (request.readyState < 4) {
                statusMessage.innerHTML = message.loading;
            } else if (request.readyState === 4) {
                statusMessage.innerHTML = message.success;
            } else {
                statusMessage.innerHTML = message.failure;
            }
        });

        for (let i = 0; i < contactInput.length; i++) {
            contactInput[i].value = '';
        }

    });

});