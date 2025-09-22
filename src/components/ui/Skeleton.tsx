'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  animate?: boolean;
}

export default function Skeleton({ 
  className = '', 
  width, 
  height, 
  rounded = false,
  animate = true 
}: SkeletonProps) {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <motion.div
      className={`bg-gray-700 ${rounded ? 'rounded-full' : 'rounded'} ${className}`}
      style={style}
      animate={animate ? {
        opacity: [0.5, 1, 0.5],
      } : {}}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <Skeleton width="200px" height="24px" />
        <div className="flex space-x-2">
          <Skeleton width="40px" height="40px" rounded />
          <Skeleton width="40px" height="40px" rounded />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              {[...Array(8)].map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <Skeleton width="80px" height="16px" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(10)].map((_, i) => (
              <tr key={i} className="border-b border-gray-800">
                <td className="px-4 py-4">
                  <Skeleton width="30px" height="16px" />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <Skeleton width="32px" height="32px" rounded />
                    <div>
                      <Skeleton width="100px" height="16px" className="mb-1" />
                      <Skeleton width="60px" height="14px" />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Skeleton width="80px" height="16px" />
                </td>
                <td className="px-4 py-4">
                  <Skeleton width="60px" height="24px" rounded />
                </td>
                <td className="px-4 py-4">
                  <Skeleton width="50px" height="16px" />
                </td>
                <td className="px-4 py-4">
                  <Skeleton width="70px" height="16px" />
                </td>
                <td className="px-4 py-4">
                  <Skeleton width="60px" height="16px" />
                </td>
                <td className="px-4 py-4">
                  <Skeleton width="80px" height="40px" />
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-center space-x-2">
                    <Skeleton width="24px" height="24px" rounded />
                    <Skeleton width="24px" height="24px" rounded />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <Skeleton width="40px" height="40px" rounded />
        <Skeleton width="60px" height="20px" />
      </div>
      <Skeleton width="120px" height="16px" className="mb-1" />
      <Skeleton width="80px" height="24px" />
    </div>
  );
}
