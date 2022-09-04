import { useConnectors, useStarknet } from "@starknet-react/core";

import styled from "@emotion/styled";

export default function ConnectWallet() {
  const { account } = useStarknet();
  const { available, connect, disconnect } = useConnectors();

  if (account) {
    return (
      <StyledConnectWallet>
        Account: {account}{" "}
        <button onClick={() => disconnect()}>Disconnect</button>
      </StyledConnectWallet>
    );
  }

  return (
    <StyledConnectWallet>
      {available.map((connector) => (
        <button key={connector.id()} onClick={() => connect(connector)}>
          {`Connect ${connector.name()}`}
        </button>
      ))}
    </StyledConnectWallet>
  );
}

const StyledConnectWallet = styled.div`
  position: fixed;
  top: 40px;
  right: 40px;

  color: white;
`;
