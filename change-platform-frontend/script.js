
// ===============================
// 📦 ÉTAPE 3 : Lire la marque depuis l'URL
// ===============================
const params = new URLSearchParams(window.location.search);
const currentBrand = params.get("brand") || localStorage.getItem("brand") || "bmw";

// Sauvegarder dans localStorage (sécurité)
localStorage.setItem("brand", currentBrand);

console.log("BRAND ACTUEL:", currentBrand);

// ===============================
// 📊 DATA séparée par marque
// Clé unique : "tpmData_mercedes", "tpmData_skoda", etc.
// ===============================
let data = JSON.parse(localStorage.getItem("tpmData_" + currentBrand)) || [];

console.log("DATA:", data);

// ===============================
// 💾 SAVE DATA
// ===============================
function saveData(){
    localStorage.setItem("tpmData_" + currentBrand, JSON.stringify(data));
}

// ===============================
// 🔄 LOAD TABLE
// ===============================
function load(){
    const tbody = document.getElementById("tbody");
    if(!tbody) return;

    tbody.innerHTML = "";

    data.forEach((d, i) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
        <td><input value="${d.master||''}" onchange="edit(${i},'master',this.value)"></td>
        <td><input value="${d.avis||''}" onchange="edit(${i},'avis',this.value)"></td>
        <td><input value="${d.desc||''}" onchange="edit(${i},'desc',this.value)"></td>

        <td>
            <select onchange="edit(${i},'risqueI',this.value)">
                <option ${d.risqueI==='A'?'selected':''}>A</option>
                <option ${d.risqueI==='B'?'selected':''}>B</option>
                <option ${d.risqueI==='C'?'selected':''}>C</option>
            </select>
        </td>

        <td>
            <select onchange="edit(${i},'risqueA',this.value)">
                <option ${d.risqueA==='A'?'selected':''}>A</option>
                <option ${d.risqueA==='B'?'selected':''}>B</option>
                <option ${d.risqueA==='C'?'selected':''}>C</option>
            </select>
        </td>

        <td><input value="${d.raison||''}" onchange="edit(${i},'raison',this.value)"></td>

        <td>${d.statut || "Planifié"}</td>

        <td>
            <select onchange="edit(${i},'bm',this.value)">
                <option ${d.bm==='YES'?'selected':''}>YES</option>
                <option ${d.bm==='NO'?'selected':''}>NO</option>
            </select>
        </td>

        <td><button onclick="deleteRow(${i})">❌</button></td>
        `;

        tbody.appendChild(tr);
    });

    saveData();
    updateChart();
}

// ===============================
// ✏️ EDIT DATA
// ===============================
function edit(i, field, value){
    data[i][field] = value;
    load();
}

// ===============================
// ➕ ADD ROW
// ===============================
function addRow(){
    data.push({
        master: "",
        avis:   "",
        desc:   "",
        risqueI:"C",
        risqueA:"C",
        raison: "",
        statut: "Planifié",
        bm:     "YES"
    });
    load();
}

// ===============================
// ❌ DELETE ROW
// ===============================
function deleteRow(i){
    data.splice(i, 1);
    load();
}

// ===============================
// 💬 CHAT SYSTEM
// ===============================
function openChat(){
    document.getElementById("chat-window").style.display = "block";
}

function closeChat(){
    document.getElementById("chat-window").style.display = "none";
}

function sendChat(){
    const input = document.getElementById("chat-input");
    const box   = document.getElementById("chat-box");

    if(!input.value.trim()) return;

    box.innerHTML += `<div>Moi: ${input.value}</div>`;
    input.value = "";
}

// ===============================
// 📊 CHART RISQUES
// ===============================
let chart;

function updateChart(){
    const a = data.filter(d => d.risqueA === "A").length;
    const b = data.filter(d => d.risqueA === "B").length;
    const c = data.filter(d => d.risqueA === "C").length;

    const ctx = document.getElementById("riskChart");
    if(!ctx) return;

    if(chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["A", "B", "C"],
            datasets: [{
                label: "Risques",
                data:  [a, b, c],
                backgroundColor: ["#2ecc71", "#f39c12", "#e74c3c"]
            }]
        },
        options: { responsive: true }
    });
}
if (!localStorage.getItem("resetDone")) {
    localStorage.clear();
    localStorage.setItem("resetDone", "true");
}

// ===============================
// 🚀 INIT — Afficher la marque + charger données
// ===============================
window.onload = () => {
    // Afficher la marque dans le titre si l'élément existe
    const title = document.getElementById("brandTitle");
    if(title) title.innerText = currentBrand.toUpperCase();

    load();
};

    function openAddTask() {
    let taskName = prompt("Nom de la tâche :");

    if (!taskName) return;

    addTaskToTable(taskName);
}

function addTaskToTable(taskName) {
    const table = document.querySelector("table tbody"); 
    // adapte si ton tableau a un autre selector

    let row = document.createElement("tr");

    // colonne nom tâche
    let tdTask = document.createElement("td");
    tdTask.innerText = taskName;
    tdTask.classList.add("task-name");

    row.appendChild(tdTask);

    // générer les colonnes horaires vides (comme ton planning)
    for (let i = 0; i < 24; i++) {
        let td = document.createElement("td");
        td.classList.add("cell");
        row.appendChild(td);
    }

    table.appendChild(row);
}
const brand = params.get("brand") || localStorage.getItem("brand") || "default";
let brand = params.get("brand");
if (!brand) {
    brand = localStorage.getItem("brand");
    if (brand) { window.location.href = "technique.html?brand=" + brand; }
    else        { window.location.href = "brands.html"; } // retour au début
}