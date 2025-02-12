import { useTableContext } from "../table-context";
import { BundleDropTokenSettingsSection } from "./BundleDropTokenSettings";
import { TransferSection } from "./TransferSection";
import { EditionDrop, ValidContractInstance } from "@thirdweb-dev/sdk";
import { useCallback } from "react";

export function useExpandedRow<TContract extends ValidContractInstance>(
  contract?: TContract,
) {
  const { expanded } = useTableContext();
  const renderExpandedRow = useCallback(
    (tokenId: string) => {
      if (tokenId === expanded?.tokenId) {
        // if (expanded.type === "list") {
        //   return <ListSection contract={contract} tokenId={expanded.tokenId} />;
        // } else
        if (expanded.type === "transfer") {
          return (
            <TransferSection contract={contract} tokenId={expanded.tokenId} />
          );
        } else if (
          expanded.type === "settings" &&
          contract instanceof EditionDrop
        ) {
          return (
            <BundleDropTokenSettingsSection
              contract={contract}
              tokenId={expanded.tokenId}
            />
          );
        }
        //  else if (
        //   expanded.type === "rewards" &&
        //   contract instanceof PackContract
        // ) {
        //   return <RewardsSection contract={contract} tokenId={expanded.tokenId} />;
        // }
      }

      return null;
    },
    [expanded, contract],
  );

  return { renderExpandedRow, title: expanded?.type || "" };
}
