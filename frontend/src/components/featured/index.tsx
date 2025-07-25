import React from "react";
import { OutlinedButton, SectionWrapper } from "@/styles/common-styles";
import { Box } from "@mui/material";
import EastIcon from "@mui/icons-material/East";
import { FeaturedCards } from "./style";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

const FeaturedNFTS = () => {
  return (
    <SectionWrapper
      sx={{
        flexDirection: "column",
        padding: "50px 400px 150px 400px",
        ".header": {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        ".title": {
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box className="header">
        <Box className="title">
          <h2>Featured Collectibles</h2>
          <p style={{ marginTop: "5px" }}>
            Discover the most sought-after moments on InstaMint - trending
            creations loved by our community
          </p>
        </Box>
        <OutlinedButton>
          View more&nbsp;&nbsp;
          <EastIcon />
        </OutlinedButton>
      </Box>
      <FeaturedCards>
        <Box className="the_card">
          <Box className="image">
            <img src="" alt="" />
            <div className="overlay">
              <span className="likes_count">
                <FavoriteBorderIcon /> 23
              </span>
              <span className="comments_count">
                <ChatBubbleOutlineOutlinedIcon /> 10
              </span>
            </div>
          </Box>
          <Box className="content">
            <span className="title">Visited Bahamas</span>
            <span className="description">
              Enjoyed the sun kisses, wanna go back there fr
            </span>
          </Box>
        </Box>

        <Box className="the_card">
          <Box className="image">
            <img src="" alt="" />
            <div className="overlay">
              <span className="likes_count">
                <FavoriteBorderIcon /> 23
              </span>
              <span className="comments_count">
                <ChatBubbleOutlineOutlinedIcon /> 10
              </span>
            </div>
          </Box>
          <Box className="content">
            <span className="title">Visited Bahamas</span>
            <span className="description">
              Enjoyed the sun kisses, wanna go back there fr
            </span>
          </Box>
        </Box>

        <Box className="the_card">
          <Box className="image">
            <img src="" alt="" />
            <div className="overlay">
              <span className="likes_count">
                <FavoriteBorderIcon /> 23
              </span>
              <span className="comments_count">
                <ChatBubbleOutlineOutlinedIcon /> 10
              </span>
            </div>
          </Box>
          <Box className="content">
            <span className="title">Visited Bahamas</span>
            <span className="description">
              Enjoyed the sun kisses, wanna go back there fr
            </span>
          </Box>
        </Box>

        <Box className="the_card">
          <Box className="image">
            <img src="" alt="" />
            <div className="overlay">
              <span className="likes_count">
                <FavoriteBorderIcon /> 23
              </span>
              <span className="comments_count">
                <ChatBubbleOutlineOutlinedIcon /> 10
              </span>
            </div>
          </Box>
          <Box className="content">
            <span className="title">Visited Bahamas</span>
            <span className="description">
              Enjoyed the sun kisses, wanna go back there fr
            </span>
          </Box>
        </Box>
      </FeaturedCards>
    </SectionWrapper>
  );
};

export default FeaturedNFTS;
