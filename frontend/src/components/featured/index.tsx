/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { OutlinedButton, SectionWrapper } from "@/styles/common-styles";
import { Box, CircularProgress, Typography } from "@mui/material";
import EastIcon from "@mui/icons-material/East";
import { FeaturedCards } from "./style";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { useRouter } from "next/router";

const FeaturedNFTS = () => {
  const router = useRouter();
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const res = await fetch("/api/nft");
        const data = await res.json();
        if (data.success && data.nfts) {
          // Sort NFTs by likes + comments (descending)
          const sortedNFTs = data.nfts.sort((a: any, b: any) => {
            const aScore = (a.likes?.length || 0) + (a.comments?.length || 0);
            const bScore = (b.likes?.length || 0) + (b.comments?.length || 0);
            return bScore - aScore;
          });

          // Show top 4
          setNfts(sortedNFTs.slice(0, 4));
        }
      } catch (err) {
        console.error("Error fetching NFTs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  return (
    <SectionWrapper
      sx={{
        flexDirection: "column",
        "@media (min-width: 1536px)": {
          padding: "50px 400px 150px 400px",
        },
        "@media (max-width: 1535px)": {
          padding: "50px 8% 80px 8%",
        },
        "@media (max-width: 599px)": {
          padding: "0px 8% 80px 8%",
          alignItems: "center",
        },
      }}
    >
      <Box
        className="header"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <Box className="title">
          <h2>Featured Collectibles</h2>
          <p style={{ marginTop: "5px" }}>
            Discover the most sought-after moments on InstaMint - trending
            creations loved by our community
          </p>
        </Box>
        <OutlinedButton onClick={() => router.push("/collections")}>
          View more&nbsp;&nbsp;
          <EastIcon />
        </OutlinedButton>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <FeaturedCards>
          {nfts.length > 0 ? (
            nfts.map((nft) => (
              <Box className="the_card" key={nft._id}>
                <Box className="image">
                  <img
                    src={nft.metadata?.image || "/placeholder.png"}
                    alt={nft.metadata?.name || "NFT"}
                  />
                  <div className="overlay">
                    <span className="likes_count">
                      <FavoriteBorderIcon /> {nft.likes?.length || 0}
                    </span>
                    <span className="comments_count">
                      <ChatBubbleOutlineOutlinedIcon />{" "}
                      {nft.comments?.length || 0}
                    </span>
                  </div>
                </Box>
                <Box className="content">
                  <span className="title">{nft.metadata?.name || ""}</span>
                  <span
                    className="description"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {nft.metadata?.description || ""}
                  </span>
                </Box>
              </Box>
            ))
          ) : (
            <Typography sx={{ mt: 4 }}>No featured NFTs available</Typography>
          )}
        </FeaturedCards>
      )}
    </SectionWrapper>
  );
};

export default FeaturedNFTS;
