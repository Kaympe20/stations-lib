import Fuse, { FuseIndex, type FuseResult } from "fuse.js";
import papaparse from "papaparse";

import type { Station } from "./types/station";
const stationsDB: Station[] = require("./stations.json")
/**
 * Creates the fuse object (otheriwse akin to an index)
 *
 * @param {boolean} [usePrebuiltIndex=true] Whether to use the internal JSON. If it is false, it will fetch online
 * @param {Station[]} [additionalStations=[]] An array of any additonal stations to add to the fuse object
 */
export async function makeDB(usePrebuiltIndex: boolean = true, additionalStations: Station[] = []): Promise<Fuse<Station>> {
    let fuse: Fuse<Station>;

    fuse = new Fuse(
        usePrebuiltIndex
            ? stationsDB
            : papaparse.parse(await ((await fetch("https://raw.githubusercontent.com/Kaympe20/stations-lib/refs/heads/main/stations.csv")).text()), {
                dynamicTyping: {
                    "stationID": true,
                    "translations": true,
                    "priority": true,
                },
                header: true,
            }).data as Station[],
        {
            keys:
            [
                "stationName",
                "city",
                "stationCode",
                "aliases",
                "altCodes",
                "translations.stationName",
                "translations.cityName"
            ],
            ignoreDiacritics: true,
        }
    )
    
    for (let stationToAdd of additionalStations) {
        fuse.add(stationToAdd)
    }

    return fuse;
}
/**
 * fuzzy search the index of stations for a search term, creating the index if it does not already exist
 *
 * @param {string} searchTerm string to search for
 * @param {number} [numResults=1] optional number of wanted results, sorted by match percentage in descending order
 * @param {Fuse<Station>} [index] an optional fuse object returned by makeDB(), speeds up search heavily
 */
export async function getStation(
        searchTerm: string,
        numResults: number = 1,
        index: Fuse<Station> | undefined = undefined
    ): Promise<FuseResult<Station>[]> {

    if (index === undefined) {
        console.log("Fuse not defined, creating a new one" )
        index = await makeDB()
    }
    if (numResults > 1) {
        index.options.findAllMatches = true
    }

    return index.search(searchTerm).slice(0, numResults).sort(
        (a: FuseResult<Station>, b: FuseResult<Station>) => 
            {
                return a.item.priority - b.item.priority
            }
    )
}