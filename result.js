document.getElementById("tdee-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const gender = document.getElementById("gender").value;
  const age = parseFloat(document.getElementById("age").value);
  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value);
  const activity = parseFloat(document.getElementById("activity").value);

  let bmr;
  if (gender === "male") {
    bmr = 66.5 + (13.8 * weight) + (5 * height) - (6.8 * age);
  } else {
    bmr = 655.1 + (9.6 * weight) + (1.9 * height) - (4.7 * age);
  }

  const tdee = bmr * activity;
  const protein = weight * 1.0; // 1.0 g โปรตีน/กก.น้ำหนักตัว

  document.getElementById("result").innerHTML = `
    <p>BMR (พลังงานพื้นฐาน): ${bmr.toFixed(2)} kcal</p>
    <p>TDEE (พลังงานที่ใช้ต่อวัน): ${tdee.toFixed(2)} kcal</p>
    <p>โปรตีนที่ควรได้รับ: ${protein.toFixed(1)} กรัม/วัน</p>
  `;

  
  // ----------------------------
  // หาว่า tdee/protein อยู่ในช่วงแผนไหน
  // ----------------------------
  const matchPlan = foodPlans.find(plan => {
    return (
      tdee >= plan.energyRange[0] && tdee <= plan.energyRange[1] &&
      protein >= plan.proteinRange[0] && protein <= plan.proteinRange[1]
    );
  });

  // ----------------------------
  // แสดงผลตารางแผนอาหาร
  // ----------------------------
  if (matchPlan) {
    let table = "<h3>แผนการแลกเปลี่ยนอาหารที่เหมาะสม</h3><table border='1' style='border-collapse:collapse; width:100%; text-align:center;'>";
    table += "<tr><th>หมวดอาหาร</th><th>จำนวนส่วน</th></tr>";

    matchPlan.portions.forEach(item => {
      table += `<tr><td>${item.type}</td><td>${item.total}</td></tr>`;
    });

    table += "</table>";
    document.getElementById("result").innerHTML += table;
  } else {
    document.getElementById("result").innerHTML +=
      "<p>ไม่พบแผนอาหารที่ตรงกับค่าพลังงานและโปรตีนนี้</p>";
  }
});
