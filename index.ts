import Fuse, { FuseIndex } from "fuse.js";
import { agregateData, writeData } from "./assembleJSON";
import type { Station } from "./types/station";

let fuse: Fuse<Station>;

export async function makeDB() {
    fuse = new Fuse(
        await Bun.file("./stations.json").json(),
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
}

export async function getStation(searchTerm: string, numResults: number = 1) {
    if (fuse === undefined) {
        console.error("Error calling getStation(): fuse not defined")
    } else {
        if (numResults > 1) {
            fuse.options.findAllMatches = true
        }
        return fuse.search(searchTerm).slice(0, numResults)
    }
}

console.log(await makeDB().then(() => getStation("Shanghai",5)))