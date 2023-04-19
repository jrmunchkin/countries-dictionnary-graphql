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
import GET_CITIES_BY_COUNTRY from "../../subqueries/get-cities-by-country";
import ADD_CITY from "../../subqueries/add-city";
import { CreateCityForm, CreateCityMutation } from "../../types/types";

interface AddCityDialog {
  isOpen: boolean;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
  countryCode: string;
}

export default function CreateCity({
  isOpen,
  onClose,
  countryCode,
}: AddCityDialog) {
  const [addCity] = useMutation<CreateCityMutation>(ADD_CITY);

  const [errorMutation, setErrorMutation] = useState<string>("");

  const validationSchema = Yup.object().shape({
    code: Yup.string()
      .required("Code is required")
      .min(3, "Code must be of 3 characters")
      .max(3, "Code must be of 3 characters"),
    name: Yup.string().required("Name is required"),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCityForm>({
    resolver: yupResolver(validationSchema),
  });

  const submitDialog: SubmitHandler<CreateCityForm> = async (
    fields: CreateCityForm,
    event: any
  ) => {
    addCity({
      variables: {
        input: {
          country: countryCode,
          code: fields.code,
          name: fields.name,
          area: Number(fields.area),
          population: Number(fields.population),
        },
      },
      onCompleted: (result) => {
        if (result?.createCity.message) {
          setErrorMutation(result?.createCity.message);
        } else {
          setErrorMutation("");
          onClose(event);
        }
      },
      refetchQueries: [
        {
          query: GET_CITIES_BY_COUNTRY,
          variables: { country: countryCode },
        },
      ],
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Create new city</DialogTitle>
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
          </div>
          <div className="p-4">
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
          </div>
        </div>
        <Typography variant="inherit" color="red">
          {errorMutation}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(submitDialog)}>Create city</Button>
      </DialogActions>
    </Dialog>
  );
}
