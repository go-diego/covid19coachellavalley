import React from "react";

const ShareIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xlink="http://www.w3.org/1999/xlink"
      enableBackground="new 0 0 50 50"
      height="16px"
      id="Layer_1"
      version="1.1"
      viewBox="0 0 50 50"
      width="16px"
      space="preserve"
    >
      <polyline
        fill="none"
        points="17,10 25,2 33,10"
        stroke="#ffdd57"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="2"
      />
      <line
        fill="none"
        stroke="#ffdd57"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="2"
        x1="25"
        x2="25"
        y1="32"
        y2="2.333"
      />
      <rect fill="none" height="50" width="50" />
      <path
        d="M17,17H8v32h34V17h-9"
        fill="none"
        stroke="#ffdd57"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="2"
      />
    </svg>
  );
};

export default function InstallInstructionsForSafari(props) {
  const { handleHide } = props;
  return (
    <nav className="notification is-radiusless navbar is-fixed-bottom is-dark has-shadow is-marginless">
      <button
        style={{ zIndex: 1 }}
        onClick={handleHide}
        className="delete"
      ></button>
      <p className="has-text-light has-text-weight-light is-size-7">
        You can install this app by tapping{" "}
        <span className="icon is-small">
          <ShareIcon />
        </span>{" "}
        and selecting{" "}
        <span className="has-text-weight-bold">Add to Home Screen</span>
      </p>
    </nav>
  );
}
