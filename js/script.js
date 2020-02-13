window.addEventListener('DOMContentLoaded', function() {

    'use strict'

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

})