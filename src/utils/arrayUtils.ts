const removeItem = (arr: any[], item: any): any[] => {
  const index = arr.indexOf(item)

  if (index === -1) {
    return arr
  } else {
    return [
      ...arr.slice(0, index),
      ...arr.slice(index+1)
    ]
  }
}

const removeItems = (arr: any[], items: any[]): any[] => {
  return items.reduce((acc, item) => {
    return removeItem(acc, item)
  }, arr)
}

export {
  removeItem,
  removeItems
}