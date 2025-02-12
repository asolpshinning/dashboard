import { ABICopyButton } from "./ABICopyButton";
import { CodeSegment } from "./CodeSegment";
import {
  CodeSnippet,
  Environment,
  SnippetApiResponse,
  SnippetSchema,
} from "./types";
import { useContractName, useWeb3 } from "@3rdweb-sdk/react";
import {
  Code,
  Flex,
  Heading,
  IconButton,
  Spinner,
  Stack,
  Text,
  useClipboard,
} from "@chakra-ui/react";
import { ValidContractInstance } from "@thirdweb-dev/sdk";
import { Card } from "components/layout/Card";
import { LinkButton } from "components/shared/LinkButton";
import { useCallback, useMemo, useState } from "react";
import { ImCheckmark, ImCopy } from "react-icons/im";
import { IoDocumentOutline } from "react-icons/io5";
import { useQuery } from "react-query";

function replaceVariablesInCodeSnippet(
  snippet: CodeSnippet,
  contractAddress?: string,
  walletAddress?: string,
): CodeSnippet {
  const envs = Object.keys(snippet) as Environment[];
  for (const env of envs) {
    if (contractAddress) {
      snippet[env] = snippet[env]?.replace(
        /{{contract_address}}/gm,
        contractAddress,
      );
    }

    if (walletAddress) {
      snippet[env] = snippet[env]?.replace(
        /{{wallet_address}}/gm,
        walletAddress,
      );
    }
  }
  return snippet;
}

interface IContractCode {
  contract?: ValidContractInstance;
}

const NPM_INSTALL_COMMAND = `npm install @thirdweb-dev/sdk`;

export const ContractCode: React.FC<IContractCode> = ({ contract }) => {
  const { data, isLoading } = useContractCodeSnippetQuery();

  const contractName = useContractName(contract);

  const scopedData = useMemo(() => {
    return getContractSnippets(data, contractName);
  }, [data, contractName]);

  const { address } = useWeb3();
  const [environment, setEnvironment] = useState<Environment>("javascript");
  const replaceSnippetVars = useCallback(
    (snip: Partial<Record<Environment, string>>) =>
      replaceVariablesInCodeSnippet(snip, contract?.getAddress(), address),
    [address, contract],
  );

  const { onCopy, hasCopied } = useClipboard(NPM_INSTALL_COMMAND);

  if (isLoading) {
    return (
      <Card>
        <Spinner /> Loading...
      </Card>
    );
  }

  if (!scopedData) {
    return (
      <Card>
        <Heading as="h2" size="title.sm">
          Code snippets for this contract are not yet available.
        </Heading>
        <Text>Please check back for updates over the next couple of days.</Text>
      </Card>
    );
  }

  const snippetCard = (snippet: SnippetSchema) => (
    <Card key={snippet.name}>
      <Stack spacing={4}>
        <Flex direction="row" gap={2} justify="space-between" align="center">
          <Flex direction="column" gap={2}>
            <Heading size="label.lg">{snippet.summary}</Heading>
            {snippet.remarks && <Text>{snippet.remarks}</Text>}
          </Flex>
          {snippet.reference && (
            <LinkButton
              flexShrink={0}
              leftIcon={<IoDocumentOutline />}
              isExternal
              noIcon
              href={snippet.reference}
              variant="outline"
              size="sm"
            >
              Documentation
            </LinkButton>
          )}
        </Flex>
        <CodeSegment
          snippet={replaceSnippetVars(snippet.examples)}
          environment={environment}
          setEnvironment={setEnvironment}
        />
      </Stack>
    </Card>
  );

  return (
    <Stack spacing={4}>
      <Card>
        <Stack spacing={3}>
          <Heading size="title.sm">Getting Started</Heading>
          <Text>First, install the latest version of the SDK.</Text>
          <Code borderRadius="md" py={2} px={4} variant="subtle" bg="#1e1e1e">
            <Flex justify="space-between" align="center">
              <Text color="#d4d4d4">
                {">"} {NPM_INSTALL_COMMAND}
              </Text>
              <IconButton
                onClick={onCopy}
                size="xs"
                colorScheme="purple"
                variant="solid"
                aria-label="copy"
                icon={hasCopied ? <ImCheckmark /> : <ImCopy />}
              />
            </Flex>
          </Code>
          <Text>
            Follow along below to get started using this contract in your code.
          </Text>
          <CodeSegment
            snippet={replaceSnippetVars(scopedData.examples)}
            environment={environment}
            setEnvironment={setEnvironment}
          />
        </Stack>
      </Card>
      {scopedData.methods?.map((snippet) => {
        return snippetCard(snippet);
      })}

      {scopedData.properties?.map((snippet) => {
        return snippetCard(snippet);
      })}

      <Card>
        <Flex direction="row" gap={2} justify="space-between" align="flex-end">
          <Flex direction="column" gap={2}>
            <Heading size="title.sm">Contract ABI</Heading>
            <Text>
              If you need the underlying contract ABI for this contract you can
              copy it from here.
            </Text>
          </Flex>
          {contract && (
            <ABICopyButton colorScheme="purple" contract={contract} />
          )}
        </Flex>
      </Card>
    </Stack>
  );
};

function getContractSnippets(
  snippets?: SnippetApiResponse,
  contractName?: string | null,
): SnippetSchema | null {
  return contractName && snippets ? snippets[contractName] : null;
}

function useContractCodeSnippetQuery() {
  return useQuery(
    ["code-snippet"],
    async () => {
      const res = await fetch(
        `https://raw.githubusercontent.com/thirdweb-dev/typescript-sdk/main/docs/snippets.json`,
      );
      return (await res.json()) as SnippetApiResponse;
    },
    {
      refetchInterval: 10_000,
    },
  );
}
