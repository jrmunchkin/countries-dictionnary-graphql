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
import { Add } from "@mui/icons-material";
import CreateLanguage from "./CreateLanguage";
import GET_COUNTRY from "../../subqueries/get-country";
import GET_LANGUAGES from "../../subqueries/get-languages";
import ADD_LANGUAGE_TO_COUNTRY from "../../subqueries/add-language-to-country";
import {
  Language,
  LanguagesQuery,
  AddLanguageToCountryMutation,
} from "../../types/types";

interface AddLanguageDialog {
  isOpen: boolean;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
  countryCode: string;
}

export default function AddLanguage({
  isOpen,
  onClose,
  countryCode,
}: AddLanguageDialog) {
  const [addLanguageToCountry] = useMutation<AddLanguageToCountryMutation>(
    ADD_LANGUAGE_TO_COUNTRY
  );
  const { data, error, loading } = useQuery<LanguagesQuery | undefined>(
    GET_LANGUAGES
  );

  const [language, setLanguage] = useState<string>("");
  const [errorMutation, setErrorMutation] = useState<string>("");
  const [isCreateLanguageOpen, setIsCreateLanguageOpen] =
    useState<boolean>(false);

  const handleCloseCreateLanguage = () => {
    setIsCreateLanguageOpen(false);
  };

  const submitDialog = async (event: any) => {
    addLanguageToCountry({
      variables: {
        code: countryCode,
        language: language,
      },
      onCompleted: (result) => {
        if (result?.addLanguageToCountry.message) {
          setErrorMutation(result?.addLanguageToCountry.message);
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
    data?.languages.map((language: Language) => {
      options.push({ label: language.name, code: language.code });
    });
    return options;
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Add language to this country</DialogTitle>
      <DialogContent>
        <div className="flex flex-col float-right mb-2">
          <Button
            onClick={() => {
              setIsCreateLanguageOpen(true);
            }}
          >
            <Add /> New language
          </Button>
          <CreateLanguage
            isOpen={isCreateLanguageOpen}
            onClose={handleCloseCreateLanguage}
          />
        </div>
        <div className="p-4">
          <FormControl required fullWidth>
            <Autocomplete
              disablePortal={false}
              id="combo-box-demo"
              options={optionsValues()}
              sx={{ width: 250 }}
              renderInput={(params) => (
                <TextField {...params} label="Language" />
              )}
              onChange={(event, value: any) => {
                setLanguage(value.code);
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
        <Button onClick={submitDialog}>Add language</Button>
      </DialogActions>
    </Dialog>
  );
}
