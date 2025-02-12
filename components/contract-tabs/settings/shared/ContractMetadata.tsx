import {
  AdminOnly,
  useContractMetadata,
  useContractMetadataMutation,
} from "@3rdweb-sdk/react";
import {
  Box,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommonContractSchema, ValidContractClass } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { Card } from "components/layout/Card";
import { FileInput } from "components/shared/FileInput";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { C } from "ts-toolbelt";
import { parseErrorToMessage } from "utils/errorParser";
import { z } from "zod";

export const ContractMetadata = <TContract extends ValidContractClass>({
  contract,
  isDisabled,
}: {
  contract: C.Instance<TContract>;
  isDisabled: boolean;
}) => {
  const toast = useToast();
  const metadata = useContractMetadata(contract);
  const metadataMutation = useContractMetadataMutation(contract);
  const {
    setValue,
    register,
    watch,
    handleSubmit,
    formState,
    getFieldState,
    reset,
  } = useForm<z.input<typeof CommonContractSchema>>({
    resolver: zodResolver(CommonContractSchema),
  });
  useEffect(() => {
    if (metadata.data && !formState.isDirty) {
      reset(metadata.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.isDirty, metadata.data]);

  return (
    <Card p={0}>
      <Box pt={10}>
        <Flex
          as="form"
          onSubmit={handleSubmit((d) => {
            metadataMutation.mutate(d, {
              onSuccess: () => {
                toast({
                  title: "Success",
                  description: "Succesfully updated metadata",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                });
              },
              onError: (error) => {
                toast({
                  title: "Error updating metadata",
                  description: parseErrorToMessage(error),
                  status: "error",
                  duration: 9000,
                  isClosable: true,
                });
              },
            });
          })}
          direction="column"
          gap={8}
        >
          <Flex px={10} as="section" direction="column" gap={4}>
            <Flex direction="column">
              <Heading size="title.md">General Settings</Heading>
              <Text size="body.md" fontStyle="italic">
                Settings to organize and distinguish between your different
                contracts.
              </Text>
            </Flex>
            <Flex gap={4} direction={{ base: "column", md: "row" }}>
              <Flex
                flexShrink={0}
                flexGrow={1}
                maxW={{ base: "100%", md: "160px" }}
              >
                <FormControl
                  display="flex"
                  flexDirection="column"
                  isDisabled={
                    metadata.isLoading ||
                    metadataMutation.isLoading ||
                    isDisabled
                  }
                  isInvalid={getFieldState("image", formState).invalid}
                >
                  <FormLabel>Image</FormLabel>
                  <FileInput
                    isDisabled={
                      metadata.isLoading ||
                      metadataMutation.isLoading ||
                      isDisabled
                    }
                    accept="image/*"
                    value={useImageFileOrUrl(watch("image"))}
                    setValue={(file) =>
                      setValue("image", file, { shouldTouch: true })
                    }
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    transition="all 200ms ease"
                  />
                  <FormErrorMessage>
                    {getFieldState("image", formState).error?.message}
                  </FormErrorMessage>
                </FormControl>
              </Flex>

              <Flex
                direction="column"
                gap={4}
                flexGrow={1}
                justify="space-between"
              >
                <Flex gap={4} direction={{ base: "column", md: "row" }}>
                  <FormControl
                    isDisabled={
                      metadata.isLoading ||
                      metadataMutation.isLoading ||
                      isDisabled
                    }
                    isInvalid={getFieldState("name", formState).invalid}
                  >
                    <FormLabel>Name</FormLabel>
                    <Input variant="filled" {...register("name")} />
                    <FormErrorMessage>
                      {getFieldState("name", formState).error?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Flex>

                <FormControl
                  isDisabled={
                    metadata.isLoading ||
                    metadataMutation.isLoading ||
                    isDisabled
                  }
                  isInvalid={getFieldState("description", formState).invalid}
                >
                  <FormLabel>Description</FormLabel>
                  <Textarea variant="filled" {...register("description")} />
                  <FormErrorMessage>
                    {getFieldState("description", formState).error?.message}
                  </FormErrorMessage>
                </FormControl>
              </Flex>
            </Flex>
          </Flex>

          <AdminOnly contract={contract} fallback={<Box pb={5} />}>
            <>
              <Divider />
              <TransactionButton
                colorScheme="primary"
                transactionCount={1}
                isDisabled={metadata.isLoading || !formState.isDirty}
                type="submit"
                isLoading={metadataMutation.isLoading}
                loadingText="Saving..."
                size="md"
                borderRadius="xl"
                borderTopLeftRadius="0"
                borderTopRightRadius="0"
              >
                Update Metadata
              </TransactionButton>
            </>
          </AdminOnly>
        </Flex>
      </Box>
    </Card>
  );
};
