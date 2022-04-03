import React from 'react';
import { SvgIcon } from '@mui/material';

const DrinkCanIcon = (props: any) => {
  const { level } = props;
  return (
    <SvgIcon viewBox="0 0 200 200" sx={{ height: '100%', width: '100%' }}>
      <g xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient
            id={`gradient${props.id}`}
            gradientTransform="rotate(90)"
          >
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset={`${level - 1}%`} stopColor="#FFFFFF" />
            <stop offset={`${level}%`} stopColor="#3c3024" />
            <stop offset="100%" stopColor="#3c3024" />
          </linearGradient>
        </defs>
        <g>
          <path
            fill={`url(#gradient${props.id})`}
            stroke="#000000"
            d="M49.4,108.76c0-18.59,0.24-37.17-0.11-55.75c-0.15-8.16,2.76-14.69,8.01-20.44c1.68-1.84,2.67-3.46,2.21-6.13    c-0.98-5.76,1.81-9.55,6.89-12.05c6.44-3.17,13.34-4.52,20.35-5.34C95.56,8,104.42,8,113.23,9.03c7.09,0.83,14.14,2.06,20.56,5.46    c6.11,3.23,7.77,6.51,6.7,13.31c-0.23,1.47,0.13,2.39,1.06,3.45c3.33,3.78,6.45,7.71,8.22,12.53c0.65,1.78,0.92,3.6,0.92,5.48    c-0.01,39.6-0.03,79.21,0.03,118.81c0.01,4.07-1.4,7.3-4.59,9.68c-2.12,1.58-3.33,3.95-5.32,5.64c-8.05,6.83-17.78,9.5-27.87,11.1    c-13.46,2.14-26.71,1.02-39.61-3.36c-6.66-2.26-12.88-5.38-17.19-11.31c-0.14-0.2-0.27-0.44-0.46-0.56    c-5.82-3.65-6.45-9.21-6.37-15.48C49.55,145.45,49.4,127.1,49.4,108.76z"
          />
        </g>
        <path
          fill="#000000"
          d="M100.13,17.69c8.82-0.13,17.45,0.94,25.79,3.92c2.15,0.77,4.17,1.81,5.81,3.43c1.64,1.61,1.55,2.35-0.53,3.3   c-6.18,2.84-12.76,4.14-19.49,4.76c-12.68,1.17-25.25,0.88-37.57-2.76c-1.78-0.52-3.52-1.22-5.21-1.99c-2.19-1-2.25-1.72-0.46-3.44   c1.61-1.54,3.55-2.54,5.62-3.29C82.51,18.61,91.23,17.54,100.13,17.69z"
        />
        <path
          fill="#FFFFFF"
          d="M88.94,31.44c-4.8-0.1-8.62-1.57-12.24-3.65c-0.76-0.44-1.71-0.95-1.53-1.98c0.18-0.97,1.21-1.32,2.05-1.51   c2.44-0.55,4.9-1.11,7.38-1.42c4.36-0.54,8.55-1.74,12.76-2.91c4.8-1.33,9.31-0.43,13.48,2.15c1.78,1.1,1.69,2.49-0.18,2.86   c-6.54,1.3-12.55,4.2-18.91,6.04C90.67,31.33,89.52,31.36,88.94,31.44z M86.7,24.55c-1.71-0.06-3.39,0.12-4.99,0.77   c-0.67,0.28-1.42,0.57-1.48,1.43c-0.06,0.86,0.62,1.32,1.29,1.59c3.66,1.46,7.37,1.59,11.1,0.26c0.68-0.24,1.4-0.56,1.36-1.48   c-0.03-0.87-0.72-1.25-1.37-1.54C90.74,24.77,88.74,24.49,86.7,24.55z M99.56,24.82c0.52,0.05,1.05,0.06,1.57-0.02   c0.96-0.16,2.23,0,2.25-1.14c0.03-1.36-1.83-1.24-2.95-1.33c-1.38-0.1-3.64-0.26-3.66,1.17C96.74,24.73,98.21,24.69,99.56,24.82z"
        />
      </g>
    </SvgIcon>
  );
};

export default DrinkCanIcon;
