import TextAreaWithCopy from "../small components/TextAreaWithCopy";

export default function Monitor({ result }) {
  return (
    <div className="p-10 mx-auto flex flex-col justify-center items-center">
      <div className="grid gap-4 grid-cols-5 ">
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
            proxyDownProfiles={result.proxyDownProfiles}
          />
        )}
        {result.maxExecutionTimeProfiles?.length > 0 && (
          <TextAreaWithCopy
            id="maxExecutionTime"
            label="Max Execution Time"
            value={result.maxExecutionTimeProfiles.join("\n")}
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
            label="Usual Activity"
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
