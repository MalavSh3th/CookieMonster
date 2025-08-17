document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("results");

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    const url = new URL(tab.url);
    const domain = url.hostname;

   
      chrome.cookies.getAll({ domain: domain }, function(cookies) {
      const rows = cookies.map(cookie => {
        const name = cookie.name;
        const isSecure = cookie.secure;
        const risk = isSecure ? "Low" : "High";
        const recommendation = isSecure ? "OK" : "Add Secure flag";
        const dbEntry = cookieDatabase[name];
        const description = dbEntry?.description || guessDescription(name);
        return { name, isSecure, risk, recommendation, description };
      });

      const highRiskCount = rows.filter(c => c.risk === "High").length;
      const total = rows.length;
      const score = total > 0 ? Math.max(0, Math.round(100 - (highRiskCount / total) * 100)) : 100;

      const scoreDiv = document.createElement("div");
      scoreDiv.innerHTML = `
        <h3> Cookie Privacy Score: 
          <span style="color:${score < 60 ? 'red' : score < 80 ? 'orange' : 'green'}">${score}/100</span>
        </h3>
        <p>${highRiskCount} high-risk cookies detected out of ${total}</p>
      `;
      resultsContainer.appendChild(scoreDiv);

      let table = "<table><tr><th>Name</th><th>Secure?</th><th>Risk</th><th>Recommendation</th><th>Description</th><th>Action</th></tr>";
      rows.forEach(c => {
        const riskClass = c.risk === "High" ? "high-risk" : "low-risk";
        table += `<tr class="${riskClass}">
          <td>${c.name}</td>
          <td>${c.isSecure ? "True" : "False"}</td>
          <td>${c.risk}</td>
          <td>${c.recommendation}</td>
          <td>${c.description}</td>
          <td><button class="delete-btn" data-name="${c.name}" data-domain="${domain}">Delete</button></td>
        </tr>`;
      });
      table += "</table>";
      resultsContainer.innerHTML += table;
    });
  });

  function guessDescription(name) {
    const lowered = name.toLowerCase();

    if (lowered.startsWith("__utm")) return "Google Analytics - tracks source/medium ";
    if (lowered === "gclb") return "Google Load Balancer cookie)";
    if (lowered.includes("fbp")) return "Facebook Pixel cookie for advertising ̂";
    if (lowered === "__ar_v4") return "AdRoll retargeting cookie";
    if (lowered.includes("ga")) return "Google Analytics ID cookie ";
    if (lowered.startsWith("rokt")) return "Rokt - personalization or marketing cookie ";
    if (lowered.includes("mibhv")) return "Behavioral tracking or personalization ";
    if (lowered.includes("uid") || lowered.includes("user")) return "Likely user identifier cookie ";
    if (lowered.includes("lid") || lowered.includes("id")) return "Likely stores an internal ID";

  
    if (lowered.includes("session") || lowered.includes("sid") || lowered.includes("sessid") || lowered.includes("phpsessid"))
      return "Likely a session or login cookie (used to maintain user state)";
    if (lowered.includes("auth") || lowered.includes("token") || lowered.includes("access"))
      return "Authentication or access management cookie";
    if (lowered.includes("track") || lowered.includes("analytics") || lowered.includes("stat") || lowered.includes("click"))
      return "Tracking or analytics cookie (used to monitor behavior)";
    if (lowered.includes("ads") || lowered.includes("ad_") || lowered.includes("marketing") || lowered.includes("promo"))
      return "Advertising or marketing-related cookie";
    if (lowered.includes("consent") || lowered.includes("gdpr") || lowered.includes("cookie_consent"))
      return "Consent management cookie (e.g., GDPR compliance)";
    if (lowered.includes("lang") || lowered.includes("locale") || lowered.includes("region"))
      return "Language or regional preference cookie";
    if (lowered.includes("cart") || lowered.includes("basket") || lowered.includes("checkout"))
      return "Shopping cart or transaction cookie";
    if (lowered.includes("pref") || lowered.includes("settings") || lowered.includes("theme"))
      return "Stores user preferences or settings";
    if (lowered.includes("login") || lowered.includes("rememberme") || lowered.includes("user"))
      return "Login state or user identity cookie";
    if (lowered.includes("api") || lowered.includes("client"))
      return "Backend or API-related cookie";
    if (lowered.includes("aws")) return "This cookie is managed by AWS and is used for load balancing.";
    if (name.length <= 6)
      return "Short or encoded name : likely internal or third-party use";

    return "Application Cookies";
  }
});

document.getElementById("download-csv").addEventListener("click", () => {
  const rows = document.querySelectorAll("table tr");
  let csvContent = "";

  rows.forEach(row => {
    const cols = row.querySelectorAll("td, th");
    const rowData = Array.from(cols).map(col => `"${col.textContent.trim()}"`).join(",");
    csvContent += rowData + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "cookie_report.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

document.querySelectorAll(".delete-btn").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.getAttribute("data-name");
    const domain = button.getAttribute("data-domain");
    const fullUrl = `https://${domain}/`;  

    chrome.cookies.remove({ name: name, url: fullUrl }, function(details) {
      if (details) {
        button.closest("tr").remove(); 
      } else {
        alert("Failed to delete cookie: " + name);
      }
    });
  });
});
setTimeout(() => {
  document.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", () => {
      const name = button.getAttribute("data-name");
      const domain = button.getAttribute("data-domain");
      const fullUrl = `https://${domain}/`;  // Must include protocol

      chrome.cookies.remove({ name: name, url: fullUrl }, function(details) {
        if (details) {
          button.closest("tr").remove();
        } else {
          alert(`Failed to delete cookie: ${name}`);
        }
      });
    });
  });
}, 500);
document.getElementById("download-csv").addEventListener("click", async () => {

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = new URL(tab.url);
  const domain = url.hostname;

 
  let csvContent = `Website: ${domain}\n\n`;

  const rows = document.querySelectorAll("table tr");
  rows.forEach(row => {
    const cols = row.querySelectorAll("td, th");
    const rowData = Array.from(cols).map(col => `"${col.textContent.trim()}"`).join(",");
    csvContent += rowData + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv" });
  const urlBlob = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = urlBlob;
  link.download = `cookie_report_${domain}.csv`;
  link.click();
  URL.revokeObjectURL(urlBlob);
});
