document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("disclosureForm");
  const outputArea = document.getElementById("outputArea");
  const generatedLetter = document.getElementById("generatedLetter");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get Form Inputs
    const name = document.getElementById("name").value.trim();
    const address = document.getElementById("address").value.trim(); // Firm/Person Address
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const jobTitle = document.getElementById("jobTitle").value.trim();
    const disclosureType = document.querySelector(
      "input[name='disclosureType']:checked"
    )?.value;
    const disclosureRequirement = document.getElementById(
      "disclosureRequirement"
    ).value;
    const prisonTime = document.getElementById("prisonTime").value.trim();
    const convictions = document.getElementById("convictions").value.trim();
    const work = document.getElementById("work").value.trim();
    const education = document.getElementById("education").value.trim();
    const personalDevelopment = document
      .getElementById("personalDevelopment")
      .value.trim();

    // Validation
    if (
      !name ||
      !address ||
      !jobTitle ||
      !disclosureType ||
      !disclosureRequirement
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // Validate Contact Information (Email or Phone required)
    if (!email && !phone) {
      alert("Please provide at least an email address or phone number.");
      return;
    }

    // Mandatory Crimes Convicted For Field if Full Disclosure Selected
    if (disclosureType === "Full" && !convictions) {
      alert(
        "Please provide the crimes you were convicted for under 'Crimes Convicted For'."
      );
      return;
    }

    // Format Date (UK Format: DD/MM/YYYY)
    const date = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // Generate and Display Letter
    const letterContent = generateLetter({
      name,
      address,
      email,
      phone,
      jobTitle,
      disclosureType,
      disclosureRequirement,
      prisonTime,
      convictions,
      work,
      education,
      personalDevelopment,
      date,
    });

    if (letterContent) {
      generatedLetter.innerHTML = letterContent;
      outputArea.classList.remove("d-none");
      outputArea.scrollIntoView({ behavior: "smooth" });
    }
  });

  /**
   * Generates the letter based on user inputs
   */
  function generateLetter({
    name,
    address,
    email,
    phone,
    jobTitle,
    disclosureType,
    disclosureRequirement,
    prisonTime,
    convictions,
    work,
    education,
    personalDevelopment,
    date,
  }) {
    // Contact Information Section
    const contactInfo = `
              <strong>${name}</strong><br>
              ${address}<br>
              ${email ? `${email}<br>` : ""}
              ${phone ? `${phone}<br>` : ""}
              ${date}<br><br>
          `;

    // Construct the body of the letter based on disclosure requirement and type
    let letterBody = `Dear [Hiring Manager’s Name],<br><br>
              I am writing in response to the <strong>${jobTitle}</strong> position advertised at your company.`;

    // Disclosure Content
    if (disclosureRequirement !== "None") {
      letterBody += `<br><br>As this role requires ${
        disclosureRequirement === "Enhanced" ? "an enhanced" : "a basic"
      } DBS check, I want to be transparent about my past. ${
        disclosureType === "Full"
          ? `I was convicted of <strong>${convictions}</strong> and served <strong>${prisonTime}</strong>.`
          : `I have spent time in prison and would like to focus on the steps I’ve taken to rehabilitate.`
      }`;
    }

    // Flexible sections for Work, Education, and Personal Development
    if (work) {
      letterBody += `<br><br>During my sentence, I undertook work in roles such as: ${work}.`;
    }
    if (education) {
      letterBody += `<br><br>I completed educational programs including: ${education}.`;
    }
    if (personalDevelopment) {
      letterBody += `<br><br>Additionally, I participated in personal development activities like: ${personalDevelopment}.`;
    }

    // Closing statement
    letterBody += `<br><br>I am committed to a positive future and a meaningful contribution to your team.<br><br>
              Kind regards,<br>${name}`;

    // Combine Contact Info and Body
    return `
              <div>${contactInfo}</div>
              <div>${letterBody}</div>
          `;
  }
});
