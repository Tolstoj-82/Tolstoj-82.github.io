(function () {
  const registry = window.OcrGameModules || {
    items: [],
    register(module) {
      if (!module || !module.id) return;
      if (this.items.some((item) => item.id === module.id)) return;

      this.items.push(module);
    },
    matching(context) {
      return this.items.filter((module) => {
        if (typeof module.matches === "function") {
          return module.matches(context);
        }

        return (
          (!module.game || module.game === context.gameName) &&
          (!module.screen || module.screen === context.selectedScreen) &&
          (!module.metric || module.metric === context.selectedMetric)
        );
      });
    },
  };

  window.OcrGameModules = registry;
})();
