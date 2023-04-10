import {
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLUnionType,
  GraphQLInputObjectType,
  GraphQLSchema,
  GraphQLFloat,
} from "graphql";
import _ from "lodash";
import {
  Code,
  ContinentCode,
  CountryCode,
  Context,
  ContinentType,
  CountryType,
  CityType,
  LanguageType,
  ErrorMessage,
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
} from "../types/types";
import Continent from "../models/continent";
import Country from "../models/country";
import City from "../models/city";
import Language from "../models/language";
import ContinentsList from "../mocks/continents";
import CountryList from "../mocks/countries";
import CityList from "../mocks/cities";
import LanguageList from "../mocks/languages";

// TYPE

const ContinentObject: GraphQLObjectType = new GraphQLObjectType({
  name: "Continent",
  fields: () => ({
    code: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    area: { type: GraphQLInt },
    population: { type: GraphQLFloat },
    photo: { type: GraphQLString },
    countries: {
      type: new GraphQLList(CountryObject),
      resolve: async (
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
  }),
});

const CountryObject: GraphQLObjectType = new GraphQLObjectType({
  name: "Country",
  fields: () => ({
    code: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    area: { type: GraphQLInt },
    population: { type: GraphQLFloat },
    currency: { type: GraphQLString },
    flag: { type: GraphQLString },
    continent: {
      type: ContinentResultUnion,
      resolve: async (
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
    },
    capital: {
      type: CityResultUnion,
      resolve: async (
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
    },
    neighbors: {
      type: new GraphQLList(CountryObject),
      resolve: async (
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
    },
    cities: {
      type: new GraphQLList(CityObject),
      resolve: async (
        parent: CountryType,
        args: undefined,
        context: Context
      ): Promise<CityType[]> => {
        return context.environment == "db"
          ? ((await City.find({
              country: parent.code,
            })) as unknown as CityType[])
          : (_.filter(CityList, (city) => {
              return city.country == parent.code;
            }) as CityType[]);
      },
    },
    languages: {
      type: new GraphQLList(LanguageObject),
      resolve: async (
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
  }),
});

const CityObject: GraphQLObjectType = new GraphQLObjectType({
  name: "City",
  fields: () => ({
    code: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    area: { type: GraphQLInt },
    population: { type: GraphQLFloat },
    photo1: { type: GraphQLString },
    photo2: { type: GraphQLString },
    photo3: { type: GraphQLString },
    photo4: { type: GraphQLString },
    country: {
      type: CountryResultUnion,
      resolve: async (
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
  }),
});

const LanguageObject: GraphQLObjectType = new GraphQLObjectType({
  name: "Language",
  fields: () => ({
    code: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    countries: {
      type: new GraphQLList(CountryObject),
      reslove: async (
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
  }),
});

const ErrorMessageObject: GraphQLObjectType = new GraphQLObjectType({
  name: "ErrorMessage",
  fields: () => ({
    message: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

// QUERY

const Query: GraphQLObjectType = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    continents: {
      type: new GraphQLNonNull(new GraphQLList(ContinentObject)),
      resolve: async (
        parent: any,
        args: undefined,
        context: Context
      ): Promise<ContinentType[]> => {
        return context.environment == "db"
          ? ((await Continent.find({})) as unknown as ContinentType[])
          : ContinentsList;
      },
    },
    continent: {
      type: ContinentResultUnion,
      args: { code: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (
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
    },
    countries: {
      type: new GraphQLNonNull(new GraphQLList(CountryObject)),
      resolve: async (
        parent: any,
        args: undefined,
        context: Context
      ): Promise<CountryType[]> => {
        return context.environment == "db"
          ? ((await Country.find({})) as unknown as CountryType[])
          : CountryList;
      },
    },
    countriesByContinent: {
      type: new GraphQLNonNull(new GraphQLList(CountryObject)),
      args: { continent: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (
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
    },
    country: {
      type: CountryResultUnion,
      args: { code: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (
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
    },
    cities: {
      type: new GraphQLNonNull(new GraphQLList(CityObject)),
      resolve: async (
        parent: any,
        args: undefined,
        context: Context
      ): Promise<CityType[]> => {
        return context.environment == "db"
          ? ((await City.find({})) as unknown as CityType[])
          : CityList;
      },
    },
    citiesByCountry: {
      type: new GraphQLNonNull(new GraphQLList(CityObject)),
      args: { country: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (
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
    },
    city: {
      type: CityResultUnion,
      args: { code: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (
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
    },
    languages: {
      type: new GraphQLNonNull(new GraphQLList(LanguageObject)),
      resolve: async (
        parent: any,
        args: undefined,
        context: Context
      ): Promise<LanguageType[]> => {
        return context.environment == "db"
          ? ((await Language.find({})) as unknown as LanguageType[])
          : LanguageList;
      },
    },
    language: {
      type: LanguageResultUnion,
      args: { code: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (
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
  }),
});

// MUTATION

const Mutation: GraphQLObjectType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    createContinent: {
      type: ContinentResultUnion,
      args: { input: { type: new GraphQLNonNull(CreateContinentInput) } },
      resolve: async (
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
    },
    updateContinent: {
      type: ContinentResultUnion,
      args: {
        code: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(UpdateContinentInput) },
      },
      resolve: async (
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
    },
    createCountry: {
      type: CountryResultUnion,
      args: { input: { type: new GraphQLNonNull(CreateCountryInput) } },
      resolve: async (
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
    },
    updateCountry: {
      type: CountryResultUnion,
      args: {
        code: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(UpdateCountryInput) },
      },
      resolve: async (
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
          if (args.input.continent)
            countryFieldToUpdate.continent = args.input.continent;
          if (args.input.flag) countryFieldToUpdate.flag = args.input.flag;

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
              if (args.input.continent)
                country.continent = args.input.continent;
              if (args.input.flag) country.flag = args.input.flag;
              countryUpdated = country;
            }
          });
        }
        return countryUpdated
          ? countryUpdated
          : { message: "Country not found" };
      },
    },
    addNeighborToCountry: {
      type: CountryResultUnion,
      args: {
        code: { type: new GraphQLNonNull(GraphQLID) },
        neighbor: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (
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
        return countryUpdated
          ? countryUpdated
          : { message: "Country not found" };
      },
    },
    addLanguageToCountry: {
      type: CountryResultUnion,
      args: {
        code: { type: new GraphQLNonNull(GraphQLID) },
        language: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (
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
                if (country.code == args.language) {
                  if (!language.countries) language.countries = [country.code];
                  else if (!language.countries.includes(country.code))
                    language.countries.push(country.code);
                }
              });
            }
          });
        }
        return countryUpdated
          ? countryUpdated
          : { message: "Country not found" };
      },
    },
    createCity: {
      type: CityResultUnion,
      args: { input: { type: new GraphQLNonNull(CreateCityInput) } },
      resolve: async (
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
    },
    updateCity: {
      type: CityResultUnion,
      args: {
        code: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(UpdateCityInput) },
      },
      resolve: async (
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
          if (args.input.country)
            cityFieldToUpdate.country = args.input.country;
          if (args.input.photo1) cityFieldToUpdate.photo1 = args.input.photo1;
          if (args.input.photo2) cityFieldToUpdate.photo2 = args.input.photo2;
          if (args.input.photo3) cityFieldToUpdate.photo3 = args.input.photo3;
          if (args.input.photo4) cityFieldToUpdate.photo4 = args.input.photo4;

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
              if (args.input.population)
                city.population = args.input.population;
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
    },
    createLanguage: {
      type: LanguageResultUnion,
      args: { input: { type: new GraphQLNonNull(CreateLanguageInput) } },
      resolve: async (
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
    },
    updateLanguage: {
      type: LanguageResultUnion,
      args: {
        code: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(UpdateLanguageInput) },
      },
      resolve: async (
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
    },
    addCountryToLanguage: {
      type: LanguageResultUnion,
      args: {
        code: { type: new GraphQLNonNull(GraphQLID) },
        country: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (
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
  }),
});

// INPUT

const CreateContinentInput: GraphQLInputObjectType = new GraphQLInputObjectType(
  {
    name: "CreateContinentInput",
    fields: {
      code: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      area: { type: GraphQLInt },
      population: { type: GraphQLFloat },
      photo: { type: GraphQLString },
    },
  }
);

const UpdateContinentInput: GraphQLInputObjectType = new GraphQLInputObjectType(
  {
    name: "UpdateContinentInput",
    fields: {
      name: { type: GraphQLString },
      area: { type: GraphQLInt },
      population: { type: GraphQLFloat },
      photo: { type: GraphQLString },
    },
  }
);

const CreateCountryInput: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: "CreateCountryInput",
  fields: {
    code: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    continent: { type: new GraphQLNonNull(GraphQLID) },
    area: { type: GraphQLInt },
    population: { type: GraphQLFloat },
    currency: { type: GraphQLString },
    capital: { type: GraphQLID },
    flag: { type: GraphQLString },
  },
});

const UpdateCountryInput: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: "UpdateCountryInput",
  fields: {
    name: { type: GraphQLString },
    continent: { type: GraphQLID },
    area: { type: GraphQLInt },
    population: { type: GraphQLFloat },
    currency: { type: GraphQLString },
    capital: { type: GraphQLID },
    flag: { type: GraphQLString },
  },
});

const CreateCityInput: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: "CreateCityInput",
  fields: {
    code: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    country: { type: new GraphQLNonNull(GraphQLID) },
    area: { type: GraphQLInt },
    population: { type: GraphQLFloat },
    photo1: { type: GraphQLString },
    photo2: { type: GraphQLString },
    photo3: { type: GraphQLString },
    photo4: { type: GraphQLString },
  },
});

const UpdateCityInput: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: "UpdateCityInput",
  fields: {
    name: { type: GraphQLString },
    country: { type: GraphQLID },
    area: { type: GraphQLInt },
    population: { type: GraphQLFloat },
    photo1: { type: GraphQLString },
    photo2: { type: GraphQLString },
    photo3: { type: GraphQLString },
    photo4: { type: GraphQLString },
  },
});

const CreateLanguageInput: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: "CreateLanguageInput",
  fields: {
    code: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const UpdateLanguageInput: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: "UpdateLanguageInput",
  fields: {
    name: { type: GraphQLString },
  },
});

// UNION

const ContinentResultUnion: GraphQLUnionType = new GraphQLUnionType({
  name: "ContinentResult",
  types: [ContinentObject, ErrorMessageObject],
  resolveType: (obj: ContinentResult): string | null => {
    if (obj.code) {
      return "Continent";
    }
    if (obj.message) {
      return "ErrorMessage";
    }
    return null;
  },
});

const CountryResultUnion: GraphQLUnionType = new GraphQLUnionType({
  name: "CountryResult",
  types: [CountryObject, ErrorMessageObject],
  resolveType: (obj: CountryResult): string | null => {
    if (obj.code) {
      return "Country";
    }
    if (obj.message) {
      return "ErrorMessage";
    }
    return null;
  },
});

const CityResultUnion: GraphQLUnionType = new GraphQLUnionType({
  name: "CityResult",
  types: [CityObject, ErrorMessageObject],
  resolveType: (obj: CityResult): string | null => {
    if (obj.code) {
      return "City";
    }
    if (obj.message) {
      return "ErrorMessage";
    }
    return null;
  },
});

const LanguageResultUnion: GraphQLUnionType = new GraphQLUnionType({
  name: "LanguageResult",
  types: [LanguageObject, ErrorMessageObject],
  resolveType: (obj: LanguageResult): string | null => {
    if (obj.code) {
      return "Language";
    }
    if (obj.message) {
      return "ErrorMessage";
    }
    return null;
  },
});

// EXPORT SCHEMA

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
