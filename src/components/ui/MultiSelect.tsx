

import { useState, useRef, useEffect } from "react";
import { Form } from "react-bootstrap";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface Props {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  id?: string;
}

/**
 * Dropdown with multi-select checkboxes.
 * - Button shows current selection ("All" when empty, names joined, or "N selected")
 * - Click toggles a panel with checkboxes + search
 * - Click outside closes it
 * - No external deps beyond react-bootstrap Form.Check
 */
export default function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "All",
  id,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("keydown", onEsc);
    }
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const selectedLabels = options
    .filter((o) => selected.includes(o.value))
    .map((o) => o.label);

  const display =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? selectedLabels[0]
        : selected.length <= 2
          ? selectedLabels.join(", ")
          : `${selected.length} selected`;

  const filtered = query.trim()
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  function toggle(value: string) {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  }

  function clearAll(e: React.MouseEvent) {
    e.stopPropagation();
    onChange([]);
  }

  return (
    <div className="mr-multiselect" ref={ref}>
      <button
        type="button"
        className={`mr-multiselect-toggle ${open ? "open" : ""}`}
        onClick={() => {
          setOpen((o) => !o);
          setQuery("");
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        id={id}
      >
        <span className={`mr-multiselect-value ${selected.length === 0 ? "placeholder" : ""}`}>
          {display}
        </span>
        <span className="mr-multiselect-actions">
          {selected.length > 0 && (
            <i
              className="bi bi-x-circle mr-multiselect-clear"
              onClick={clearAll}
              role="button"
              aria-label="Clear selection"
              tabIndex={-1}
            />
          )}
          <i className={`bi bi-chevron-${open ? "up" : "down"} mr-multiselect-caret`} />
        </span>
      </button>

      {open && (
        <div className="mr-multiselect-panel" role="listbox">
          {options.length > 6 && (
            <div className="mr-multiselect-search">
              <i className="bi bi-search" />
              <input
                type="text"
                placeholder="Search…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              {selected.length > 0 && (
                <button type="button" className="mr-multiselect-clear-btn" onClick={clearAll}>
                  Clear
                </button>
              )}
            </div>
          )}
          <div className="mr-multiselect-options">
            {filtered.length === 0 ? (
              <p className="mr-multiselect-empty">No matches</p>
            ) : (
              filtered.map((o) => {
                const checked = selected.includes(o.value);
                return (
                  <label
                    key={o.value}
                    className={`mr-multiselect-option ${checked ? "checked" : ""}`}
                  >
                    <Form.Check
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(o.value)}
                      label={o.label}
                      id={`ms-${id ?? "x"}-${o.value}`}
                    />
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
