import React from "react";

export default function index() {
  function play() {
    var audio = new Audio("100101001011010101001010010100101");
    audio.play();
  }
  return <button onClick={play}>index</button>;
}
