"use client";

import React, { useState } from "react";

export default function BmiCalculator() {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);

  const heightInMeters = height / 100;
  const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
  const numericBmi = parseFloat(bmi);

  const getCategory = (val: number) => {
    if (val < 18.5) return { label: "Underweight", color: "text-blue-400" };
    if (val < 25) return { label: "Normal weight", color: "text-green-400" };
    if (val < 30) return { label: "Overweight", color: "text-yellow-400" };
    return { label: "Obese", color: "text-red-400" };
  };

  const category = getCategory(numericBmi);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-xl space-y-6">
          <div>
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>Height</span>
              <span className="font-bold text-accent">{height} cm</span>
            </div>
            <input
              type="range"
              min="100"
              max="220"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>Weight</span>
              <span className="font-bold text-accent">{weight} kg</span>
            </div>
            <input
              type="range"
              min="30"
              max="150"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl flex flex-col items-center justify-center space-y-3">
          <span className="text-gray-400 text-sm">Your BMI Score</span>
          <span className="text-5xl font-extrabold text-white">{bmi}</span>
          <span className={`text-sm font-semibold ${category.color}`}>
            {category.label}
          </span>
        </div>
      </div>
    </div>
  );
}