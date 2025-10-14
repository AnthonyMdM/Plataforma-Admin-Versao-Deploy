"use client";
import React from "react";

export default function useCombobox(options: Record<string, string>) {
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);

  const filteredOptions = React.useMemo(
    () =>
      Object.entries(options).filter(([label]) =>
        label.toLowerCase().includes(search.toLowerCase())
      ),
    [search, options]
  );

  const availableOptions = React.useMemo(
    () =>
      search.length > 0 ? filteredOptions : Object.entries(options).slice(0, 5),
    [search, filteredOptions, options]
  );

  const handleSelect = React.useCallback((label: string, value: string) => {
    setSelected(value);
    setSearch(label);
    setOpen(false);
    setFocusedIndex(-1);
  }, []);

  const handleClear = React.useCallback(() => {
    setSelected("");
    setSearch("");
    setFocusedIndex(-1);
  }, []);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) {
        if (e.key === "ArrowDown" || e.key === "Enter") {
          e.preventDefault();
          setOpen(true);
          setFocusedIndex(0);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev < availableOptions.length - 1 ? prev + 1 : 0
          );
          break;

        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev > 0 ? prev - 1 : availableOptions.length - 1
          );
          break;

        case "Enter":
          e.preventDefault();
          if (focusedIndex >= 0 && availableOptions[focusedIndex]) {
            const [label, value] = availableOptions[focusedIndex];
            handleSelect(label, value);
          }
          break;

        case "Escape":
          setOpen(false);
          setFocusedIndex(-1);
          break;
      }
    },
    [open, availableOptions, focusedIndex, handleSelect]
  );

  const reset = React.useCallback(() => {
    setSearch("");
    setSelected("");
    setOpen(false);
    setFocusedIndex(-1);
  }, []);

  return {
    search,
    setSearch,
    selected,
    setSelected,
    open,
    setOpen,
    focusedIndex,
    availableOptions,
    handleSelect,
    handleClear,
    handleKeyDown,
    reset,
  };
}
