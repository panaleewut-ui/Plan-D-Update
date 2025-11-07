window.onload = function () {
  const bmr = parseFloat(localStorage.getItem("bmr"));
  const tdee = parseFloat(localStorage.getItem("tdee"));
  const protein = parseFloat(localStorage.getItem("protein"));

  let resultHTML = `
    <p>BMR (พลังงานพื้นฐาน): ${bmr.toFixed(2)} kcal</p>
    <p>TDEE (พลังงานที่ใช้ต่อวัน): ${tdee.toFixed(2)} kcal</p>
    <p>โปรตีนที่ควรได้รับ: ${protein.toFixed(1)} กรัม/วัน</p>
  `;

  const matchPlan = foodPlans.find(plan => {
    return (
      tdee >= plan.energyRange[0] && tdee <= plan.energyRange[1] &&
      protein >= plan.proteinRange[0] && protein <= plan.proteinRange[1]
    );
  });

  if (matchPlan) {
    resultHTML += "<h3>แผนการแลกเปลี่ยนอาหารที่เหมาะสม</h3><table>";
    resultHTML += "<tr><th>หมวดอาหาร</th><th>จำนวนส่วน</th></tr>";
    matchPlan.portions.forEach(item => {
      resultHTML += `<tr><td>${item.type}</td><td>${item.total}</td></tr>`;
    });
    resultHTML += "</table>";
  } else {
    resultHTML += `
      <div class="no-data">
        <p>💬 ระบบยังไม่มีฐานข้อมูลนี้ โปรดติดตามในอนาคต</p>
      </div>
    `;
  }

  document.getElementById("result").innerHTML = resultHTML;
};
