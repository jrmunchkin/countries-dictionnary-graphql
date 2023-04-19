import { useMutation, useQuery } from "@apollo/client";
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
  FormControl,
  Autocomplete,
} from "@mui/material";
import UPDATE_COUNTRY from "../../subqueries/update-country";
import GET_COUNTRY from "../../subqueries/get-country";
import GET_CITIES_BY_COUNTRY from "../../subqueries/get-cities-by-country";
import {
  UpdateCountryMutation,
  UpdateCountryForm,
  Country,
  City,
  CitiesByCountryQuery,
} from "../../types/types";

interface UpdateCountryDialog {
  isOpen: boolean;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
  country: Country;
}

export default function UpdateCountry({
  isOpen,
  onClose,
  country,
}: UpdateCountryDialog) {
  const [updateCountry] = useMutation<UpdateCountryMutation>(UPDATE_COUNTRY);

  const { loading, error, data } = useQuery<CitiesByCountryQuery | undefined>(
    GET_CITIES_BY_COUNTRY,
    {
      variables: {
        country: country.code,
      },
    }
  );

  const [errorMutation, setErrorMutation] = useState<string>("");
  const [capital, setCapital] = useState<string>("");

  const optionsValues = () => {
    let options: any = [];
    data?.citiesByCountry.map((city: City) => {
      options.push({ label: city.name, code: city.code });
    });
    return options;
  };

  const validationSchema = Yup.object().shape({
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
  } = useForm<UpdateCountryForm>({
    resolver: yupResolver(validationSchema),
  });

  const submitDialog: SubmitHandler<UpdateCountryForm> = async (
    fields: UpdateCountryForm,
    event: any
  ) => {
    updateCountry({
      variables: {
        code: country.code,
        input: {
          name: fields.name,
          area: Number(fields.area),
          population: Number(fields.population),
          currency: fields.currency,
          capital: capital,
        },
      },
      onCompleted: (result) => {
        if (result?.updateCountry.message) {
          setErrorMutation(result?.updateCountry.message);
        } else {
          setErrorMutation("");
          onClose(event);
        }
      },
      refetchQueries: [
        {
          query: GET_COUNTRY,
          variables: { code: country.code },
        },
      ],
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Update country</DialogTitle>
      <DialogContent>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-4">
            <div className="mb-4">
              <TextField
                required
                defaultValue={country.name}
                error={errors.name ? true : false}
                id="name"
                label="Name"
                {...register("name")}
                helperText={errors.name?.message}
              ></TextField>
            </div>
            <div className="mb-4">
              <TextField
                defaultValue={country.area}
                error={errors.area ? true : false}
                type="number"
                id="area"
                label="Area"
                {...register("area")}
                helperText={errors.area?.message}
              ></TextField>
            </div>
            <div className="mb-4">
              <FormControl required fullWidth>
                <Autocomplete
                  defaultValue={country.capital?.name}
                  disablePortal={false}
                  id="combo-box-demo"
                  options={optionsValues()}
                  renderInput={(params) => (
                    <TextField {...params} label="Capital" />
                  )}
                  onChange={(event, value: any) => {
                    setCapital(value?.code);
                  }}
                />
              </FormControl>
            </div>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <TextField
                defaultValue={country.population}
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
                defaultValue={country.currency}
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
        <Button onClick={handleSubmit(submitDialog)}>Update country</Button>
      </DialogActions>
    </Dialog>
  );
}
