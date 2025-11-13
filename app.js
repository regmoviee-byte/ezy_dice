const diceA = document.getElementById('dice-a');
const diceB = document.getElementById('dice-b');
const diceC = document.getElementById('dice-c');
const statusEl = document.getElementById('status');
const baseEl = document.getElementById('base-total');
const d4Line = document.getElementById('d4-line');
const d4ValueEl = document.getElementById('d4-value');
const finalEl = document.getElementById('final-total');
const finalWithModEl = document.getElementById('final-with-mod');
const modifierInput = document.getElementById('modifier-input');
const rollBtn = document.getElementById('roll-btn');

let lastTotal = null;

const rollDie = (sides) => Math.floor(Math.random() * sides) + 1;

const animateDice = () => {
  [diceA, diceB, diceC].forEach((die) => {
    die.classList.remove('roll');
    void die.offsetWidth; // restart animation
    die.classList.add('roll');
  });
};

const applyModifier = () => {
  const modifier = Number(modifierInput.value);
  if (Number.isFinite(lastTotal)) {
    const total = lastTotal + (Number.isFinite(modifier) ? modifier : 0);
    finalWithModEl.textContent = total;
  } else {
    finalWithModEl.textContent = '–';
  }
};

modifierInput.addEventListener('input', applyModifier);

const resetExtremeStates = () => {
  document.body.classList.remove('extreme-success', 'extreme-fail');
  statusEl.classList.remove('glitch', 'bloody');
  statusEl.removeAttribute('data-text');
};

const setStatus = (text, options = {}) => {
  statusEl.textContent = text;
  if (options.glitch) {
    statusEl.dataset.text = text;
    statusEl.classList.add('glitch');
  }
  if (options.bloody) {
    statusEl.classList.add('bloody');
  }
};

const rollDice = () => {
  resetExtremeStates();
  rollBtn.disabled = true;
  animateDice();
  statusEl.textContent = 'Кубики в полёте...';

  setTimeout(() => {
    const first = rollDie(6);
    const second = rollDie(6);

    diceA.textContent = first;
    diceB.textContent = second;

    let baseTotal = first + second;
    let d4Info = null;

    const hasSix = first === 6 || second === 6;
    const hasOne = first === 1 || second === 1;

    const isExtremeSuccess = first === 6 && second === 6;
    const isExtremeFail = first === 1 && second === 1;

    diceC.textContent = '–';
    d4Line.hidden = true;

    if (isExtremeSuccess) {
      document.body.classList.add('extreme-success');
      setStatus('Экстремальный успех', { glitch: true });
      baseEl.textContent = '12';
      finalEl.textContent = '12';
      lastTotal = 12;
      applyModifier();
      rollBtn.disabled = false;
      return;
    }

    if (isExtremeFail) {
      document.body.classList.add('extreme-fail');
      setStatus('Экстремальный провал', { bloody: true });
      baseEl.textContent = '2';
      finalEl.textContent = '2';
      lastTotal = 2;
      applyModifier();
      rollBtn.disabled = false;
      return;
    }

    if (hasSix && hasOne) {
      setStatus('Шквальный бросок без d4.');
    } else if (hasSix) {
      d4Info = { value: rollDie(4), type: 'add' };
      setStatus('6 обнаружена! d4 добавляется.');
    } else if (hasOne) {
      d4Info = { value: rollDie(4), type: 'subtract' };
      setStatus('1 обнаружена! d4 вычитается.');
    } else {
      setStatus('Чистый бросок d6.');
    }

    if (d4Info) {
      d4Line.hidden = false;
      diceC.textContent = d4Info.value;
      d4ValueEl.textContent = `${d4Info.type === 'add' ? '+' : '−'}${d4Info.value}`;
      baseTotal = d4Info.type === 'add' ? baseTotal + d4Info.value : baseTotal - d4Info.value;
    } else {
      d4ValueEl.textContent = '–';
    }

    baseEl.textContent = `${first} + ${second} = ${first + second}`;
    finalEl.textContent = baseTotal;
    lastTotal = baseTotal;
    applyModifier();
    rollBtn.disabled = false;
  }, 650);
};

rollBtn.addEventListener('click', rollDice);
