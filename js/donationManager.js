// Website for browsing & selecting from my vinyl record collection
// This file contains all the functions related to the full Record collection
// Note: relies on MANAGER_DEBUG and TEST_URL variable from the main javascript.js file
//
// Main sheet: https://docs.google.com/spreadsheets/d/1xr7AxVFrFkv1fBzspuMmcXcOBlGwNVRYmdGTj3gkvBQ
// Test sheet: https://docs.google.com/spreadsheets/d/13ooKXitlRdYBmN1CWV8ylQULB_wPFZmnIZONTYyRR8k


// --------------------- //
//  CONSTANTS & GLOBALS  //
// --------------------- //

// TODO: Collection mananger class
// TODO: Store as a dictionary?
const donationManager = buildDonationManager();
var lastCollection = [];


// -------------------- //
//  BUILDING FUNCTIONS  //
// -------------------- //

// Accesses the Google sheet & parses the information into a json object
// Returns: json object representing the full spreadsheet
async function fetchSheetData()
{
  // Declare scraper variables
  const sheetID = "1fIHHGmDPQj8QgfZ3xb5kGuOwyp2A1XIF8oQlH7dF-ks";
  const sheetName = "Donations"
  const mainURL = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?sheet=${sheetName}`;

  const testID = "1EpijaGgCD-AGFlejKhpSs-P9QG1q3g86-2PumGFCRiA"
  const testURL = `https://docs.google.com/spreadsheets/d/${testID}/gviz/tq?sheet=${sheetName}`;

  const URL = (TEST_URL) ? testURL : mainURL;

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
  const recordCollection = [];
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
      donationManager.push(curDonation);
      if (MANAGER_DEBUG) donationToString(curDonation);
    }
  }

  return donationManager;
}


// ---------------------- //
//  PROCESSING FUNCTIONS  //
// ---------------------- //

// Reads the global donation manager,
// and displays it as a table
// Parameters: recordCollection - collection to display as a table
//             showKeywords     - boolean on if the keywords column should be displayed
// TODO: Modify to handle queue table differently
function readCollection(recordCollection, showKeywords)
{
  if (MANAGER_DEBUG) console.log(`Collection size: ${recordCollection.length} | Show Keywords: ${showKeywords}`);
  
  const isQueue = recordCollection === currentQueue;

  // Only display if there are actually records to show
  if(recordCollection.length <= 0 && lastFunction !== "TABLE")
  {
    clearCollection();
    return;
  }

  // Begin building record table
  var outputHTML = beginCollectionTable(showKeywords);

  // Convert each record to HTML and add to output
  for(var i = 0; i < recordCollection.length; i++)
  {
    var curRecord = recordCollection[i];

    if (MANAGER_DEBUG) console.log(`Record #${i+1}:`);
    
    outputHTML += recordToTable(curRecord, showKeywords, isQueue);
  }
  outputHTML += endCollectionTable();

  document.getElementById("htmlCollection").innerHTML = outputHTML;
}

// Clears all HTML from the collection table
function clearCollection()
{
  lastCollection = [];
  document.getElementById("htmlCollection").innerHTML = "";
}
