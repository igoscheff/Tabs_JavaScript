window.addEventListener('DOMContentLoaded', function() {

    'use strict'

    ///////////////////////// Табы /////////////////////////

    //Получение объектов со страницы (табы, родитель табов, контент табов)
    let tab = document.querySelectorAll('.info-header-tab'),
        info = document.querySelector('.info-header'),
        tabContent = document.querySelectorAll('.info-tabcontent')

    //Функция скрытия табов
    function hideTabContent(a) {
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('show')
            tabContent[i].classList.add('hide')
        }
    }

    //Вызов функции скрытия табов, оставляя только первый элемент
    hideTabContent(1)

    //Функция показа табов
    function showTabContent(a) {
        if (tabContent[a].classList.contains('hide')) {
            tabContent[a].classList.remove('hide')
            tabContent[a].classList.add('show')
        }
    }

    //Обработчик событий для родителя табов, делегирующий события табам
    info.addEventListener('click', function(event) {
        let target = event.target

        if (target && target.classList.contains('info-header-tab')) {
            for (let i = 0; tab.length; i++) {
                if (target == tab[i]) {
                    hideTabContent(0)
                    showTabContent(i)
                    break;
                }
            }
        }
    })

    ///////////////////////// Таймер /////////////////////////

    //Дата окончания таймера
    let deadline = '2020-02-13';

    //Функция вазвращающая интервал до окончания таймера
    function getTimeRemaining(endtime) {
        let t = Date.parse(endtime) - Date.parse(new Date()),
        seconds = Math.floor((t/1000) % 60),
        minutes = Math.floor((t/1000/60) % 60),
        hours = Math.floor(t/1000/60/60);

        return {
            'total' : t,
            'hours' : hours,
            'minutes' : minutes,
            'seconds' : seconds
        }
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
                clearInterval(timeInterval)
                hours.textContent = '00';
                minutes.textContent = '00';
                seconds.textContent = '00';
            }
        }
    }

    //Вызов функции установки и обнавления времени
    setClock('timer', deadline)

})