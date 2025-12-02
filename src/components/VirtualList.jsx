// components/VirtualList.jsx
import React, { useRef, useState, useEffect } from 'react';

const VirtualList = ({ items, itemHeight = 60, renderItem, containerHeight = 400 }) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const totalHeight = items.length * itemHeight;
  
  // Tính toán item nào đang hiển thị
  const startIndex = Math.floor(scrollTop / itemHeight);
  const visibleItemCount = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(items.length - 1, startIndex + visibleItemCount + 2); // +2 để buffer cuộn cho mượt

  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push({
      index: i,
      data: items[i],
      style: {
        position: 'absolute',
        top: `${i * itemHeight}px`,
        width: '100%',
        height: `${itemHeight}px`,
      },
    });
  }

  const onScroll = (e) => setScrollTop(e.currentTarget.scrollTop);

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      style={{ height: `${containerHeight}px`, overflowY: 'auto', position: 'relative' }}
    >
      <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
        {visibleItems.map(({ index, data, style }) => (
           <div key={data.id || index} style={style}>
              {renderItem(data)}
           </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualList;