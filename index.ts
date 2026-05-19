import Fuse, { FuseIndex, type FuseResult } from "fuse.js";
import papaparse from "papaparse";

import type { Station } from "./types/station";
const stationsDB: Station[] = require("./stations.json")

let fuse: Fuse<Station>;
/**
 * @param {boolean} [useLocalFile=true] A boolean indicating whether to use an online index or to use a local file
 * @return {Promise<Fuse<Station>>}
 */
export async function makeDB(usePrebuiltIndex: boolean = true): Promise<Fuse<Station>> {
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

    return fuse;
}

export async function getStation(searchTerm: string, numResults: number = 1): Promise<FuseResult<Station>[]> {
    if (fuse === undefined) {
        console.log("Fuse not defined, creating a new one" )
        await makeDB()
    }
    if (numResults > 1) {
        fuse.options.findAllMatches = true
    }

    

    return fuse.search(searchTerm).slice(0, numResults).sort(
        (a: FuseResult<Station>, b: FuseResult<Station>) => 
            {
                return a.item.priority - b.item.priority
            }
        )
}

console.log(await getStation("Shanghai",5))