import React, { useRef, useState, useEffect } from 'react';

const VirtualList = ({ items, itemHeight = 60, renderItem, containerHeight = "100%" }) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [viewHeight, setViewHeight] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Hàm đo chiều cao
    const measure = () => {
        const h = containerRef.current.clientHeight;
        if (h > 0) setViewHeight(h);
    };

    measure(); // Đo ngay

    // Fallback: Nếu đo ra 0 (do chưa render xong), thử lại sau 100ms
    if (containerRef.current.clientHeight === 0) {
        setTimeout(measure, 100);
    }

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const totalHeight = items.length * itemHeight;

  // Nếu chưa đo được chiều cao, mặc định render vài item để không bị trắng trang
  const currentViewHeight = viewHeight || 600; 

  const startIndex = Math.floor(scrollTop / itemHeight);
  const visibleItemCount = Math.ceil(currentViewHeight / itemHeight);
  const endIndex = Math.min(items.length - 1, startIndex + visibleItemCount + 4);

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
      style={{ height: containerHeight, overflowY: 'auto', position: 'relative' }}
      className="custom-scrollbar h-full w-full no-scrollbar" 
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