const d6a = document.querySelector('#d6-a');
const d6b = document.querySelector('#d6-b');
const d4 = document.querySelector('#d4');
const rollButton = document.querySelector('#roll-btn');
const modifierInput = document.querySelector('#modifier');
const resultMessage = document.querySelector('#result-message');
const sumDisplay = document.querySelector('#sum-display');
const totalDisplay = document.querySelector('#total-display');
const statusOverlay = document.querySelector('#status-overlay');
const statusText = document.querySelector('#status-text');

const roll = (sides) => Math.floor(Math.random() * sides) + 1;

const setDiceValue = (element, value) => {
  element.textContent = value;
};

const animateDice = (...dice) => {
  dice.forEach((die) => {
    die.classList.remove('rolling');
    void die.offsetWidth; // restart animation
    die.classList.add('rolling');
  });
};

const hideStatus = () => {
  statusOverlay.className = 'status-overlay hidden';
  statusText.textContent = '';
};

const showStatus = (type, text) => {
  statusOverlay.className = `status-overlay active ${type}`;
  statusText.textContent = text;
  setTimeout(hideStatus, 1200);
};

let latestBaseSum = null;

const updateTotalWithModifier = () => {
  if (latestBaseSum === null) {
    totalDisplay.textContent = 'Итог с модификатором: —';
    return;
  }
  const modifier = Number(modifierInput.value) || 0;
  totalDisplay.textContent = `Итог с модификатором: ${latestBaseSum + modifier}`;
};

modifierInput.addEventListener('input', updateTotalWithModifier);

rollButton.addEventListener('click', () => {
  hideStatus();
  d4.classList.add('hidden');
  animateDice(d6a, d6b, d4);

  const first = roll(6);
  const second = roll(6);
  setDiceValue(d6a, first);
  setDiceValue(d6b, second);

  const bothSix = first === 6 && second === 6;
  const bothOne = first === 1 && second === 1;

  if (bothSix) {
    latestBaseSum = first + second;
    resultMessage.textContent = 'Экстремальный успех! Сумма 12.';
    sumDisplay.textContent = 'Сумма: 12';
    showStatus('success', 'Экстремальный успех');
    updateTotalWithModifier();
    return;
  }

  if (bothOne) {
    latestBaseSum = first + second;
    resultMessage.textContent = 'Экстремальный провал! Сумма 2.';
    sumDisplay.textContent = 'Сумма: 2';
    showStatus('fail', 'Экстремальный провал');
    updateTotalWithModifier();
    return;
  }

  const includesSix = first === 6 || second === 6;
  const includesOne = first === 1 || second === 1;

  let d4Result = null;
  let d4Action = '';

  if (includesSix && includesOne) {
    resultMessage.textContent = 'Выпали 6 и 1 — куб d4 не используется.';
  } else if (includesSix) {
    d4Result = roll(4);
    setDiceValue(d4, d4Result);
    d4.classList.remove('hidden');
    d4Action = ` + d4(${d4Result})`;
  } else if (includesOne) {
    d4Result = roll(4);
    setDiceValue(d4, d4Result);
    d4.classList.remove('hidden');
    d4Action = ` − d4(${d4Result})`;
  } else {
    resultMessage.textContent = 'Чистый бросок: только два d6.';
  }

  let baseSum = first + second;
  if (d4Result !== null) {
    if (includesSix) {
      baseSum += d4Result;
      resultMessage.textContent = `Добавляем d4: +${d4Result}.`;
    } else if (includesOne) {
      baseSum -= d4Result;
      resultMessage.textContent = `Вычитаем d4: -${d4Result}.`;
    }
  }

  latestBaseSum = baseSum;
  sumDisplay.textContent = `Сумма: ${first} + ${second}${d4Action} = ${baseSum}`;
  updateTotalWithModifier();
});
