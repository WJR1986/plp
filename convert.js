document.getElementById("convertButton").addEventListener("click", () => {
  const fileInput = document.getElementById("jsonFileInput");
  const outputTextArea = document.getElementById("outputTextArea");
  const downloadButton = document.getElementById("downloadButton");

  if (fileInput.files.length === 0) {
    alert("Please select a JSON file to convert.");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const jsonData = JSON.parse(event.target.result);
      const plainText = convertJsonToPlainText(jsonData);
      outputTextArea.value = plainText;
      downloadButton.style.display = "block";
    } catch (error) {
      alert("Error parsing JSON file. Please ensure it is a valid JSON file.");
      console.error("Error parsing JSON:", error);
    }
  };

  reader.readAsText(file);
});

document.getElementById("downloadButton").addEventListener("click", () => {
  const outputTextArea = document.getElementById("outputTextArea");
  const blob = new Blob([outputTextArea.value], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "converted_text.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
});

function convertJsonToPlainText(jsonData) {
  let plainText = "";

  function processObject(obj, indent = "") {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (Array.isArray(obj[key])) {
          plainText += `${indent}${key}:\n`;
          obj[key].forEach((item, index) => {
            plainText += `${indent}  ${index + 1}. ${item.goal}\n`;
            item.options.forEach((option, optionIndex) => {
              plainText += `${indent}    ${optionIndex + 1}. ${option}\n`;
            });
          });
        } else if (typeof obj[key] === "object") {
          plainText += `${indent}${key}:\n`;
          processObject(obj[key], indent + "  ");
        } else {
          plainText += `${indent}${key}: ${obj[key]}\n`;
        }
      }
    }
  }

  processObject(jsonData);
  return plainText;
}
