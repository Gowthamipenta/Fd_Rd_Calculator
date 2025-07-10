let activeTab = 'fd';

function switchTab(tab) {
  activeTab = tab;
  document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
  document.querySelector(`.tab:nth-child(${tab === 'fd' ? 1 : 2})`).classList.add('active');
  calculate();
}

document.getElementById('rate').oninput = function () {
  document.getElementById('rateLabel').textContent = this.value;
};

['years', 'months', 'days'].forEach(id => {
  document.getElementById(id).oninput = function () {
    const label = document.getElementById(`${id.slice(0, 3)}Label`);
    label.textContent = `${this.value} ${id.charAt(0).toUpperCase() + id.slice(1)}`;
    calculate();
  };
});

document.getElementById('senior').onchange = calculate;
document.getElementById('amount').oninput = calculate;
document.getElementById('rate').oninput = calculate;

function calculate() {
  const principal = parseFloat(document.getElementById('amount').value) || 0;
  let rate = parseFloat(document.getElementById('rate').value) || 0;
  const years = parseInt(document.getElementById('years').value);
  const months = parseInt(document.getElementById('months').value);
  const days = parseInt(document.getElementById('days').value);
  const isSenior = document.getElementById('senior').checked;

  const timeInYears = years + months / 12 + days / 365;
  if (isSenior) rate += 0.5;

  let maturity = 0;
  let investment = 0;

  if (activeTab === 'fd') {
    investment = principal;
    maturity = principal * Math.pow(1 + rate / 100, timeInYears);
  } else {
    const monthly = principal;
    const n = Math.round(timeInYears * 12);
    investment = monthly * n;
    maturity = monthly * ((Math.pow(1 + rate / 400, n) - 1) / (Math.pow(1 + rate / 400, 1) - 1));
  }

  const profit = maturity - investment;
  const profitPercent = (profit / investment) * 100;

  document.getElementById('result').innerHTML = `
    <strong>Investment:</strong> ₹${investment.toFixed(2)}<br>
    <strong>Maturity:</strong> ₹${maturity.toFixed(2)}<br>
    <strong>Profit:</strong> ₹${profit.toFixed(2)} (${profitPercent.toFixed(2)}%)
  `;
}

calculate();
