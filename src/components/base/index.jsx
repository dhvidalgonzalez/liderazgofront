import React from "react";
import Menu from "../menu";
import Header from "../header";
import Footer from "../footer";

const Base = ({ content }) => {
  return (
    <>
      <Menu></Menu>

      <Header></Header>
      <div class="content">
        {content}

        <Footer></Footer>
      </div>
    </>
  );
};

export default Base;
