---
title: 'Data Page'
icon: 'carbon:table-split'
---

# \<DataPage \/\>

- ใช้สร้างหน้าที่เป็นหน้าตารางข้อมูล และมี Filter ทางซ้าย
- **เร็นเดอร์ทั้งหน้า**เนื่องจากใช้ Flex ในการจัดขนาด Element ต่างๆ ให้สูงอย่างน้อย 100vh เสมอ

## Interfaces

```ts
export interface FilterChoice {
	label: string;
	value: string | number | boolean;
}

export interface FilterGroup {
	key: string;
	legend: string;
	choices: FilterChoice[];
}

export type SelectedFilterType = Record<FilterGroup['key'], FilterChoice['value'][]>;
```

## Props

| Props            | Type                                | Meaning                                          |
| ---------------- | ----------------------------------- | ------------------------------------------------ |
| `breadcrumbList` | `{ label: string; url: string }[]`  | ข้อมูล Breadcrumb                                |
| `filterList`     | `FilterGroup[]`                     | ข้อมูล Filter ว่าจะต้องมีอะไรบ้าง                |
| `filteredData`   | `{ id: any; [key: string]: any }[]` | ข้อมูลใส่ตารางที่ผ่านการ filter มาจากด้านนอกแล้ว |
| `tableHeader`    | `{ key: string; value: string }[]`  | ข้อมูลหัวตาราง                                   |
| `tablePageSize`  | `number = 10`                       | จำนวนข้อมูลต่อหน้า                               |

## Reactive Props

Props เหล่านี้ต้อง `bind:props` เพื่อให้ parent component สามารถทราบ state ด้านใน component ได้

| Props                    | Type                             | Meaning                                                                                                      |
| ------------------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `bind:searchQuery`       | `string = ""`                    | ข้อความในกล่องค้นหา                                                                                          |
| `bind:selectedFilter`    | `SelectedFilterType = ทุกชอยส์*` | เป็น Object ที่จะมีชื่อกลุ่ม filter เป็น key และค่า checkbox ที่เลือกเป็น value ใน array ของกลุ่มใครกลุ่มมัน |
| `bind:isFilterSomeFalse` | `boolean = false`                | เอาไว้ sync กับด้านนอกว่าตอนนี้ Filter **บางอัน**ไม่ถูกเลือกหรือเปล่า                                        |
| `bind:isFilterAllFalse`  | `boolean = false`                | เอาไว้ sync กับด้านนอกว่าตอนนี้ Filter **ทุกอัน**ไม่ถูกเลือกหรือเปล่า                                        |
| `bind:mounted`           | `boolean = false`                | เอาไว้ sync กับด้านนอกว่าตอนนี้ DataPage mount แล้วหรือยัง                                                   |

> \*ทุกชอยส์ คือ `Object.fromEntries(filterList.map((group) => [group.key, group.choices.map((choice) => choice.value)]));`

## Slots

### Default Slot

Default Slot จะเป็น Header ของหน้านั้นๆ

### Slot `table`

จากตัวอย่างต่อไป

```svelte
<svelte:fragment slot="table" let:cellKey let:cellValue>
	{#if cellKey === 'direction'}
		{#if cellValue}
			<span class="bg-teal-30 rounded-full px-2 text-black">ตามเสียงส่วนใหญ่ในพรรค</span>
		{:else}
			<span class="bg-red-30 rounded-full px-2 text-black">ต่างจากเสียงส่วนใหญ่ในพรรค</span>
		{/if}
	{:else}
		{cellValue}
	{/if}
</svelte:fragment>
```

Slot `table` จะ expose ค่าออกมา 2 ตัวคือ `cellKey` กับ `cellValue`

- `cellKey` คือ key ของคอลัมน์นั้นๆ (เป็นอันเดียวกับ `key` ใน `tableHeader`)
- `cellValue` คือค่าของช่องนั้นๆ

จากตัวอย่างจะเห็นว่า จะเช็คว่าเป็นช่องของคอลัมน์ `direction` หรือไม่ ถ้าใช่ก็จะ format ข้อมูลใหม่ (เป็น Tag) แต่ถ้าไม่ใช่ก็จะแสดงเป็นค่าปกติ
