document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const copyBtn = document.getElementById('copy-btn');
    const generateBtn = document.getElementById('generate-btn');
    const lengthSlider = document.getElementById('length-slider');
    const lengthValue = document.getElementById('length-value');
    const uppercaseChk = document.getElementById('uppercase');
    const lowercaseChk = document.getElementById('lowercase');
    const numbersChk = document.getElementById('numbers');
    const symbolsChk = document.getElementById('symbols');
    const strengthIndicator = document.getElementById('strength-indicator');

    // Character sets excluding I, l, 0, O, 1, &
    const uppercaseChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijkmnopqrstuvwxyz';
    const numberChars = '23456789';
    const symbolChars = '@#$%^*()_+-=[]{}|;:,./<>?'; // Excludes &

    lengthSlider.addEventListener('input', () => {
        lengthValue.textContent = lengthSlider.value;
    });

    generateBtn.addEventListener('click', () => {
        const length = parseInt(lengthSlider.value);
        let charSet = '';
        let password = '';

        if (uppercaseChk.checked) charSet += uppercaseChars;
        if (lowercaseChk.checked) charSet += lowercaseChars;
        if (numbersChk.checked) charSet += numberChars;
        if (symbolsChk.checked) charSet += symbolChars;

        if (charSet === '') {
            alert('Please select at least one character type.');
            return;
        }

        for (let i = 0; i < length; i++) {
            password += charSet.charAt(Math.floor(Math.random() * charSet.length));
        }

        passwordInput.value = password;
        updateStrength(length, charSet);
    });

    copyBtn.addEventListener('click', () => {
        if (passwordInput.value) {
            navigator.clipboard.writeText(passwordInput.value);
            alert('Password copied to clipboard!');
        }
    });

    function updateStrength(length, charSet) {
        let strength = 'Weak';
        let types = 0;
        if (uppercaseChk.checked) types++;
        if (lowercaseChk.checked) types++;
        if (numbersChk.checked) types++;
        if (symbolsChk.checked) types++;

        if (length >= 12 && types >= 3) strength = 'Strong';
        else if (length >= 8 && types >= 2) strength = 'Medium';

        strengthIndicator.textContent = `Strength: ${strength}`;
        strengthIndicator.style.color = strength === 'Strong' ? 'green' : strength === 'Medium' ? 'orange' : 'red';
    }
});
