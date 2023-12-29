---
title: 'Search Result'
icon: 'carbon:search-locate'
---

# \<SearchResult \/\>

- ใช้แสดงผลลัพธ์จาก `<SearchInput>`
- หากไม่มีการระบุว่าต้องการผลลัพธ์ชนิดใดบ้าง component จะแสดงผลลัพธ์ทุกประเภท

## Props

| Props          | Type            | Meaning                            |
| -------------- | --------------- | ---------------------------------- |
| `searchResult` | `SearchResults` | ผลลัพธ์ที่ได้จาก `<SearchInput />` |
| `politician`   | `boolean`       | แสดงผลลัพธ์นักการเมือง             |
| `voting`       | `boolean`       | แสดงผลลัพธ์การลงมติ                |
| `bill`         | `boolean`       | แสดงผลลัพธ์การออกกฎหมาย            |
| `billProposer` | `boolean`       | แสดงผลลัพธ์ชื่อผู้เสนอร่าง         |

### Example of Props Usage

แสดงผลลัพธ์เฉพาะส่วนการออกกฎหมาย และ ชื่อผู้เสนอร่าง

```svelte
<SearchResult bill billProposer />
```
