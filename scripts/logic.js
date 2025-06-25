// Selecting elements from the DOM
const Display = document.getElementById('resultScreen');
const numberButtons = document.querySelectorAll('.numberButtons button');
const actionButtons = document.querySelectorAll('.actionButtons button:not(#result):not(#clear)');
const equalButton = document.getElementById('result');
const clearButton = document.getElementById('clear');

// Variables to store the calculator's state
let currentInput = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

// Update the display with the current input
function updateDisplay() {
    Display.textContent = currentInput;
}

// Handle numeric input
function inputNumber(number) {
    if (waitingForSecondOperand) {
        currentInput = number;
        waitingForSecondOperand = false;
    } else {
        currentInput = currentInput === '0' ? number : currentInput + number;
    }
}

// Handle operator input
function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        currentInput = String(result);
        firstOperand = result;
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
}

// Perform the calculation
function calculate(firstOperand, secondOperand, operator) {
    switch (operator) {
        case '+':
            return firstOperand + secondOperand;
        case '-':
            return firstOperand - secondOperand;
        case '*':
            return firstOperand * secondOperand;
        case '/':
            return secondOperand === 0 ? 'Error' : firstOperand / secondOperand;
        default:
            return secondOperand;
    }
}

// Reset the calculator to its initial state
function resetCalculator() {
    currentInput = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
}

// Add event listeners for number buttons
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        inputNumber(button.textContent);
        updateDisplay();
    });
});

// Add event listeners for operator buttons
actionButtons.forEach(button => {
    button.addEventListener('click', () => {
        handleOperator(button.textContent);
        updateDisplay();
    });
});

// Add event listener for equal button
equalButton.addEventListener('click', () => {
    if (operator === null || waitingForSecondOperand) {
        return;
    }

    const inputValue = parseFloat(currentInput);
    const result = calculate(firstOperand, inputValue, operator);

    currentInput = isNaN(result) ? 'Error' : String(result);
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;

    updateDisplay();
});

// Add event listener for clear button
clearButton.addEventListener('click', () => {
    resetCalculator();
    updateDisplay();
});

// Initialize display
updateDisplay();
