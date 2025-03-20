import React from "react";

export default function SkipButton({ onClick }: { onClick: () => void }) {
    return (
      <button className="btn btn-light position-absolute top-0 end-0 m-3 px-4 py-2 rounded-pill shadow-lg" onClick={onClick}>
        Skip
      </button>
    );
  }
  