import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Collapse,
  Drawer,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Add,
  ArrowForward,
  Update,
  PhotoCamera,
} from "@mui/icons-material";
import AddNeighbor from "./AddNeighbor";
import UpdateCountry from "./UpdateCountry";
import AddLanguage from "./AddLanguage";
import CityPanel from "../City/CityPanel";
import GET_COUNTRY from "../../subqueries/get-country";
import UPDATE_COUNTRY from "../../subqueries/update-country";
import {
  Code,
  Language,
  Country,
  CountryQuery,
  UpdateCountryMutation,
} from "../../types/types";

export default function CountryDetails({ code }: Code) {
  const [updateCountry] = useMutation<UpdateCountryMutation>(UPDATE_COUNTRY);

  const { loading, error, data } = useQuery<CountryQuery | undefined>(
    GET_COUNTRY,
    {
      variables: { code: code },
      fetchPolicy: "network-only",
    }
  );

  const [languageOpen, setLanguageOpen] = useState<boolean>(false);
  const [neighborOpen, setNeighborOpen] = useState<boolean>(false);
  const [isAddLanguageOpen, setIsAddLanguageOpen] = useState<boolean>(false);
  const [isAddNeighborOpen, setIsAddNeighborOpen] = useState<boolean>(false);
  const [isUpdateCountryOpen, setIsUpdateCountryOpen] =
    useState<boolean>(false);
  const [isPanelOpen, setIsPanelOpen] = useState<any>({ left: false });
  const [countryCode, setCountryCode] = useState<string>("");

  const toggleDrawer =
    (code: string, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setCountryCode(code);
      setIsPanelOpen({ ["left"]: open });
    };

  const handleCloseUpdateCountry = () => {
    setIsUpdateCountryOpen(false);
  };

  const handleCloseAddNeighbor = () => {
    setIsAddNeighborOpen(false);
  };

  const handleCloseAddLanguage = () => {
    setIsAddLanguageOpen(false);
  };

  function uploadBase64Flag(file: File) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      if (reader.result) {
        let flag = reader.result as string;
        updateCountry({
          variables: {
            code: code,
            input: {
              flag: flag.split(",")[1],
            },
          },
          onCompleted: (result) => {
            if (result?.updateCountry.message) {
              console.log(result?.updateCountry.message);
            }
          },
          refetchQueries: [
            {
              query: GET_COUNTRY,
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

  if (loading) return <div className="h-screen">Loading country...</div>;
  if (error) return <div className="h-screen">Error : {error.message}</div>;

  return (
    <div>
      {data?.country.code ? (
        <div className="h-screen">
          <div className="flex items-stretch">
            <Tooltip title="Insert flag" placement="top">
              <IconButton
                color="primary"
                aria-label="upload flag"
                component="label"
              >
                <input
                  hidden
                  accept=".png"
                  type="file"
                  onChange={(e) => {
                    if (e.target.files) {
                      uploadBase64Flag(e.target.files[0]);
                    }
                  }}
                />
                {data?.country.flag ? (
                  <Avatar
                    className="pointer-events-none"
                    aria-label="recipe"
                    src={`data:image/png;base64, ${data?.country.flag}`}
                  />
                ) : (
                  <Avatar aria-label="recipe">
                    <PhotoCamera />
                  </Avatar>
                )}
              </IconButton>
            </Tooltip>
            <h1 className="ml-4 mt-2 text-2xl">{data?.country.name}</h1>
            <div className="mt-2">
              <Button
                onClick={() => {
                  setIsUpdateCountryOpen(true);
                }}
              >
                <Update /> Update
              </Button>
              <UpdateCountry
                isOpen={isUpdateCountryOpen}
                onClose={handleCloseUpdateCountry}
                country={data?.country}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <List>
              <ListItem>
                <ListItemText
                  primary={
                    "Area : " +
                    (data?.country.area
                      ? new Intl.NumberFormat().format(data?.country.area) +
                        " km"
                      : "unknown")
                  }
                ></ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    "Population : " +
                    (data?.country.population
                      ? new Intl.NumberFormat().format(data?.country.population)
                      : "unknown")
                  }
                ></ListItemText>
              </ListItem>
              <ListItemButton
                onClick={() => {
                  setLanguageOpen(!languageOpen);
                }}
              >
                <ListItemText primary="Spoken languages"></ListItemText>
                {languageOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={languageOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {data?.country.languages &&
                  data?.country.languages.length > 0 ? (
                    data.country.languages.map((language: Language) => {
                      return (
                        <ListItem key={language.code}>
                          <ListItemText
                            sx={{ pl: 4 }}
                            primary={language.name}
                          />
                        </ListItem>
                      );
                    })
                  ) : (
                    <></>
                  )}
                  <ListItem>
                    <Button
                      onClick={() => {
                        setIsAddLanguageOpen(true);
                      }}
                      sx={{ pl: 4 }}
                    >
                      <Add /> Add language
                    </Button>
                    <AddLanguage
                      isOpen={isAddLanguageOpen}
                      onClose={handleCloseAddLanguage}
                      countryCode={data?.country.code}
                    />
                  </ListItem>
                </List>
              </Collapse>
            </List>
            <List>
              <ListItem>
                <ListItemText
                  primary={
                    "Currency : " +
                    (data?.country.currency
                      ? data?.country.currency
                      : "unknown")
                  }
                ></ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    "Capital : " +
                    (data?.country.capital?.name
                      ? data?.country.capital.name
                      : "unknown")
                  }
                ></ListItemText>
              </ListItem>
              <ListItemButton
                onClick={() => {
                  setNeighborOpen(!neighborOpen);
                }}
              >
                <ListItemText primary="Neighbors"></ListItemText>
                {neighborOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={neighborOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {data?.country.neighbors &&
                  data?.country.neighbors.length > 0 ? (
                    data.country.neighbors.map((neighbor: Country) => {
                      return (
                        <ListItem key={neighbor.code}>
                          <ListItemText
                            sx={{ pl: 4 }}
                            primary={neighbor.name}
                          />
                        </ListItem>
                      );
                    })
                  ) : (
                    <></>
                  )}
                  <ListItem>
                    <Button
                      onClick={() => {
                        setIsAddNeighborOpen(true);
                      }}
                      sx={{ pl: 4 }}
                    >
                      <Add /> Add neighbor
                    </Button>
                    <AddNeighbor
                      isOpen={isAddNeighborOpen}
                      onClose={handleCloseAddNeighbor}
                      countryCode={data?.country.code}
                    />
                  </ListItem>
                </List>
              </Collapse>
            </List>
          </div>
          <Button
            onClick={toggleDrawer(data?.country.code, true)}
            endIcon={<ArrowForward />}
          >
            Cities
          </Button>
        </div>
      ) : (
        <div className="h-screen"></div>
      )}
      <Drawer
        anchor={"left"}
        open={isPanelOpen["left"]}
        onClose={toggleDrawer("", false)}
        PaperProps={{
          sx: {
            width: {
              xs: "85%",
              sm: "65%",
              lg: "50%",
            },
          },
        }}
      >
        <div className="bg-gradient-to-r from-gray-200 to-gray-400">
          <CityPanel countryCode={countryCode} />
        </div>
      </Drawer>
    </div>
  );
}
