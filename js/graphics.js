// File header


// ------------------ //
//  HELPER FUNCTIONS  //
// ------------------ //

// Checks an input value to see if it's a valid CSS color
// Parameters: strColor - string representing the color to check
// Returns: true if the string is a valid color, false otherwise
function isValidColor(strColor) {
  var s = new Option().style;
  s.color = strColor;

  // Explicitly check for words that technically count, but shouldn't
  if(strColor == null || strColor == "initial" || strColor == "inherit" || strColor == "unset")
  {
    return false;
  }

  // return 'false' if color wasn't assigned
  return s.color == strColor.toLowerCase();
}

// Capitalizes the first letter of an input string
function capitalizeFirstLetter(string) 
{
  return String(string).charAt(0).toUpperCase() + String(string).slice(1);
}


// ----------- //
//  FUNCTIONS  //
// ----------- //

function displayCutChart(hairType)
{
  // Create string variables for better readability
  var hairCutString = `${hairType}Cut`;
  var hairKeepString = `${hairType}Keep`;
  var titleString = capitalizeFirstLetter(hairType) + " Cut vs. Keep Poll"
  if(GRAPHICS_DEBUG) console.log(hairCutString)

  // Extract the colors and amounts from the global Donation Manager
  var hairCutAmount = donationManager.polls.get(hairCutString);
  var hairKeepAmount = donationManager.polls.get(hairKeepString);

  // Create the pie chart and store it in the corresponding HTML element
  const ctx = document.getElementById(`${hairCutString}Graph`);
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ["Cut", "Keep"],
      datasets: [{
        label: 'Money raised ($)',
        data: [hairCutAmount, hairKeepAmount],
        backgroundColor: ["indianred", "darkseagreen"],
        borderColor: "rgb(34, 34, 34)",
        borderWidth: 2,
        hoverOffset: 20,
        hoverBorderColor: "black"
      }]
    },
    options: {
      radius: "90%",
      plugins: {
        legend: {
          onHover: function (e) {
            e.native.target.style.cursor = "pointer";
          },
          onLeave: function (e) {
            e.native.target.style.cursor = "default";
          },
          display: true,
          labels: {
            color: "black",
            font: {
              size: 16,
              weight: 900
            }
          },
          title: {
            display: true,
            text: titleString,
            color: "black",
            font: {
              size: 20,
              weight: "bold"
            }
          }
        }
      }
    }
  });
}

// Uses Chart.js to create a pie chart representing
// the current votes for hair color.
// Parameters: hairType - string containing which type of hair to check
function displayColorChart(hairType)
{
  // Create string variables for better readability
  var hairColorString = `${hairType}Color`;
  var titleString = capitalizeFirstLetter(hairType) + " Color Poll"

  // Extract the colors and amounts from the global Donation Manager
  var hairColors = Array.from(donationManager.polls.get(hairColorString).keys());
  var hairValues = Array.from(donationManager.polls.get(hairColorString).values());

  // Check which hairColor keys can't be converted to a CSS color
  var chartColors = Array.from(donationManager.polls.get(hairColorString).keys());
  for(i = 0; i < hairValues.length; i++)
  {
    if(!isValidColor(chartColors[i]))
    {
      chartColors[i] = "rgba(0, 0, 0, 0.5)"
    }
  }

  // Create the pie chart and store it in the corresponding HTML element
  const ctx = document.getElementById(`${hairColorString}Graph`);
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: hairColors,
      datasets: [{
        label: 'Money raised ($)',
        data: hairValues,
        backgroundColor: chartColors,
        borderColor: "rgb(34, 34, 34)",
        borderWidth: 2,
        hoverOffset: 20,
        hoverBorderColor: "black"
      }]
    },
    options: {
      radius: "90%",
      plugins: {
        legend: {
          onHover: function (e) {
            e.native.target.style.cursor = "pointer";
          },
          onLeave: function (e) {
            e.native.target.style.cursor = "default";
          },
          display: true,
          labels: {
            color: "black",
            font: {
              size: 12,
              weight: 900
            }
          },
          title: {
            display: true,
            text: titleString,
            color: "black",
            font: {
              size: 20,
              weight: "bold"
            }
          }
        }
      }
    }
  });
}

function displayHairCharts(hairType)
{
  // Create string variables for better readability
  var hairColorString = `${hairType}Color`;
  var hairCutString = `${hairType}Cut`;
  var hairKeepString = `${hairType}Keep`;
  var titleString = capitalizeFirstLetter(hairType) + " Polls"

  // Extract the amounts from the global Donation Manager
  var hairCutAmount = donationManager.polls.get(hairCutString);
  var hairKeepAmount = donationManager.polls.get(hairKeepString);

  // Extract the colors and amounts from the global Donation Manager
  var hairColors = Array.from(donationManager.polls.get(hairColorString).keys());
  var hairValues = Array.from(donationManager.polls.get(hairColorString).values());

  // Check which hairColor keys can't be converted to a CSS color
  var chartColors = Array.from(donationManager.polls.get(hairColorString).keys());
  for(i = 0; i < hairValues.length; i++)
  {
    if(!isValidColor(chartColors[i]))
    {
      chartColors[i] = "rgba(0, 0, 0, 0.5)"
    }
  }

  // Create the pie chart and store it in the corresponding HTML element
  const ctx = document.getElementById(`${hairColorString}Graph`);
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: hairColors,
      datasets: [{
        label: 'Money raised ($)',
        data: [hairCutAmount, hairKeepAmount],
        backgroundColor: ["indianred", "darkseagreen"],
        borderColor: "rgb(34, 34, 34)",
        borderWidth: 2,
        hoverOffset: 20,
        hoverBorderColor: "black"
      },
      {
        label: 'Money raised ($)',
        data: hairValues,
        backgroundColor: chartColors,
        borderColor: "rgb(34, 34, 34)",
        borderWidth: 2,
        hoverOffset: 20,
        hoverBorderColor: "black"
      }]
    },
    options: {
      radius: "90%",
      plugins: {
        legend: {
          onHover: function (e) {
            e.native.target.style.cursor = "pointer";
          },
          onLeave: function (e) {
            e.native.target.style.cursor = "default";
          },
          display: true,
          labels: {
            color: "black",
            font: {
              size: 12,
              weight: 900
            }
          },
          title: {
            display: true,
            text: titleString,
            color: "black",
            font: {
              size: 20,
              weight: "bold"
            }
          }
        }
      }
    }
  });
}
