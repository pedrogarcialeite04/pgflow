// --- SIMULADOR FINANCEIRO ---
let currentType = 'income';
let transactions = [];
let myChart;

function initChart() {
    const ctx = document.getElementById('demoChart').getContext('2d');
    Chart.defaults.color = '#888';
    Chart.defaults.font.family = 'Montserrat';
    
    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Entradas', 'Saídas'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#00ff9d', '#ff4757'],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } },
            animation: { animateScale: true, animateRotate: true }
        }
    });
}

window.setType = function(type) {
    currentType = type;
    document.querySelectorAll('.t-opt').forEach(el => el.classList.remove('active'));
    if(type === 'income') {
        document.getElementById('btn-inc').classList.add('active');
    } else {
        document.getElementById('btn-exp').classList.add('active');
    }
};

window.addTransaction = function() {
    const desc = document.getElementById('descInput').value;
    const amount = parseFloat(document.getElementById('amountInput').value);
    const cat = document.getElementById('catInput').value;

    if(!desc || isNaN(amount) || amount <= 0) {
        showCustomNotification("Preencha a descrição e um valor válido.", "error");
        return;
    }

    const transaction = { id: Date.now(), desc, amount, category: cat, type: currentType };
    transactions.unshift(transaction);
    updateUI();
    
    showCustomNotification("Registro adicionado com sucesso!", "success");
    document.getElementById('descInput').value = '';
    document.getElementById('amountInput').value = '';
};

window.deleteTransaction = function(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateUI();
    showCustomNotification("Registro removido.", "error");
};

window.editTransaction = function(id) {
    const item = transactions.find(t => t.id === id);
    if(item) {
        document.getElementById('descInput').value = item.desc;
        document.getElementById('amountInput').value = item.amount;
        document.getElementById('catInput').value = item.category;
        window.setType(item.type);
        transactions = transactions.filter(t => t.id !== id);
        updateUI();
        document.getElementById('descInput').focus();
        showCustomNotification("Editando: Finalize e clique em adicionar.", "success");
    }
};

function updateUI() {
    const list = document.getElementById('historyList');
    list.innerHTML = '';
    let inc = 0, exp = 0;

    transactions.forEach(t => {
        if(t.type === 'income') inc += t.amount; else exp += t.amount;
        const div = document.createElement('div');
        div.className = 'tx-row';
        div.innerHTML = `
            <div class="tx-info"><strong>${t.desc}</strong> <span style="color:#666; font-size:0.7rem">(${t.category})</span></div>
            <div class="tx-actions">
                <span class="${t.type === 'income' ? 'inc' : 'exp'}">${t.type==='income' ? '+' : '-'} R$ ${t.amount.toFixed(2)}</span>
                <div class="action-btns"><button onclick="editTransaction(${t.id})" class="act-btn edit"><i class="fa-solid fa-pen"></i></button><button onclick="deleteTransaction(${t.id})" class="act-btn del"><i class="fa-solid fa-trash"></i></button></div>
            </div>`;
        list.appendChild(div);
    });

    document.getElementById('displayIncome').innerText = `R$ ${inc.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    document.getElementById('displayExpense').innerText = `R$ ${exp.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;

    if(myChart) {
        myChart.data.datasets[0].data = [inc, exp];
        if(inc === 0 && exp === 0) {
             myChart.data.datasets[0].backgroundColor = ['#222', '#222'];
        } else {
             myChart.data.datasets[0].backgroundColor = ['#00ff9d', '#ff4757'];
        }
        myChart.update();
    }
}