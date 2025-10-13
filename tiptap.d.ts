declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    table: {
      /**
       * 插入表格
       */
      insertTable: (options: {
        rows: number
        cols: number
        withHeaderRow?: boolean
      }) => ReturnType
      /**
       * 删除表格
       */
      deleteTable: () => ReturnType
      /**
       * 添加列 / 行
       */
      addColumnBefore: () => ReturnType
      addColumnAfter: () => ReturnType
      addRowBefore: () => ReturnType
      addRowAfter: () => ReturnType
      deleteColumn: () => ReturnType
      deleteRow: () => ReturnType
    }
  }
}
