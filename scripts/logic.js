// Select elements from the DOM
const display = document.querySelector('.display');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalButton = document.getElementById('equal');
const clearButton = document.getElementById('clear');
const percentageButton = document.getElementById('percentage');
const squareRootButton = document.getElementById('squareRoot');
const themeToggle = document.getElementById('themeToggle');

// Variables to store the calculator state
let currentInput = '0';              // Current value shown on display
let firstOperand = null;             // First number of the operation
let operator = null;                 // Current operator (+, -, etc.)
let waitingForSecondOperand = false; // Whether we are waiting for the second number

// Update the display with the current input
function updateDisplay() {
    display.value = currentInput;
}

// Handle number and dot input
function inputNumber(value) {
    if (waitingForSecondOperand) {
        currentInput = value === '.' ? '0.' : value;
        waitingForSecondOperand = false;
        return;
    }

    if (value === '.') {
        if (!currentInput.includes('.')) {
            currentInput += '.';
        }
        return;
    }

    if (currentInput === '0') {
        currentInput = value;
    } else {
        currentInput += value;
    }
}

// Handle operator input
function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (operator && waitingForSecondOperand) {
        operator = nextOperator; // Replace operator
        return;
    }

    if (firstOperand === null) {
        firstOperand = inputValue; // Store the first number
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        currentInput = isNaN(result) ? 'Error' : String(result); // Handle error
        firstOperand = result;
    }

    operator = nextOperator;
    waitingForSecondOperand = true;
}

// Perform the calculation
function calculate(first, second, operator) {
    switch (operator) {
        case '+': return first + second;
        case '-': return first - second;
        case '*': return first * second;
        case '/': return second === 0 ? 'Error' : first / second;
        default: return second;
    }
}

// Reset calculator to its initial state
function resetCalculator() {
    currentInput = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
}

// Add event listeners to number buttons
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        inputNumber(button.textContent);
        updateDisplay();
    });
});

// Add event listeners to operator buttons
operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        handleOperator(button.textContent);
        updateDisplay();
    });
});

// Event listener for equal button
equalButton.addEventListener('click', () => {
    if (operator === null || waitingForSecondOperand) return;

    const inputValue = parseFloat(currentInput);
    const result = calculate(firstOperand, inputValue, operator);

    currentInput = isNaN(result) ? 'Error' : String(result);
    operator = null;
    firstOperand = null;
    waitingForSecondOperand = false;

    updateDisplay();
});

// Event listener for clear button
clearButton.addEventListener('click', () => {
    resetCalculator();
    updateDisplay();
});

// Event listener for percentage button
percentageButton.addEventListener('click', () => {
    const value = parseFloat(currentInput);
    let result;

    if (firstOperand !== null && operator) {
        switch (operator) {
            case '+':
            case '-':
                result = firstOperand * (value / 100);
                break;
            case '*':
                result = value / 100;
                break;
            case '/':
                result = value === 0 ? 'Error' : firstOperand / (value / 100);
                break;
            default:
                result = value / 100;
        }

        currentInput = String(result);
        updateDisplay();
    } else {
        // If no operator has been used yet, just divide by 100
        currentInput = String(value / 100);
        updateDisplay();
    }
});


// Event listener for square root button
squareRootButton.addEventListener('click', () => {
    const value = parseFloat(currentInput);
    currentInput = value < 0 || isNaN(value) ? 'Error' : String(Math.sqrt(value));
    updateDisplay();
});

// Keyboard support
window.addEventListener('keydown', (e) => {
    e.preventDefault();
    const key = e.key;

    if (!isNaN(key) || key === '.') {
        inputNumber(key);
        updateDisplay();
    }

    if (["+", "-", "*", "/"].includes(key)) {
        handleOperator(key);
        updateDisplay();
    }

    if (key === '=' || key === 'Enter') {
        equalButton.click();
    }

    if (key.toLowerCase() === 'c') {
        clearButton.click();
    }

    if (key === '%') {
        percentageButton.click();
    }

    if (key.toLowerCase() === 'r') {
        squareRootButton.click();
    }
});

// Toggle theme mode
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    document.documentElement.classList.toggle('dark');

    themeToggle.textContent = document.body.classList.contains('dark')
        ? '☀️'
        : '🌙';
});

// Initialize the display with default value
updateDisplay();
