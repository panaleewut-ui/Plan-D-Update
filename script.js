document.getElementById("tdee-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const gender = document.getElementById("gender").value;
  const age = parseFloat(document.getElementById("age").value);
  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value);
  const activity = parseFloat(document.getElementById("activity").value);
  const goal = document.getElementById("goal").value;

  let bmr;
  if (gender === "male") {
    bmr = 66.5 + (13.8 * weight) + (5 * height) - (6.8 * age);
  } else {
    bmr = 655.1 + (9.6 * weight) + (1.9 * height) - (4.7 * age);
  }

  let tdee = bmr * activity;
  if (goal === "lose") tdee -= 500;
  else if (goal === "gain") tdee += 500;

  const protein = weight * 1.0;

  localStorage.setItem("tdee", tdee);
  localStorage.setItem("bmr", bmr);
  localStorage.setItem("protein", protein);
  localStorage.setItem("goal", goal);

  window.location.href = "result.html";
});
