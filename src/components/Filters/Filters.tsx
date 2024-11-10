'use client';
import { useState } from 'react';

type Props = {
  onCategoryChange: (index: number) => void;
};
export default function Filters({ onCategoryChange }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<number>(-1);
  const category = ['portrait', 'landscape', 'food', 'nature', 'night', 'travel', 'street', 'CityandArchitecture', 'other'];
  const handleCategoryChange = (index: number) => {
    setSelectedCategory(index);
    onCategoryChange(index);
  };
  return (
    <div className="grid  grid-cols-2  md:flex items-center justify-center space-x-4   mb-8 mt-8">
      <button
        type="button"
        className={
          'text-gray-400 hover:text-white text-[13px] uppercase font-effra tracking-4 font-bold' +
          (selectedCategory === -1 ? ' text-white' : '')
        }
        onClick={() => handleCategoryChange(-1)}
      >
        All
      </button>
      {category.map((item, index) => (
        <button
          type="button"
          key={index}
          className={
            'text-gray-400 hover:text-white text-[13px] uppercase font-effra tracking-4 font-bold' +
            (selectedCategory === index ? ' text-white' : '')
          }
          onClick={() => handleCategoryChange(index)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
