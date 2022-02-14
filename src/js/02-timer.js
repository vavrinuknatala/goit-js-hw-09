import '../css/common.css';
// Описан в документации
import flatpickr from 'flatpickr';
// Дополнительный импорт стилей
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix';

const btnStart = document.querySelector('button[data-start]');
btnStart.disabled = true;
const input = document.querySelector('#datetime-picker');
const daysSpan = document.querySelector('span[data-days]');
const hoursSpan = document.querySelector('span[data-hours]');
const minutesSpan = document.querySelector('span[data-minutes]');
const secondsSpan = document.querySelector('span[data-seconds]');

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const dateNow = Date.now();
    // console.log('~ dateNow', dateNow);

    btnStart.addEventListener('click', onBtnStart);

    if (selectedDates[0] < dateNow) {
      Notify.failure('Please choose a date in the future');
      btnStart.disabled = true;
      return;
    }
    btnStart.disabled = false;

    function onBtnStart() {
      btnStart.disabled = true;
      Notify.success('start обратный отсчет пошел');

      const timerId = setInterval(() => {
        const currentTime = Date.now();
        const deltaTime = selectedDates[0] - currentTime;
        // console.log('~ deltaTime', deltaTime);

        const time = convertMs(deltaTime);
        updateClockface(time);
        //console.log(`${time.days}:${time.hours}:${time.minutes}:${time.seconds}`);
        if (deltaTime <= 1000) {
          Notify.success('FINISH');
          clearInterval(timerId);
          return;
        }
      }, 1000);
    }

    function convertMs(ms) {
      // Number of milliseconds per unit of time
      const second = 1000;
      const minute = second * 60;
      const hour = minute * 60;
      const day = hour * 24;

      // Remaining days
      const days = addLeadingZero(Math.floor(ms / day));
      // Remaining hours
      const hours = addLeadingZero(Math.floor((ms % day) / hour));
      // Remaining minutes
      const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
      // Remaining seconds
      const seconds = addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));

      return { days, hours, minutes, seconds };
    }
    function addLeadingZero(value) {
      return String(value).padStart(2, '0');
    }

    function updateClockface({ days, hours, minutes, seconds }) {
      daysSpan.textContent = `${days}`;
      hoursSpan.textContent = `${hours}`;
      minutesSpan.textContent = `${minutes}`;
      secondsSpan.textContent = `${seconds}`;
    }
  },
};
flatpickr(input, options);