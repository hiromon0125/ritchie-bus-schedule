export default async function Page() {
  return (
    <div className=" m-auto w-full max-w-screen-lg pb-12 opacity-80">
      <h1 className=" font-bold">Private Policy</h1>
      <div className=" flex flex-col gap-4">
        <div className=" flex flex-col gap-1">
          <p className=" font-bold">
            Privacy Policy for Ritchie's Bus Schedule Application
          </p>
          <p>Last Updated: 10/28/2024</p>
        </div>
        <p>
          Thank you for choosing Ritchie’s Bus Schedule Application ("App"). We
          value your privacy and are committed to protecting your personal
          information. This Privacy Policy explains how we collect, use, and
          safeguard information within our App.
        </p>
        <ol className=" flex flex-col gap-2">
          <li>
            <h2 className=" mb-3 mt-4 text-xl font-semibold">
              1. Information We Collect
            </h2>
            We collect limited information from our users to enhance their
            experience, provide accurate information, and ensure the security
            and functionality of our App. The types of information we collect
            include:
            <ol className=" flex flex-col gap-3 pl-3 pt-3">
              <li>
                <h3 className=" my-3 text-lg font-semibold">
                  a. Authentication Data
                </h3>
                <div className=" flex flex-col gap-2 pl-5">
                  <p>
                    <b>Third-Party Authentication:</b> We utilize the
                    third-party authentication service, Clerk, to secure user
                    accounts and simplify the sign-in process. We also offer
                    Google as an authentication option.
                  </p>
                  <p>
                    <b>Data Collected:</b> Clerk handles authentication securely
                    on our behalf and may collect information such as your email
                    address and unique identifiers associated with your Google
                    account if you choose to authenticate with Google.
                  </p>
                </div>
              </li>
              <li>
                <h3 className=" my-3 text-lg font-semibold">
                  b. User Preferences
                </h3>
                <p className=" pl-5">
                  <b>Favorites:</b> When you favorite a bus or stop within the
                  App, we store this information on your account so you can
                  easily access it later. This data is also shared with the
                  manager of the bus schedule to improve the bus routing.
                </p>
              </li>
              <li>
                <h3 className=" my-3 text-lg font-semibold">
                  c. Debugging and Analytics Logs
                </h3>
                <p className=" pl-5">
                  <b>Logs:</b> We collect limited debugging logs to troubleshoot
                  technical issues and improve App performance. These logs may
                  include anonymized data on how users interact with the App but
                  are not tied to personally identifiable information.
                </p>
              </li>
            </ol>
          </li>
          <li>
            <h2 className=" mb-3 mt-4 text-xl font-semibold">
              2. How We Use Your Information
            </h2>
            We use the collected information solely to provide and enhance the
            App experience:
            <ul className=" flex list-disc flex-col gap-1 py-2 pl-9">
              <li>
                To personalize your experience based on your preferences (e.g.,
                favorite bus or stop).
              </li>
              <li>
                To maintain the App's security and prevent unauthorized access
                or misuse.
              </li>
              <li>
                To troubleshoot and improve the App's performance through
                anonymized logs.
              </li>
            </ul>
          </li>
          <li>
            <h2 className=" mb-3 mt-4 text-xl font-semibold">
              3. Sharing of Your Information
            </h2>
            We do not share or sell any of your personal information with third
            parties for marketing purposes. However, we may share information
            with service providers, such as Clerk, solely to facilitate the
            services they provide for authentication and security purposes.
          </li>
          <li>
            <h2 className=" mb-3 mt-4 text-xl font-semibold">
              4. Security of Your Information
            </h2>
            We are committed to securing your information. We implement a range
            of security measures, including encryption and regular security
            assessments, to ensure your data is protected against unauthorized
            access, alteration, or disclosure.
          </li>
          <li>
            <h2 className=" mb-3 mt-4 text-xl font-semibold">
              5. Third-Party Authentication Providers
            </h2>
            Our App uses Clerk and Google as authentication providers to enhance
            security. By using our App and choosing Google or Clerk as your
            authentication method, you agree to the terms and privacy policies
            of these providers. We recommend reviewing{" "}
            <a
              href="https://clerk.chat/legal/privacy"
              className=" text-blue-700 underline"
            >
              Clerk’s Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="https://developers.google.com/identity/protocols/oauth2/policies"
              className=" text-blue-700 underline"
            >
              Google’s Privacy Policy
            </a>{" "}
            to understand how they handle your data.
          </li>
          <li>
            <h2 className=" mb-3 mt-4 text-xl font-semibold">
              6. Your Choices and Control Over Information
            </h2>
            Access and Manage Your Data: You can update your account information
            and preferences by accessing your profile settings within the App.
            Delete Account: If you wish to delete your account and any
            associated data, please contact our support team, and we will
            facilitate the deletion process in compliance with applicable
            regulations.
          </li>
          <li>
            <h2 className=" mb-3 mt-4 text-xl font-semibold">
              7. Changes to This Privacy Policy
            </h2>
            We may update this Privacy Policy periodically to reflect changes in
            our practices or legal obligations. Any updates will be posted
            within the App, and your continued use after such modifications
            constitutes your acceptance of the revised policy.
          </li>
          <li>
            <h2 className=" mb-3 mt-4 text-xl font-semibold">8. Contact Us</h2>
            If you have questions or concerns about this Privacy Policy or your
            data, please contact us at:{" "}
            <a
              href="mailto:hiroto002takeuchi+ritchies@gmail.com"
              className=" text-blue-700 underline"
            >
              hiroto002takeuchi+ritchies@gmail.com
            </a>
          </li>
        </ol>
      </div>
    </div>
  );
}
