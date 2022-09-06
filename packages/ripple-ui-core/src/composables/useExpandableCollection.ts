import { ref } from 'vue'
import type { Ref } from 'vue'

export function useExpandableState(initalActiveItems: number[]) {
  const activeItems: Ref<number[]> = ref(initalActiveItems)

  function isItemExpanded(index: number) {
    return activeItems.value.includes(index)
  }

  // function isAllExpanded() {
  //   return activeItems.value.length === items.length
  // }

  function toggleItem(itemIndex: number) {
    const activeItemIndex = activeItems.value.indexOf(itemIndex)

    // Item needs to made active
    if (activeItemIndex === -1) {
      activeItems.value.push(itemIndex)
    }

    // Item needs to be made inactive
    else {
      activeItems.value.splice(activeItemIndex, 1)
    }
  }

  function setToggledItems(state: number[]) {
    activeItems.value = state
  }

  return { isItemExpanded, isAllExpanded, toggleItem, toggleAll }
}


// export function useExpandableCollection(items: [], contentEls: []) {
//   const activeItems: Ref<number[]> = ref([])

//   // During setup add any of the active items to the activeItems array
//   items.forEach((item, index) => {
//     if (item?.active) {
//       activeItems.value.push(index)
//     }
//   })

//   function isItemExpanded(index: number) {
//     return activeItems.value.includes(index)
//   }

//   function isAllExpanded() {
//     return activeItems.value.length === items.length
//   }

//   function toggleItem(itemIndex: number) {
//     const activeItemIndex = activeItems.value.indexOf(itemIndex)

//     // Item needs to made active
//     if (activeItemIndex === -1) {
//       activeItems.value.push(itemIndex)
//       animateOpening(contentEls.value[itemIndex])
//     }

//     // Item needs to be made inactive
//     else {
//       activeItems.value.splice(activeItemIndex, 1)
//       animateClosing(contentEls.value[itemIndex])
//     }
//   }

//   function toggleAll() {
//     // Make all items active
//     if (!isAllExpanded()) {
//       items.forEach((item, index) => {
//         if (!isItemExpanded(index)) {
//           toggleItem(index)
//         }
//       })
//     }

//     // Make all items inactive
//     else {
//       items.forEach((item, index) => {
//         if (isItemExpanded(index)) {
//           toggleItem(index)
//         }
//       })
//     }
//   }

//   return { isItemExpanded, isAllExpanded, toggleItem, toggleAll }
// }
