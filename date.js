function getCurrentDateFormatted() {
  const today = new Date();
  return today.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
}

const IAGData = {
  IAG: [
    {
      goal: "IAG",
      options: [
        `Personal Learning Plan at HMP Northumberland created on ${getCurrentDateFormatted()}`,
      ],
    },
  ],
};

console.log(IAGData);
