import { useQuery } from "@apollo/client";
import { useState } from "react";
import {
  Paper,
  CircularProgress,
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
import CountryDetails from "./CountryDetails";
import CreateCountry from "./CreateCountry";
import GET_COUNTRIES_BY_CONTINENT from "../../subqueries/get-countries-by-continent";
import { Country, CountriesByContinentQuery } from "../../types/types";

interface CountryPanel {
  continentCode: string;
}

export default function CountryPanel({ continentCode }: CountryPanel) {
  const { loading, error, data } = useQuery<
    CountriesByContinentQuery | undefined
  >(GET_COUNTRIES_BY_CONTINENT, {
    variables: {
      continent: continentCode,
    },
  });

  const rowsPerPage = 5;
  const [countryCode, setCountryCode] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [isCreateCountryOpen, setIsCreateCountryOpen] =
    useState<boolean>(false);

  const handleCloseCreateCountry = () => {
    setIsCreateCountryOpen(false);
  };

  if (loading)
    return (
      <div className="flex h-screen justify-center items-center">
        <CircularProgress size="10rem" />
      </div>
    );
  if (error) return <div className="h-screen">Error : {error.message}</div>;

  return (
    <div className="p-6">
      <div className="max-h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Countries</h2>
          <Button
            onClick={() => {
              setIsCreateCountryOpen(true);
            }}
            size="small"
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Add /> New Country
          </Button>
          <CreateCountry
            isOpen={isCreateCountryOpen}
            onClose={handleCloseCreateCountry}
            continentCode={continentCode}
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
              {data?.countriesByContinent
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((country: Country, index: number) => {
                  return (
                    <TableRow
                      key={country.code}
                      className={`${
                        index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      <TableCell component="th" scope="row">
                        {country.code}
                      </TableCell>
                      <TableCell align="right">{country.name}</TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          onClick={() => {
                            setCountryCode(country.code);
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
          count={
            data?.countriesByContinent ? data?.countriesByContinent.length : 0
          }
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event: unknown, newPage: number) => {
            setPage(newPage);
          }}
          className="mt-4"
        />
      </div>
      <div className="h-screen">
        {countryCode ? <CountryDetails code={countryCode} /> : <></>}
      </div>
    </div>
  );
}
