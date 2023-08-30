// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next';
import { Stat } from 'library/Stat';
import { usePayouts } from 'contexts/Payouts';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { minDecimalPlaces, planckToUnit } from '@polkadot-cloud/utils';
import { faCircleDown } from '@fortawesome/free-solid-svg-icons';
import { useConnect } from 'contexts/Connect';
import { useOverlay } from '@polkadot-cloud/react/hooks';

export const UnclaimedPayoutsStatus = () => {
  const { t } = useTranslation();
  const { network, isReady } = useApi();
  const { openModal } = useOverlay().modal;
  const { unclaimedPayouts } = usePayouts();
  const { activeAccount, isReadOnlyAccount } = useConnect();

  const totalUnclaimed = Object.values(unclaimedPayouts || {}).reduce(
    (total, validators) =>
      Object.values(validators)
        .reduce((amount, value) => amount.plus(value), new BigNumber(0))
        .plus(total),
    new BigNumber(0)
  );

  return (
    <Stat
      label={t('nominate.pendingPayouts', { ns: 'pages' })}
      helpKey="Payout"
      type="odometer"
      stat={{
        value: minDecimalPlaces(
          planckToUnit(totalUnclaimed, network.units).toFormat(),
          2
        ),
      }}
      buttons={
        Object.keys(unclaimedPayouts || {}).length > 0
          ? [
              {
                title: t('claim', { ns: 'modals' }),
                icon: faCircleDown,
                disabled: !isReady || isReadOnlyAccount(activeAccount),
                small: true,
                onClick: () =>
                  openModal({
                    key: 'ClaimPayouts',
                    size: 'sm',
                  }),
              },
            ]
          : undefined
      }
    />
  );
};
