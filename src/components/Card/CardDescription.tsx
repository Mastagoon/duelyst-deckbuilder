import { Keywords } from "../../data/cards"

const CardDescription: React.FC<{ description: string }> = ({
  description,
}) => {
  const HighlightKeywords = (description: string) => {
    if (!description) return ""
    const keywords = Keywords.map((keyword) => `\\b${keyword}\\b`)
    const regex = new RegExp(keywords.join("|"), "gi")
    return description.replace(
      regex,
      (match) =>
        `<span class="font-bold text-secondary-cyan-bold">${match}</span>`
    )
  }

  return (
    <span
      className="text-secondary-cyan text-xs overflow-y-scroll no-scrollbar text-center"
      dangerouslySetInnerHTML={{ __html: HighlightKeywords(description) }}
    ></span>
  )
}

export default CardDescription
