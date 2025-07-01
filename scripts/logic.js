// Select elements from the DOM
const display = document.querySelector('.display');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalButton = document.getElementById('equal');
const clearButton = document.getElementById('clear');

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
        currentInput = value; // Replace the value
        waitingForSecondOperand = false;
    } else {
        // Replace if it's 0, otherwise append
        currentInput = currentInput === '0' ? value : currentInput + value;
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
        currentInput = isNaN(result) ? 'Error' : String(result); // Handle error (e.g. divide by zero)
        currentInput = String(result);  // Show the result
        firstOperand = result;         // Store it for chaining
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

// Keyboard support
window.addEventListener('keydown', (e)=> {
    e.preventDefault(); // Prevent default browser behavior (e.g., form submission)
    
    const key = e.key; // Get the key that was pressed
    
    if (!isNaN(key) || key === '.') {
        // If the key is a number or decimal point, process as number input
        inputNumber (key);
        updateDisplay();
    }

    if (["+", "-", "*", "/"].includes(key)) {
         // If key is a valid operator, process it
        handleOperator(key);
        updateDisplay();
    }

    if (key === '=' || key === 'Enter') {
         // Equal or Enter triggers calculation
        equalButton.click();
    }

    if (key.toLowerCase() === 'c') {
        // Pressing 'c' resets the calculator
        clearButton.click();
    }
});

// Initialize the display with default value
updateDisplay(); // Show "0" at the start