export const checkLogs = (profiles, logs) => {
    const profilesArr = profiles.split("\n");
    const logsArr = logs.split("\n");
  
    if (profilesArr.length !== logsArr.length) {
      return { error: "Profiles number and Logs number do not match" };
    }
  
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
  
    logsArr.forEach((log, i) => {
      log = log.toLowerCase();
  
      if (log === "") {
        notLogsProfiles.push(profilesArr[i]);
      } else if (log === "matched") {
        connectedProfiles.push(profilesArr[i]);
      } else if (log.includes("proxy down")) {
        proxyDownProfiles.push(profilesArr[i]);
      } else {
        let logArr = log.split("update_status : ");
        log = logArr[logArr.length - 1];
        logArr = log.split(" ; ");
        log = logArr[logArr.length - 1];
  
        switch (log) {
          case "connected":
          case "active":
          case "matched":
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
          case "unusual_activity":
            unusualActivityProfiles.push(profilesArr[i]);
            break;
          case "account_disabled":
            accountDisabledProfiles.push(profilesArr[i]);
            break;
          default:
            othersProfiles.push(profilesArr[i]);
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
    };
  };
  