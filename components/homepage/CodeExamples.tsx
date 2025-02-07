import { Box, Container, Flex, Heading } from "@chakra-ui/react";
import { LinkButton } from "components/shared/LinkButton";
import { useTrack } from "hooks/analytics/useTrack";

export const CodeExamples: React.FC = () => {
  const { trackEvent } = useTrack();

  return (
    <Flex id="developers" direction="column" bg="backgroundDark" pb="-100px">
      <Container
        maxW="container.page"
        position="relative"
        py={["75px", "75px", "150px"]}
      >
        <Flex w="100%" align="center" direction="column" position="relative">
          <Flex
            maxW="container.lg"
            px={0}
            alignItems="center"
            direction="column"
          >
            <Heading
              w="100%"
              as="h2"
              mb="16px"
              textAlign="center"
              size="display.md"
              color="#F2FBFF"
            >
              Powerful SDKs for all your needs
            </Heading>
            <Heading
              color="rgba(242, 251, 255, 0.8)"
              textAlign="center"
              size="subtitle.lg"
            >
              Use our robust SDKs to take things into your own hands
              <Box display={{ base: "none", md: "block" }} /> and easily
              implement web3 features directly into your projects.
            </Heading>

            <LinkButton
              noIcon
              bgColor="purple.500"
              colorScheme="purple"
              _hover={{ bgColor: "purple.600" }}
              borderRadius="full"
              href="https://portal.thirdweb.com/learn"
              // px={8}
              // position="absolute"
              // bottom={70}
              mt={12}
              size="lg"
              fontSize={{ base: "md", md: "lg" }}
              onClick={() =>
                trackEvent({
                  category: "home",
                  action: "click",
                  label: "explore-docs",
                })
              }
            >
              Explore documentation & guides
            </LinkButton>
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
};
