// ===== Tabs =====
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    tabContents.forEach(c => c.classList.remove('active'));
    document.getElementById(btn.dataset.tab + '-tab').classList.add('active');
  });
});

// ===== Toast =====
const toast = document.getElementById('toast');
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1800);
}

// ===== Random utilities (Web Crypto) =====
function randInt(max) {
  if (max <= 0) return 0;
  if (window.crypto && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function shuffle(str) {
  const arr = str.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

function estimateStrength(len, diversity) {
  if (len >= 14 && diversity >= 3) return { pct: 100, color: 'green', label: 'Strong' };
  if (len >= 10 && diversity >= 2) return { pct: 65, color: 'orange', label: 'Medium' };
  return { pct: 35, color: 'red', label: 'Weak' };
}

function setStrength(mode, est) {
  const fill = document.getElementById('strength-fill-' + mode);
  const indicator = document.getElementById('strength-indicator-' + mode);
  fill.style.width = est.pct + '%';
  fill.style.backgroundColor = est.color;
  indicator.textContent = 'Strength: ' + est.label;
  indicator.style.color = est.color;
}

// ===== Random mode =====
const passwordRandom = document.getElementById('password-random');
const copyBtnRandom = document.getElementById('copy-btn-random');
const generateBtnRandom = document.getElementById('generate-btn-random');
const regenerateBtnRandom = document.getElementById('regenerate-btn-random');
const lengthSliderRandom = document.getElementById('length-slider-random');
const lengthValueRandom = document.getElementById('length-value-random');
const uppercaseChk = document.getElementById('uppercase');
const lowercaseChk = document.getElementById('lowercase');
const numbersChk = document.getElementById('numbers');
const symbolsChk = document.getElementById('symbols');

const uppercaseChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // no I,O
const lowercaseChars = 'abcdefghijkmnopqrstuvwxyz'; // no l
const numberChars   = '23456789'; // no 0,1
const symbolChars   = '@#$%^*()_+-=[]{}|;:,./<>?'; // no &

lengthValueRandom.textContent = lengthSliderRandom.value;
lengthSliderRandom.addEventListener('input', () => {
  lengthValueRandom.textContent = lengthSliderRandom.value;
});

function generateRandomPassword() {
  const length = parseInt(lengthSliderRandom.value, 10);
  let pools = [];
  if (uppercaseChk.checked) pools.push(uppercaseChars);
  if (lowercaseChk.checked) pools.push(lowercaseChars);
  if (numbersChk.checked)   pools.push(numberChars);
  if (symbolsChk.checked)   pools.push(symbolChars);

  if (pools.length === 0) {
    showToast('Select at least one character type');
    return;
  }

  let result = pools.map(set => set[randInt(set.length)]).join('');
  const all = pools.join('');
  for (let i = result.length; i < length; i++) {
    result += all[randInt(all.length)];
  }
  result = shuffle(result);

  passwordRandom.value = result;
  const est = estimateStrength(length, pools.length);
  setStrength('random', est);
}

generateBtnRandom.addEventListener('click', generateRandomPassword);
regenerateBtnRandom.addEventListener('click', generateRandomPassword);
copyBtnRandom.addEventListener('click', () => {
  if (!passwordRandom.value) return;
  navigator.clipboard.writeText(passwordRandom.value);
  showToast('Password copied!');
});

// ===== Words mode =====
const passwordWords = document.getElementById('password-words');
const copyBtnWords = document.getElementById('copy-btn-words');
const generateBtnWords = document.getElementById('generate-btn-words');
const regenerateBtnWords = document.getElementById('regenerate-btn-words');
const wordsInput = document.getElementById('words-input');
const wordCountSlider = document.getElementById('word-count-slider');
const wordCountValue = document.getElementById('word-count-value');
const separatorsChk = document.getElementById('separators');
const addNumbersChk = document.getElementById('add-numbers');
const capitalizeChk = document.getElementById('capitalize');

wordCountValue.textContent = wordCountSlider.value;
wordCountSlider.addEventListener('input', () => {
  wordCountValue.textContent = wordCountSlider.value;
});

function generateWordPassphrase() {
  let words = wordsInput.value.trim().split(/[\s,]+/).filter(Boolean);
  if (words.length === 0) {
    showToast('Enter words to generate a passphrase');
    return;
  }
  const count = parseInt(wordCountSlider.value, 10);

  let chosen = [];
  for (let i = 0; i < count; i++) {
    let w = words[randInt(words.length)];
    if (capitalizeChk.checked) w = w.charAt(0).toUpperCase() + w.slice(1);
    chosen.push(w);
  }

  const sep = separatorsChk.checked ? (randInt(2) === 0 ? '-' : '_') : '';
  let pass = sep ? chosen.join(sep) : chosen.join('');

  if (addNumbersChk.checked) {
    pass += String(randInt(100));
  }

  passwordWords.value = pass;
  const est = estimateStrength(pass.length, count >= 4 ? 3 : 2);
  setStrength('words', est);
}

generateBtnWords.addEventListener('click', generateWordPassphrase);
regenerateBtnWords.addEventListener('click', generateWordPassphrase);
copyBtnWords.addEventListener('click', () => {
  if (!passwordWords.value) return;
  navigator.clipboard.writeText(passwordWords.value);
  showToast('Passphrase copied!');
});

// ===== Given Letters mode =====
const passwordCustom = document.getElementById('password-custom');
const copyBtnCustom = document.getElementById('copy-btn-custom');
const generateBtnCustom = document.getElementById('generate-btn-custom');
const regenerateBtnCustom = document.getElementById('regenerate-btn-custom');
const allowedLettersEl = document.getElementById('allowed-letters');
const mustIncludeEl = document.getElementById('must-include');
const lengthSliderCustom = document.getElementById('length-slider-custom');
const lengthValueCustom = document.getElementById('length-value-custom');
const avoidDupChk = document.getElementById('avoid-duplicates');
const shuffleResultChk = document.getElementById('shuffle-result');

lengthValueCustom.textContent = lengthSliderCustom.value;
lengthSliderCustom.addEventListener('input', () => {
  lengthValueCustom.textContent = lengthSliderCustom.value;
});

function uniqueChars(str) {
  return Array.from(new Set(str.split(''))).join('');
}

function generateFromGivenLetters() {
  let allowed = (allowedLettersEl.value || '').replace(/\s+/g, '');
  let required = (mustIncludeEl.value || '').replace(/\s+/g, '');

  if (!allowed) {
    showToast('Enter allowed letters/characters');
    return;
  }

  allowed = uniqueChars(allowed);
  required = uniqueChars(required);

  for (const ch of required) {
    if (!allowed.includes(ch)) {
      showToast(`Required char "${ch}" not in allowed set`);
      return;
    }
  }

  const length = parseInt(lengthSliderCustom.value, 10);
  const avoidDup = avoidDupChk.checked;

  if (avoidDup && length > allowed.length) {
    showToast('Length exceeds unique allowed characters');
    return;
  }
  if (required.length > length) {
    showToast('Length is less than number of required characters');
    return;
  }

  let resultArr = required.split('');
  let pool = allowed;
  if (avoidDup) {
    for (const ch of required) pool = pool.replace(ch, '');
  }

  while (resultArr.length < length) {
    if (avoidDup) {
      if (pool.length === 0) break;
      const idx = randInt(pool.length);
      resultArr.push(pool[idx]);
      pool = pool.slice(0, idx) + pool.slice(idx + 1);
    } else {
      resultArr.push(allowed[randInt(allowed.length)]);
    }
  }

  let result = resultArr.join('');
  if (shuffleResultChk.checked) result = shuffle(result);

  passwordCustom.value = result;
  const usedUnique = new Set(result.split('')).size;
  const diversity = usedUnique >= 10 ? 3 : usedUnique >= 5 ? 2 : 1;
  const est = estimateStrength(result.length, diversity);
  setStrength('custom', est);
}

generateBtnCustom.addEventListener('click', generateFromGivenLetters);
regenerateBtnCustom.addEventListener('click', generateFromGivenLetters);
copyBtnCustom.addEventListener('click', () => {
  if (!passwordCustom.value) return;
  navigator.clipboard.writeText(passwordCustom.value);
  showToast('Password copied!');
});

// ===== DB Credentials mode =====
const dbUsername = document.getElementById('db-username');
const copyUsername = document.getElementById('copy-username');
const dbPassword = document.getElementById('db-password');
const copyDbPassword = document.getElementById('copy-db-password');
const generateBtnDb = document.getElementById('generate-btn-db');
const regenerateBtnDb = document.getElementById('regenerate-btn-db');

function generateDbCredentials() {
  // DB Username: Only lowercase letters, 8-12 chars, random shuffle
  const usernameLength = randInt(5) + 8; // 8-12
  let usernamePool = lowercaseChars; // only lowercase, excluding l
  let username = '';
  for (let i = 0; i < usernameLength; i++) {
    username += usernamePool[randInt(usernamePool.length)];
  }
  username = shuffle(username); // unique random arrangement
  dbUsername.value = username;

  // DB Password: >12 chars (13-20), includes symbols/numbers/uppercase, shuffled
  const passwordLength = randInt(8) + 13; // 13-20
  let passwordPools = [uppercaseChars, numberChars, symbolChars, lowercaseChars]; // all types
  let password = passwordPools.map(set => set[randInt(set.length)]).join(''); // ensure one of each
  const allPool = passwordPools.join('');
  for (let i = password.length; i < passwordLength; i++) {
    password += allPool[randInt(allPool.length)];
  }
  password = shuffle(password); // avoid patterns
  dbPassword.value = password;

  // Estimate strength (high due to rules)
  const est = estimateStrength(passwordLength, 4); // 4 types
  setStrength('db', est);
}

generateBtnDb.addEventListener('click', generateDbCredentials);
regenerateBtnDb.addEventListener('click', generateDbCredentials);

copyUsername.addEventListener('click', () => {
  if (!dbUsername.value) return;
  navigator.clipboard.writeText(dbUsername.value);
  showToast('Username copied!');
});

copyDbPassword.addEventListener('click', () => {
  if (!dbPassword.value) return;
  navigator.clipboard.writeText(dbPassword.value);
  showToast('Password copied!');
});
