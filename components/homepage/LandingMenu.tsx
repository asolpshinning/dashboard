import { IconButton } from "@chakra-ui/button";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { NextLink } from "components/shared/NextLink";
import { useTrack } from "hooks/analytics/useTrack";
import { useCallback } from "react";

export const LandingMenu: React.FC = () => {
  const { trackEvent } = useTrack();

  const scrollToId = useCallback(
    (id: string) => {
      if (document) {
        trackEvent({ category: "topnav", action: "click", label: id });
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
        });
      }
    },
    [trackEvent],
  );

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<HamburgerIcon />}
        variant="outline"
        color="black"
      />
      <MenuList bgColor="white" color="black">
        <MenuItem onClick={() => scrollToId("features")}>Features</MenuItem>
        <MenuItem onClick={() => scrollToId("developers")}>Developers</MenuItem>
        <MenuItem onClick={() => scrollToId("fees")}>Pricing</MenuItem>
        <NextLink href="https://portal.thirdweb.com" isExternal>
          <MenuItem>Guides</MenuItem>
        </NextLink>
        <NextLink href="/dashboard">
          <MenuItem
            onClick={() =>
              trackEvent({
                category: "topnav",
                action: "click",
                label: "start",
              })
            }
          >
            Get Early Access
          </MenuItem>
        </NextLink>
      </MenuList>
    </Menu>
  );
};
