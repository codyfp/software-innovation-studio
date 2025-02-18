import { Cocktail, CocktailApi } from "@/clientApi/CocktailApi";
import { useRouter } from "next/router";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import 'primeicons/primeicons.css';

type ReactionType = "like" | "dislike";

export default function Cocktail() {
  const router = useRouter();

  const [cocktail, setCocktail] = useState<Cocktail>();
  const [reaction, setReaction] = useState<ReactionType>();

  const onReactionClick = (reactionType: ReactionType) => {
    setReaction(reactionType);
  };

  async function fetchCocktail() {
    const id = new URL(window.location.href).pathname.split("/").slice(-1)[0] as string;

    try {
      const api = new CocktailApi();
      const data: Cocktail = await api.getById(id);
      setCocktail(data);
    } catch (error) {
      const err = error as Error;
      alert(`Failed to get cocktail. ${err.message}`);
    }
  }

  useEffect(() => {
    fetchCocktail();
  }, []);

  const generateImageURL = (id: string) => {
    return `https://mixomate-cocktails.s3.ap-southeast-2.amazonaws.com/${id}.jpg`
  }

  const handleBackClick = () => {
    window.location.href = '/recommendations'
  }

  if (!cocktail) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div className="flex flex-1 flex-col bg-gray-300">
      <Head>
        <title>Mixo Mate | Cocktail</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-5">
        <span>
          <i className="pi pi-arrow-left text-xl cursor-pointer" onClick={handleBackClick}></i>
          <h1 className="x-title mb-10 text-center">{cocktail?.name}</h1>
        </span>

        <div className="flex">
          <div className="flex flex-col items-center w-1/2">
            <div className="overflow-hidden rounded-[20px] w-[300px] h-[400px]">
              <Image
                src={generateImageURL(cocktail.id)}
                alt={cocktail.name}
                priority={true}
                className="w-full h-full"
                height={400}
                width={400}
              />
            </div>

            <div className="flex gap-4 p-4">
              <ButtonReaction
                reactionType="like"
                value={reaction}
                onClick={onReactionClick}
              />

              <ButtonReaction
                reactionType="dislike"
                value={reaction}
                onClick={onReactionClick}
              />
            </div>
          </div>

          <div className="w-1/2">
            <Card
              title="Ingredients"
              list={cocktail.ingredients.map((ingredient) => ingredient.name)}
            />

            <Card title="Steps" list={cocktail.steps} listNumber />
          </div>
        </div>
      </main>
    </div>
  );
}

function Card({
  title,
  list = [],
  listNumber = false,
}: {
  title: string;
  list: string[];
  listNumber?: boolean;
}) {
  return (
    <div className="bg-white rounded-[20px] p-5 mb-2">
      <h2 className="x-title mb-4">{title}</h2>

      <ul
        className={`x-title !text-[16px] !leading-[1.5] pl-6 ${
          listNumber ? "list-decimal" : "list-disc"
        }`}
      >
        {list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ButtonReaction({
  value,
  reactionType,
  onClick,
}: {
  value?: ReactionType;
  reactionType: ReactionType;
  onClick: (reaction: "like" | "dislike") => void;
}) {
  const iconType = value === reactionType ? "fa-solid" : "fa-regular";

  const reactionClass =
    reactionType === "like"
      ? "fa-thumbs-up text-green-500 hover:text-green-600"
      : "fa-thumbs-down text-red-500 hover:text-red-600";

  return (
    <button onClick={() => onClick(reactionType)} className="outline-none">
      <i className={`${iconType} ${reactionClass} text-[28px]`} />
    </button>
  );
}