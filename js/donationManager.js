// Website for browsing & selecting from my vinyl record collection
// This file contains all the functions related to the full Record collection
// Note: relies on MANAGER_DEBUG and TEST_URL variable from the main javascript.js file
//
// Main sheet: https://docs.google.com/spreadsheets/d/1xr7AxVFrFkv1fBzspuMmcXcOBlGwNVRYmdGTj3gkvBQ
// Test sheet: https://docs.google.com/spreadsheets/d/13ooKXitlRdYBmN1CWV8ylQULB_wPFZmnIZONTYyRR8k


// -------------------- //
//  MANAGER FUNCTIONS  //
// -------------------- //

// Object representing a donation manager
class DonationManager {
  constructor() {
    // Float representing the total donation amount
    this.total = 0;

    // Float(?) representing how much time remains of the stream
    this.time = 0;

    // Array containing all donations
    this.list = [];

    // Map containing all donators and their total donation amounts
    this.leaderboard = new Map();

    // Map containing the current poll results
    this.polls = new Map();
    this.polls.set("hairCut", 0);
    this.polls.set("beardCut", 0);
    this.polls.set("hairKeep", 0);
    this.polls.set("beardKeep", 0);
    this.polls.set("hairColor", new Map());
    this.polls.set("beardColor", new Map());
  }
}

// Create donation manager, populate it, then displays list of donations
const donationManager = new DonationManager();


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

// Checks if a key is present in a given map.
// If so, increase its value by the input. 
// If not, insert that key/value pair
// Parameters: map - Map to increase/insert value into
//             key - key which is being searched for
//             value - numeric value to increase by
// 
// Note: assumes the map has global visibility (does not return anything)
function increaseOrInsertMap(map, key, value)
{
  if(map.has(key))
  {
    var oldValue = map.get(key)
    map.set(key, oldValue + value)
  }
  else
  {
    map.set(key, value)
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
// for each valid row of the spreadsheet, and updates all
// necessary fields in the global DonationManager
async function buildDonationManager()
{
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
      // Build donation object
      var curDonation = createDonation(curRow);
      if (MANAGER_DEBUG) donationToString(curDonation);

      // Extract some info we'll need
      var curDonator = curDonation.donator;
      var curAmount = curDonation.amount

      // Update non-Map properties
      donationManager.total += curAmount;
      donationManager.time += curAmount; // TODO
      donationManager.list.push(curDonation);

      // Update leaderboard Map
      increaseOrInsertMap(donationManager.leaderboard, curDonator, curAmount)

      // Update poll Map (and sub-Maps)
      updatePollMaps(curDonation);
    }
  }

  // Round total to nearest cent
  donationManager.total = donationManager.total.toFixed(2);

  // Sort the Maps from largest to smallest values
  donationManager.leaderboard = new Map([...donationManager.leaderboard.entries()].sort((a, b) => b[1] - a[1]));
  donationManager.polls.set("hairColor", new Map([...donationManager.polls.get("hairColor").entries()].sort((a, b) => b[1] - a[1])));
  donationManager.polls.set("beardColor", new Map([...donationManager.polls.get("beardColor").entries()].sort((a, b) => b[1] - a[1])));
}

// Updates the global DonationManager poll Map, including sub-Maps.
// This includes increasing the numeric values of hairCut, beardCut, hairKeep, beardKeep,
// as well as adding the hairColor to its respective sub-Map if necessary/increasing its value
// Parameters: donation - current donation to add to the hair/beard polls
function updatePollMaps(donation)
{
  var hairType = `${donation.hairType}`
  var tempAmount = 0;

  // Early return if no hair type specified
  if(hairType == "")
  {
    return;
  }

  // Update corresponding cut/keep value
  if(donation.hairLength == "shorter")
  {
    tempAmount = donationManager.polls.get(`${hairType}Cut`);
    donationManager.polls.set(`${hairType}Cut`, tempAmount + donation.amount);
  }
  if(donation.hairLength == "longer")
  {
    tempAmount = donationManager.polls.get(`${hairType}Keep`);
    donationManager.polls.set(`${hairType}Keep`, tempAmount + donation.amount);
  }

  // If a color is present, store it directly into the color map.
  // If not, manually check the message in case they forgot the special formatting
  if(donation.hairColor != "" && donation.hairColor != null)
  {
    increaseOrInsertMap(donationManager.polls.get(`${hairType}Color`), donation.hairColor, donation.amount)
  }
  else
  {
    var messageArray = donation.message.split(" ");
    for(i = 0; i < messageArray.length; i++)
    {
      // Check each word of the message, and break if there is ever a hit
      curWord = messageArray[i];
      if(isValidColor(curWord))
      {
        increaseOrInsertMap(donationManager.polls.get(`${hairType}Color`), curWord, donation.amount)
        break;
      }
    }
  }
}


// ---------------------- //
//  PROCESSING FUNCTIONS  //
// ---------------------- //

// Reads the global donation manager list, 
// and displays it as a table
function displayDonations()
{
  if (MANAGER_DEBUG) console.log(`Donation amount: ${donationManager.list.length}`);

  // Begin building record table
  var outputHTML = beginDonationTable();

  // Convert each donation to HTML and add to output
  for(var i = 0; i < donationManager.list.length; i++)
  {
    var curDonation = donationManager.list[i];

    if (MANAGER_DEBUG && DONATION_DEBUG) console.log(`Donation #${i+1}:`);
    
    outputHTML += donationToTable(curDonation);
  }
  outputHTML += endTable();

  document.getElementById("htmlDonationTable").innerHTML = outputHTML;
}

// Reads the global donation manager leaderboard, 
// and displays it as a table
function displayLeaderboard()
{
  if (MANAGER_DEBUG) console.log(`Leaderboard amount: ${donationManager.leaderboard.size}`);

  // Begin building record table
  var outputHTML = beginLeaderboardTable();

  // Convert each leaderboard entry to HTML and add to output
  var leaderboardKeys = Array.from(donationManager.leaderboard.keys());
  for(var i = 0; i < donationManager.leaderboard.size; i++)
  {
    var curLeaderboardKey = leaderboardKeys[i];
    var curLeaderboardValue = donationManager.leaderboard.get(curLeaderboardKey);

    if (MANAGER_DEBUG && DONATION_DEBUG) console.log(`Leaderboard #${i+1}:`);
    
    outputHTML += leaderboardToTable(i+1, curLeaderboardKey, curLeaderboardValue);
  }
  outputHTML += endTable();

  document.getElementById("htmlLeaderboardTable").innerHTML = outputHTML;
}

// Displays the donation list as a table
async function displayAll()
{
  await buildDonationManager();
  
  displayDonations();
  displayLeaderboard();
  displayColorChart("hair");
  displayColorChart("beard");
  displayCutChart("hair");
  displayCutChart("beard");
  // displayHairCharts("hair");

  if(MANAGER_DEBUG)
  {
    console.log(`Total: ${donationManager.total}`);
    console.log(`Time: ${donationManager.time}`);
    console.log("List: ");
    console.log(donationManager.list);
    console.log("Leaderboard: ");
    console.log(donationManager.leaderboard);
    console.log("Polls: ");
    console.log(donationManager.polls);
  }
}
