/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from "react"; // Import useMemo
import { Box, Skeleton, Typography } from "@mui/material";
import Masonry from "react-masonry-css";

interface RightSideGridProps {
  items: any[];
  onCardClick: (item: any) => void;
  loading?: boolean;
  isDetailViewOpen: boolean; // <-- Add this new prop
}

const RightSideGrid: React.FC<RightSideGridProps> = ({
  items,
  onCardClick,
  loading = false,
  isDetailViewOpen, // <-- Receive the new prop
}) => {
  const [isLoading, setIsLoading] = useState(loading);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  // Define two sets of breakpoint column configurations
  const normalBreakpointColumns = {
    default: 4, // Default: 4 columns when detail is NOT open
    1100: 3, // 3 columns on screens <= 1100px
    700: 2, // 2 columns on screens <= 700px
    500: 1, // 1 column on screens <= 500px
  };

  const detailViewBreakpointColumns = {
    default: 3, // Default: 3 columns when detail IS open (reduced from 4)
    1100: 2, // 2 columns on screens <= 1100px (reduced from 3)
    700: 2, // 2 columns (remains 2 if 700px is still wide enough for 2)
    500: 1, // 1 column (remains 1)
  };

  // Use useMemo to dynamically select the breakpoint configuration
  const currentBreakpointColumns = useMemo(() => {
    return isDetailViewOpen
      ? detailViewBreakpointColumns
      : normalBreakpointColumns;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDetailViewOpen]); // Recalculate only when isDetailViewOpen changes

  return (
    <Box
      sx={{
        flex: 1, // Allows RightSideGrid to take remaining space
        padding: 2,
        overflowY: "auto",
        height: "calc(100vh - 80px)",

        // Custom Scrollbar
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#f1f1f1",
          borderRadius: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#888",
          borderRadius: "8px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#555",
        },
        scrollbarWidth: "thin", // Firefox
        scrollbarColor: "#888 #f1f1f1", // Firefox
      }}
    >
      {/* Loading state with skeletons */}
      {isLoading && (
        <Masonry
          breakpointCols={currentBreakpointColumns} // Use the dynamic breakpoints
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {Array.from(new Array(6)).map((_, index) => (
            <Box key={`skeleton-${index}`} sx={{ width: "100%" }}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={Math.random() * (280 - 180) + 180}
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
          breakpointCols={currentBreakpointColumns} // Use the dynamic breakpoints
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {items.map((item) => (
            <Box
              key={item.id || item.tokenId}
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

              {/* <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
                {item.title || item.name}
              </Typography> */}
              {/* <Typography variant="caption" color="text.secondary">
                Price: {item.price} XTZ
              </Typography> */}
            </Box>
          ))}
        </Masonry>
      )}
    </Box>
  );
};

export default RightSideGrid;
