"use client";

type Props = {
  empty: boolean;
};

export function CategoryPickerHint({ empty }: Props) {
  if (!empty) return null;
  return (
    <p className="mt-1 text-xs font-semibold text-amber-600">
      No categories for this type yet. Add one below first.
    </p>
  );
}
