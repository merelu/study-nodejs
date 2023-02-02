import { parse } from "csv-parse";
import { createReadStream } from "fs";
import { FilterByCountry } from "./filter-by-country.js";
import { SumProfit } from "./sum-profit.js";

const csvParser = parse({ columns: true });

createReadStream("data.csv")
  .pipe(csvParser)
  .pipe(new FilterByCountry("Sierra Leone Leonely"))
  .pipe(new SumProfit())
  .pipe(process.stdout);
