<template>
  <div class="container">
    <!-- 新增 -->
    <el-dialog
      :title="actionType ? '新增场馆': '编辑场馆'"
      :visible.sync="dialogVisible"
      append-to-body
      @close="closeDialog"
    >
      <el-form label-width="100px" style="margin-left: 50px;max-width: 500px">
        <el-form-item label="场馆名称">
          <el-input v-model="temp.name" placeholder="例如：篮球馆"></el-input>
        </el-form-item>

        <el-form-item label="关联策略">
          <el-select
            v-model="temp.id"
            placeholder="请选择"
            clearable>
            <el-option
              v-for="item in policyOpts"
              :key="item.id"
              :label="item.attributes.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="场馆图片">
          <image-upload v-model="temp.pic" ref="imageUpload"></image-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="onUpdateVenue"
          :loading="listLoading"
        >确定</el-button>
      </div>
    </el-dialog>

    <!-- 详情 -->
    <el-dialog
      title="场馆详情"
      :visible.sync="detailDialogVisible"
      append-to-body
      v-if="list[editIndex]"
    >
      <el-form label-width="auto" style="margin-left: 50px;max-width: 500px">
        <el-form-item label="场馆名称">
          {{ list[editIndex].attributes.name }}
        </el-form-item>
        <el-form-item label="场馆预约开放周期">
         {{ list[editIndex].attributes.pic }}
        </el-form-item>
        <el-form-item label="关联策略">
         {{ list[editIndex].related_item }}
        </el-form-item>

        <el-form-item label="场馆图片">
          <el-image :src="list[editIndex].attributes.pic"></el-image>
        </el-form-item>
      </el-form>
    </el-dialog>

    <div class="header">
        <el-select
          v-model="value1"
          filterable
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select
          v-if="value1"
          v-model="value2"
          slot="prepend"
          filterable
          placeholder="请选择"
          clearable
        >
          <el-option label="1" value="1"></el-option>
          <el-option label="2" value="2"></el-option>
          <el-option label="3" value="3"></el-option>
        </el-select>

        <div>
          <el-button type="primary" round icon="el-icon-search">搜索</el-button>
          <el-button
            type="success"
            round
            icon="el-icon-plus"
            @click="updateActionType(1)"
            >新增</el-button
          >
        </div>
    </div>

    <el-card style="margin-top: 20px"
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;margin-bottom: 10px">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column property="name" label="场馆ID" width="120"><template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="场馆名称" width="120">
          <template slot-scope="scope">{{ scope.row.attributes.name }}</template>
        </el-table-column>
        <el-table-column
          property="address"
          label="场馆预约开放周期"
          show-overflow-tooltip
        >
        <template slot-scope="scope">{{ scope.row.attributes.pic }}</template>
        </el-table-column>
        <el-table-column
          property="address"
          label="关联策略"
          show-overflow-tooltip
        >
        <template slot-scope="scope">{{ scope.row.related_item}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row,$index}">
            <el-button
              icon="el-icon-edit"
              size="small"
              type="primary"
              circle
              @click="updateActionType(0, row, $index)"
            ></el-button>
            <el-button
              icon="el-icon-delete"
              size="small"
              type="danger"
              :loading="listLoading"
              circle
              @click="onDeleteVenue(row, $index)"
            ></el-button>
            <el-button size="small" round @click="checkDetails($index)">查看详情</el-button>
            <el-button size="small" round @click="setOpenTime(row)">设置时间段</el-button>
            <!-- <el-dropdown>
            <el-button type="success">
              编辑时间
              <i class="el-icon-arrow-down el-icon--right" size="small"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>场馆开放时间</el-dropdown-item>
              <el-dropdown-item>场馆可预约时间</el-dropdown-item>
            </el-dropdown-menu>
            </el-dropdown> -->
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
      background
      layout="total, prev, pager, next, jumper"
      :total="list.length"
      :page-size="10"
      :current-page.sync="currentPage"
      @current-change="onCurrentChange"
    >
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
import {
  getVenueList,
  getVenue_PolicyList,
  addVenueItem,
  deleteVenueItem,
  editVenueItem,
} from "@/api/venue";

import ImageUpload from "./components/image-upload.vue";
import { common } from "@/mixin/index.js";

import { scrollTo } from "@/utils/scroll-to";
import {
  getAssociatedList,
  getPolicyOpts,
  createFunc,
  editFunc,
  delFunc,
} from "@/utils/index";
import { notifySuccess, notifyFail } from "@/utils/notify.js";

export default {
  name: "ComplexTable",
  components: { ImageUpload },
  props: {},
  mixins: [common],
  data() {
    return {
      value1: "",
      value2: "",
      options: [
        {
          value: "1",
          label: "1",
        },
        {
          value: "2",
          label: "2",
        },
        {
          value: "3",
          label: "3",
        },
        {
          value: "4",
          label: "4",
        },
      ],
      // 策略选项
      policyOpts: [],
      venueName: "",
      openCycle: null,
      temp: {
        name: "",
        pic: "",
        // 记录策略id
        id: "",
      },
      // 新增或编辑图片时是否显示上次上传的图片
    };
  },
  computed: {},
  watch: {},
  created() {
    getPolicyOpts(this);
    getAssociatedList(this, getVenue_PolicyList, "policy");
  },
  mounted() {},
  methods: {
    // getList() {
    //   getVenueList().then((res) => {
    //     this.list = res.data;
    //     this.listLoading = false;
    //   });
    // },

    // 新增或编辑
    onUpdateVenue() {
      this.listLoading = true;
      let temp = Object.assign({}, this.temp);
      delete temp.id;
      const relationships = {
        policy: {
          data: {
            type: "policies",
            id: this.temp.id,
          },
        },
      };

      if (this.actionType) {
        let createData = {
          data: {
            type: "venues",
            attributes: temp,
            relationships,
          },
        };
        createFunc(this, addVenueItem, createData);
      } else {
        const venue_id = this.list[this.editIndex].id;
        let editData = {
          data: {
            type: "venues",
            id: venue_id,
            attributes: temp,
            relationships,
          },
        };
        editFunc(this, editVenueItem, editData);
      }
    },

    closeDialog() {
      // 重新点击新增会重置url
      this.$refs.imageUpload.previewURL = "";
      this.$refs.imageUpload.isShowPlusIcon = true;
    },

    onDeleteVenue(row, index) {
      delFunc(this, deleteVenueItem, row, index);
    },

    // 设置开放时间
    setOpenTime(row) {
      console.log(row);
      this.$router.push({
        path: "/venue-management/open-time",
        query: {
          venue_id: row.id,
          venue_name: row.venue_name,
        },
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.container {
  margin: 20px;
  .header {
    display: flex;
    margin: 10px 0;
  }
  .el-select {
    margin-right: 10px;
  }
}
</style>
