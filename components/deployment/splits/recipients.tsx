import {
  Alert,
  AlertDescription,
  AlertIcon,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  IconButton,
  Input,
  Text,
} from "@chakra-ui/react";
import { AddressZero } from "@ethersproject/constants";
import { Split } from "@thirdweb-dev/sdk";
import { Button } from "components/buttons/Button";
import { BasisPointsInput } from "components/inputs/BasisPointsInput";
import { SplitsPieChart } from "components/splits-chart/splits-chart";
import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { z } from "zod";

export const RecipientForm: React.FC = () => {
  const { register, control, getFieldState, formState, watch, setValue } =
    useFormContext<z.infer<typeof Split["schema"]["deploy"]>>();
  const { fields, append, remove } = useFieldArray({
    name: "recipients",
    control,
  });
  useEffect(() => {
    if (fields.length === 0) {
      append({ address: "", sharesBps: 10000 });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalShares =
    watch("recipients")?.reduce((a, b) => a + b.sharesBps, 0) || 0;

  return (
    <>
      <Divider />
      <Flex px={10} as="section" direction="column" gap={4}>
        <Flex direction="column">
          <Heading size="title.md">Split Settings</Heading>
          <Text size="body.md" fontStyle="italic">
            Define the recipients and share percentages for this Split contract.
          </Text>
        </Flex>

        <SplitsPieChart recipients={watch("recipients") || []} />

        {totalShares < 10000 ? (
          <Alert status="warning">
            <AlertIcon />
            <AlertDescription>
              Total shares need to add up to 100%. Total shares currently add up
              to {totalShares / 100}%.
            </AlertDescription>
          </Alert>
        ) : totalShares > 10000 ? (
          <Alert status="warning">
            <AlertIcon />
            <AlertDescription>
              Total shares cannot go over 100%.
            </AlertDescription>
          </Alert>
        ) : null}

        <Flex direction="column" gap={2}>
          {fields.map((field, index) => {
            return (
              <Flex
                key={field.id}
                gap={2}
                direction={{ base: "column", md: "row" }}
              >
                <FormControl
                  isInvalid={
                    getFieldState(`recipients.${index}.address`, formState)
                      .invalid
                  }
                >
                  <Input
                    variant="filled"
                    placeholder={AddressZero}
                    {...register(`recipients.${index}.address`)}
                  />
                  <FormErrorMessage>
                    {
                      getFieldState(`recipients.${index}.address`, formState)
                        .error?.message
                    }
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={
                    getFieldState(`recipients.${index}.sharesBps`, formState)
                      .invalid
                  }
                >
                  <BasisPointsInput
                    variant="filled"
                    value={watch(`recipients.${index}.sharesBps`)}
                    onChange={(value) =>
                      setValue(`recipients.${index}.sharesBps`, value, {
                        shouldTouch: true,
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                  />
                  <FormErrorMessage>
                    {
                      getFieldState(`recipients.${index}.sharesBps`, formState)
                        .error?.message
                    }
                  </FormErrorMessage>
                </FormControl>
                <IconButton
                  borderRadius="md"
                  isDisabled={index === 0 || formState.isSubmitting}
                  colorScheme="red"
                  icon={<IoMdRemove />}
                  aria-label="remove row"
                  onClick={() => remove(index)}
                />
              </Flex>
            );
          })}
        </Flex>

        {/* then render high level controls */}
        <Flex>
          <Button
            leftIcon={<IoMdAdd />}
            onClick={() => append({ address: "", sharesBps: 0 })}
          >
            Add Recipient
          </Button>
        </Flex>
      </Flex>
    </>
  );
};
