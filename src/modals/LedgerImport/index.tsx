// Copyright 2022 @paritytech/polkadot-native authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { ButtonSecondary } from '@polkadotcloud/dashboard-ui';
import { useLedgerHardware } from 'contexts/Hardware/Ledger';
import type { LedgerResponse, LedgerTask } from 'contexts/Hardware/types';
import { useModal } from 'contexts/Modal';
import { CustomHeaderWrapper, PaddingWrapper } from 'modals/Wrappers';
import React, { useEffect, useRef, useState } from 'react';
import type { AnyJson } from 'types';
import { clipAddress, localStorageOrDefault, setStateWithRef } from 'Utils';
import { Splash } from './Splash';

export const LedgerImport: React.FC = () => {
  const { replaceModalWith } = useModal();
  const {
    executeLedgerLoop,
    transportResponse,
    setIsImporting,
    resetStatusCodes,
    getIsImporting,
    handleNewStatusCode,
  } = useLedgerHardware();

  // Store addresses retreived from Ledger device.
  //
  // TODO: Initialise to any addresses saved in local storage.
  const [addresses, setAddresses] = useState<AnyJson>(
    localStorageOrDefault('ledger_addresses', [], true)
  );
  const addressesRef = useRef(addresses);

  // Gets the next non-imported address index.
  const getNextAddressIndex = () => {
    if (!addressesRef.current.length) {
      return 0;
    }
    return addressesRef.current[addressesRef.current.length - 1].index + 1;
  };

  // Connect to Ledger device and perform necessary tasks.
  //
  // The tasks sent to the device depend on the current state of the import process. The interval is
  // cleared once the address has been successfully fetched.
  let interval: ReturnType<typeof setInterval>;
  const handleLedgerLoop = () => {
    interval = setInterval(() => {
      const tasks: Array<LedgerTask> = ['get_device_info'];
      if (getIsImporting()) {
        tasks.push('get_address');
      }
      executeLedgerLoop(tasks, { accountIndex: getNextAddressIndex() });
    }, 2000);
  };

  // Handle new Ledger status report.
  const handleLedgerStatusResponse = (response: LedgerResponse) => {
    if (!response) return;

    const { ack, statusCode, body, options } = response;
    handleNewStatusCode(ack, statusCode);

    if (statusCode === 'ReceivedAddress') {
      const addressFormatted = body.map(({ pubKey, address }: AnyJson) => ({
        index: options.accountIndex,
        pubKey,
        address,
        name: clipAddress(address),
      }));

      const newAddresses = addressesRef.current.concat(addressFormatted);

      localStorage.setItem('ledger_addresses', JSON.stringify(newAddresses));

      setIsImporting(false);
      setStateWithRef(newAddresses, setAddresses, addressesRef);
      resetStatusCodes();
    }
  };

  // Initialise listeners for Ledger IO.
  useEffect(() => {
    if (!addressesRef.current.length) {
      setIsImporting(true);
    }
    handleLedgerLoop();
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Listen for new Ledger status reports.
  useEffect(() => {
    handleLedgerStatusResponse(transportResponse);
  }, [transportResponse]);

  return (
    <PaddingWrapper verticalOnly>
      <CustomHeaderWrapper>
        <h1>
          <ButtonSecondary
            text="Back"
            iconLeft={faChevronLeft}
            iconTransform="shrink-3"
            onClick={() => replaceModalWith('Connect', {}, 'large')}
          />
        </h1>
      </CustomHeaderWrapper>
      {!addressesRef.current.length ? (
        <Splash />
      ) : (
        <>{/* TODO: Manage Component */}</>
      )}
    </PaddingWrapper>
  );
};
