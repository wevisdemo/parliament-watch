---
title: 'Data Page'
icon: 'carbon:search'
---

# \<SearchInput \/\>

- Search Input UI ที่เมื่อพิมพ์ จะ search จาก index ที่มอบให้
- สามารถส่ง properties เหมือน [Carbon `TextInput`](https://svelte.carbondesignsystem.com/components/TextInput) ได้ทั้งหมด

## Interfaces

See [models/search.ts](/src/models/search.ts).

## Props

| Props           | Type            | Meaning                                                                              |
| --------------- | --------------- | ------------------------------------------------------------------------------------ |
| `searchIndexes` | `SearchIndexes` | ข้อมูลที่ใช้สำหรับการค้นหาแบ่งตามประเภทของข้อมูล โดยสามารถส่งเพียงข้อมูลบางประเภทได้ |

## Reactive Props

Props เหล่านี้ต้อง `bind:props` เพื่อให้ parent component สามารถทราบ state ด้านใน component ได้

| Props                | Type                           | Meaning                                                                                                                      |
| -------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `bind:searchResults` | `SearchResults \| null = null` | ผลลัพธ์ของการค้นหา โดยจะแสดง properties เฉพาะที่มีใน index เท่านั้น; หากไม่มีใน index ผลการค้นหานั้นๆจะมีค่าเป็น `undefined` |
| `bind:searchValue`   | `searchValue  \| null = ''`    | ข้อความในช่องค้นหา อาจใช้สำหรับการ reset ข้อความของ Input ได้                                                                |
