import React from "react";
import Features from "./Features";
import vmailLogo from "../../images/vmail_t.png";

const Homepage = () => {
  return (
    <div className="flex min-h-full w-screen flex-col sm:supports-[min-height:100dvh]:min-h-[100dvh] md:grid md:grid-cols-2 lg:grid-cols-[70%_30%]">
      {/* Left Section */}
      <div className="relative bg-slate-200 hidden flex-1 flex-col justify-center px-5 pt-8 text-[#FE7600] dark:text-[#0c0b0d] md:flex md:px-6 md:py-[22px] lg:px-8">
        {/* edit dark and text for the font colour in light and dark mode */}
        {/* Navigation */}
        <nav className="left-0 top-8 flex w-full px-6 sm:absolute md:top-[22px] md:px-6 lg:px-8">
          <img
            src={vmailLogo}
            alt="Vmail"
            className="cursor-pointer w-[20px] h-[20px] lg:w-[100px] lg:h-[40px]"
          />
        </nav>
        <Features />
      </div>

      {/* Right Section */}
      <div className="relative flex grow flex-col items-center justify-between bg-white py-8 text-black dark:bg-black dark:text-white sm:rounded-t-[30px] md:rounded-none md:w-full md:px-6">
        {/* Header */}
        <nav className="flex w-full justify-start px-6 pb-8 md:hidden md:px-6 lg:px-8">
          <img
            src={vmailLogo}
            alt="Vmail"
            className="cursor-pointer w-[20px] h-[20px] lg:w-[22px] lg:h-[22px]"
          />
        </nav>

        {/* Get Started Section */}
        <div className="relative flex w-full grow flex-col items-center justify-center">
          <h2 className="text-center text-[20px] leading-[1.2] md:text-[32px] md:leading-8">
            Get started
          </h2>
          <div className="mt-5 w-full max-w-[440px]">
            {/* Log in and Sign up buttons */}
            <div className="grid gap-x-3 gap-y-2 sm:grid-cols-1 sm:gap-y-0 ">
              <button onClick={signIn}
                className="relative flex h-12 items-center justify-center rounded-md text-center text-base font-medium bg-[#3C46FF] text-[#fff] hover:bg-[#0000FF]"
                data-testid="login-button"
              >
                <div className="relative -top-[1px]">Log in</div>
              </button>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="mt-10 flex flex-col justify-center">
          <div className="flex justify-center text-[#cdcdcd] md:mb-3">
            {/* SVG */}
            {/* ... (SVG content) */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;

const signIn = async () => {
  let endpoint = "https://accounts.google.com/o/oauth2/v2/auth"
  let form = document.createElement('form')
  form.setAttribute('method', 'GET')
  form.setAttribute('action', endpoint)

  let params = {
      "client_id": "435103188171-s26urp6qsll47klpef1tqi5dkhu2tp1p.apps.googleusercontent.com",
      "redirect_uri": "http://localhost:3000/verify",
      "response_type": "code",
      "scope": "https://mail.google.com",
      "access_type": "offline"
  }

  for(var p in params){
      let input = document.createElement('input')
      input.setAttribute('type', 'hidden')
      input.setAttribute('name', p)
      input.setAttribute('value', params[p])
      form.appendChild(input)
  }

  document.body.appendChild(form)

  form.submit()
}