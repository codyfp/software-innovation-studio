import { useState, useEffect, useMemo } from 'react'
import { InputLabel } from '@/types/InputLabels'
import { Ingredient } from '@/clientApi/IngredientApi'
interface InputChipProps {
  title: InputLabel
  options: Ingredient[]
  setOptions: (options: Ingredient[]) => void,
  searchOptions?: Ingredient[],
  htmlId?: string
}

export default function InputChips({ title, options, setOptions, searchOptions = [], htmlId }: InputChipProps) {
  const [input, setInput] = useState<string>("")
  const [currentOptions, setCurrentOptions] = useState<Ingredient[]>(searchOptions)

  // Save optionsNames as a map to avoid looping through searchOptions every time
  const optionNames = useMemo(() => {
    return new Map(searchOptions.map((ingredient) => [ingredient.name, ingredient]))
  }, [searchOptions]);

  useEffect(() => {
    // Datalist is limited in browsers to about 100-200 options, so we need to filter the options for users to actually find what they want
    const filteredOptions = searchOptions.filter((ingredient) => {
      return ingredient.name.toLowerCase().includes(input.toLowerCase())
    })
    setCurrentOptions(filteredOptions)

    // If input matches an option, add it to the list
    // This is very hacky as it checks each change, so if a partial match exists it will add it, fix if needed could be a debounce?
    // i.e if you try to type 'orange liqueur' it will add 'orange' first and clear the input
    if (optionNames.has(input)) {
      const _chips = [...options]
      _chips.push(optionNames.get(input) as Ingredient) // ngl idk what this as Ingredient is doing but it works; thanks copilot cause im delerious af
      setOptions(_chips)
      setInput("")
    }
  }, [input])

  const onDeleteItem = (index: number) => {
    const _chips = [...options]
    _chips.splice(index, 1)
    setOptions(_chips)
  }

  return (
    <div className="bg-white px-5 py-4 min-h-[12rem] rounded-xl flex flex-col items-center">
      <div className="flex flex-row items-center mb-4">
        <label className={`x-title w-32 ${title === 'Allergens' ? 'mr-4' : ''}`}>{title}:</label>
        <input
          placeholder="Enter here"
          className="bg-gray-300 rounded-full h-8 w-60 px-5 uppercase"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          list={`${htmlId}+ingredients`}
        />
        <datalist id={`${htmlId}+ingredients`}>
          {currentOptions.map((ingredient) => (
            <option key={ingredient.id} value={ingredient.name} />
          ))}
        </datalist>
      </div>

      <div className="flex flex-row flex-wrap gap-1 mb-4">
        {options.map((chip, index) => (
          <Chip key={index} onClick={() => onDeleteItem(index)}>
            {chip.name}
          </Chip>
        ))}
      </div>
    </div>
  )
}

function Chip({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <div className="bg-gray-300 flex items-center gap-3 rounded-full pl-5 pr-2 h-8 w-max">
      <div className="font-bold uppercase">{children}</div>
      <button
        className="hover:bg-gray-400 flex items-center justify-center rounded-full w-[20px] h-[20px]"
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 384 512"
        >
          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
        </svg>
      </button>
    </div>
  );
}
