// --- 1. DOM Elements ---
const display = document.getElementById('display');
const history = document.getElementById('history');

// --- 2. State Variables ---
let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetScreen = false;

// --- Click Effect Function (புதியது) ---
function triggerButtonAnimation(btn) {
    if (!btn) return;
    btn.classList.add('btn-clicked');
    setTimeout(() => {
        btn.classList.remove('btn-clicked');
    }, 400);
}

// --- 3. Update Display Function ---
function updateDisplay() {
    if (currentInput.length > 12) {
        display.textContent = parseFloat(currentInput).toExponential(5);
    } else {
        display.textContent = currentInput;
    }
}

// --- 4. Append Number ---
function appendNumber(number) {
    if (shouldResetScreen) {
        currentInput = '';
        shouldResetScreen = false;
    }
    if (number === '.' && currentInput.includes('.')) return;
    if (currentInput === '0' && number !== '.') {
        currentInput = number;
    } else {
        currentInput += number;
    }
    updateDisplay();
}

// --- 5. Append Operator ---
function appendOperator(op) {
    if (operator !== null && !shouldResetScreen) {
        calculateResult();
    }
    previousInput = currentInput;
    operator = op;
    shouldResetScreen = true;
    
    let symbol = op;
    if (op === '*') symbol = '×';
    if (op === '/') symbol = '÷';
    history.textContent = `${previousInput} ${symbol}`;
}

// --- 6. Calculate Result ---
function calculateResult() {
    if (operator === null || shouldResetScreen) return;
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    switch (operator) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '*': result = prev * current; break;
        case '/': 
            if (current === 0) { result = "Error"; } 
            else { result = prev / current; }
            break;
        default: return;
    }
    
    if (result !== "Error") {
        result = Math.round(result * 100000000) / 100000000;
    }
    
    let symbol = operator;
    if (operator === '*') symbol = '×';
    if (operator === '/') symbol = '÷';
    history.textContent = `${previousInput} ${symbol} ${currentInput} =`;
    
    currentInput = result.toString();
    operator = null;
    shouldResetScreen = true;
    updateDisplay();
}

// --- 7. Clear All (AC) ---
function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    shouldResetScreen = false;
    history.textContent = '';
    updateDisplay();
}

// --- 8. Delete Last Character ---
function deleteLast() {
    if (shouldResetScreen) return;
    if (currentInput.length === 1 || currentInput === "Error") {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

// --- 9. Keyboard Support with Animation ---
document.addEventListener('keydown', (e) => {
    let btn = null;
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
        btn = document.querySelector(`button[onclick="appendNumber('${e.key}')"]`);
    }
    if (e.key === '.') {
        appendNumber('.');
        btn = document.querySelector(`button[onclick="appendNumber('.')"]`);
    }
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        appendOperator(e.key);
        btn = document.querySelector(`button[onclick="appendOperator('${e.key}')"]`);
    }
    if (e.key === 'Enter' || e.key === '=') {
        calculateResult();
        btn = document.querySelector(`button[onclick="calculateResult()"]`);
    }
    if (e.key === 'Backspace') {
        deleteLast();
        btn = document.querySelector(`button[onclick="deleteLast()"]`);
    }
    if (e.key === 'Escape') {
        clearAll();
        btn = document.querySelector(`button[onclick="clearAll()"]`);
    }

    // Trigger animation for keyboard presses
    if (btn) triggerButtonAnimation(btn);
});

// Initial Display Update
updateDisplay();