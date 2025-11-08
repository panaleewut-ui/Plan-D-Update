console.log("result.js ทำงานแล้ว");
import { foodPlans } from "./data.js";

window.addEventListener("DOMContentLoaded", () => {
  const goal = localStorage.getItem("goal");
  const tdee = parseFloat(localStorage.getItem("tdee"));
  const protein = parseFloat(localStorage.getItem("protein"));
  
  const resultContainer = document.getElementById("result");
  const toggleButton = document.getElementById("toggleTableView");

  // ตรวจว่ามีข้อมูลไหม
  if (!goal || !tdee || !protein) {
    resultContainer.innerHTML = "<p>ไม่พบข้อมูลการคำนวณ โปรดย้อนกลับไปกรอกใหม่</p>";
    toggleButton.style.display = "none";
    return;
  }

  // หาข้อมูลแผนอาหารที่ตรงกับ tdee และโปรตีน
  const matchPlan = foodPlans.find(plan =>
    tdee >= plan.energyRange[0] &&
    tdee <= plan.energyRange[1] &&
    protein >= plan.proteinRange[0] &&
    protein <= plan.proteinRange[1]
  );

  if (!matchPlan) {
    resultContainer.innerHTML = `
      <p style="color:#666; text-align:center; padding:1rem;">
        ❗ ระบบยังไม่มีฐานข้อมูลนี้ โปรดติดตามในอนาคต
      </p>`;
    toggleButton.style.display = "none";
    return;
  }

  // รวมเนื้อสัตว์+ถั่วให้เป็นหมวดเดียว
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

  groupedPortions = groupedPortions.concat(
    otherGroups.map(p => ({
      ...p,
      meal3: (p.total / 3).toFixed(1),
      meal2: (p.total / 2).toFixed(1)
    }))
  );

  // แสดงผลเบื้องต้น
  resultContainer.innerHTML = `
    <p><strong>เป้าหมายของคุณ:</strong> ${goal}</p>
    <p><strong>พลังงานที่ใช้ต่อวัน (TDEE):</strong> ${tdee.toFixed(2)} kcal</p>
    <div id="tableContainer"></div>
  `;

  const tableContainer = document.getElementById("tableContainer");
  let currentMode = "single"; // เริ่มต้นเป็นแบบตารางเดียว

  const renderTable = () => {
    if (currentMode === "single") {
      // ตารางเดียว (รวม)
      tableContainer.innerHTML = `
        <h3>🍽️ แผนส่วนอาหารของคุณ (รวมทุกหมวด)</h3>
        <table class="styled-table">
          <thead>
            <tr>
              <th>หมวดอาหาร</th>
              <th>รวมทั้งหมด</th>
              <th>เฉลี่ยต่อ 3 มื้อ</th>
              <th>เฉลี่ยต่อ 2 มื้อ</th>
            </tr>
          </thead>
          <tbody>
            ${groupedPortions
              .map(
                item => `
              <tr>
                <td>${item.type}</td>
                <td>${item.total}</td>
                <td>${item.meal3}</td>
                <td>${item.meal2}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      `;
    } else {
      // ตารางแยก (รวมเนื้อสัตว์กับหมวดอื่น)
      const meatTable = groupedPortions.filter(p => p.type.includes("เนื้อสัตว์"));
      const otherTable = groupedPortions.filter(p => !p.type.includes("เนื้อสัตว์"));

      tableContainer.innerHTML = `
        <h3>🥩 หมวดเนื้อสัตว์ (เฉลี่ยต่อมื้อ)</h3>
        <table class="styled-table">
          <thead>
            <tr><th>หมวด</th><th>รวมทั้งหมด</th><th>เฉลี่ย 3 มื้อ</th><th>เฉลี่ย 2 มื้อ</th></tr>
          </thead>
          <tbody>
            ${meatTable.map(item => `
              <tr>
                <td>${item.type}</td>
                <td>${item.total}</td>
                <td>${item.meal3}</td>
                <td>${item.meal2}</td>
              </tr>`).join("")}
          </tbody>
        </table>

        <h3>🥗 หมวดอื่น ๆ</h3>
        <table class="styled-table">
          <thead>
            <tr><th>หมวด</th><th>รวมทั้งหมด</th><th>เฉลี่ย 3 มื้อ</th><th>เฉลี่ย 2 มื้อ</th></tr>
          </thead>
          <tbody>
            ${otherTable.map(item => `
              <tr>
                <td>${item.type}</td>
                <td>${item.total}</td>
                <td>${item.meal3}</td>
                <td>${item.meal2}</td>
              </tr>`).join("")}
          </tbody>
        </table>
      `;
    }
  };

  // แสดงผลตารางแรก
  renderTable();

  // ปุ่มสลับโหมด
  toggleButton.addEventListener("click", () => {
    currentMode = currentMode === "single" ? "split" : "single";
    renderTable();
    toggleButton.textContent = currentMode === "single" ? "🔁 สลับมุมมอง: แยกตาราง" : "🔁 สลับมุมมอง: ตารางเดียว";
  });
});
