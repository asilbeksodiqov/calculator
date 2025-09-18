let currentInput = '0';
let previousInput = null;
let operator = null;
let waitingForOperand = false;
let history = []; // oxirgi 10 ta amal

const display = document.getElementById('display');
const historyDiv = document.getElementById('history');

// Displayni yangilash — operator bilan
function updateDisplay() {
  if (operator && previousInput !== null) {
    display.textContent = `${previousInput} ${operator} ${currentInput}`;
  } else {
    display.textContent = currentInput;
  }
}

// Raqam qo‘shish
function appendNumber(num) {
  if (waitingForOperand) {
    currentInput = num;
    waitingForOperand = false;
  } else {
    currentInput = currentInput === '0' ? num : currentInput + num;
  }
  updateDisplay();
}

function appendOperator(op) {
    if (previousInput === null) {
      previousInput = currentInput;
      currentInput = ''; // ⬅️ BU YERDA O'ZGARTIRILDI: keyingi operand 0 dan boshlanadi
    } else if (!waitingForOperand) {
      calculate(false);
      previousInput = currentInput;
      currentInput = '0'; // ⬅️ BU YERDA O'ZGARTIRILDI
    }
    operator = op;
    waitingForOperand = true;
    updateDisplay();
  }

// Hisoblash + tarixga qo‘shish
function calculate(saveToHistory = true) {
  if (previousInput === null || operator === null) return;

  const prev = parseFloat(previousInput);
  const current = parseFloat(currentInput);
  let result;

  if (isNaN(prev) || isNaN(current)) return;

  switch (operator) {
    case '+': result = prev + current; break;
    case '-': result = prev - current; break;
    case '*': result = prev * current; break;
    case '/': result = prev / current; break;
    default: return;
  }

  const expression = `${previousInput} ${operator} ${currentInput} = ${result}`;
  currentInput = String(result);
  operator = null;
  previousInput = null;
  waitingForOperand = true;

  if (saveToHistory) {
    addToHistory(expression);
  }

  updateDisplay();
}

// Tarixga qo‘shish
function addToHistory(entry) {
  history.unshift(entry); // boshiga qo‘sh
  if (history.length > 10) {
    history.pop(); // 10 tadan oshmasin
  }
  saveHistoryToLocalStorage();
  updateHistoryUI();
}

function updateHistoryUI() {
    // Hozircha hech narsa qilmasin, lekin xato bermasin
    const historyDiv = document.getElementById('history');
    if (historyDiv) {
      // Agar kerak bo'lsa, keyin qayta yoqish oson
      // historyDiv.innerHTML = ...;
    }
  }

// LocalStorage ga saqlash
function saveHistoryToLocalStorage() {
  localStorage.setItem('calcHistory', JSON.stringify(history));
}

// LocalStorage dan yuklash
function loadHistoryFromLocalStorage() {
  const saved = localStorage.getItem('calcHistory');
  if (saved) {
    history = JSON.parse(saved);
    updateHistoryUI();
  }
}

// Tozalash
function clearDisplay() {
  currentInput = '0';
  operator = null;
  previousInput = null;
  waitingForOperand = false;
  updateDisplay();
}

// Belgini o‘chirish
function backspace() {
  if (currentInput.length === 1) {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
  }
  updateDisplay();
}

// Modalni ochish
function showHistoryModal() {
    const modal = document.getElementById('historyModal');
    const list = document.getElementById('modalHistoryList');
    
    if (history.length === 0) {
      list.innerHTML = '<p class="empty-history">No action taken yet</p>';
    } else {
      list.innerHTML = history.map((item, index) => 
        `<div class="modal-history-item">${index + 1}. ${item}</div>`
      ).join('');
    }
  
    modal.style.display = 'flex';
  }
  
  // Modalni yopish
  function closeHistoryModal() {
    document.getElementById('historyModal').style.display = 'none';
  }

  // Contact Modalni ochish
function showContactModal() {
    document.getElementById('contactModal').style.display = 'flex';
  }
  
  // Contact Modalni yopish
  function closeContactModal() {
    document.getElementById('contactModal').style.display = 'none';
  }
  
  // Tarixni tozalash
  function clearHistory() {
    history = [];
    saveHistoryToLocalStorage();
    updateHistoryUI();
    document.getElementById('modalHistoryList').innerHTML = '<p class="empty-history">History was cleared</p>';
  }

// Dastlab tarixni yuklab qo‘yamiz
loadHistoryFromLocalStorage();
updateDisplay();