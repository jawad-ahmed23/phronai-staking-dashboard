// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonInvertRounded } from '@rossbulat/polkadot-dashboard-ui';
import { EXTENSIONS } from 'config/extensions';
import { useExtensions } from 'contexts/Extensions';
import { ExtensionConfig } from 'contexts/Extensions/types';
import { Action } from 'library/Modal/Action';
import { SelectItems } from 'library/SelectItems';
import { forwardRef } from 'react';
import { Extension } from './Extension';
import { ReadOnly } from './ReadOnly';
import { forwardRefProps } from './types';
import {
  AccountSeparator,
  ContentWrapper,
  ExtensionsWrapper,
  PaddingWrapper,
} from './Wrappers';

export const Extensions = forwardRef((props: forwardRefProps, ref: any) => {
  const { setSection } = props;
  const { extensions } = useExtensions();

  const installed = EXTENSIONS.filter((a: ExtensionConfig) =>
    extensions.find((b: ExtensionConfig) => b.id === a.id)
  );

  const other = EXTENSIONS.filter(
    (a: ExtensionConfig) =>
      !installed.find((b: ExtensionConfig) => b.id === a.id)
  );

  return (
    <ContentWrapper>
      <PaddingWrapper ref={ref}>
        <div className="head">
          <h1>
            Connect
            <ButtonInvertRounded
              text="Go To Accounts"
              iconTransform="shrink-2"
              onClick={() => setSection(1)}
            />
          </h1>
        </div>
        <Action text="Extensions" />
        <ExtensionsWrapper>
          <SelectItems layout="two-col">
            {installed
              .concat(other)
              .map((extension: ExtensionConfig, i: number) => {
                return (
                  <Extension
                    key={`active_extension_${i}`}
                    meta={extension}
                    setSection={setSection}
                  />
                );
              })}
          </SelectItems>
        </ExtensionsWrapper>
        <AccountSeparator />
        <Action text="Read Only Accounts" />
        <ReadOnly {...props} />
      </PaddingWrapper>
    </ContentWrapper>
  );
});
