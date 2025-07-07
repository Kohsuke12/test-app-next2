//SWR導入確認用

import * as React from "react";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { Category } from "@/types/Category";
import { useCategories } from "@/hooks/useCategories";

interface Props {
  selectedCategories: Category[];
  setSelectedCategories: (categories: Category[]) => void;
}

export const CategoriesSelect: React.FC<Props> = ({
  selectedCategories,
  setSelectedCategories,
}) => {
  const { categories, error, isLoading } = useCategories();

  const handleChange = (value: number[]) => {
    value.forEach((v: number) => {
      const isSelect = selectedCategories.some((c: Category) => c.id === v);
      if (isSelect) {
        setSelectedCategories(selectedCategories.filter((c: Category) => c.id !== v));
        return;
      }

      const category = categories.find((c: Category) => c.id === v);
      if (!category) return;
      setSelectedCategories([...selectedCategories, category]);
    });
  };

  // ローディング状態の表示
  if (isLoading) {
    return (
      <FormControl className="w-full">
        <OutlinedInput placeholder="カテゴリーを読み込み中..." disabled />
      </FormControl>
    );
  }

  // エラー状態の表示
  if (error) {
    return (
      <FormControl className="w-full">
        <OutlinedInput placeholder="カテゴリーの読み込みに失敗しました" disabled />
      </FormControl>
    );
  }

  return (
    <FormControl className="w-full">
      <Select
        multiple
        value={selectedCategories}
        onChange={(e) => handleChange(e.target.value as unknown as number[])}
        input={<OutlinedInput />}
        renderValue={(selected: Category[]) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value: Category) => (
              <Chip key={value.id} label={value.name} />
            ))}
          </Box>
        )}
      >
        {categories.map((category: Category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
