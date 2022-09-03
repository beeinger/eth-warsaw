import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@shardlabs/starknet-hardhat-plugin";

const config: HardhatUserConfig = {
  starknet: {
    dockerizedVersion: "0.9.1",
  },
  networks: {
    integratedDevnet: {
      url: "http://127.0.0.1:5050",

      // or specify Docker image tag
      dockerizedVersion: "0.2.3-arm",

      // optional devnet CLI arguments
      args: ["--lite-mode", "--gas-price", "2000000000"],

      // stdout: "logs/stdout.log" <- dumps stdout to the file
      stdout: "STDOUT", // <- logs stdout to the terminal
      // stderr: "logs/stderr.log" <- dumps stderr to the file
      stderr: "STDERR", // <- logs stderr to the terminal
    },
  },
};

export default config;
