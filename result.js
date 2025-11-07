import { foodPlans } from "./data.js";

window.addEventListener("DOMContentLoaded", () => {
  const goal = localStorage.getItem("goal");
  const tdee = parseFloat(localStorage.getItem("tdee"));
  const protein = parseFloat(localStorage.getItem("protein"));
  
  const goalResult = document.getElementById("goalResult");
  const tdeeResult = document.getElementById("tdeeResult");
  const foodTable = document.getElementById("foodTable");
  const container = document.getElementById("foodTableContainer");

  if (!goal || !tdee || !protein) {
    container.innerHTML = "<p>ไม่พบข้อมูลการคำนวณ โปรดย้อนกลับไปกรอกใหม่</p>";
    return;
  }

  goalResult.textContent = `เป้าหมายของคุณ: ${goal}`;
  tdeeResult.textContent = `พลังงานที่ใช้ต่อวัน (TDEE): ${tdee.toFixed(2)} kcal`;

  const matchPlan = foodPlans.find(plan =>
    tdee >= plan.energyRange[0] &&
    tdee <= plan.energyRange[1] &&
    protein >= plan.proteinRange[0] &&
    protein <= plan.proteinRange[1]
  );

  if (matchPlan) {
    matchPlan.portions.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.type}</td>
        <td>${item.total}</td>
        <td>${item.meal3}</td>
        <td>${item.meal2}</td>
      `;
      foodTable.appendChild(row);
    });
  } else {
    container.innerHTML = `
      <p style="color:#666; text-align:center; padding:1rem;">
        ❗ ระบบยังไม่มีฐานข้อมูลนี้ โปรดติดตามในอนาคต
      </p>
    `;
    document.querySelector("table").style.display = "none";
  }
});

function goBack() {
  window.location.href = "index.html";
}
window.goBack = goBack;
