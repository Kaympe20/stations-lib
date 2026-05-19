import Fuse, { FuseIndex } from "fuse.js";
import { agregateData, writeData } from "./assembleJSON";
import type { Station } from "./types/station";

let fuse: Fuse<Station>;

export async function makeDB(): Promise<Fuse<Station>> {
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

    return fuse;
}

export async function getStation(searchTerm: string, numResults: number = 1) {
    if (fuse === undefined) {
        console.log("Fuse not defined, creating a new one" )
        return await makeDB().then(
            () => {
                if (numResults > 1) {
                    fuse.options.findAllMatches = true
                }
                return fuse.search(searchTerm).slice(0, numResults)
            }
        )
    } else {
        if (numResults > 1) {
            fuse.options.findAllMatches = true
        }
        return fuse.search(searchTerm).slice(0, numResults)
    }
}

console.log(await getStation("Shanghai",5))