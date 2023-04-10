type Context = {
  environment: string;
};

type Code = {
  code: string;
};

type ContinentCode = {
  continent: string;
};

type CountryCode = {
  country: string;
};

type ContinentType = {
  code: string;
  name: string;
  area?: number;
  population?: number;
  photo?: string;
  countries?: string[];
};

type CountryType = {
  code: string;
  name: string;
  area?: number;
  population?: number;
  currency?: string;
  capital?: string;
  neighbors?: string[];
  cities?: string[];
  languages?: string[];
  flag?: string;
  continent: string;
};

type CityType = {
  code: string;
  name: string;
  area?: number;
  population?: number;
  photo1?: string;
  photo2?: string;
  photo3?: string;
  photo4?: string;
  country: string;
};

type LanguageType = {
  code: string;
  name: string;
  countries?: string[];
};

type ContinentCreateInput = {
  input: {
    code: string;
    name: string;
    area?: number;
    population?: number;
    photo?: string;
  };
};

type ContinentUpdateInput = {
  code: string;
  input: {
    name?: string;
    area?: number;
    population?: number;
    photo?: string;
  };
};

type CountryCreateInput = {
  input: {
    code: string;
    name: string;
    area?: number;
    population?: number;
    currency?: string;
    capital?: string;
    flag?: string;
    continent: string;
  };
};

type CountryUpdateInput = {
  code: string;
  input: {
    name?: string;
    area?: number;
    population?: number;
    currency?: string;
    capital?: string;
    continent?: string;
    flag?: string;
  };
};

type CountryAddNeighborInput = {
  code: string;
  neighbor: string;
};

type CountryAddLanguageInput = {
  code: string;
  language: string;
};

type CityCreateInput = {
  input: {
    code: string;
    name: string;
    area?: number;
    population?: number;
    photo1?: string;
    photo2?: string;
    photo3?: string;
    photo4?: string;
    country: string;
  };
};

type CityUpdateInput = {
  code: string;
  input: {
    name?: string;
    area?: number;
    population?: number;
    country?: string;
    photo1?: string;
    photo2?: string;
    photo3?: string;
    photo4?: string;
  };
};

type LanguageCreateInput = {
  input: {
    code: string;
    name: string;
  };
};

type LanguageUpdateInput = {
  code: string;
  input: {
    name?: string;
  };
};

type LanguageAddCountryInput = {
  code: string;
  country: string;
};

type ErrorMessage = {
  message?: string;
};

type ContinentResult = ContinentType & ErrorMessage;

type CountryResult = CountryType & ErrorMessage;

type CityResult = CityType & ErrorMessage;

type LanguageResult = LanguageType & ErrorMessage;

export {
  Context,
  Code,
  ContinentCode,
  CountryCode,
  ContinentType,
  CountryType,
  CityType,
  LanguageType,
  ContinentCreateInput,
  ContinentUpdateInput,
  CountryCreateInput,
  CountryUpdateInput,
  CountryAddNeighborInput,
  CountryAddLanguageInput,
  CityCreateInput,
  CityUpdateInput,
  LanguageCreateInput,
  LanguageUpdateInput,
  LanguageAddCountryInput,
  ContinentResult,
  CountryResult,
  CityResult,
  LanguageResult,
  ErrorMessage,
};
