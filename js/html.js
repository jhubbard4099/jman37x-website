// File header

// --------------------- //
//  CONSTANTS & GLOBALS  //
// --------------------- //

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const GOAL_PIXEL_HEIGHT = 500;
const ANIMATION_MULTIPLIER = 1000;

// ----------- //
//  FUNCTIONS  //
// ----------- //

async function init()
{
  // Builds the donation manager, then displays various graphs and charts
  await displayAll();

  // Build the goal donation meter
  buildGoalMeter()

  // console.log(document.getElementsByClassName("jmarathon-goal"));
}

async function buildGoalMeter()
{
  // Display total donation amount
  // var donationTotal = 5000;
  var donationTotal = Math.trunc(donationManager.total);
  document.getElementById("jmarathon-total").textContent = `$${donationTotal}`;

  // Check if each segment can be unlocked, and if so, display it
  var goalSegments = document.getElementsByClassName("jmarathon-goal-segment");
  var prevMaxAmount = 0;
  for(var i = 0; i < goalSegments.length; i++)
  {
    if(HTML_DEBUG) console.log("");
    if(HTML_DEBUG) console.log(`Iteration ${i+1}`);

    // If 75% of current goal increment is met, display the next segment
    var curSegment = goalSegments[i];
    var curMaxAmount = parseInt(curSegment.dataset.max, 10);
    var curUnlockAmount = curMaxAmount * 0.75;

    // Show next segment if unlock goal is met and there's another segment to show
    if(donationTotal >= curUnlockAmount && i != goalSegments.length-1)
    {
      var nextSegment = goalSegments[i+1];
      nextSegment.style += "display: inline; ";
      nextSegment.animate([
        { opacity: 0 }, // Start
        { opacity: 1 }  // End
      ], {
        duration: 1000,
        easing: 'ease-in'
      });
    }

    // If previous segment is complete, begin filling current one
    if(prevMaxAmount < donationTotal)
    {
      // Skip finding height of first segment since it isn't defined yet
      var curMeterHeight = 60;
      if(i != 0)
      {
        curMeterHeight = document.getElementById("jmarathon-meter-fill").style.height;
        curMeterHeight = parseInt(curMeterHeight.replace(/[a-z]/gi, ""));
      }
      if(HTML_DEBUG) console.log(`Current Height = ${curMeterHeight}`);

      // Find % to fill by dividing remains of the donation total by the remains of the maximum
      // TODO: Math slightly off
      var curSegmentPercent = (donationTotal - prevMaxAmount) / (curMaxAmount - prevMaxAmount);
      prevMaxAmount = curMaxAmount;

      if(HTML_DEBUG) console.log(`Segment% = ${curSegmentPercent}`);
      if(HTML_DEBUG) console.log(`Previous Max = ${prevMaxAmount}`);

      // Fill segment fully if amount if exceeded, otherwise fill based on % completed
      var newMeterHeight = curMeterHeight;
      if(donationTotal >= curMaxAmount)
      {
        newMeterHeight += GOAL_PIXEL_HEIGHT;
      }
      else
      {
        newMeterHeight += curSegmentPercent * GOAL_PIXEL_HEIGHT;
      }
      if(HTML_DEBUG) console.log(`New Height = ${newMeterHeight}`);

      // Animate bar filling, wait for completion, then set height
      var animationTime = (i + 1) * ANIMATION_MULTIPLIER;
      document.getElementById("jmarathon-meter-fill").animate(
        [
          {height: `${curMeterHeight}px`},
          {height: `${newMeterHeight}px`}
        ], {
          duration: animationTime,
          easing: 'ease-out'
        }
      );
      await wait(animationTime);
      document.getElementById("jmarathon-meter-fill").style.height = `${newMeterHeight}px`;
    }
  }
}

init();
