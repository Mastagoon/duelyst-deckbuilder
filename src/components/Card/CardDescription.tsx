import { HighlightKeywords } from "../../data/cards"

const CardDescription: React.FC<{ description: string }> = ({
  description,
}) => {
  return (
    <span
      className="text-primary-cyan text-xs overflow-y-scroll no-scrollbar text-center"
      dangerouslySetInnerHTML={{ __html: HighlightKeywords(description) }}
    ></span>
  )
}

export default CardDescription
