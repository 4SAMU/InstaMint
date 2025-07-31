// RightSide.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import Masonry from "react-masonry-css"; // Import Masonry component

interface RightSideGridProps {
  items: any[];
  onCardClick: (item: any) => void;
  loading?: boolean;
}

const RightSideGrid: React.FC<RightSideGridProps> = ({
  items,
  onCardClick,
  loading = false,
}) => {
  const [isLoading, setIsLoading] = useState(loading);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  // Define breakpoints for responsive columns
  // You can adjust these values based on your desired layout and screen sizes
  const breakpointColumnsObj = {
    default: 5, // Default: 5 columns
    1400: 4, // 4 columns on screens <= 1400px
    1100: 3, // 3 columns on screens <= 1100px
    700: 2, // 2 columns on screens <= 700px
    500: 1, // 1 column on screens <= 500px
  };

  return (
    <Box
      sx={{
        flex: 1, // Keep flex: 1 if this component is a child of a flex container
        // Remove display: "flex", flexWrap: "wrap", justifyContent: "center"
        // These will be handled by the Masonry component internally
        padding: 2,
        overflowY: "auto", // Use overflowY for vertical scrolling if content exceeds height
        height: "calc(100vh - 80px)",
      }}
    >
      {/* Loading state with skeletons */}
      {isLoading && (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {Array.from(new Array(6)).map((_, index) => (
            <Box
              key={`skeleton-${index}`}
              sx={{ width: "100%" /* Skeletons take full column width */ }}
            >
              <Skeleton
                variant="rectangular"
                width="100%"
                height={Math.random() * (280 - 180) + 180} // Random height for skeleton to simulate masonry
                sx={{ borderRadius: 2 }}
              />
              <Skeleton width="60%" sx={{ mt: 1 }} />
              <Skeleton width="40%" sx={{ mt: 0.5 }} />
            </Box>
          ))}
        </Masonry>
      )}

      {/* Empty state */}
      {!isLoading && items.length === 0 && (
        <Typography
          variant="h6"
          sx={{
            mt: 4,
            color: "text.secondary",
            textAlign: "center",
            width: "100%",
          }}
        >
          No images found
        </Typography>
      )}

      {/* Loaded images */}
      {!isLoading && items.length > 0 && (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {items.map((item) => (
            <Box
              key={item.id || item.tokenId}
              // The width is controlled by Masonry's column structure,
              // so remove `width: "30%", minWidth: "200px"` from here.
              // Just ensure the content (image + text) fills the column.
              sx={{ cursor: "pointer", mb: 2 }} // mb adds vertical spacing between items within a column
              onClick={() => onCardClick(item)}
            >
              <img
                src={item.image}
                alt={item.title || item.name || "NFT Image"}
                style={{
                  width: "100%", // Image takes full width of its Masonry column
                  height: "auto", // Crucial for Masonry effect
                  borderRadius: 8,
                  display: "block", // Removes extra space below image
                }}
              />
              <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
                {item.title || item.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Price: {item.price} XTZ
              </Typography>
            </Box>
          ))}
        </Masonry>
      )}
    </Box>
  );
};

export default RightSideGrid;
