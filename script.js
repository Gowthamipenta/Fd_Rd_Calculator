let activeTab = 'fd';

function switchTab(tab) {
  activeTab = tab;
  document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
  document.querySelector(`.tab:nth-child(${tab === 'fd' ? 1 : 2})`).classList.add('active');
  calculate();
}

function updateTenureLabel() {
  const months = parseInt(document.getElementById('tenure').value);
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  const label = `${months} Month${months > 1 ? 's' : ''} (${years} Year${years !== 1 ? 's' : ''}${remMonths > 0 ? ` ${remMonths} Month${remMonths > 1 ? 's' : ''}` : ''})`;
  document.getElementById('tenureLabel').textContent = label;
}

function calculate() {
  updateTenureLabel();
  const principal = parseFloat(document.getElementById('amount').value) || 0;
  let rate = parseFloat(document.getElementById('rate').value) || 0;
  const tenureMonths = parseInt(document.getElementById('tenure').value);
  const isSenior = document.getElementById('senior').checked;

  const timeInYears = tenureMonths / 12;
  if (isSenior) rate += 0.5;

  let maturity = 0;
  let investment = 0;

  if (activeTab === 'fd') {
    investment = principal;
    maturity = principal * Math.pow(1 + rate / 100, timeInYears);
  } else {
    const monthly = principal;
    const n = tenureMonths;
    investment = monthly * n;
    maturity = monthly * ((Math.pow(1 + rate / 400, n) - 1) / (Math.pow(1 + rate / 400, 1) - 1));
  }

  const interestEarned = maturity - investment;
  const interestEarnedPercent = (interestEarned / investment) * 100;

  document.getElementById('result').innerHTML = `
    <strong>Investment:</strong> ₹${investment.toFixed(2)}<br>
    <strong>Maturity:</strong> ₹${maturity.toFixed(2)}<br>
    <strong>Interest Earned:</strong> ₹${interestEarned.toFixed(2)} (${interestEarnedPercent.toFixed(2)}%)
  `;
}

['amount', 'rate', 'tenure'].forEach(id => {
  document.getElementById(id).addEventListener('input', calculate);
});
document.getElementById('senior').addEventListener('change', calculate);

calculate();
