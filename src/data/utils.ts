import type { CardData, CardType, Faction, Rarity } from "./cards"

const normalizeSpriteName = (name: string | undefined | null): string | null =>
  name ? name : null
//
// export const card = (
// faction: number,
// id: number,
// title: string,
// cost: number,
// type: CardType,
// rarity: Rarity,
// spriteName?: string
// ): CardData => ({
// id,
// title,
// faction,
// cost,
// type,
// rarity,
// spriteName: normalizeSpriteName(spriteName),
// })
//
// export const lyonar = (
// id: number,
// title: string,
// cost: number,
// type: CardType,
// rarity: Rarity,
// spriteName?: string
// ): CardData => card("lyonar", id, title, cost, type, rarity, spriteName)
//
// export const songhai = (
// id: number,
// title: string,
// cost: number,
// type: CardType,
// rarity: Rarity,
// spriteName?: string
// ): CardData => card("songhai", id, title, cost, type, rarity, spriteName)
//
// export const vetruvian = (
// id: number,
// title: string,
// cost: number,
// type: CardType,
// rarity: Rarity,
// spriteName?: string
// ): CardData => card("vetruvian", id, title, cost, type, rarity, spriteName)
//
// export const abyssian = (
// id: number,
// title: string,
// cost: number,
// type: CardType,
// rarity: Rarity,
// spriteName?: string
// ): CardData => card("abyssian", id, title, cost, type, rarity, spriteName)
//
// export const magmar = (
// id: number,
// title: string,
// cost: number,
// type: CardType,
// rarity: Rarity,
// spriteName?: string
// ): CardData => card("magmar", id, title, cost, type, rarity, spriteName)
//
// export const vanar = (
// id: number,
// title: string,
// cost: number,
// type: CardType,
// rarity: Rarity,
// spriteName?: string
// ): CardData => card("vanar", id, title, cost, type, rarity, spriteName)
//
// export const neutral = (
// id: number,
// title: string,
// cost: number,
// type: CardType,
// rarity: Rarity,
// spriteName?: string
// ): CardData => card("neutral", id, title, cost, type, rarity, spriteName)

export const Keywords = [
  "shadow creep",
  "airdrop",
  "celerity",
  "provoke",
  "zeal",
  "rush",
  "ranged",
  "flying",
  "opening gambit",
]
