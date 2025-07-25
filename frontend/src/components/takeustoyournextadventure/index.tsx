import { SecondaryButton, SectionWrapper } from "@/styles/common-styles";
import React from "react";

const TakeUsToYourNextAdventure = () => {
  return (
    <SectionWrapper
      sx={{
        flexDirection: "column",
        padding: "200px 400px",
        backgroundImage: "url('/assets/adventure.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover", // maintain aspect ratio
        backgroundPosition: "top",
        width: "100%",
        height: "750px",
        h1: {
          width: "400px",
          fontSize: "50px",
          color: "white",
        },
        ".paragraph": {
          color: "white",
          width: "300px",
          fontWeight: "500",
          marginTop: "20px",
        },
      }}
    >
      <h1>Your Memories Deserve the Blockchain.</h1>
      <p className="paragraph">
        Whether it&#39;s a candid snap, a travel highlight, or a moment worth
        remembering — mint it instantly on Etherlink. Share your world, grow
        your audience, and earn with every reaction.
      </p>
      <SecondaryButton
        sx={{
          width: "200px",
          mt: "20px",
          borderRadius: "20px",
          background: "#e7a300",
        }}
      >
        Try Out now!
      </SecondaryButton>
    </SectionWrapper>
  );
};

export default TakeUsToYourNextAdventure;
