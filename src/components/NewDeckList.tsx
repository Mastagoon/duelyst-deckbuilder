const NewDeckList: React.FC = () => {
  const deckList = []

  return (
    <div className="bg-secondary-dark-blue flex flex-col justify-between text-white h-screen w-full px-2">
      <div className="flex flex-col">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col">
            <span>M: 10</span>
            <span>S: 10</span>
            <span>A: 10</span>
          </div>
          <span className="">05/40 Total</span>
        </div>
        <div>Mana Curve</div>
      </div>
      <hr />
      <div
        className={`reverse-gradient-border flex flex-col text-center overflow-y-scroll h-full px-1 ${
          deckList.length < 1 && "items-center justify-center"
        }`}
      >
        {deckList.length ? (
          "DECK LIST"
        ) : (
          <div className="self-center">
            Choose a general to construct a deck
          </div>
        )}
      </div>
      <div>Save / Share</div>
    </div>
  )
}

export default NewDeckList
