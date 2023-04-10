interface Code {
  code: string;
}

interface Continent {
  code: string;
  name: string;
  area?: number;
  population?: number;
  photo?: string;
  countries?: Country[];
}

interface Country {
  code: string;
  name: string;
  area?: number;
  population?: number;
  currency?: string;
  capital?: City;
  languages?: Language[];
  neighbors?: Country[];
  cities?: City[];
  flag?: string;
  message?: string;
}

interface City {
  code: string;
  name: string;
  area?: number;
  population?: number;
  photo1?: string;
  photo2?: string;
  photo3?: string;
  photo4?: string;
  message?: string;
}

interface Language {
  code: string;
  name: string;
  message?: string;
}

interface ContinentsQuery {
  continents: Continent[];
}

interface CountriesQuery {
  countries: Country[];
}

interface CountriesByContinentQuery {
  countriesByContinent: Country[];
}

interface CountryQuery {
  country: Country;
}

interface CityQuery {
  city: City;
}

interface CitiesByCountryQuery {
  citiesByCountry: City[];
}

interface LanguagesQuery {
  languages: Language[];
}

interface CreateCountryMutation {
  createCountry: Country;
}

interface UpdateCountryMutation {
  updateCountry: Country;
}

interface UpdateCityMutation {
  updateCity: City;
}

interface CreateCityMutation {
  createCity: City;
}

interface CreateLanguageMutation {
  createLanguage: Language;
}

interface AddNeighborToCountryMutation {
  addNeighborToCountry: Country;
}

interface AddLanguageToCountryMutation {
  addLanguageToCountry: Country;
}

interface CreateCountryForm {
  code: string;
  name: string;
  area?: number;
  population?: number;
  currency?: string;
}

interface UpdateCountryForm {
  name: string;
  area?: number;
  population?: number;
  currency?: string;
}

interface CreateCityForm {
  code: string;
  name: string;
  area?: number;
  population?: number;
}

interface UpdateCityForm {
  name: string;
  area?: number;
  population?: number;
}

interface CreateLanguageForm {
  code: string;
  name: string;
}

export type {
  Code,
  Continent,
  Country,
  City,
  Language,
  ContinentsQuery,
  CountriesQuery,
  CountriesByContinentQuery,
  CountryQuery,
  CityQuery,
  CitiesByCountryQuery,
  LanguagesQuery,
  CreateCountryMutation,
  UpdateCountryMutation,
  CreateCityMutation,
  UpdateCityMutation,
  CreateLanguageMutation,
  AddNeighborToCountryMutation,
  AddLanguageToCountryMutation,
  CreateCountryForm,
  UpdateCountryForm,
  CreateCityForm,
  UpdateCityForm,
  CreateLanguageForm,
};
