import TextAreaWithCopy from "./TextAreaWithCopy";

export default function Monitor({ result }) {
  return (
    <div className="p-8 mx-auto flex flex-col justify-center items-center bg-white rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Results Overview
      </h3>
      <div className="flex flex-wrap justify-center gap-2 w-full">
        {result.connectedProfiles?.length > 0 && (
          <TextAreaWithCopy
            id="active"
            label="Active"
            value={result.connectedProfiles.join("\n")}
          />
        )}
        {result.proxyDownProfiles?.length > 0 && (
          <TextAreaWithCopy
            id="proxyDown"
            label="Proxy Down"
            value={result.proxyDownProfiles.join("\n")}
          />
        )}
        {result.maxExecutionTimeProfiles?.length > 0 && (
          <TextAreaWithCopy
            id="maxExecutionTime"
            label="Max Execution Time"
            value={result.maxExecutionTimeProfiles.join("\n")}
          />
        )}
        {result.disconnectedProfiles?.length > 0 && (
          <TextAreaWithCopy
            id="disconnected"
            label="Disconnected"
            value={result.disconnectedProfiles.join("\n")}
          />
        )}
        {result.wrongBrowserProfiles?.length > 0 && (
          <TextAreaWithCopy
            id="wrongBrowser"
            label="Wrong Browser"
            value={result.wrongBrowserProfiles.join("\n")}
          />
        )}
        {result.accountRestrictedProfiles?.length > 0 && (
          <TextAreaWithCopy
            id="accountRestricted"
            label="Account Restricted"
            value={result.accountRestrictedProfiles.join("\n")}
          />
        )}
        {result.captchaVerificationProfiles?.length > 0 && (
          <TextAreaWithCopy
            id="captchaVerification"
            label="Captcha Verification"
            value={result.captchaVerificationProfiles.join("\n")}
          />
        )}
        {result.wrongPasswordProfiles?.length > 0 && (
          <TextAreaWithCopy
            id="wrongPassword"
            label="Wrong Password"
            value={result.wrongPasswordProfiles.join("\n")}
          />
        )}
        {result.wrongRecoveryProfiles?.length > 0 && (
          <TextAreaWithCopy
            id="wrongRecovery"
            label="Wrong Recovery"
            value={result.wrongRecoveryProfiles.join("\n")}
          />
        )}
        {result.phoneNumberProfiles?.length > 0 && (
          <TextAreaWithCopy
            id="phoneNumber"
            label="Phone Number"
            value={result.phoneNumberProfiles.join("\n")}
          />
        )}
        {result.unusualActivityProfiles?.length > 0 && (
          <TextAreaWithCopy
            id="usualActivity"
            label="Unusual Activity"
            value={result.unusualActivityProfiles.join("\n")}
          />
        )}
        {result.accountDisabledProfiles?.length > 0 && (
          <TextAreaWithCopy
            id="accountDisabled"
            label="Account Disabled"
            value={result.accountDisabledProfiles.join("\n")}
          />
        )}
        {result.notLogsProfiles?.length > 0 && (
          <TextAreaWithCopy
            id="empty"
            label="Empty"
            value={result.notLogsProfiles.join("\n")}
          />
        )}
        {result.othersProfiles?.length > 0 && (
          <TextAreaWithCopy
            id="others"
            label="Others"
            value={result.othersProfiles.join("\n")}
          />
        )}
      </div>
    </div>
  );
}
