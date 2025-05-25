
async function calculate() {
    const expression = document.getElementById('expression').value;
    let result;
    try {
        result = eval(expression);
    } catch {
        alert('Invalid expression');
        return;
    }

    document.getElementById('result').innerText = result;

    await fetch('/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression, result })
    });

    loadHistory();
}

async function loadHistory() {
    const res = await fetch('/history');
    const history = await res.json();
    const list = document.getElementById('history');
    list.innerHTML = '';
    history.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.expression} = ${entry.result}`;
        list.appendChild(li);
    });
}

window.onload = loadHistory;
