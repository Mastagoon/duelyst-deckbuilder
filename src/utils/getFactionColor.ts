import { Faction } from "../data/cards"
import constants from "../data/constants"

export default (f: number) => {
  switch (f) {
    case Faction.abyssian:
      return constants.colors.abyssian
    case Faction.magmar:
      return constants.colors.magmar
    case Faction.lyonar:
      return constants.colors.lyonar
    case Faction.neutral:
      return constants.colors.neutral
    case Faction.songhai:
      return constants.colors.songhai
    case Faction.vanar:
      return constants.colors.vanar
    case Faction.vetruvian:
      return constants.colors.vetruvian
  }
}
