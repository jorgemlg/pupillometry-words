/// Initialize variables

let expInfo = {
  expName: "", // long descriptive name
  expCode: "", // short name code provided on Prolific
  prolificExpId: "", //add Prolific ID
};
let urlProlific =
  "https://app.prolific.co/submissions/complete?cc=" + expInfo.prolificExpId;

let words = [];
let ratings = [];
let rts = [];
let currentWordIndex = 0;
let practiceWords = ["white", "night", "day", "duck", "black"];
const buttonOrder = Math.round(Math.random()); //random 0/1 button order assignment

let finalCountDownClock = 5;
let redirectTimer;
let rtEstimate = 2000;
let startTrialsTime;

///
///

$(document).ready(function () {
  startStudyTime = new Date().getTime();
  const words = loadCSV();
  // warn subjects before closing tab
  window.onbeforeunload = function (e) {
    e = e || window.event;
  };
});

async function loadCSV() {
  const word = await fetch("words.csv");
  const data = await word.text();
  words = data.split(/\r?\n|\r/).filter((word) => word !== "");
  Shuffle(words);
  words = [...practiceWords, ...words];
  expInfo.numTrials = words.length;
  return words;
}

function startPractice() {
  $("#instructions").hide();
  $("#experiment").show();
  $("#buttonOrder" + buttonOrder).show();
  $("#buttonAnimalDiv").show();
  startTrial = displayWord(currentWordIndex);
}

function startExperiment() {
  startTrialsTime = new Date().getTime();
  $("#practice").hide();
  $("#experiment").show();
  $(".Progress").show();
  $("#buttonOrder" + buttonOrder).show();
  $("#buttonAnimalDiv").show();
  startTrial = displayWord(currentWordIndex++);
}

function displayWord(index) {
  let startTrial = new Date().getTime();
  $("#progressBar").css(
    "width",
    Math.ceil(
      ((currentWordIndex - practiceWords.length) /
        (words.length - practiceWords.length)) *
        100
    ) + "px"
  );
  $("#currentWord").text(words[index]);

  return startTrial;
}

function nextWord(response) {
  let reactionTime = new Date().getTime() - startTrial;
  rts.push(reactionTime);
  ratings.push(response);
  if (currentWordIndex == practiceWords.length - 1) {
    $("#experiment").hide();
    $("#practice").show();
    currentWordIndex++;
  } else if (currentWordIndex < words.length - 1) {
    currentWordIndex++;
    startTrial = displayWord(currentWordIndex);
  } else {
    demographics();
  }
}

function demographics() {
  $("#experiment").hide();
  // write code to collect demographics info
  finalQuestionnaire();
}
function finalQuestionnaire() {
  $("#demographics").hide();
  // write code to collect final questions
  assignExperimentInfo();
  debrief();
}

function debrief() {
  // show debriefing info and resend to prolific
  submit();
}

function submit() {
  let expData = [[words, ratings, rts], expInfo];

  setTimeout(function () {
    // wait to save to prevent losing data
    $.post("log_trials_prolific.py", {
      prolificPID: expInfo.prolificPID,
      studyID: expInfo.studyID,
      sessionID: expInfo.sessionID,
      expData: JSON.stringify(expData),
    });
  }, 100);

  $("#urlProlific").text(urlProlific);
  $("#doneText").hide();
  $("#submitPage").show();
  window.onbeforeunload = null;
  let redirectTimer = setInterval(finalCountDown, 1000);

  return redirectTimer;
}

function finalCountDown() {
  finalCountDownClock--;

  if (finalCountDownClock < 0) {
    clearInterval(redirectTimer);
    window.location = urlProlific;
  } else {
    $("#finalCountDown").text(finalCountDownClock.toString());
  }
}
