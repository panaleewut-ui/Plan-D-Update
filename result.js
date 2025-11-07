function goHome() {
  window.location.href = "index.html";
}

window.onload = function () {
  const tdee = parseFloat(localStorage.getItem("tdee")) || 0;
  const bmr = parseFloat(localStorage.getItem("bmr")) || 0;
  const protein = parseFloat(localStorage.getItem("protein")) || 0;
  const goal = localStorage.getItem("goal") || "maintain";

  const goalText =
    goal === "lose" ? "ลดน้ำหนัก"
    : goal === "gain" ? "เพิ่มน้ำหนัก"
    : "คงน้ำหนัก";

  document.getElementById("goalResult").textContent = `เป้าหมาย: ${goalText}`;
  document.getElementById("bmrResult").textContent = `BMR (พลังงานพื้นฐาน): ${bmr.toFixed(2)} kcal`;
  document.getElementById("tdeeResult").textContent = `TDEE (พลังงานที่ใช้ต่อวัน): ${tdee.toFixed(2)} kcal`;
  document.getElementById("proteinResult").textContent = `โปรตีนที่ควรได้รับ: ${protein.toFixed(1)} กรัม/วัน`;

  // ถ้ามี data.js
  if (typeof foodPlans !== "undefined") {
    const plan = foodPlans.find(p => tdee >= p.energyRange[0] && tdee <= p.energyRange[1]);
    const tbody = document.querySelector("#foodTable tbody");

    if (plan) {
      document.getElementById("foodTable").classList.remove("hidden");
      plan.portions.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.type}</td>
          <td>${item.total}</td>
          <td>${(item.total / 3).toFixed(1)}</td>
          <td>${(item.total / 2).toFixed(1)}</td>
        `;
        tbody.appendChild(row);
      });
    } else {
      document.getElementById("noData").classList.remove("hidden");
      document.getElementById("noData").textContent =
        "⚠️ ระบบยังไม่มีฐานข้อมูลนี้ โปรดติดตามในอนาคต";
    }
  } else {
    document.getElementById("noData").classList.remove("hidden");
    document.getElementById("noData").textContent =
      "⚠️ ระบบยังไม่มีฐานข้อมูลนี้ โปรดติดตามในอนาคต";
  }
};
