"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const lodash_1 = __importDefault(require("lodash"));
const continent_1 = __importDefault(require("../models/continent"));
const country_1 = __importDefault(require("../models/country"));
const city_1 = __importDefault(require("../models/city"));
const language_1 = __importDefault(require("../models/language"));
const continents_1 = __importDefault(require("../mocks/continents"));
const countries_1 = __importDefault(require("../mocks/countries"));
const cities_1 = __importDefault(require("../mocks/cities"));
const languages_1 = __importDefault(require("../mocks/languages"));
// TYPE
const ContinentObject = new graphql_1.GraphQLObjectType({
    name: "Continent",
    fields: () => ({
        code: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        area: { type: graphql_1.GraphQLInt },
        population: { type: graphql_1.GraphQLFloat },
        photo: { type: graphql_1.GraphQLString },
        countries: {
            type: new graphql_1.GraphQLList(CountryObject),
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                return context.environment == "db"
                    ? (yield country_1.default.find({
                        continent: parent.code,
                    }))
                    : lodash_1.default.filter(countries_1.default, (country) => {
                        return country.continent == parent.code;
                    });
            }),
        },
    }),
});
const CountryObject = new graphql_1.GraphQLObjectType({
    name: "Country",
    fields: () => ({
        code: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        area: { type: graphql_1.GraphQLInt },
        population: { type: graphql_1.GraphQLFloat },
        currency: { type: graphql_1.GraphQLString },
        flag: { type: graphql_1.GraphQLString },
        continent: {
            type: ContinentResultUnion,
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                const continent = context.environment == "db"
                    ? (yield continent_1.default.findOne({
                        code: parent.continent,
                    }))
                    : lodash_1.default.find(continents_1.default, { code: parent.continent });
                return continent ? continent : { message: "Continent not found" };
            }),
        },
        capital: {
            type: CityResultUnion,
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                const capital = context.environment == "db"
                    ? (yield city_1.default.findOne({
                        code: parent.capital,
                    }))
                    : lodash_1.default.find(cities_1.default, { code: parent.capital });
                return capital ? capital : { message: "Capital not found" };
            }),
        },
        neighbors: {
            type: new graphql_1.GraphQLList(CountryObject),
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                return context.environment == "db"
                    ? (yield country_1.default.find({
                        code: { $in: parent.neighbors },
                    }))
                    : lodash_1.default.filter(countries_1.default, (country) => {
                        return lodash_1.default.includes(parent.neighbors, country.code);
                    });
            }),
        },
        cities: {
            type: new graphql_1.GraphQLList(CityObject),
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                return context.environment == "db"
                    ? (yield city_1.default.find({
                        country: parent.code,
                    }))
                    : lodash_1.default.filter(cities_1.default, (city) => {
                        return city.country == parent.code;
                    });
            }),
        },
        languages: {
            type: new graphql_1.GraphQLList(LanguageObject),
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                return context.environment == "db"
                    ? (yield language_1.default.find({
                        code: { $in: parent.languages },
                    }))
                    : lodash_1.default.filter(languages_1.default, (language) => {
                        return lodash_1.default.includes(parent.languages, language.code);
                    });
            }),
        },
    }),
});
const CityObject = new graphql_1.GraphQLObjectType({
    name: "City",
    fields: () => ({
        code: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        area: { type: graphql_1.GraphQLInt },
        population: { type: graphql_1.GraphQLFloat },
        photo1: { type: graphql_1.GraphQLString },
        photo2: { type: graphql_1.GraphQLString },
        photo3: { type: graphql_1.GraphQLString },
        photo4: { type: graphql_1.GraphQLString },
        country: {
            type: CountryResultUnion,
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                const country = context.environment == "db"
                    ? (yield country_1.default.findOne({
                        code: parent.country,
                    }))
                    : lodash_1.default.find(countries_1.default, { code: parent.country });
                return country ? country : { message: "Country not found" };
            }),
        },
    }),
});
const LanguageObject = new graphql_1.GraphQLObjectType({
    name: "Language",
    fields: () => ({
        code: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        countries: {
            type: new graphql_1.GraphQLList(CountryObject),
            reslove: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                return context.environment == "db"
                    ? (yield country_1.default.find({
                        code: { $in: parent.countries },
                    }))
                    : lodash_1.default.filter(countries_1.default, (country) => {
                        return lodash_1.default.includes(parent.countries, country.code);
                    });
            }),
        },
    }),
});
const ErrorMessageObject = new graphql_1.GraphQLObjectType({
    name: "ErrorMessage",
    fields: () => ({
        message: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
    }),
});
// QUERY
const Query = new graphql_1.GraphQLObjectType({
    name: "Query",
    fields: () => ({
        continents: {
            type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(ContinentObject)),
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                return context.environment == "db"
                    ? (yield continent_1.default.find({}))
                    : continents_1.default;
            }),
        },
        continent: {
            type: ContinentResultUnion,
            args: { code: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) } },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                const continent = context.environment == "db"
                    ? (yield continent_1.default.findOne({
                        code: args.code,
                    }))
                    : lodash_1.default.find(continents_1.default, { code: args.code });
                return continent ? continent : { message: "Continent not found" };
            }),
        },
        countries: {
            type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(CountryObject)),
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                return context.environment == "db"
                    ? (yield country_1.default.find({}))
                    : countries_1.default;
            }),
        },
        countriesByContinent: {
            type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(CountryObject)),
            args: { continent: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) } },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                const countries = context.environment == "db"
                    ? (yield country_1.default.find({
                        continent: args.continent,
                    }))
                    : lodash_1.default.filter(countries_1.default, (country) => {
                        return country.continent == args.continent;
                    });
                return countries;
            }),
        },
        country: {
            type: CountryResultUnion,
            args: { code: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) } },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                const country = context.environment == "db"
                    ? (yield country_1.default.findOne({
                        code: args.code,
                    }))
                    : lodash_1.default.find(countries_1.default, { code: args.code });
                return country ? country : { message: "Country not found" };
            }),
        },
        cities: {
            type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(CityObject)),
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                return context.environment == "db"
                    ? (yield city_1.default.find({}))
                    : cities_1.default;
            }),
        },
        citiesByCountry: {
            type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(CityObject)),
            args: { country: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) } },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                const cities = context.environment == "db"
                    ? (yield city_1.default.find({
                        country: args.country,
                    }))
                    : lodash_1.default.filter(cities_1.default, (city) => {
                        return city.country == args.country;
                    });
                return cities;
            }),
        },
        city: {
            type: CityResultUnion,
            args: { code: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) } },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                const city = context.environment == "db"
                    ? (yield city_1.default.findOne({ code: args.code }))
                    : lodash_1.default.find(cities_1.default, { code: args.code });
                return city ? city : { message: "City not found" };
            }),
        },
        languages: {
            type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(LanguageObject)),
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                return context.environment == "db"
                    ? (yield language_1.default.find({}))
                    : languages_1.default;
            }),
        },
        language: {
            type: LanguageResultUnion,
            args: { code: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) } },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                const language = context.environment == "db"
                    ? (yield language_1.default.findOne({
                        code: args.code,
                    }))
                    : lodash_1.default.find(languages_1.default, { code: args.code });
                return language ? language : { message: "Language not found" };
            }),
        },
    }),
});
// MUTATION
const Mutation = new graphql_1.GraphQLObjectType({
    name: "Mutation",
    fields: () => ({
        createContinent: {
            type: ContinentResultUnion,
            args: { input: { type: new graphql_1.GraphQLNonNull(CreateContinentInput) } },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                const continent = args.input;
                if (context.environment == "db") {
                    // CREATE
                    const continentToSave = new continent_1.default(continent);
                    return continentToSave
                        .save()
                        .then((continentSaved) => {
                        return continentSaved;
                    })
                        .catch((err) => {
                        return err.code === 11000
                            ? { message: "Continent already exist" }
                            : { message: "Something went wrong during saving" };
                    });
                }
                else {
                    // CREATE
                    continents_1.default.push(continent);
                    return continent;
                }
            }),
        },
        updateContinent: {
            type: ContinentResultUnion,
            args: {
                code: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                input: { type: new graphql_1.GraphQLNonNull(UpdateContinentInput) },
            },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                let continentUpdated;
                if (context.environment == "db") {
                    // UPDATE
                    const continentFieldToUpdate = {};
                    if (args.input.name)
                        continentFieldToUpdate.name = args.input.name;
                    if (args.input.area)
                        continentFieldToUpdate.area = args.input.area;
                    if (args.input.population)
                        continentFieldToUpdate.population = args.input.population;
                    if (args.input.photo)
                        continentFieldToUpdate.photo = args.input.photo;
                    continentUpdated = (yield continent_1.default.findOneAndUpdate({
                        code: args.code,
                    }, continentFieldToUpdate, { new: true }));
                }
                else {
                    // UPDATE
                    continents_1.default.forEach((continent) => {
                        if (args.code == continent.code) {
                            if (args.input.name)
                                continent.name = args.input.name;
                            if (args.input.area)
                                continent.area = args.input.area;
                            if (args.input.population)
                                continent.population = args.input.population;
                            if (args.input.photo)
                                continent.photo = args.input.photo;
                            continentUpdated = continent;
                        }
                    });
                }
                return continentUpdated
                    ? continentUpdated
                    : { message: "Continent not found" };
            }),
        },
        createCountry: {
            type: CountryResultUnion,
            args: { input: { type: new graphql_1.GraphQLNonNull(CreateCountryInput) } },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                const country = args.input;
                if (context.environment == "db") {
                    // CHECKS
                    if (!(yield continent_1.default.exists({
                        code: country.continent,
                    })))
                        return { message: "The continent you try to link doesn't exist" };
                    // CREATE
                    const countryToSave = new country_1.default(country);
                    return countryToSave
                        .save()
                        .then((countrySaved) => {
                        return countrySaved;
                    })
                        .catch((err) => {
                        return err.code === 11000
                            ? { message: "Country already exist" }
                            : { message: "Something went wrong during saving" };
                    });
                }
                else {
                    // CHECKS
                    if (!lodash_1.default.find(continents_1.default, {
                        code: country.continent,
                    }))
                        return { message: "The continent you try to link doesn't exist" };
                    // CREATE
                    countries_1.default.push(country);
                    return country;
                }
            }),
        },
        updateCountry: {
            type: CountryResultUnion,
            args: {
                code: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                input: { type: new graphql_1.GraphQLNonNull(UpdateCountryInput) },
            },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                let countryUpdated;
                if (context.environment == "db") {
                    // CHEKCS
                    if (args.input.continent) {
                        if (!(yield continent_1.default.exists({
                            code: args.input.continent,
                        })))
                            return { message: "The continent you try to link doesn't exist" };
                    }
                    // UPDATE
                    const countryFieldToUpdate = {};
                    if (args.input.name)
                        countryFieldToUpdate.name = args.input.name;
                    if (args.input.area)
                        countryFieldToUpdate.area = args.input.area;
                    if (args.input.population)
                        countryFieldToUpdate.population = args.input.population;
                    if (args.input.currency)
                        countryFieldToUpdate.currency = args.input.currency;
                    if (args.input.capital)
                        countryFieldToUpdate.capital = args.input.capital;
                    if (args.input.continent)
                        countryFieldToUpdate.continent = args.input.continent;
                    if (args.input.flag)
                        countryFieldToUpdate.flag = args.input.flag;
                    countryUpdated = (yield country_1.default.findOneAndUpdate({
                        code: args.code,
                    }, countryFieldToUpdate, { new: true }));
                }
                else {
                    // CHEKCS
                    if (args.input.continent) {
                        if (!lodash_1.default.find(continents_1.default, {
                            code: args.input.continent,
                        }))
                            return { message: "The continent you try to link doesn't exist" };
                    }
                    // UPDATE
                    countries_1.default.forEach((country) => {
                        if (args.code == country.code) {
                            if (args.input.name)
                                country.name = args.input.name;
                            if (args.input.area)
                                country.area = args.input.area;
                            if (args.input.population)
                                country.population = args.input.population;
                            if (args.input.currency)
                                country.currency = args.input.currency;
                            if (args.input.capital)
                                country.capital = args.input.capital;
                            if (args.input.continent)
                                country.continent = args.input.continent;
                            if (args.input.flag)
                                country.flag = args.input.flag;
                            countryUpdated = country;
                        }
                    });
                }
                return countryUpdated
                    ? countryUpdated
                    : { message: "Country not found" };
            }),
        },
        addNeighborToCountry: {
            type: CountryResultUnion,
            args: {
                code: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                neighbor: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
            },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                let countryUpdated;
                if (context.environment == "db") {
                    // CHECKS
                    if (!(yield country_1.default.exists({ code: args.neighbor })))
                        return { message: "The neighbor you try to add doesn't exist" };
                    // UPDATE
                    countryUpdated = (yield country_1.default.findOneAndUpdate({
                        code: args.code,
                    }, {
                        $addToSet: {
                            neighbors: args.neighbor,
                        },
                    }, { new: true }));
                    if (countryUpdated) {
                        yield country_1.default.findOneAndUpdate({
                            code: args.neighbor,
                        }, {
                            $addToSet: {
                                neighbors: args.code,
                            },
                        });
                    }
                }
                else {
                    // CHECKS
                    if (!lodash_1.default.find(countries_1.default, { code: args.neighbor }))
                        return { message: "The neighbor you try to add doesn't exist" };
                    // UPDATE
                    countries_1.default.forEach((country) => {
                        var _a;
                        if (args.code == country.code) {
                            if (!country.neighbors)
                                country.neighbors = [args.neighbor];
                            else if (!((_a = country.neighbors) === null || _a === void 0 ? void 0 : _a.includes(args.neighbor)))
                                country.neighbors.push(args.neighbor);
                            countryUpdated = country;
                            countries_1.default.forEach((neighbor) => {
                                if (neighbor.code == args.neighbor) {
                                    if (!neighbor.neighbors)
                                        neighbor.neighbors = [country.code];
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
            }),
        },
        addLanguageToCountry: {
            type: CountryResultUnion,
            args: {
                code: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                language: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
            },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                let countryUpdated;
                if (context.environment == "db") {
                    //CHECKS
                    if (!(yield language_1.default.exists({ code: args.language })))
                        return { message: "The language you try to add doesn't exist" };
                    //UPDATE
                    countryUpdated = (yield country_1.default.findOneAndUpdate({
                        code: args.code,
                    }, { $addToSet: { languages: args.language } }, { new: true }));
                    if (countryUpdated) {
                        yield language_1.default.findOneAndUpdate({
                            code: args.language,
                        }, { $addToSet: { countries: args.code } });
                    }
                }
                else {
                    //CHECKS
                    if (!lodash_1.default.find(languages_1.default, { code: args.language }))
                        return { message: "The language you try to add doesn't exist" };
                    //UPDATE
                    countries_1.default.forEach((country) => {
                        var _a;
                        if (args.code == country.code) {
                            if (!country.languages)
                                country.languages = [args.language];
                            else if (!((_a = country.languages) === null || _a === void 0 ? void 0 : _a.includes(args.language)))
                                country.languages.push(args.language);
                            countryUpdated = country;
                            languages_1.default.forEach((language) => {
                                if (country.code == args.language) {
                                    if (!language.countries)
                                        language.countries = [country.code];
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
            }),
        },
        createCity: {
            type: CityResultUnion,
            args: { input: { type: new graphql_1.GraphQLNonNull(CreateCityInput) } },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                const city = args.input;
                if (context.environment == "db") {
                    // CHECKS
                    if (!(yield country_1.default.exists({ code: city.country })))
                        return { message: "The country you try to link doesn't exist" };
                    // CREATE
                    const cityToSave = new city_1.default(city);
                    return cityToSave
                        .save()
                        .then((citySaved) => {
                        return citySaved;
                    })
                        .catch((err) => {
                        return err.code === 11000
                            ? { message: "City already exist" }
                            : { message: "Something went wrong during saving" };
                    });
                }
                else {
                    // CHECKS
                    if (!lodash_1.default.find(countries_1.default, {
                        code: city.country,
                    }))
                        return { message: "The country you try to link doesn't exist" };
                    // CREATE
                    cities_1.default.push(city);
                    return city;
                }
            }),
        },
        updateCity: {
            type: CityResultUnion,
            args: {
                code: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                input: { type: new graphql_1.GraphQLNonNull(UpdateCityInput) },
            },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                let cityUpdated;
                if (context.environment == "db") {
                    // CHECKS
                    if (args.input.country) {
                        if (!(yield country_1.default.exists({ code: args.input.country })))
                            return { message: "The country you try to link doesn't exist" };
                    }
                    // UPDATE
                    const cityFieldToUpdate = {};
                    if (args.input.name)
                        cityFieldToUpdate.name = args.input.name;
                    if (args.input.area)
                        cityFieldToUpdate.area = args.input.area;
                    if (args.input.population)
                        cityFieldToUpdate.population = args.input.population;
                    if (args.input.country)
                        cityFieldToUpdate.country = args.input.country;
                    if (args.input.photo1)
                        cityFieldToUpdate.photo1 = args.input.photo1;
                    if (args.input.photo2)
                        cityFieldToUpdate.photo2 = args.input.photo2;
                    if (args.input.photo3)
                        cityFieldToUpdate.photo3 = args.input.photo3;
                    if (args.input.photo4)
                        cityFieldToUpdate.photo4 = args.input.photo4;
                    cityUpdated = (yield city_1.default.findOneAndUpdate({
                        code: args.code,
                    }, cityFieldToUpdate, { new: true }));
                }
                else {
                    // CHECKS
                    if (args.input.country) {
                        if (!lodash_1.default.find(countries_1.default, {
                            code: args.input.country,
                        }))
                            return { message: "The country you try to link doesn't exist" };
                    }
                    // UPDATE
                    cities_1.default.forEach((city) => {
                        if (args.code == city.code) {
                            if (args.input.name)
                                city.name = args.input.name;
                            if (args.input.area)
                                city.area = args.input.area;
                            if (args.input.population)
                                city.population = args.input.population;
                            if (args.input.country)
                                city.country = args.input.country;
                            if (args.input.photo1)
                                city.photo1 = args.input.photo1;
                            if (args.input.photo2)
                                city.photo2 = args.input.photo2;
                            if (args.input.photo3)
                                city.photo3 = args.input.photo3;
                            if (args.input.photo4)
                                city.photo4 = args.input.photo4;
                            cityUpdated = city;
                        }
                    });
                }
                return cityUpdated ? cityUpdated : { message: "City not found" };
            }),
        },
        createLanguage: {
            type: LanguageResultUnion,
            args: { input: { type: new graphql_1.GraphQLNonNull(CreateLanguageInput) } },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                const language = args.input;
                if (context.environment == "db") {
                    // CREATE
                    const languageToSave = new language_1.default(language);
                    return languageToSave
                        .save()
                        .then((languageSaved) => {
                        return languageSaved;
                    })
                        .catch((err) => {
                        return err.code === 11000
                            ? { message: "Language already exist" }
                            : { message: "Something went wrong during saving" };
                    });
                }
                else {
                    // CREATE
                    languages_1.default.push(language);
                    return language;
                }
            }),
        },
        updateLanguage: {
            type: LanguageResultUnion,
            args: {
                code: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                input: { type: new graphql_1.GraphQLNonNull(UpdateLanguageInput) },
            },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                let languageUpdated;
                if (context.environment == "db") {
                    // UPDATE
                    const languageFieldToUpdate = {};
                    if (args.input.name)
                        languageFieldToUpdate.name = args.input.name;
                    languageUpdated = (yield language_1.default.findOneAndUpdate({
                        code: args.code,
                    }, languageFieldToUpdate, { new: true }));
                }
                else {
                    // UPDATE
                    cities_1.default.forEach((language) => {
                        if (args.code == language.code) {
                            if (args.input.name)
                                language.name = args.input.name;
                            languageUpdated = language;
                        }
                    });
                }
                return languageUpdated
                    ? languageUpdated
                    : { message: "Language not found" };
            }),
        },
        addCountryToLanguage: {
            type: LanguageResultUnion,
            args: {
                code: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                country: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
            },
            resolve: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
                let languageUpdated;
                if (context.environment == "db") {
                    // CHECKS
                    if (!(yield country_1.default.exists({ code: args.country })))
                        return { message: "The country you try to add doesn't exist" };
                    // UPDATE
                    languageUpdated = (yield language_1.default.findOneAndUpdate({
                        code: args.code,
                    }, { $addToSet: { countries: args.country } }, { new: true }));
                    if (languageUpdated) {
                        yield country_1.default.findOneAndUpdate({
                            code: args.country,
                        }, { $addToSet: { languages: args.code } });
                    }
                }
                else {
                    // CHECKS
                    if (!lodash_1.default.find(countries_1.default, { code: args.country }))
                        return { message: "The country you try to add doesn't exist" };
                    // UPDATE
                    languages_1.default.forEach((language) => {
                        var _a;
                        if (args.code == language.code) {
                            if (!language.countries)
                                language.countries = [args.country];
                            else if (!((_a = language.countries) === null || _a === void 0 ? void 0 : _a.includes(args.country)))
                                language.countries.push(args.country);
                            languageUpdated = language;
                            countries_1.default.forEach((country) => {
                                var _a;
                                if (args.country == country.code) {
                                    if (!country.languages)
                                        country.languages = [language.code];
                                    else if (!((_a = country.languages) === null || _a === void 0 ? void 0 : _a.includes(language.code)))
                                        country.languages.push(language.code);
                                }
                            });
                        }
                    });
                }
                return languageUpdated
                    ? languageUpdated
                    : { message: "Language not found" };
            }),
        },
    }),
});
// INPUT
const CreateContinentInput = new graphql_1.GraphQLInputObjectType({
    name: "CreateContinentInput",
    fields: {
        code: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        area: { type: graphql_1.GraphQLInt },
        population: { type: graphql_1.GraphQLFloat },
        photo: { type: graphql_1.GraphQLString },
    },
});
const UpdateContinentInput = new graphql_1.GraphQLInputObjectType({
    name: "UpdateContinentInput",
    fields: {
        name: { type: graphql_1.GraphQLString },
        area: { type: graphql_1.GraphQLInt },
        population: { type: graphql_1.GraphQLFloat },
        photo: { type: graphql_1.GraphQLString },
    },
});
const CreateCountryInput = new graphql_1.GraphQLInputObjectType({
    name: "CreateCountryInput",
    fields: {
        code: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        continent: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        area: { type: graphql_1.GraphQLInt },
        population: { type: graphql_1.GraphQLFloat },
        currency: { type: graphql_1.GraphQLString },
        capital: { type: graphql_1.GraphQLID },
        flag: { type: graphql_1.GraphQLString },
    },
});
const UpdateCountryInput = new graphql_1.GraphQLInputObjectType({
    name: "UpdateCountryInput",
    fields: {
        name: { type: graphql_1.GraphQLString },
        continent: { type: graphql_1.GraphQLID },
        area: { type: graphql_1.GraphQLInt },
        population: { type: graphql_1.GraphQLFloat },
        currency: { type: graphql_1.GraphQLString },
        capital: { type: graphql_1.GraphQLID },
        flag: { type: graphql_1.GraphQLString },
    },
});
const CreateCityInput = new graphql_1.GraphQLInputObjectType({
    name: "CreateCityInput",
    fields: {
        code: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        country: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        area: { type: graphql_1.GraphQLInt },
        population: { type: graphql_1.GraphQLFloat },
        photo1: { type: graphql_1.GraphQLString },
        photo2: { type: graphql_1.GraphQLString },
        photo3: { type: graphql_1.GraphQLString },
        photo4: { type: graphql_1.GraphQLString },
    },
});
const UpdateCityInput = new graphql_1.GraphQLInputObjectType({
    name: "UpdateCityInput",
    fields: {
        name: { type: graphql_1.GraphQLString },
        country: { type: graphql_1.GraphQLID },
        area: { type: graphql_1.GraphQLInt },
        population: { type: graphql_1.GraphQLFloat },
        photo1: { type: graphql_1.GraphQLString },
        photo2: { type: graphql_1.GraphQLString },
        photo3: { type: graphql_1.GraphQLString },
        photo4: { type: graphql_1.GraphQLString },
    },
});
const CreateLanguageInput = new graphql_1.GraphQLInputObjectType({
    name: "CreateLanguageInput",
    fields: {
        code: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
    },
});
const UpdateLanguageInput = new graphql_1.GraphQLInputObjectType({
    name: "UpdateLanguageInput",
    fields: {
        name: { type: graphql_1.GraphQLString },
    },
});
// UNION
const ContinentResultUnion = new graphql_1.GraphQLUnionType({
    name: "ContinentResult",
    types: [ContinentObject, ErrorMessageObject],
    resolveType: (obj) => {
        if (obj.code) {
            return "Continent";
        }
        if (obj.message) {
            return "ErrorMessage";
        }
        return null;
    },
});
const CountryResultUnion = new graphql_1.GraphQLUnionType({
    name: "CountryResult",
    types: [CountryObject, ErrorMessageObject],
    resolveType: (obj) => {
        if (obj.code) {
            return "Country";
        }
        if (obj.message) {
            return "ErrorMessage";
        }
        return null;
    },
});
const CityResultUnion = new graphql_1.GraphQLUnionType({
    name: "CityResult",
    types: [CityObject, ErrorMessageObject],
    resolveType: (obj) => {
        if (obj.code) {
            return "City";
        }
        if (obj.message) {
            return "ErrorMessage";
        }
        return null;
    },
});
const LanguageResultUnion = new graphql_1.GraphQLUnionType({
    name: "LanguageResult",
    types: [LanguageObject, ErrorMessageObject],
    resolveType: (obj) => {
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
exports.default = new graphql_1.GraphQLSchema({
    query: Query,
    mutation: Mutation,
});
//# sourceMappingURL=schema.js.map