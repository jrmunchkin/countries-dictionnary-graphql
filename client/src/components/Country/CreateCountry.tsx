import { useMutation } from "@apollo/client";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import GET_COUNTRIES_BY_CONTINENT from "../../subqueries/get-countries-by-continent";
import ADD_COUNTRY from "../../subqueries/add-country";
import { CreateCountryForm, CreateCountryMutation } from "../../types/types";

interface CreateCountryDialog {
  isOpen: boolean;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
  continentCode: string;
}

export default function CreateCountry({
  isOpen,
  onClose,
  continentCode,
}: CreateCountryDialog) {
  const [addCountry] = useMutation<CreateCountryMutation>(ADD_COUNTRY);

  const [errorMutation, setErrorMutation] = useState<string>("");

  const validationSchema = Yup.object().shape({
    code: Yup.string()
      .required("Code is required")
      .min(2, "Code must be of 2 characters")
      .max(2, "Code must be of 2 characters"),
    name: Yup.string().required("Name is required"),
    currency: Yup.string()
      .min(3, "Currency must be of 3 characters")
      .max(3, "Currency must be of 3 characters"),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCountryForm>({
    resolver: yupResolver(validationSchema),
  });

  const submitDialog: SubmitHandler<CreateCountryForm> = async (
    fields: CreateCountryForm,
    event: any
  ) => {
    addCountry({
      variables: {
        input: {
          continent: continentCode,
          code: fields.code,
          name: fields.name,
          area: fields.area,
          population: fields.population,
          currency: fields.currency,
        },
      },
      onCompleted: (result) => {
        if (result?.createCountry.message) {
          setErrorMutation(result?.createCountry.message);
        } else {
          setErrorMutation("");
          onClose(event);
        }
      },
      refetchQueries: [
        {
          query: GET_COUNTRIES_BY_CONTINENT,
          variables: { continent: continentCode },
        },
      ],
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Create new country</DialogTitle>
      <DialogContent>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-4">
            <div className="mb-4">
              <TextField
                required
                error={errors.code ? true : false}
                id="code"
                label="Code"
                {...register("code")}
                name="code"
                helperText={errors.code?.message}
              ></TextField>
            </div>
            <div className="mb-4">
              <TextField
                required
                error={errors.name ? true : false}
                id="name"
                label="Name"
                {...register("name")}
                helperText={errors.name?.message}
              ></TextField>
            </div>
            <div className="mb-4">
              <TextField
                error={errors.area ? true : false}
                type="number"
                id="area"
                label="Area"
                {...register("area")}
                helperText={errors.area?.message}
              ></TextField>
            </div>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <TextField
                error={errors.population ? true : false}
                type="number"
                id="population"
                label="Population"
                {...register("population")}
                helperText={errors.population?.message}
              ></TextField>
            </div>
            <div className="mb-4">
              <TextField
                error={errors.currency ? true : false}
                id="currency"
                label="Currency symbol"
                {...register("currency")}
                helperText={errors.currency?.message}
              ></TextField>
            </div>
          </div>
        </div>
        <Typography variant="inherit" color="red">
          {errorMutation}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(submitDialog)}>Create country</Button>
      </DialogActions>
    </Dialog>
  );
}
