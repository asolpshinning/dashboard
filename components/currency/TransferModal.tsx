import {
  useTokenBalance,
  useTransferMutation,
  useWeb3,
} from "@3rdweb-sdk/react";
import {
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useToken } from "@thirdweb-dev/react";
import { MismatchButton } from "components/buttons/MismatchButton";
import { useSingleQueryParam } from "hooks/useQueryParam";
import React from "react";
import { useForm } from "react-hook-form";
import { FiSend } from "react-icons/fi";
import { parseErrorToMessage } from "utils/errorParser";

interface IMintModal {
  isOpen: boolean;
  onClose: () => void;
}

const FORM_ID = "TransferModal-form";

interface TransferModalFormValues {
  amount: string;
  to: string;
}

export const TransferModal: React.FC<IMintModal> = ({ isOpen, onClose }) => {
  const { address } = useWeb3();

  const tokenAddress = useSingleQueryParam("token");
  const contract = useToken(tokenAddress);

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TransferModalFormValues>({
    defaultValues: { to: address, amount: "0" },
  });

  const currentBalance = useTokenBalance(tokenAddress, watch("to"));

  const mutation = useTransferMutation(contract);
  const toast = useToast();

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader as={Heading}>Transfer Tokens</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={8}>
            <Stack>
              <form
                id={FORM_ID}
                onSubmit={handleSubmit((d) =>
                  mutation.mutate(
                    { to: d.to, amount: d.amount },
                    {
                      onSuccess: () => {
                        toast({
                          title: "Permissions updated",
                          status: "success",
                          duration: 5000,
                          isClosable: true,
                        });
                      },
                      onError: (error) => {
                        toast({
                          title: "Failed to update permissions",
                          description: parseErrorToMessage(error),
                          status: "error",
                          duration: 9000,
                          isClosable: true,
                        });
                      },
                      onSettled: onClose,
                    },
                  ),
                )}
              >
                <Stack spacing={4}>
                  <FormControl isRequired isInvalid={!!errors.to}>
                    <Heading as={FormLabel} size="label.md">
                      To Address
                    </Heading>
                    <InputGroup>
                      <Input
                        fontFamily="mono"
                        fontSize="body.md"
                        {...register("to")}
                      />
                    </InputGroup>
                    <FormErrorMessage>{errors?.to?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={!!errors.amount}>
                    <Heading as={FormLabel} size="label.md">
                      Amount
                    </Heading>
                    <Input
                      fontFamily="mono"
                      fontSize="body.md"
                      step="any"
                      type="number"
                      {...register("amount")}
                    />
                    <FormErrorMessage>
                      {errors?.amount?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Stack>
              </form>
            </Stack>
            <Divider />
            <Stack spacing={2} opacity={watch("to") ? 1 : 0.5}>
              <Table variant="simple">
                <TableCaption>Outcome of successful transfer</TableCaption>
                <Thead>
                  <Tr>
                    <Th isNumeric>Current Balance</Th>
                    <Th isNumeric>New Balance</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td fontFamily="mono" isNumeric>
                      {currentBalance.data?.displayValue}
                    </Td>
                    <Td fontFamily="mono" isNumeric>
                      {watch("to")
                        ? parseFloat(currentBalance.data?.displayValue || "0") +
                          parseFloat(watch("amount"))
                        : 0}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Stack>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <MismatchButton
            isLoading={mutation.isLoading}
            type="submit"
            form={FORM_ID}
            colorScheme="primary"
            rightIcon={<FiSend />}
            isDisabled={!watch("to") || !watch("amount")}
          >
            Send Transfer
          </MismatchButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
