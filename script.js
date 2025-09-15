document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            tabContents.forEach(c => c.classList.remove('active'));
            document.getElementById(`${btn.dataset.tab}-tab`).classList.add('active');
        });
    });

    // Shared elements
    const toast = document.getElementById('toast');

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }

    // Random Characters Mode
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
    const strengthFillRandom = document.getElementById('strength-fill-random');
    const strengthIndicatorRandom = document.getElementById('strength-indicator-random');

    // Character sets excluding I, l, 0, O, 1, &
    const uppercaseChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijkmnopqrstuvwxyz';
    const numberChars = '23456789';
    const symbolChars = '@#$%^*()_+-=[]{}|;:,./<>?'; // Excludes &

    lengthSliderRandom.addEventListener('input', () => {
        lengthValueRandom.textContent = lengthSliderRandom.value;
    });

    function generateRandomPassword() {
        const length = parseInt(lengthSliderRandom.value);
        let charSet = '';
        let password = '';

        if (uppercaseChk.checked) charSet += uppercaseChars;
        if (lowercaseChk.checked) charSet += lowercaseChars;
        if (numbersChk.checked) charSet += numberChars;
        if (symbolsChk.checked) charSet += symbolChars;

        if (charSet === '') {
            showToast('Select at least one character type');
            return;
        }

        for (let i = 0; i < length; i++) {
            password += charSet.charAt(Math.floor(Math.random() * charSet.length));
        }

        passwordRandom.value = password;
        updateStrength('random', length, charSet.length / 4); // Approximate types by charset diversity
    }

    generateBtnRandom.addEventListener('click', generateRandomPassword);
    regenerateBtnRandom.addEventListener('click', generateRandomPassword);

    copyBtnRandom.addEventListener('click', () => {
        if (passwordRandom.value) {
            navigator.clipboard.writeText(passwordRandom.value);
            showToast('Password copied!');
        }
    });

    // Word-Based Passphrase Mode
    const passwordWords = document.getElementById('password-words');
    const copyBtnWords = document.getElementById('copy-btn-words');
    const generateBtnWords = document.getElementById('generate-btn-words');
    const regenerateBtnWords = document.getElementById('regenerate-btn-words');
    const wordCountSlider = document.getElementById('word-count-slider');
    const wordCountValue = document.getElementById('word-count-value');
    const separatorsChk = document.getElementById('separators');
    const addNumbersChk = document.getElementById('add-numbers');
    const capitalizeChk = document.getElementById('capitalize');
    const strengthFillWords = document.getElementById('strength-fill-words');
    const strengthIndicatorWords = document.getElementById('strength-indicator-words');

    // Sample word list (expandable; based on common Diceware-style words)
    const wordList = [
        'apple', 'banana', 'cherry', 'date', 'elder', 'fig', 'grape', 'honey', 'iris', 'jazz',
        'kiwi', 'lemon', 'mango', 'nectar', 'olive', 'peach', 'quince', 'rasp', 'straw', 'tanger',
        'uva', 'vanilla', 'walnut', 'xylophone', 'yam', 'zest', 'aurora', 'breeze', 'cascade', 'dawn',
        'echo', 'flame', 'galaxy', 'horizon', 'island', 'jungle', 'kale', 'lagoon', 'meadow', 'nebula'
    ];

    wordCountSlider.addEventListener('input', () => {
        wordCountValue.textContent = wordCountSlider.value;
    });

    function generateWordPassphrase() {
        const wordCount = parseInt(wordCountSlider.value);
        let passphrase = [];
        
        for (let i = 0; i < wordCount; i++) {
            let word = wordList[Math.floor(Math.random() * wordList.length)];
            if (capitalizeChk.checked) word = word.charAt(0).toUpperCase() + word.slice(1);
            passphrase.push(word);
        }

        if (separatorsChk.checked) {
            const separators = ['-', '_'];
            passphrase = passphrase.join(separators[Math.floor(Math.random() * separators.length)]);
        } else {
            passphrase = passphrase.join('');
        }

        if (addNumbersChk.checked) {
            const num = Math.floor(Math.random() * 100);
            passphrase += num;
        }

        passwordWords.value = passphrase;
        updateStrength('words', wordCount * 5, wordCount); // Approximate by length and count
    }

    generateBtnWords.addEventListener('click', generateWordPassphrase);
    regenerateBtnWords.addEventListener('click', generateWordPassphrase);

    copyBtnWords.addEventListener('click', () => {
        if (passwordWords.value) {
            navigator.clipboard.writeText(passwordWords.value);
            showToast('Passphrase copied!');
        }
    });

    // Shared strength update function
    function updateStrength(mode, length, diversity) {
        let strength = 'Weak';
        let percent = 0;
        let color = 'red';

        if (length >= 12 && diversity >= 3) {
            strength = 'Strong';
            percent = 100;
            color = 'green';
        } else if (length >= 8 && diversity >= 2) {
            strength = 'Medium';
            percent = 60;
            color = 'orange';
        } else {
            percent = 30;
        }

        const fill = document.getElementById(`strength-fill-${mode}`);
        const indicator = document.getElementById(`strength-indicator-${mode}`);
        
        fill.style.width = `${percent}%`;
        fill.style.backgroundColor = color;
        indicator.textContent = `Strength: ${strength}`;
        indicator.style.color = color;
    }
});
