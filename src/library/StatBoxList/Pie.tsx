// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonHelp } from '@polkadotcloud/core-ui';
import { ReactOdometer } from '@polkadotcloud/react-odometer';
import { useHelp } from 'contexts/Help';
import { StatPie } from 'library/Graphs/StatBoxPie';
import { useEffect, useState } from 'react';
import { StatBox } from './Item';
import type { PieProps } from './types';

export const Pie = ({ label, stat, graph, tooltip, helpKey }: PieProps) => {
  const help = helpKey !== undefined;
  const showValue = stat?.value !== 0 || stat?.total === 0;
  const showTotal = !!stat?.total;
  const { openHelp } = useHelp();

  const [value, setValue] = useState(0);
  const [tValue, setTvalue] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => setValue(Number(stat?.value ?? 0)), 0);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [stat?.value]);

  useEffect(() => {
    const tTimeoutId = setTimeout(() => setTvalue(Number(stat?.total ?? 0)), 0);
    return () => {
      clearTimeout(tTimeoutId);
    };
  }, [stat?.total]);

  return (
    <StatBox>
      <div className="content chart">
        <div className="chart">
          <StatPie value={graph?.value1} value2={graph?.value2} />
          {tooltip ? (
            <div className="tooltip">
              <h3>{tooltip}</h3>
            </div>
          ) : null}
        </div>

        <div className="labels">
          <h3>
            {showValue ? (
              <>
                <ReactOdometer duration={150} value={value} />
                {stat?.unit && <>{stat?.unit}</>}

                {showTotal ? (
                  <span className="total">
                    / <ReactOdometer duration={150} value={tValue} />
                    {stat?.unit ? (
                      <>
                        &nbsp;
                        {stat?.unit}
                      </>
                    ) : null}
                  </span>
                ) : null}
              </>
            ) : (
              <>0</>
            )}
          </h3>
          <h4>
            {label}{' '}
            {help ? (
              <ButtonHelp marginLeft onClick={() => openHelp(helpKey)} />
            ) : null}
          </h4>
        </div>
      </div>
    </StatBox>
  );
};
