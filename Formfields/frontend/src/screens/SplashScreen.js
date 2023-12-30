import React from "react";

const SplashScreen = () => {
  return (
    <div>
      <div className="flex justify-center items-center h-screen flex-col ">
        <img
          src="https://cdn-icons-png.flaticon.com/128/1828/1828466.png"
          alt="profile"
        />
        <h1 className="m-4 text-2xl font-semibold">
          Seems like you didn't Sign In , If you don't have the accout then
          please Register
        </h1>
      </div>
    </div>
  );
};

export default SplashScreen;
