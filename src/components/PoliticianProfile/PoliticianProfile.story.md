---
title: 'Politician Profile'
icon: 'carbon:table-split'
---

# \<PoliticianProfile \/\>

## Models

```ts
export interface Party {
	name: string;
	logo: string;
	color: string;
}
```

## Props

| Props       | Type              | Meaning                                  |
| ----------- | ----------------- | ---------------------------------------- |
| `id`        | `string`          | id of the politician                     |
| `firstname` | `string`          | firstname of the politician              |
| `lastname`  | `string`          | lastname or familyname of the politician |
| `avatar`    | `string`          | avatar image of the politician           |
| `party`     | `Party`           | party of the politician                  |
| `role`      | `string`          | role of the politician in paliarment     |
| `isLarge`   | `boolean = false` | display a component in big scale type    |
