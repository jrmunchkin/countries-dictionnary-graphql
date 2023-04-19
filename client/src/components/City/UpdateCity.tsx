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
import UPDATE_CITY from "../../subqueries/update-city";
import GET_CITY from "../../subqueries/get-city";
import { UpdateCityMutation, UpdateCityForm, City } from "../../types/types";

interface UpdateCityDialog {
  isOpen: boolean;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
  city: City;
}

export default function UpdateCity({
  isOpen,
  onClose,
  city,
}: UpdateCityDialog) {
  const [updateCity] = useMutation<UpdateCityMutation>(UPDATE_CITY);

  const [errorMutation, setErrorMutation] = useState<string>("");

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateCityForm>({
    resolver: yupResolver(validationSchema),
  });

  const submitDialog: SubmitHandler<UpdateCityForm> = async (
    fields: UpdateCityForm,
    event: any
  ) => {
    updateCity({
      variables: {
        code: city.code,
        input: {
          name: fields.name,
          area: Number(fields.area),
          population: Number(fields.population),
        },
      },
      onCompleted: (result) => {
        if (result?.updateCity.message) {
          setErrorMutation(result?.updateCity.message);
        } else {
          setErrorMutation("");
          onClose(event);
        }
      },
      refetchQueries: [
        {
          query: GET_CITY,
          variables: { code: city.code },
        },
      ],
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Update city</DialogTitle>
      <DialogContent>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-4">
            <div className="mb-4">
              <TextField
                required
                defaultValue={city.name}
                error={errors.name ? true : false}
                id="name"
                label="Name"
                {...register("name")}
                helperText={errors.name?.message}
              ></TextField>
            </div>
            <div className="mb-4">
              <TextField
                defaultValue={city.area}
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
                defaultValue={city.population}
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
        <Button onClick={handleSubmit(submitDialog)}>Update city</Button>
      </DialogActions>
    </Dialog>
  );
}
