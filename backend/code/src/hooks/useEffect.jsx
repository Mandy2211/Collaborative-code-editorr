useEffect(() => {
    if (typeof window !== "undefined" && typeof Prism !== "undefined") {
      Prism.highlightAll();
    }
  }, [code, language]);