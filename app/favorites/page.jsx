'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import PokemonCard from '../components/PokemonCard';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const getFavs = async () => {
      try {
        const response = await fetch('/api/favorites', {
          method: 'GET',
        });
        const data = await response.json();
        setFavorites(data);
      } catch (err) {
        console.error(err);
      }
    };
    getFavs();
  }, []);

  return (
    <div>
      <h1>Favorite Pokemon</h1>
      <div className='singleButton'>
      <Link href='./'>
        <button className='homeButton'>GET MORE POKEMON</button>
      </Link>
      </div>
      <div className='favorites'>
      {favorites.map((pokemon) => (
        <PokemonCard name={pokemon.name} />
      ))}
      </div>
    </div>
  );
};

export default Favorites;
