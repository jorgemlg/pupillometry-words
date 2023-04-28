function Shuffle(o) {
  for (
    let j, x, i = o.length;
    i;
    j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x
  );
  return o;
}

let elem = document.documentElement;
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera*/
    elem = document.body;
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

function expDuration() {
  const expDurationVal = parseFloat(
    ((rtEstimate * expInfo.numTrials) / 60000).toFixed(2)
  );
  const minutes = Math.trunc(expDurationVal);
  const seconds = Math.ceil((expDurationVal % 1) * 60);
}

function assignExperimentInfo() {
  //record things like the name of the experiment, the browser information, etc.
  [expInfo.prolificPID, expInfo.studyID, expInfo.sessionID] = getProlificInfo();

  //browserInfo
  let browserInfo = getBrowserInfo();
  expInfo.browserName = browserInfo.name;
  expInfo.browserVersion = browserInfo.version;

  //displayInfo
  expInfo.windowHeight = $(window).height();
  expInfo.windowWidth = $(window).width();
  expInfo.screenHeight = screen.height;
  expInfo.screenWidth = screen.width;
  expInfo.allTrialsDuration = new Date().getTime() - startTrialsTime;
  expInfo.studyDuration = new Date().getTime() - startStudyTime;

  //conditions
  expInfo.buttonOrder = buttonOrder;

  //timings
  expInfo.rtEstimate = rtEstimate;

  //experiment
  expInfo.expectedDuration = expDuration();
}

function getProlificInfo() {
  const urlParams = new URLSearchParams(window.location.search);
  const prolificPID = urlParams.get("PROLIFIC_PID") || "prolificPID_NULL";
  const studyID = urlParams.get("STUDY_ID") || "studyID_NULL";
  const sessionID = urlParams.get("SESSION_ID") || "sessionID_NULL";

  return [prolificPID, studyID, sessionID];
}

function getBrowserInfo() {
  const userAgent = navigator.userAgent;
  let browserName = "Unknown";
  let browserVersion = "Unknown";

  // Detect browser name
  if (userAgent.indexOf("Chrome") > -1) {
    browserName = "Google Chrome";
  } else if (userAgent.indexOf("Safari") > -1) {
    browserName = "Apple Safari";
  } else if (userAgent.indexOf("Firefox") > -1) {
    browserName = "Mozilla Firefox";
  } else if (
    userAgent.indexOf("MSIE") > -1 ||
    userAgent.indexOf("Trident/") > -1
  ) {
    browserName = "Microsoft Internet Explorer";
  } else if (userAgent.indexOf("Edge") > -1) {
    browserName = "Microsoft Edge";
  } else if (userAgent.indexOf("Opera") > -1) {
    browserName = "Opera";
  }

  // Detect browser version
  const versionMatch =
    userAgent.match(
      /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
    ) || [];
  const version = versionMatch[2] || "Unknown";

  if (versionMatch[1] === "Trident") {
    const tridentVersion = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
    browserVersion = tridentVersion[1] || "Unknown";
  } else {
    browserVersion = version;
  }

  return {
    name: browserName,
    version: browserVersion,
  };
}
