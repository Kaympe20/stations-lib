import { getStation, makeDB } from ".";

[
    "Shanghai",
    "Aberdeen",
    "New York",
].forEach(async (value) => {
    let valueToPrint: string = "";

    valueToPrint += ("Searching for " + value + "\n")
    valueToPrint += (JSON.stringify(await getStation(value, 5, await makeDB())) + "\n\n")

    console.log(valueToPrint)
})