import { useQuery } from "@apollo/client";
import { useState } from "react";
import {
  Paper,
  Toolbar,
  Table,
  TableContainer,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
  Button,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import CityDetails from "./CityDetails";
import CreateCity from "./CreateCity";
import GET_CITIES_BY_COUNTRY from "../../subqueries/get-cities-by-country";
import { City, CitiesByCountryQuery } from "../../types/types";

interface CityPanel {
  countryCode: string;
}

export default function CityPanel({ countryCode }: CityPanel) {
  const { loading, error, data } = useQuery<CitiesByCountryQuery | undefined>(
    GET_CITIES_BY_COUNTRY,
    {
      variables: {
        country: countryCode,
      },
    }
  );

  const rowsPerPage = 5;
  const [cityCode, setCityCode] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [isCreateCityOpen, setIsCreateCityOpen] = useState<boolean>(false);

  const handleCloseCreateCity = () => {
    setIsCreateCityOpen(false);
  };

  return (
    <div className="p-6">
      <div className="max-h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Cities</h2>

          <Button
            onClick={() => {
              setIsCreateCityOpen(true);
            }}
            size="small"
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Add /> New City
          </Button>
          <CreateCity
            isOpen={isCreateCityOpen}
            onClose={handleCloseCreateCity}
            countryCode={countryCode}
          />
        </div>
        <TableContainer component={Paper}>
          <Table
            sx={{
              width: "100%",
            }}
            size="small"
            aria-label="a dense table"
          >
            <TableHead className="bg-gray-800">
              <TableRow>
                <TableCell style={{ color: "white" }}>Code</TableCell>
                <TableCell style={{ color: "white" }} align="right">
                  Name
                </TableCell>
                <TableCell style={{ color: "white" }} align="right">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.citiesByCountry
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((city: City, index: number) => {
                  return (
                    <TableRow
                      key={city.code}
                      className={`${
                        index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      <TableCell component="th" scope="row">
                        {city.code}
                      </TableCell>
                      <TableCell align="right">{city.name}</TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          onClick={() => {
                            setCityCode(city.code);
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[rowsPerPage]}
          component="div"
          count={data?.citiesByCountry ? data?.citiesByCountry.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event: unknown, newPage: number) => {
            setPage(newPage);
          }}
          className="mt-4"
        />
      </div>
      <div>
        <CityDetails code={cityCode} />
      </div>
    </div>
  );
}
