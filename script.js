// External JS for the calculator
// Features: + - × ÷, decimals, clear, backspace, equals, keyboard support

(() => {
  const display = document.getElementById('display');
  const buttons = document.querySelectorAll('.btn');

  const setDisplay = (text) => {
    display.textContent = String(text).slice(0, 100); // limit length
  };

  const getDisplay = () => display.textContent.trim();

  const append = (ch) => {
    let cur = getDisplay();
    if (cur === '0' && ch !== '.') cur = '';
    setDisplay(cur + ch);
  };

  const backspace = () => {
    let cur = getDisplay();
    if (cur.length <= 1) setDisplay('0');
    else setDisplay(cur.slice(0, -1));
  };

  const clearAll = () => setDisplay('0');

  // Safely evaluate an arithmetic expression containing digits, parentheses, decimal points and + - * / characters
  const safeEvaluate = (expr) => {
    // replace user-facing symbols with JS operators
    expr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
    // basic validation: allow digits, operators, parentheses, decimal point and spaces
    if (!/^[0-9+\-*/().\s]+$/.test(expr)) throw new Error('Invalid characters');
    // avoid successive operators like "**" or "//"
    if (/[*\/]{2,}/.test(expr)) throw new Error('Invalid operator sequence');

    // Use Function to evaluate (safer than eval in this context after validation)
    // Limit the precision of the result
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${expr})`)();
    if (!isFinite(result)) throw new Error('Math error');
    // round small floating errors
    return Math.round((result + Number.EPSILON) * 1e12) / 1e12;
  };

  const calculate = () => {
    try {
      const expr = getDisplay();
      const res = safeEvaluate(expr);
      setDisplay(res);
    } catch (err) {
      setDisplay('Error');
      setTimeout(clearAll, 900);
    }
  };

  // Button clicks
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-value');
      const act = btn.getAttribute('data-action');

      if (act === 'clear') return clearAll();
      if (act === 'back') return backspace();
      if (act === 'equals') return calculate();

      if (val) {
        // prevent multiple decimals within the same number
        if (val === '.') {
          const cur = getDisplay();
          // find last operator index
          const lastOp = Math.max(
            cur.lastIndexOf('+'),
            cur.lastIndexOf('-'),
            cur.lastIndexOf('×'),
            cur.lastIndexOf('÷'),
            cur.lastIndexOf('*'),
            cur.lastIndexOf('/')
          );
          const lastNumber = cur.slice(lastOp + 1);
          if (lastNumber.includes('.')) return;
        }
        append(val);
      }
    });
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') { append(e.key); e.preventDefault(); return; }
    if (e.key === '.') { append('.'); e.preventDefault(); return; }
    if (e.key === 'Enter' || e.key === '=') { calculate(); e.preventDefault(); return; }
    if (e.key === 'Backspace') { backspace(); e.preventDefault(); return; }
    if (e.key === 'Escape') { clearAll(); e.preventDefault(); return; }

    const map = {'/':'÷','*':'×','-':'−','+':'+'};
    if (map[e.key]) { append(map[e.key]); e.preventDefault(); return; }
  });

  // Initialize
  clearAll();
})();