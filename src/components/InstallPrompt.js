import React from "react";

export default function InstallPrompt(props) {
  const { handleHide, handleInstallApp } = props;
  return (
    <nav className="notification is-radiusless navbar is-fixed-bottom is-dark has-shadow is-marginless is-paddingless">
      <button
        style={{ zIndex: 1 }}
        onClick={handleHide}
        className="delete"
      ></button>

      <div
        className="container"
        style={{ justifyContent: "center", display: "flex" }}
      >
        <div className="navbar-item">
          <button
            className="button is-black is-rounded"
            onClick={handleInstallApp}
          >
            <span className="icon">👇</span>
            <span className="heading is-marginless">Install Now</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
