import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  FormControl,
  Autocomplete,
  TextField,
} from "@mui/material";
import GET_COUNTRIES from "../../subqueries/get-countries";
import ADD_NEIGHBOR_TO_COUNTRY from "../../subqueries/add-neighbor-to-country";
import GET_COUNTRY from "../../subqueries/get-country";
import {
  Country,
  CountriesQuery,
  AddNeighborToCountryMutation,
} from "../../types/types";

interface AddNeighborDialog {
  isOpen: boolean;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
  countryCode: string;
}

export default function AddNeighbor({
  isOpen,
  onClose,
  countryCode,
}: AddNeighborDialog) {
  const [addNeighborToCountry] = useMutation<AddNeighborToCountryMutation>(
    ADD_NEIGHBOR_TO_COUNTRY
  );

  const { data, error, loading } = useQuery<CountriesQuery | undefined>(
    GET_COUNTRIES
  );

  const [neighbor, setNeighbor] = useState<string>("");
  const [errorMutation, setErrorMutation] = useState<string>("");

  const submitDialog = async (event: any) => {
    addNeighborToCountry({
      variables: {
        code: countryCode,
        neighbor: neighbor,
      },
      onCompleted: (result) => {
        if (result?.addNeighborToCountry.message) {
          setErrorMutation(result?.addNeighborToCountry.message);
        } else {
          setErrorMutation("");
          onClose(event);
        }
      },
      refetchQueries: [
        {
          query: GET_COUNTRY,
          variables: { code: countryCode },
        },
      ],
    });
  };

  const optionsValues = () => {
    let options: any = [];
    data?.countries.map((country: Country) => {
      options.push({ label: country.name, code: country.code });
    });
    return options;
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Add neighbor to this country</DialogTitle>
      <DialogContent>
        <div className="p-4">
          <FormControl required fullWidth>
            <Autocomplete
              disablePortal={false}
              id="combo-box-demo"
              options={optionsValues()}
              sx={{ width: 250 }}
              renderInput={(params) => (
                <TextField {...params} label="Neighbor" />
              )}
              onChange={(event, value: any) => {
                setNeighbor(value.code);
              }}
            />
          </FormControl>
        </div>
        <Typography variant="inherit" color="red">
          {errorMutation}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={submitDialog}>Add neighbor</Button>
      </DialogActions>
    </Dialog>
  );
}
