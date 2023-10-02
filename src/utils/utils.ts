import * as bcrypt from "bcrypt";
import { ValueTransformer } from "typeorm";

// TODO[Security] Suggestion: choose more complex password hashing algorithm.
export class Hash {
  static make(plainText) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(plainText, salt);
  }

  static compare(plainText, hash) {
    return bcrypt.compareSync(plainText, hash);
  }
}

export function convertDateTimeFormat(dateTimeString) {
  const [time, date] = dateTimeString.split(" ");
  const [hour, minute] = time.split(":");
  const [day, month, year] = date.split("/");

  const formattedDate = new Date(
    `${year}-${month}-${day}T${hour}:${minute}:00.000Z`
  );
  return formattedDate.toISOString();
}
