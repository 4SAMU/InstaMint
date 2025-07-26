/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Box } from "@mui/material";

interface RightSideGridProps {
  items: any[];
  onCardClick: (item: any) => void;
}

const RightSideGrid: React.FC<RightSideGridProps> = ({
  items,
  onCardClick,
}) => {
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

        "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },
      }}
    >
      {items.map((item) => (
        <Box
          key={item.id}
          sx={{
            width: "30%",
            minWidth: "200px",
            cursor: "pointer",
          }}
          onClick={() => onCardClick(item)}
        >
          <img
            src={item.image}
            alt={item.title}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 8,
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default RightSideGrid;
