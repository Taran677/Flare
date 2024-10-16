import React from "react";
import { RevolvingDot } from "react-loader-spinner"; 

const LoadingSpinner = () => {
  return (
    <div
      style={{
        zIndex: 9999,
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      render(
      <RevolvingDot
        visible={true}
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="revolving-dot-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
      )
    </div>
  );
};

export default LoadingSpinner;
