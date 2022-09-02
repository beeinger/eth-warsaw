import React from "react";

type Props = {};

export default function index({}: Props) {
  function play() {
    var audio = new Audio("100101001011010101001010010100101");
    audio.play();
  }
  return <button onClick={play}>index</button>;
}
