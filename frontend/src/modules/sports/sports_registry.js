import * as Football from "./football/index.js";
import * as Basketball from "./basketball/index.js";
import * as Baseball from "./baseball/index.js";
import * as TrackField from "./track_field/index.js";
import * as Softball from "./softball/index.js";
import * as Soccer from "./soccer/index.js";

export const sportsRegistry = {
  football: Football,
  basketball: Basketball,
  baseball: Baseball,
  track_field: TrackField,
  softball: Softball,
  soccer: Soccer
};
