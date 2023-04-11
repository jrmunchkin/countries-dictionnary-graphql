import { useQuery } from "@apollo/client";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Button,
  Drawer,
  CircularProgress,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import CountryPanel from "../Country/CountryPanel";
import GET_CONTINENTS from "../../subqueries/get-continents";
import { Continent, ContinentsQuery } from "../../types/types";

export default function ContinentList() {
  const { loading, error, data } = useQuery<ContinentsQuery | undefined>(
    GET_CONTINENTS
  );

  const [isPanelOpen, setIsPanelOpen] = useState<any>({ left: false });
  const [continentCode, setContinentCode] = useState<string>("");

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
      setContinentCode(code);
      setIsPanelOpen({ ["left"]: open });
    };

  if (loading)
    return (
      <div className="flex h-screen justify-center items-center">
        <CircularProgress size="10rem" />
      </div>
    );
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data?.continents.map((continent: Continent) => (
          <Card key={continent.code}>
            <CardHeader
              avatar={<Avatar aria-label="recipe">{continent.code}</Avatar>}
              title={continent.name}
            />
            <CardMedia
              component="img"
              height="100"
              src={`data:image/png;base64, ${continent.photo}`}
              alt="Paella dish"
            />
            <CardContent>
              <List dense={false}>
                <ListItem>
                  <ListItemText
                    primary={
                      "Area : " +
                      (continent.area
                        ? new Intl.NumberFormat().format(continent.area) + " km"
                        : "unknown")
                    }
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary={
                      "Population : " +
                      (continent.population
                        ? new Intl.NumberFormat().format(continent.population)
                        : "unknown")
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={toggleDrawer(continent.code, true)}
                endIcon={<ArrowForward />}
              >
                Countries
              </Button>
            </CardActions>
          </Card>
        ))}
        <Drawer
          anchor="left"
          open={isPanelOpen["left"]}
          onClose={toggleDrawer("", false)}
          PaperProps={{
            sx: {
              width: {
                xs: "95%",
                sm: "80%",
                lg: "70%",
              },
            },
          }}
        >
          <div className="bg-gradient-to-r from-gray-200 to-gray-400">
            <CountryPanel continentCode={continentCode} />
          </div>
        </Drawer>
      </div>
    </div>
  );
}
