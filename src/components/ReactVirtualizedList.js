// import React, { useState, useRef, useEffect } from 'react';

// const VirtualizedList = ({ 
//   items, 
//   itemHeight = 50, 
//   containerHeight = 400,
//   overscan = 3, 
//   renderItem 
// }) => {
//   const [scrollTop, setScrollTop] = useState(0);
//   const containerRef = useRef(null);
  
  
//   const visibleItemsCount = Math.ceil(containerHeight / itemHeight);
//   const totalHeight = items.length * itemHeight;
//   const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
//   const endIndex = Math.min(
//     items.length,
//     Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
//   );

//   const visibleItems = items.slice(startIndex, endIndex);

//   // Handle scroll events
//   const handleScroll = () => {
//     const { scrollTop } = containerRef.current;
//     setScrollTop(scrollTop);
//   };

//   // Update scroll position if items change
//   useEffect(() => {
//     const { current } = containerRef;
//     if (current) {
//       current.addEventListener('scroll', handleScroll);
//       return () => current.removeEventListener('scroll', handleScroll);
//     }
//   }, []);

//   return (
//     <div 
//       ref={containerRef}
//       className="relative overflow-auto"
//       style={{ height: containerHeight }}
//     >
//       <div 
//         className="absolute top-0 left-0 right-0"
//         style={{ height: totalHeight }}
//       >
//         <div
//           className="absolute top-0 left-0 right-0"
//           style={{
//             transform: `translateY(${startIndex * itemHeight}px)`
//           }}
//         >
//           {visibleItems.map((item, index) => (
//             <div
//               key={startIndex + index}
//               className="absolute w-full"
//               style={{
//                 height: itemHeight,
//                 transform: `translateY(${index * itemHeight}px)`
//               }}
//             >
//               {renderItem(item, startIndex + index)}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };


// const ReactVirtualizedList = () => {
//   // Generating large dataset
//   const items = Array.from({ length: 200000 }, (_, index) => ({
//     id: index,
//     title: `Item ${index + 1}`,
//     description: `I am item ${index + 1}`
//   }));

  
//   const renderItem = (item, index) => (
//     <div className="p-3 border-b hover:bg-gray-50">
//       <div className="font-medium">{item.title}</div>
//       <div className="text-sm text-gray-600">{item.description}</div>
//     </div>
//   );

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Virtualized List Implementaion</h1>
//       <div className="border rounded shadow">
//         <VirtualizedList
//           items={items}
//           itemHeight={70}
//           containerHeight={500}
//           renderItem={renderItem}
//           overscan={5}
//         />
//       </div>
//       <div className="mt-4 text-sm text-gray-600">
//         Total items: {items.length.toLocaleString()}
//       </div>
//     </div>
//   );
// };

// export default ReactVirtualizedList;


import React, { useState, useRef, useCallback } from 'react';

const VirtualizedList = ({ items, containerHeight = 400, overscan = 3, renderItem }) => {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [itemHeights, setItemHeights] = useState({}); 

  const totalHeight = items.reduce((acc, _, index) => acc + (itemHeights[index] || 50), 0);
  const getItemHeight = (index) => itemHeights[index] || 50;

  
  let startIndex = 0;
  let yOffset = 0;
  for (let i = 0; i < items.length; i++) {
    const height = getItemHeight(i);
    if (yOffset + height > scrollTop) {
      startIndex = Math.max(0, i - overscan);
      break;
    }
    yOffset += height;
  }

  let endIndex = startIndex;
  let visibleHeight = 0;
  for (let i = startIndex; i < items.length && visibleHeight < containerHeight; i++) {
    visibleHeight += getItemHeight(i);
    endIndex = i + 1;
  }
  endIndex = Math.min(endIndex + overscan, items.length);

  const visibleItems = items.slice(startIndex, endIndex);

  
  const measureRef = useCallback((node, index) => {
    if (node !== null) {
      const height = node.getBoundingClientRect().height;
      setItemHeights((prev) => {
        if (prev[index] !== height) {
          return { ...prev, [index]: height };
        }
        return prev;
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-auto border rounded-lg"
      style={{ height: containerHeight }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ paddingTop: yOffset }}>
          {visibleItems.map((item, index) => (
            <div
              key={startIndex + index}
              ref={(node) => measureRef(node, startIndex + index)}
              className="p-3 border-b bg-white hover:bg-gray-50"
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function ReactVirtualizedList () {
  const items = Array.from({ length: 200000 }, (_, index) => ({
    id: index,
    title: `Item ${index + 1}`,
    description: `I am item ${index + 1}`
  }));

  const renderItem = (item) => (
    <div>
      <div className="font-medium">{item.title}</div>
      <div className="text-sm text-gray-600">{item.description}</div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Virtualized List</h1>
      <VirtualizedList items={items} containerHeight={500} renderItem={renderItem} overscan={5} />
      <div className="mt-4 text-sm text-gray-600">
        Total items: {items.length.toLocaleString()}
      </div>
    </div>
  );
};

