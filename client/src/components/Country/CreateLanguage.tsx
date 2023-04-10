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
import GET_LANGUAGES from "../../subqueries/get-languages";
import ADD_LANGUAGE from "../../subqueries/add-language";
import { CreateLanguageForm, CreateLanguageMutation } from "../../types/types";

interface AddLanguageDialog {
  isOpen: boolean;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
}

export default function CreateLanguage({ isOpen, onClose }: AddLanguageDialog) {
  const [addLanguage] = useMutation<CreateLanguageMutation>(ADD_LANGUAGE);

  const [errorMutation, setErrorMutation] = useState<string>("");

  const validationSchema = Yup.object().shape({
    code: Yup.string()
      .required("Code is required")
      .min(2, "Code must be of 2 characters")
      .max(2, "Code must be of 2 characters"),
    name: Yup.string().required("Name is required"),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLanguageForm>({
    resolver: yupResolver(validationSchema),
  });

  const submitDialog: SubmitHandler<CreateLanguageForm> = async (
    fields: CreateLanguageForm,
    event: any
  ) => {
    addLanguage({
      variables: {
        input: {
          code: fields.code,
          name: fields.name,
        },
      },
      onCompleted: (result) => {
        if (result?.createLanguage.message) {
          setErrorMutation(result?.createLanguage.message);
        } else {
          setErrorMutation("");
          onClose(event);
        }
      },
      refetchQueries: [
        {
          query: GET_LANGUAGES,
        },
      ],
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Create new language</DialogTitle>
      <DialogContent>
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
        <Typography variant="inherit" color="red">
          {errorMutation}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(submitDialog)}>Create language</Button>
      </DialogActions>
    </Dialog>
  );
}
