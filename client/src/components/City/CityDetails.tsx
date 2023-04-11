import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Update } from "@mui/icons-material";
import UpdateCity from "./UpdateCity";
import GET_CITY from "../../subqueries/get-city";
import UPDATE_CITY from "../../subqueries/update-city";
import { Code, CityQuery, UpdateCityMutation } from "../../types/types";

export default function CityDetails({ code }: Code) {
  const [updateCity] = useMutation<UpdateCityMutation>(UPDATE_CITY);

  const { loading, error, data } = useQuery<CityQuery | undefined>(GET_CITY, {
    variables: { code: code },
    fetchPolicy: "network-only",
  });

  const [isUpdateCityOpen, setIsUpdateCityOpen] = useState<boolean>(false);

  const handleCloseUpdateCity = () => {
    setIsUpdateCityOpen(false);
  };

  function uploadBase64Photo(file: File, photoNumber: number) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      if (reader.result) {
        let photo = reader.result as string;
        let input;
        if (photoNumber == 1) input = { photo1: photo.split(",")[1] };
        if (photoNumber == 2) input = { photo2: photo.split(",")[1] };
        if (photoNumber == 3) input = { photo3: photo.split(",")[1] };
        if (photoNumber == 4) input = { photo4: photo.split(",")[1] };
        updateCity({
          variables: {
            code: code,
            input: input,
          },
          onCompleted: (result) => {
            if (result?.updateCity.message) {
              console.log(result?.updateCity.message);
            }
          },
          refetchQueries: [
            {
              query: GET_CITY,
              variables: { code: code },
            },
          ],
        });
      }
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }

  if (loading)
    return (
      <div className="flex justify-center">
        <CircularProgress size="10rem" />
      </div>
    );
  if (error) return <div>Error : {error.message}</div>;

  return (
    <div>
      {data?.city.code ? (
        <div>
          <div className="flex items-stretch">
            <Avatar aria-label="recipe">{data?.city.code}</Avatar>
            <h1 className="ml-4 mt-1 text-2xl">{data?.city.name}</h1>
            <div className="mt-1">
              <Button
                onClick={() => {
                  setIsUpdateCityOpen(true);
                }}
              >
                <Update /> Update
              </Button>
              <UpdateCity
                isOpen={isUpdateCityOpen}
                onClose={handleCloseUpdateCity}
                city={data?.city}
              />
            </div>
          </div>
          <div className="grid grid-cols-1">
            <List>
              <ListItem>
                <ListItemText
                  primary={
                    "Area : " +
                    (data?.city.area
                      ? new Intl.NumberFormat().format(data?.city.area) + " km"
                      : "unknown")
                  }
                ></ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    "Population : " +
                    (data?.city.population
                      ? new Intl.NumberFormat().format(data?.city.population)
                      : "unknown")
                  }
                ></ListItemText>
              </ListItem>
            </List>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <IconButton
                color="primary"
                aria-label="upload photo"
                component="label"
              >
                <input
                  hidden
                  accept=".png"
                  type="file"
                  onChange={(e) => {
                    if (e.target.files) {
                      uploadBase64Photo(e.target.files[0], 1);
                    }
                  }}
                />
                {data?.city.photo1 ? (
                  <img
                    height={200}
                    width={400}
                    src={`data:image/png;base64, ${data?.city.photo1}`}
                  />
                ) : (
                  <img height={150} width={150} src="empty_picture.png" />
                )}
              </IconButton>
              <IconButton
                color="primary"
                aria-label="upload photo"
                component="label"
              >
                <input
                  hidden
                  accept=".png"
                  type="file"
                  onChange={(e) => {
                    if (e.target.files) {
                      uploadBase64Photo(e.target.files[0], 2);
                    }
                  }}
                />
                {data?.city.photo2 ? (
                  <img
                    height={200}
                    width={400}
                    src={`data:image/png;base64, ${data?.city.photo2}`}
                  />
                ) : (
                  <img height={150} width={150} src="empty_picture.png" />
                )}
              </IconButton>
              <IconButton
                color="primary"
                aria-label="upload photo"
                component="label"
              >
                <input
                  hidden
                  accept=".png"
                  type="file"
                  onChange={(e) => {
                    if (e.target.files) {
                      uploadBase64Photo(e.target.files[0], 3);
                    }
                  }}
                />
                {data?.city.photo3 ? (
                  <img
                    height={200}
                    width={400}
                    src={`data:image/png;base64, ${data?.city.photo3}`}
                  />
                ) : (
                  <img height={150} width={150} src="empty_picture.png" />
                )}
              </IconButton>
              <IconButton
                color="primary"
                aria-label="upload photo"
                component="label"
              >
                <input
                  hidden
                  accept=".png"
                  type="file"
                  onChange={(e) => {
                    if (e.target.files) {
                      uploadBase64Photo(e.target.files[0], 4);
                    }
                  }}
                />
                {data?.city.photo4 ? (
                  <img
                    height={200}
                    width={400}
                    src={`data:image/png;base64, ${data?.city.photo4}`}
                  />
                ) : (
                  <img height={150} width={150} src="empty_picture.png" />
                )}
              </IconButton>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-screen"></div>
      )}
    </div>
  );
}
