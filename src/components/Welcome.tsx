
import React from "react";
import { useAppContext } from "../contexts/AppContext";

const Welcome = () => {
  const { storeName } = useAppContext();

  return (
    <div className="bg-gradient-to-b from-primary/20 to-primary/5 rounded-lg p-8 mb-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">
        به فروشگاه {storeName || "ما"} خوش آمدید
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl">
        بهترین محصولات با کیفیت عالی و قیمت مناسب را از ما بخواهید.
      </p>
    </div>
  );
};

export default Welcome;
