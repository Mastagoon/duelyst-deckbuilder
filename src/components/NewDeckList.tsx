import { useNewDeckContext } from "../context/newDeckContext"
import Image from "next/image"
import constants from "../data/constants"
import ManaGem from "./Card/ManaGem"

const NewDeckList: React.FC = () => {
  const { general, cards } = useNewDeckContext()

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
          !general && "items-center justify-center"
        }`}
      >
        {general ? (
          <>
            <div className="flex bg-red-500 flex-col">
              <div className="flex flex-row relative">
                <ManaGem className="w-5 h-5" cost={0} />
                <span className="text-sm font-bold">{general.name}</span>
                <div className="relative bg-yellow-500">
                  <Image
                    className="bg-green-500 absolute right-0 top-0"
                    src={`${constants.imageUrl}/${general.resource.idle}`}
                    layout="intrinsic"
                    height={120}
                    width={120}
                  />
                </div>
              </div>
            </div>
          </>
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
