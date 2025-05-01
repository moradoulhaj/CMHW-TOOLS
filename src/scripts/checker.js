export const checkLogs = (profiles, logs) => {
  const profilesArr = profiles.split("\n");
  const logsArr = logs.split("\n");

  let notLogsProfiles = [];
  let connectedProfiles = [];
  let proxyDownProfiles = [];
  let maxExecutionTimeProfiles = [];
  let accountRestrictedProfiles = [];
  let captchaVerificationProfiles = [];
  let wrongPasswordProfiles = [];
  let phoneNumberProfiles = [];
  let unusualActivityProfiles = [];
  let accountDisabledProfiles = [];
  let othersProfiles = [];
  let othersLogs = [];

  let wrongBrowserProfiles = [];
  let wrongRecoveryProfiles = [];
  let disconnectedProfiles = [];

  logsArr.forEach((log, i) => {
    log = log.toLowerCase();

    if (log === "") {
      notLogsProfiles.push(profilesArr[i]);
    } else if (log === "matched" || log.includes("active")) {
      connectedProfiles.push(profilesArr[i]);
    } else if (log.includes("proxy down") || log.includes("proxy problem")) {
      proxyDownProfiles.push(profilesArr[i]);
    } else if (
      log.includes("account_disabled_check")
    ) {
      accountDisabledProfiles.push(profilesArr[i]);
    } else if (
      log.includes("captcha verification") ||
      log.includes("captcha_verification") ||
      log.includes("captcha_text") ||
      log.includes("device verification")
    ) {
      captchaVerificationProfiles.push(profilesArr[i]);
    } else if (
      log.includes("recovery verification") ||
      log.includes("wrong_recovery") ||
      log.includes("wrong_2fa")
    ) {
      wrongRecoveryProfiles.push(profilesArr[i]);
    } else if (log.includes("confirm phone number")) {
      phoneNumberProfiles.push(profilesArr[i]);
    } else if (log.includes("wrong_password")) {
      wrongPasswordProfiles.push(profilesArr[i]); // Add profile to disconnectedProfiles
    } else if (log.includes("unusual activity")) {
      unusualActivityProfiles.push(profilesArr[i]);
    } else {
      let logArr = log.split("update_status : ");
      log = logArr[logArr.length - 1];
      logArr = log.split(" ; ");
      log = logArr[logArr.length - 1];

      switch (log) {
        case "connected":
        case "active":
        case "matched":
        case "critical alert":
          // case "spam deleted":
          connectedProfiles.push(profilesArr[i]);
          break;
        case "max_execution_time":
          maxExecutionTimeProfiles.push(profilesArr[i]);
          break;
        case "account_restricted":
          accountRestrictedProfiles.push(profilesArr[i]);
          break;
        case "captcha_verification":
          captchaVerificationProfiles.push(profilesArr[i]);
          break;
        case "wrong_password":
          wrongPasswordProfiles.push(profilesArr[i]);
          break;
        case "phone_number":
          phoneNumberProfiles.push(profilesArr[i]);
          break;
        case "unusual_activity" || "account_disabled_unusual":
          unusualActivityProfiles.push(profilesArr[i]);
          break;
        case "wrong_browser":
          wrongBrowserProfiles.push(profilesArr[i]);
          break;
        case "account_disabled" || "account_disabled_check":
          accountDisabledProfiles.push(profilesArr[i]);
          break;
        case "wrong_recovery":
          wrongRecoveryProfiles.push(profilesArr[i]);
          break;

        default:
          othersProfiles.push(profilesArr[i]);
          othersLogs.push(log);

          break;
      }
    }
  });

  return {
    notLogsProfiles,
    connectedProfiles,
    proxyDownProfiles,
    maxExecutionTimeProfiles,
    accountRestrictedProfiles,
    captchaVerificationProfiles,
    wrongPasswordProfiles,
    phoneNumberProfiles,
    unusualActivityProfiles,
    accountDisabledProfiles,
    othersProfiles,
    wrongBrowserProfiles,
    wrongRecoveryProfiles,
    disconnectedProfiles,
    othersLogs,
  };
};
export const checkCleanLogs = (profiles, logs) => {
  const profilesArr = profiles.split("\n");
  const logsArr = logs.split("\n");

  let notLogsProfiles = [];
  let spamNotDeleted = [];
  let spamDeleted = [];

  logsArr.forEach((log, i) => {
    log = log.toLowerCase();

    if (log === "") {
      notLogsProfiles.push(profilesArr[i]);
    } else if (log === "spam not deleted") {
      spamNotDeleted.push(profilesArr[i]);
    } else if (log.includes("spam deleted")) {
      spamDeleted.push(profilesArr[i]);
    }
  });

  return {
    notLogsProfiles,
    spamNotDeleted,
    spamDeleted,
  };
};
export const extractColumns234 = (text) => {
  return text
    .split("\n")
    .map((line) => {
      const parts = line.split("\t");
      return [parts[1], parts[2], parts[3]].join("\t");
    })
    .join("\n");
};
