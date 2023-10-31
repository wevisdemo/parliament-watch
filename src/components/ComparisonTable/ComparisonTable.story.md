---
title: 'Politician Profile'
icon: 'carbon:table-split'
---

# \<ComparisonTable \/\>

## Models

```ts
export interface Party {
	name: string;
	logo: string;
	color: string;
}
```

## Props

| Props       | Type                          | Meaning                              |
| ----------- | ----------------------------- | ------------------------------------ |
| `tableData` | `{ [key: string]: string }[]` | array of string key and string value |
