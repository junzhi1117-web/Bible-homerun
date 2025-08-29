import React from 'react';
import type { RunnerIconType } from '../types';

interface RunnerIconProps {
  iconId: RunnerIconType | string;
}

interface ColorScheme {
  jersey: string;
  skin: string;
  stroke: string;
}

export const availableIcons: RunnerIconType[] = ['default', 'blue', 'red', 'yellow'];

const colorSchemes: Record<RunnerIconType, ColorScheme> = {
  'default': { jersey: '#E5E7EB', skin: '#FDE68A', stroke: '#4B5563' }, // Gray, Amber, Dark Gray
  'blue':    { jersey: '#A2B6C5', skin: '#FDE68A', stroke: '#6E8595' }, // Muted Blue
  'red':     { jersey: '#E4C9C9', skin: '#FDE68A', stroke: '#B49999' }, // Dusty Rose
  'yellow':  { jersey: '#D9C8A8', skin: '#FDE68A', stroke: '#A99878' }, // Pale Ochre
};


export const RunnerIcon: React.FC<RunnerIconProps> = ({ iconId }) => {
  const colors = colorSchemes[iconId as RunnerIconType] || colorSchemes.default;

  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <g stroke={colors.stroke} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        {/* Legs */}
        <path d="M40 95 V 65 H 60 V 95" />
        {/* Arms */}
        <path d="M25 45 L 75 45" />
        {/* Torso (Jersey) */}
        <rect x="30" y="35" width="40" height="35" rx="10" fill={colors.jersey}/>
        {/* Head */}
        <circle cx="50" cy="20" r="15" fill={colors.skin}/>
      </g>
    </svg>
  );
};
