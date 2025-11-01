(() => {
  const exprEl = document.getElementById('expr');
  const resultEl = document.getElementById('result');
  let expr = '0';

  const setExpr = (v) => {
    expr = v;
    exprEl.textContent = expr;
  };

  const isOperator = ch => /[+\-*/]/.test(ch);

  function appendChar(ch){
    if(expr === 'Error' || expr === 'Cannot divide by zero') expr = '0';
    if(expr === '0' && /[0-9.]/.test(ch)) {
      if(ch === '.') { setExpr('0.'); return; }
      setExpr(ch);
      return;
    }

    const last = expr.slice(-1);
    if(isOperator(last) && isOperator(ch)){
      setExpr(expr.slice(0,-1) + ch);
      return;
    }

    if(ch === '.'){
      const lastOpIndex = Math.max(expr.lastIndexOf('+'), expr.lastIndexOf('-'), expr.lastIndexOf('*'), expr.lastIndexOf('/'));
      const currentNum = expr.slice(lastOpIndex + 1);
      if(currentNum.includes('.')) return;
    }

    setExpr(expr + ch);
  }

  function backspace(){
    if(expr === 'Error' || expr === 'Cannot divide by zero') {
      setExpr('0');
      return;
    }
    if(expr.length <= 1) {
      setExpr('0');
      return;
    }
    setExpr(expr.slice(0,-1));
  }

  function clearAll(){
    setExpr('0');
    resultEl.innerHTML = '&nbsp;';
  }

  function sanitizeExpression(s){
    if(!/^[0-9+\-*/().\s]+$/.test(s)) return null;
    if(/^[+\-*/]/.test(s)) return null;
    return s;
  }

  function formatNumber(n){
    if(!isFinite(n)) return null;
    if(Number.isInteger(n)) return String(n);
    return String(Number(n.toFixed(12)).toString());
  }

  function evaluate(){
    const sanitized = sanitizeExpression(expr);
    if(!sanitized){
      setExpr('Error');
      resultEl.textContent = '';
      return;
    }
    try{
      const toEval = sanitized.replace(/÷/g, '/').replace(/×/g, '*');
      const fn = new Function('return (' + toEval + ')');
      const val = fn();
      if(!isFinite(val)){
        setExpr('Cannot divide by zero');
        resultEl.textContent = '';
        return;
      }
      const display = formatNumber(val);
      resultEl.textContent = '';
      setExpr(display);
    } catch(e){
      setExpr('Error');
      resultEl.textContent = '';
    }
  }

  document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.dataset.value;
      const a = btn.dataset.action;
      if(a === 'clear') clearAll();
      else if(a === 'back') backspace();
      else if(a === 'equals') evaluate();
      else if(v) appendChar(v);
    });
  });

  window.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') { e.preventDefault(); evaluate(); return; }
    if(e.key === 'Backspace') { e.preventDefault(); backspace(); return; }
    if(e.key === 'Escape') { e.preventDefault(); clearAll(); return; }
    if(/^[0-9+\-*/().]$/.test(e.key)){
      e.preventDefault();
      appendChar(e.key);
    }
  });

  setExpr(expr);
})();
