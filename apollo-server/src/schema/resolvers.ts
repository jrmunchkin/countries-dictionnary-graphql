import ContinentsList from "../mocks/continents";
import CountryList from "../mocks/countries";
import CityList from "../mocks/cities";
import LanguageList from "../mocks/languages";
import Continent from "../models/continent";
import Country from "../models/country";
import City from "../models/city";
import Language from "../models/language";
import _ from "lodash";
import {
  Context,
  Code,
  ContinentCode,
  CountryCode,
  ContinentType,
  CountryType,
  CityType,
  LanguageType,
  ContinentCreateInput,
  CountryCreateInput,
  CityCreateInput,
  LanguageCreateInput,
  ContinentUpdateInput,
  CountryUpdateInput,
  CountryAddNeighborInput,
  CountryAddLanguageInput,
  CityUpdateInput,
  LanguageUpdateInput,
  LanguageAddCountryInput,
  ContinentResult,
  CountryResult,
  CityResult,
  LanguageResult,
  ErrorMessage,
} from "../types/types";

const resolvers = {
  // QUERY
  Query: {
    // CONTINENT
    continents: async (
      parent: any,
      args: undefined,
      context: Context
    ): Promise<ContinentType[]> => {
      return context.environment == "db"
        ? ((await Continent.find({})) as unknown as ContinentType[])
        : ContinentsList;
    },
    continent: async (
      parent: any,
      args: Code,
      context: Context
    ): Promise<ContinentType | ErrorMessage> => {
      const continent =
        context.environment == "db"
          ? ((await Continent.findOne({
              code: args.code,
            })) as unknown as ContinentType)
          : _.find(ContinentsList, { code: args.code });
      return continent ? continent : { message: "Continent not found" };
    },
    // COUNTRY
    countries: async (
      parent: any,
      args: undefined,
      context: Context
    ): Promise<CountryType[]> => {
      return context.environment == "db"
        ? ((await Country.find({})) as unknown as CountryType[])
        : CountryList;
    },
    countriesByContinent: async (
      parent: any,
      args: ContinentCode,
      context: Context
    ): Promise<CountryType[]> => {
      const countries =
        context.environment == "db"
          ? ((await Country.find({
              continent: args.continent,
            })) as unknown as CountryType[])
          : (_.filter(CountryList, (country) => {
              return country.continent == args.continent;
            }) as CountryType[]);
      return countries;
    },
    country: async (
      parent: any,
      args: Code,
      context: Context
    ): Promise<CountryType | ErrorMessage> => {
      const country =
        context.environment == "db"
          ? ((await Country.findOne({
              code: args.code,
            })) as unknown as CountryType)
          : _.find(CountryList, { code: args.code });
      return country ? country : { message: "Country not found" };
    },
    // CITY
    cities: async (
      parent: any,
      args: undefined,
      context: Context
    ): Promise<CityType[]> => {
      return context.environment == "db"
        ? ((await City.find({})) as unknown as CityType[])
        : CityList;
    },
    citiesByCountry: async (
      parent: any,
      args: CountryCode,
      context: Context
    ): Promise<CityType[]> => {
      const cities =
        context.environment == "db"
          ? ((await City.find({
              country: args.country,
            })) as unknown as CityType[])
          : (_.filter(CityList, (city) => {
              return city.country == args.country;
            }) as CityType[]);
      return cities;
    },
    city: async (
      parent: any,
      args: Code,
      context: Context
    ): Promise<CityType | ErrorMessage> => {
      const city =
        context.environment == "db"
          ? ((await City.findOne({ code: args.code })) as unknown as CityType)
          : _.find(CityList, { code: args.code });
      return city ? city : { message: "City not found" };
    },
    // LANGUAGE
    languages: async (
      parent: any,
      args: undefined,
      context: Context
    ): Promise<LanguageType[]> => {
      return context.environment == "db"
        ? ((await Language.find({})) as unknown as LanguageType[])
        : LanguageList;
    },
    language: async (
      parent: any,
      args: Code,
      context: Context
    ): Promise<LanguageType | ErrorMessage> => {
      const language =
        context.environment == "db"
          ? ((await Language.findOne({
              code: args.code,
            })) as unknown as LanguageType)
          : _.find(LanguageList, { code: args.code });
      return language ? language : { message: "Language not found" };
    },
  },

  // CONTINENT
  Continent: {
    countries: async (
      parent: ContinentType,
      args: undefined,
      context: Context
    ): Promise<CountryType[]> => {
      return context.environment == "db"
        ? ((await Country.find({
            continent: parent.code,
          })) as unknown as CountryType[])
        : (_.filter(CountryList, (country) => {
            return country.continent == parent.code;
          }) as CountryType[]);
    },
  },

  // COUNTRY
  Country: {
    continent: async (
      parent: CountryType,
      args: undefined,
      context: Context
    ): Promise<ContinentType | ErrorMessage> => {
      const continent =
        context.environment == "db"
          ? ((await Continent.findOne({
              code: parent.continent,
            })) as unknown as ContinentType)
          : _.find(ContinentsList, { code: parent.continent });
      return continent ? continent : { message: "Continent not found" };
    },
    neighbors: async (
      parent: CountryType,
      args: undefined,
      context: Context
    ): Promise<CountryType[]> => {
      return context.environment == "db"
        ? ((await Country.find({
            code: { $in: parent.neighbors },
          })) as unknown as CountryType[])
        : (_.filter(CountryList, (country) => {
            return _.includes(parent.neighbors, country.code);
          }) as CountryType[]);
    },
    capital: async (
      parent: CountryType,
      args: undefined,
      context: Context
    ): Promise<CityType | ErrorMessage> => {
      const capital =
        context.environment == "db"
          ? ((await City.findOne({
              code: parent.capital,
            })) as unknown as CityType)
          : _.find(CityList, { code: parent.capital });
      return capital ? capital : { message: "Capital not found" };
    },
    cities: async (
      parent: CountryType,
      args: undefined,
      context: Context
    ): Promise<CityType[]> => {
      return context.environment == "db"
        ? ((await City.find({ country: parent.code })) as unknown as CityType[])
        : (_.filter(CityList, (city) => {
            return city.country == parent.code;
          }) as CityType[]);
    },
    languages: async (
      parent: CountryType,
      args: undefined,
      context: Context
    ): Promise<LanguageType[]> => {
      return context.environment == "db"
        ? ((await Language.find({
            code: { $in: parent.languages },
          })) as unknown as LanguageType[])
        : (_.filter(LanguageList, (language) => {
            return _.includes(parent.languages, language.code);
          }) as LanguageType[]);
    },
  },

  // CITY
  City: {
    country: async (
      parent: CityType,
      args: undefined,
      context: Context
    ): Promise<CountryType | ErrorMessage> => {
      const country =
        context.environment == "db"
          ? ((await Country.findOne({
              code: parent.country,
            })) as unknown as CountryType)
          : _.find(CountryList, { code: parent.country });
      return country ? country : { message: "Country not found" };
    },
  },

  // LANGUAGE
  Language: {
    countries: async (
      parent: LanguageType,
      args: undefined,
      context: Context
    ): Promise<CountryType[]> => {
      return context.environment == "db"
        ? ((await Country.find({
            code: { $in: parent.countries },
          })) as unknown as CountryType[])
        : (_.filter(CountryList, (country) => {
            return _.includes(parent.countries, country.code);
          }) as CountryType[]);
    },
  },

  // MUTATION
  Mutation: {
    // CONTINENT
    createContinent: async (
      parent: any,
      args: ContinentCreateInput,
      context: Context
    ): Promise<ContinentType | ErrorMessage> => {
      const continent = args.input;
      if (context.environment == "db") {
        // CREATE
        const continentToSave = new Continent(continent);
        return continentToSave
          .save()
          .then((continentSaved) => {
            return continentSaved as unknown as ContinentType;
          })
          .catch((err) => {
            return err.code === 11000
              ? { message: "Continent already exist" }
              : { message: "Something went wrong during saving" };
          });
      } else {
        // CREATE
        ContinentsList.push(continent);
        return continent;
      }
    },
    updateContinent: async (
      parent: any,
      args: ContinentUpdateInput,
      context: Context
    ): Promise<ContinentType | ErrorMessage> => {
      let continentUpdated;
      if (context.environment == "db") {
        // UPDATE
        const continentFieldToUpdate = {} as ContinentType;
        if (args.input.name) continentFieldToUpdate.name = args.input.name;
        if (args.input.area) continentFieldToUpdate.area = args.input.area;
        if (args.input.population)
          continentFieldToUpdate.population = args.input.population;
        if (args.input.photo) continentFieldToUpdate.photo = args.input.photo;

        continentUpdated = (await Continent.findOneAndUpdate(
          {
            code: args.code,
          },
          continentFieldToUpdate,
          { new: true }
        )) as unknown as ContinentType;
      } else {
        // UPDATE
        ContinentsList.forEach((continent) => {
          if (args.code == continent.code) {
            if (args.input.name) continent.name = args.input.name;
            if (args.input.area) continent.area = args.input.area;
            if (args.input.population)
              continent.population = args.input.population;
            if (args.input.photo) continent.photo = args.input.photo;
            continentUpdated = continent;
          }
        });
      }
      return continentUpdated
        ? continentUpdated
        : { message: "Continent not found" };
    },
    // COUNTRY
    createCountry: async (
      parent: any,
      args: CountryCreateInput,
      context: Context
    ): Promise<CountryType | ErrorMessage> => {
      const country = args.input;
      if (context.environment == "db") {
        // CHECKS
        if (
          !(await Continent.exists({
            code: country.continent,
          }))
        )
          return { message: "The continent you try to link doesn't exist" };

        // CREATE
        const countryToSave = new Country(country);
        return countryToSave
          .save()
          .then((countrySaved) => {
            return countrySaved as unknown as CountryType;
          })
          .catch((err) => {
            return err.code === 11000
              ? { message: "Country already exist" }
              : { message: "Something went wrong during saving" };
          });
      } else {
        // CHECKS
        if (
          !_.find(ContinentsList, {
            code: country.continent,
          })
        )
          return { message: "The continent you try to link doesn't exist" };

        // CREATE
        CountryList.push(country);
        return country;
      }
    },
    updateCountry: async (
      parent: any,
      args: CountryUpdateInput,
      context: Context
    ): Promise<CountryType | ErrorMessage> => {
      let countryUpdated;
      if (context.environment == "db") {
        // CHEKCS
        if (args.input.continent) {
          if (
            !(await Continent.exists({
              code: args.input.continent,
            }))
          )
            return { message: "The continent you try to link doesn't exist" };
        }

        // UPDATE
        const countryFieldToUpdate = {} as CountryType;
        if (args.input.name) countryFieldToUpdate.name = args.input.name;
        if (args.input.area) countryFieldToUpdate.area = args.input.area;
        if (args.input.population)
          countryFieldToUpdate.population = args.input.population;
        if (args.input.currency)
          countryFieldToUpdate.currency = args.input.currency;
        if (args.input.capital)
          countryFieldToUpdate.capital = args.input.capital;
        if (args.input.flag) countryFieldToUpdate.flag = args.input.flag;
        if (args.input.continent)
          countryFieldToUpdate.continent = args.input.continent;

        countryUpdated = (await Country.findOneAndUpdate(
          {
            code: args.code,
          },
          countryFieldToUpdate,
          { new: true }
        )) as unknown as CountryType;
      } else {
        // CHEKCS
        if (args.input.continent) {
          if (
            !_.find(ContinentsList, {
              code: args.input.continent,
            })
          )
            return { message: "The continent you try to link doesn't exist" };
        }

        // UPDATE
        CountryList.forEach((country) => {
          if (args.code == country.code) {
            if (args.input.name) country.name = args.input.name;
            if (args.input.area) country.area = args.input.area;
            if (args.input.population)
              country.population = args.input.population;
            if (args.input.currency) country.currency = args.input.currency;
            if (args.input.capital) country.capital = args.input.capital;
            if (args.input.flag) country.flag = args.input.flag;
            if (args.input.continent) country.continent = args.input.continent;
            countryUpdated = country;
          }
        });
      }
      return countryUpdated ? countryUpdated : { message: "Country not found" };
    },
    addNeighborToCountry: async (
      parent: any,
      args: CountryAddNeighborInput,
      context: Context
    ): Promise<CountryType | ErrorMessage> => {
      let countryUpdated;

      if (context.environment == "db") {
        // CHECKS
        if (!(await Country.exists({ code: args.neighbor })))
          return { message: "The neighbor you try to add doesn't exist" };

        // UPDATE
        countryUpdated = (await Country.findOneAndUpdate(
          {
            code: args.code,
          },
          {
            $addToSet: {
              neighbors: args.neighbor,
            },
          },
          { new: true }
        )) as unknown as CountryType;

        if (countryUpdated) {
          await Country.findOneAndUpdate(
            {
              code: args.neighbor,
            },
            {
              $addToSet: {
                neighbors: args.code,
              },
            }
          );
        }
      } else {
        // CHECKS
        if (!_.find(CountryList, { code: args.neighbor }))
          return { message: "The neighbor you try to add doesn't exist" };

        // UPDATE
        CountryList.forEach((country) => {
          if (args.code == country.code) {
            if (!country.neighbors) country.neighbors = [args.neighbor];
            else if (!country.neighbors?.includes(args.neighbor))
              country.neighbors.push(args.neighbor);
            countryUpdated = country;

            CountryList.forEach((neighbor) => {
              if (neighbor.code == args.neighbor) {
                if (!neighbor.neighbors) neighbor.neighbors = [country.code];
                else if (!neighbor.neighbors.includes(country.code))
                  neighbor.neighbors.push(country.code);
              }
            });
          }
        });
      }
      return countryUpdated ? countryUpdated : { message: "Country not found" };
    },
    addLanguageToCountry: async (
      parent: any,
      args: CountryAddLanguageInput,
      context: Context
    ): Promise<CountryType | ErrorMessage> => {
      let countryUpdated;

      if (context.environment == "db") {
        //CHECKS
        if (!(await Language.exists({ code: args.language })))
          return { message: "The language you try to add doesn't exist" };

        //UPDATE
        countryUpdated = (await Country.findOneAndUpdate(
          {
            code: args.code,
          },
          { $addToSet: { languages: args.language } },
          { new: true }
        )) as unknown as CountryType;

        if (countryUpdated) {
          await Language.findOneAndUpdate(
            {
              code: args.language,
            },
            { $addToSet: { countries: args.code } }
          );
        }
      } else {
        //CHECKS
        if (!_.find(LanguageList, { code: args.language }))
          return { message: "The language you try to add doesn't exist" };

        //UPDATE
        CountryList.forEach((country) => {
          if (args.code == country.code) {
            if (!country.languages) country.languages = [args.language];
            else if (!country.languages?.includes(args.language))
              country.languages.push(args.language);
            countryUpdated = country;

            LanguageList.forEach((language) => {
              if (args.language == language.code) {
                if (!language.countries) language.countries = [country.code];
                else if (!language.countries.includes(country.code))
                  language.countries.push(country.code);
              }
            });
          }
        });
      }
      return countryUpdated ? countryUpdated : { message: "Country not found" };
    },
    // CITY
    createCity: async (
      parent: any,
      args: CityCreateInput,
      context: Context
    ): Promise<CityType | ErrorMessage> => {
      const city = args.input;
      if (context.environment == "db") {
        // CHECKS
        if (!(await Country.exists({ code: city.country })))
          return { message: "The country you try to link doesn't exist" };

        // CREATE
        const cityToSave = new City(city);
        return cityToSave
          .save()
          .then((citySaved) => {
            return citySaved as unknown as CityType;
          })
          .catch((err) => {
            return err.code === 11000
              ? { message: "City already exist" }
              : { message: "Something went wrong during saving" };
          });
      } else {
        // CHECKS
        if (
          !_.find(CountryList, {
            code: city.country,
          })
        )
          return { message: "The country you try to link doesn't exist" };

        // CREATE
        CityList.push(city);
        return city;
      }
    },
    updateCity: async (
      parent: any,
      args: CityUpdateInput,
      context: Context
    ): Promise<CityType | ErrorMessage> => {
      let cityUpdated;
      if (context.environment == "db") {
        // CHECKS
        if (args.input.country) {
          if (!(await Country.exists({ code: args.input.country })))
            return { message: "The country you try to link doesn't exist" };
        }

        // UPDATE
        const cityFieldToUpdate = {} as CityType;
        if (args.input.name) cityFieldToUpdate.name = args.input.name;
        if (args.input.area) cityFieldToUpdate.area = args.input.area;
        if (args.input.population)
          cityFieldToUpdate.population = args.input.population;
        if (args.input.photo1) cityFieldToUpdate.photo1 = args.input.photo1;
        if (args.input.photo2) cityFieldToUpdate.photo2 = args.input.photo2;
        if (args.input.photo3) cityFieldToUpdate.photo3 = args.input.photo3;
        if (args.input.photo4) cityFieldToUpdate.photo4 = args.input.photo4;
        if (args.input.country) cityFieldToUpdate.country = args.input.country;

        cityUpdated = (await City.findOneAndUpdate(
          {
            code: args.code,
          },
          cityFieldToUpdate,
          { new: true }
        )) as unknown as CityType;
      } else {
        // CHECKS
        if (args.input.country) {
          if (
            !_.find(CountryList, {
              code: args.input.country,
            })
          )
            return { message: "The country you try to link doesn't exist" };
        }

        // UPDATE
        CityList.forEach((city) => {
          if (args.code == city.code) {
            if (args.input.name) city.name = args.input.name;
            if (args.input.area) city.area = args.input.area;
            if (args.input.population) city.population = args.input.population;
            if (args.input.country) city.country = args.input.country;
            if (args.input.photo1) city.photo1 = args.input.photo1;
            if (args.input.photo2) city.photo2 = args.input.photo2;
            if (args.input.photo3) city.photo3 = args.input.photo3;
            if (args.input.photo4) city.photo4 = args.input.photo4;
            cityUpdated = city;
          }
        });
      }
      return cityUpdated ? cityUpdated : { message: "City not found" };
    },
    // LANGUAGE
    createLanguage: async (
      parent: any,
      args: LanguageCreateInput,
      context: Context
    ): Promise<LanguageType | ErrorMessage> => {
      const language = args.input;
      if (context.environment == "db") {
        // CREATE
        const languageToSave = new Language(language);
        return languageToSave
          .save()
          .then((languageSaved) => {
            return languageSaved as unknown as LanguageType;
          })
          .catch((err) => {
            return err.code === 11000
              ? { message: "Language already exist" }
              : { message: "Something went wrong during saving" };
          });
      } else {
        // CREATE
        LanguageList.push(language);
        return language;
      }
    },
    updateLanguage: async (
      parent: any,
      args: LanguageUpdateInput,
      context: Context
    ): Promise<LanguageType | ErrorMessage> => {
      let languageUpdated;
      if (context.environment == "db") {
        // UPDATE
        const languageFieldToUpdate = {} as LanguageType;
        if (args.input.name) languageFieldToUpdate.name = args.input.name;

        languageUpdated = (await Language.findOneAndUpdate(
          {
            code: args.code,
          },
          languageFieldToUpdate,
          { new: true }
        )) as unknown as LanguageType;
      } else {
        // UPDATE
        CityList.forEach((language) => {
          if (args.code == language.code) {
            if (args.input.name) language.name = args.input.name;
            languageUpdated = language;
          }
        });
      }
      return languageUpdated
        ? languageUpdated
        : { message: "Language not found" };
    },
    addCountryToLanguage: async (
      parent: any,
      args: LanguageAddCountryInput,
      context: Context
    ): Promise<LanguageType | ErrorMessage> => {
      let languageUpdated;

      if (context.environment == "db") {
        // CHECKS
        if (!(await Country.exists({ code: args.country })))
          return { message: "The country you try to add doesn't exist" };

        // UPDATE
        languageUpdated = (await Language.findOneAndUpdate(
          {
            code: args.code,
          },
          { $addToSet: { countries: args.country } },
          { new: true }
        )) as unknown as LanguageType;

        if (languageUpdated) {
          await Country.findOneAndUpdate(
            {
              code: args.country,
            },
            { $addToSet: { languages: args.code } }
          );
        }
      } else {
        // CHECKS
        if (!_.find(CountryList, { code: args.country }))
          return { message: "The country you try to add doesn't exist" };

        // UPDATE
        LanguageList.forEach((language) => {
          if (args.code == language.code) {
            if (!language.countries) language.countries = [args.country];
            else if (!language.countries?.includes(args.country))
              language.countries.push(args.country);
            languageUpdated = language;

            CountryList.forEach((country) => {
              if (args.country == country.code) {
                if (!country.languages) country.languages = [language.code];
                else if (!country.languages?.includes(language.code))
                  country.languages.push(language.code);
              }
            });
          }
        });
      }

      return languageUpdated
        ? languageUpdated
        : { message: "Language not found" };
    },
  },

  ContinentResult: {
    __resolveType(obj: ContinentResult): string | null {
      if (obj.code) {
        return "Continent";
      }
      if (obj.message) {
        return "ErrorMessage";
      }

      return null;
    },
  },

  CountryResult: {
    __resolveType(obj: CountryResult): string | null {
      if (obj.code) {
        return "Country";
      }
      if (obj.message) {
        return "ErrorMessage";
      }

      return null;
    },
  },

  CityResult: {
    __resolveType(obj: CityResult): string | null {
      if (obj.code) {
        return "City";
      }
      if (obj.message) {
        return "ErrorMessage";
      }

      return null;
    },
  },

  LanguageResult: {
    __resolveType(obj: LanguageResult): string | null {
      if (obj.code) {
        return "Language";
      }
      if (obj.message) {
        return "ErrorMessage";
      }

      return null;
    },
  },
};

export default resolvers;
