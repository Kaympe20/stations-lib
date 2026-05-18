export type Station = {
    city?: string;
    stationName: string
    translations?: Array<translation>;
    stationCode: string;
    sixLetterStationCode?: string;
    priority: number; // How high to prioritize the code, 0 is the code the operator uses, 1 is Secondary Operator, 2 is agregator, 3 is IATA
}

export type translation = {
    langCode: string;
    text: string;
}