// Basic calculator logic with keyboard support and input validation
const displayExpr = document.getElementById('display-expression');
const displayValue = document.getElementById('display-value');
let expr = '';

function update() {
  // Show the typed expression above and a preview/actual result below
  displayExpr.textContent = expr;
  if (!expr) {
    displayValue.textContent = '0';
    return;
  }

  // Validate characters; show 'Error' for invalid chars
  if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
    displayValue.textContent = 'Error';
    return;
  }

  try {
    const result = Function('"use strict"; return (' + expr + ')')();
    displayValue.textContent = Number.isFinite(result) ? String(result) : 'Error';
  } catch (e) {
    // While typing an incomplete expression, show the expression itself as the value
    displayValue.textContent = expr;
  }
}

function clearAll() {
  expr = '';
  update();
}

function deleteLast() {
  expr = expr.slice(0, -1);
  update();
}

function append(value) {
  // Prevent two operators in a row (but allow minus after operator for negative numbers)
  const last = expr.slice(-1);
  const operators = '+-*/';
  if (operators.includes(value)) {
    if (!expr && value !== '-') return; // can't start with operator except minus
    if (operators.includes(last)) {
      // replace previous operator
      expr = expr.slice(0, -1) + value;
      update(); return;
    }
  }

  // Prevent multiple decimals in the same number part
  if (value === '.') {
    const parts = expr.split(/[\+\-\*\/\(\)]/);
    const lastPart = parts[parts.length - 1];
    if (lastPart.includes('.')) return;
    if (last === '' || operators.includes(last) || last === '(') value = '0.'; // start 0.
  }

  expr += value;
  update();
}

function evaluateExpression() {
  if (!expr) return;
  // Validate allowed characters only
  if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
    displayValue.textContent = 'Error';
    return;
  }
  try {
    // Use Function to evaluate in a safer local scope
    const result = Function('"use strict"; return (' + expr + ')')();
    if (!Number.isFinite(result)) {
      expr = '';
      displayValue.textContent = 'Error';
    } else {
      expr = String(result);
      update();
    }
  } catch (e) {
    displayValue.textContent = 'Error';
  }
}

// Button clicks
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const v = btn.dataset.value;
    const action = btn.dataset.action;
    if (action === 'clear') clearAll();
    else if (action === 'delete') deleteLast();
    else if (action === 'equals') evaluateExpression();
    else if (v) append(v);
  });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  const key = e.key;
  if (key >= '0' && key <= '9') append(key);
  else if ('+-*/().'.includes(key)) append(key);
  else if (key === 'Enter' || key === '=') evaluateExpression();
  else if (key === 'Backspace') deleteLast();
  else if (key === 'Escape') clearAll();
});