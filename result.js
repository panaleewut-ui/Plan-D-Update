import { foodPlans } from "./data.js";

window.addEventListener("DOMContentLoaded", () => {
  const goal = localStorage.getItem("goal");
  const tdee = parseFloat(localStorage.getItem("tdee"));
  const protein = parseFloat(localStorage.getItem("protein"));
  
  const goalResult = document.getElementById("goalResult");
  const tdeeResult = document.getElementById("tdeeResult");
  const foodTable = document.getElementById("foodTable");
  const container = document.getElementById("foodTableContainer");

  // ❗ ตรวจว่ามีข้อมูลหรือไม่
  if (!goal || !tdee || !protein) {
    container.innerHTML = "<p>ไม่พบข้อมูลการคำนวณ โปรดย้อนกลับไปกรอกใหม่</p>";
    return;
  }

  // แสดงค่าเป้าหมายและ TDEE
  goalResult.textContent = `เป้าหมายของคุณ: ${goal}`;
  tdeeResult.textContent = `พลังงานที่ใช้ต่อวัน (TDEE): ${tdee.toFixed(2)} kcal`;

  // 🔍 หาข้อมูลแผนที่ตรง
  const matchPlan = foodPlans.find(plan =>
    tdee >= plan.energyRange[0] &&
    tdee <= plan.energyRange[1] &&
    protein >= plan.proteinRange[0] &&
    protein <= plan.proteinRange[1]
  );

  if (matchPlan) {
    // 🔸 รวมหมวดเนื้อสัตว์และถั่วให้เป็นหมวดเดียว
    const meatGroup = matchPlan.portions.filter(p =>
      p.type.includes("เนื้อสัตว์") || p.type.includes("ถั่ว")
    );

    const otherGroups = matchPlan.portions.filter(p =>
      !p.type.includes("เนื้อสัตว์") && !p.type.includes("ถั่ว")
    );

    let groupedPortions = [];

    if (meatGroup.length > 0) {
      const totalMeat = meatGroup.reduce((sum, p) => sum + p.total, 0);
      groupedPortions.push({
        type: "เนื้อสัตว์ (รวม)",
        total: totalMeat,
        meal3: (totalMeat / 3).toFixed(1),
        meal2: (totalMeat / 2).toFixed(1)
      });
    }

    // เพิ่มหมวดอื่นๆ
    groupedPortions = groupedPortions.concat(
      otherGroups.map(p => ({
        ...p,
        meal3: (p.total / 3).toFixed(1),
        meal2: (p.total / 2).toFixed(1)
      }))
    );

    // ล้างตารางก่อนเพิ่มข้อมูลใหม่
    foodTable.innerHTML = "";

    // เพิ่มข้อมูลลงตาราง
    groupedPortions.forEach(item => {
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
    const table = document.querySelector("table");
    if (table) table.style.display = "none";
  }
});

// ปุ่มย้อนกลับ
function goBack() {
  window.location.href = "index.html";
}
window.goBack = goBack;
