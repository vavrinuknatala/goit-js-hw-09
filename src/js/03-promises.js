import { Notify } from 'notiflix';
const refs = {
  form: document.querySelector('.form'),
  formSubmit: document.querySelector('.form button'),
  inputDelay: document.querySelector('input[name = delay]'),
  inputStep: document.querySelector('input[name = step]'),
  inputAmount: document.querySelector('input[name = amount]'),
};

refs.form.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  let newDelay = 0;
  const delay = Number(refs.inputDelay.value);
  const step = Number(refs.inputStep.value);
  const amount = Number(refs.inputAmount.value);

  for (let positions = 0; positions < amount; positions += 1) {
    newDelay = positions * step + delay;
    createPromise(positions, newDelay)
      .then(({ position, delay }) =>
        Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`),
      )
      .catch(({ position, delay }) =>
        Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`),
      );
  }
  refs.form.reset();
}

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}