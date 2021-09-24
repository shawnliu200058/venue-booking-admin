export const common = {
  data() {
    return {
      list: [],
      // 1为新增，2为编辑
      actionType: 1,
      editIndex: 0,
      listLoading: false,
      dialogVisible: false,
      detailDialogVisible: false,
      currentPage: 1
    };
  },
  methods: {
    // 更新 dialog 标题：1. 新增  2. 编辑
    updateActionType(type, row = null, index = 0) {
      // 需要编辑目标的index
      this.editIndex = index;
      // 编辑时显示上次编辑的内容，新增时显示空，增加用户体验
      // row为null时为新增，点击新增应清空上次输入的内容
      // 赋予数组要编辑场馆的id，使用编辑功能时才会传入row
      if (row) {
        this.temp = this.list[index].attributes;
        this.temp.id = row.id;
      }
      // 新增
      // for (let key of Object.keys(this.temp)) {
      //   console.log(this.temp[key])
      //   this.temp[key] = ''
      //   console.log(this.temp[key]);
      // }
      else
        for (var key in this.temp) {
          this.temp[key] = "";
        }
      this.actionType = type;
      this.dialogVisible = true;
    },

    // 查看详情
    checkDetails(index) {
      this.detailDialogVisible = true;
      this.editIndex = index;
    },

    onCurrentChange() {
      this.getList(this.currentPage);
      scrollTo(0, 800);
    }
  }
};