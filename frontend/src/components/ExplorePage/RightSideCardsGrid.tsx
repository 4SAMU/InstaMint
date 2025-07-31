// RightSide.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Box, Skeleton, Typography } from "@mui/material";

interface RightSideGridProps {
  items: any[];
  onCardClick: (item: any) => void;
  loading?: boolean; // <-- optional prop to indicate loading
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

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        justifyContent: "center",
        padding: 2,
        overflow: "auto",
        height: "calc(100vh - 80px)",
      }}
    >
      {/* Loading state with skeletons */}
      {isLoading &&
        Array.from(new Array(6)).map((_, index) => (
          <Box key={index} sx={{ width: "30%", minWidth: "200px" }}>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={180}
              sx={{ borderRadius: 2 }}
            />
            <Skeleton width="60%" />
            <Skeleton width="40%" />
          </Box>
        ))}

      {/* Empty state */}
      {!isLoading && items.length === 0 && (
        <Typography variant="h6" sx={{ mt: 4, color: "text.secondary" }}>
          No images found
        </Typography>
      )}

      {/* Loaded images */}
      {!isLoading &&
        items.length > 0 &&
        items.map((item) => (
          <Box
            key={item.id || item.tokenId} // Use tokenId as fallback key if id is not always present
            sx={{ width: "30%", minWidth: "200px", cursor: "pointer" }}
            onClick={() => onCardClick(item)}
          >
            {/* The src might be an IPFS gateway URL or your backend URL */}
            <img
              src={item.image}
              alt={item.title || item.name || "NFT Image"}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: 8,
              }}
              // You might want to remove this onLoad if images are from various sources
              // or handle loading states more globally for the grid.
              // onLoad={() => setIsLoading(false)}
            />
            {/* Optional: Display title/name below the image */}
            <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
              {item.title || item.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Price: {item.price} XTZ
            </Typography>
          </Box>
        ))}
    </Box>
  );
};

export default RightSideGrid;
