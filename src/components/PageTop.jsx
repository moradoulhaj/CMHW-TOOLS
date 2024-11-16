import React, { useEffect, useState } from "react";

const Wait = (sec) => new Promise((res) => setTimeout(res, sec * 1000));

const PageTop = () => {
  const [loading, setLoading] = useState(1);

  useEffect(() => {
    const load = async () => {
      await Wait(5);

      setLoading(false);
    };
    load();
  }, [loading, setLoading]);

  if (loading) return <h1>is Loading</h1>;

  return <h1>lazy loaded</h1>;
};

export default PageTop;
