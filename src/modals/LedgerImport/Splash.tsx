// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import { ReactComponent as LogoSVG } from 'img/ledgerLogo.svg';
import { Title } from 'library/Modal/Title';
import { determineStatusFromCodes } from './Utils';
import { SplashWrapper } from './Wrappers';

export const Splash = () => {
  const { statusCodes } = useLedgerHardware();

  return (
    <>
      <Title title="" />
      <SplashWrapper>
        <div className="icon">
          <LogoSVG style={{ transform: 'scale(0.6)' }} opacity={0.05} />
        </div>

        <div className="content">
          <h2>
            {!statusCodes.length
              ? 'Checking...'
              : determineStatusFromCodes(statusCodes, false).title}
          </h2>
          <h5>{determineStatusFromCodes(statusCodes, false).subtitle}</h5>
        </div>
      </SplashWrapper>
    </>
  );
};
