import React from "react";
import View from "./view";
import Base from "/src/components/base";
import { DataContextProvider } from "./context";

const CreateJustification = () => {
  return (
    <DataContextProvider>
      <Base content={<View />} />
    </DataContextProvider>
  );
};

export default CreateJustification;
