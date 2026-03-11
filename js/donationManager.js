// Website for browsing & selecting from my vinyl record collection
// This file contains all the functions related to the full Record collection
// Note: relies on MANAGER_DEBUG and TEST_URL variable from the main javascript.js file
//
// Main sheet: https://docs.google.com/spreadsheets/d/1xr7AxVFrFkv1fBzspuMmcXcOBlGwNVRYmdGTj3gkvBQ
// Test sheet: https://docs.google.com/spreadsheets/d/13ooKXitlRdYBmN1CWV8ylQULB_wPFZmnIZONTYyRR8k


// --------------------- //
//  CONSTANTS & GLOBALS  //
// --------------------- //

// Build donation manager, then displays list of donations
const donationManager = buildDonationManager();
displayDonations();


// ------------------ //
//  HELPER FUNCTIONS  //
// ------------------ //

// Checks if a row is valid to be turned into a donation
// Parameters: row - spreadsheet row to convert to a donation object
// Returns:    true if the row is valid, false otherwise
// 
// Note: assumes the following row format:
//    Donator - Amount - Type - Message
function rowIsValid(row)
{
  // Checks if the donator, amount, and type fields are all filled
  const isValid = ((row[0] !== null) && (row[1] !== null) && (row[2] !== null));

  if (MANAGER_DEBUG && !isValid) console.error("INVALID DONATION");

  return isValid;
}


// -------------------- //
//  CREATION FUNCTIONS  //
// -------------------- //

// Object representing a donation manager
// Parameters: TODO
class DonationManager {
  constructor(donationArray, totalMoney) {
    this.donator = donator;
    this.amount = amount;
    this.type = type;
    this.message = message;
  }
}


// -------------------- //
//  BUILDING FUNCTIONS  //
// -------------------- //

// Accesses the Google sheet & parses the information into a json object
// Returns: json object representing the full spreadsheet
async function fetchSheetData()
{
  // Declare scraper variables
  const sheetID = "1EpijaGgCD-AGFlejKhpSs-P9QG1q3g86-2PumGFCRiA";
  const sheetName = (TEST_SHEET) ? "Test" : "Donations";
  const URL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?sheet=${sheetName}`;

  var sheet = null;

  // Retrieve webpage, then trim it down to just the spreadsheet
  await fetch(URL).then(response => response.text()).then(data => {

    const jsonBody = (data.split("setResponse(")[1]);
    const jsonText = jsonBody.slice(0, jsonBody.length - 2);
    
    sheet = JSON.parse(jsonText);

  }).catch(error => console.log(error));

  if (MANAGER_DEBUG) console.log(sheet);

  return sheet;
}

// Fetches the spreadsheet json, creates donation objects
// for each valid row of the spreadsheet, and stores
// them into the global donation manager.
// Returns: an array representing a donation manager
async function buildDonationManager()
{
  const donationArray = [];
  var sheet = await fetchSheetData();

  // total number of rows to check
  const count = sheet.table.rows.length;

  // Iterate through spreadsheet rows
  for(var i = 0; i < count; i++)
  {
    var curRow = sheet.table.rows[i].c;
    if (MANAGER_DEBUG) console.log(curRow);

    if(rowIsValid(curRow))
    {
      var curDonation = createDonation(curRow);
      donationArray.push(curDonation);
      if (MANAGER_DEBUG) donationToString(curDonation);
    }
  }

  return donationArray;
}


// ---------------------- //
//  PROCESSING FUNCTIONS  //
// ---------------------- //

// Reads the global donation manager, and displays it as a table
// Parameters: donationCollection  - donation list to display as a table
function readDonations(donationCollection)
{
  if (MANAGER_DEBUG) console.log(`Donation amount: ${donationCollection.length}`);

  // Begin building record table
  var outputHTML = beginDonationTable();

  // Convert each donation to HTML and add to output
  for(var i = 0; i < donationCollection.length; i++)
  {
    var curDonation = donationCollection[i];

    if (MANAGER_DEBUG) console.log(`Donation #${i+1}:`);
    
    outputHTML += donationToTable(curDonation);
  }
  outputHTML += endDonationTable();

  document.getElementById("htmlDonationTable").innerHTML = outputHTML;
}

// Displays the donation list as a table
async function displayDonations()
{
  var donationCollection = await donationManager;
  
  readDonations(donationCollection);
}
