<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="门店" prop="storeId">
        <el-input
          v-model="queryParams.storeId"
          placeholder="请输入门店ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['business:set:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:set:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:set:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="setList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="门店" align="center" prop="storeName" />
      <el-table-column label="套装名称" align="center" prop="productName" />
      <el-table-column label="套装描述" align="center" prop="productDescribe" />
      <el-table-column label="套装价格" align="center" prop="productPrice" />
      <el-table-column label="首页图片" align="center" prop="imageUrl">
        <template #default="scope">
          <img :src="scope.row.imageUrl" alt="图标" style="max-width: 100px; max-height: 100px;">
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sortOrder" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleProductSetDetail(scope.row.id)"
          >详情图</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改商品套装对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="门店" prop="storeId">
          <el-select v-model="form.storeId" placeholder="请选择门店">
            <el-option v-for="item in storeOptions" :key="item.id" :label="item.storeName" :value="item.id" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="套装名称" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入套装名称" />
        </el-form-item>
        <el-form-item label="套装描述" prop="productDescribe">
          <el-input v-model="form.productDescribe" placeholder="请输入套装描述" />
        </el-form-item>
        <el-form-item label="套装价格" prop="productPrice">
          <el-input v-model="form.productPrice" placeholder="请输入套装价格" />
        </el-form-item>
        <el-form-item label="首页图片" prop="imageUrl">
          <image-upload v-model="form.imageUrl" :limit="1"/>
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input v-model="form.sortOrder" placeholder="请输入排序" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 商品详情弹框 -->
    <el-dialog :title="productSetDetailTitle" :visible.sync="productSetDetailOpen" width="500px" append-to-body>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleProductSetDetailAdd"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleProductSetDetailUpdate"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="single"
            @click="handleProductSetDetailDelete"
          >删除</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="setDetailList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="图片" align="center" prop="imageUrl">
          <template #default="scope">
            <img :src="scope.row.imageUrl" alt="图片" style="max-width: 100px; max-height: 100px;">
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center" prop="sortOrder" />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelProductSetDetail">取 消</el-button>
      </div>
      <pagination
        v-show="totalProductSetDetail>0"
        :total="totalProductSetDetail"
        :page.sync="queryParamsProductSetDetail.pageNum"
        :limit.sync="queryParamsProductSetDetail.pageSize"
        @pagination="getProductSetDetailList"
      />
    </el-dialog>

    <!-- 添加或修改商品详情图对话框 -->
    <el-dialog :title="productSetDetailAddUpdateTitle" :visible.sync="productSetDetailAddUpdateOpen" width="500px" append-to-body>
      <el-form ref="form" :model="productSetDetailForm" :rules="rulesSetDetail" label-width="80px">
        <el-form-item label="图片" prop="imageUrl">
          <image-upload v-model="productSetDetailForm.imageUrl" :limit="1"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="productSetDetailForm.status">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="productSetDetailForm.sortOrder" controls-position="right" :min="0" :value="1" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormProductSetDetail">确 定</el-button>
        <el-button @click="cancelProductSetAddUpdateDetail">取 消</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import { listSet, getSet, delSet, addSet, updateSet } from "@/api/business/set";
import { listAllStore } from '@/api/business/carousel'
import { addImage, delImage, getImage, listImage, updateImage } from '@/api/business/image'


let productSetIdGlobal = 0;
export default {
  name: "Set",
  dicts: ['sys_normal_disable'],

  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 商品套装表格数据
      setList: [],
      //门店
      storeOptions: [],
      // 表单参数
      productSetDetailForm: {},
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        storeId: null,
        status: null,
      },
      // 总条数
      totalProductSetDetail: 0,
      // 查询参数
      queryParamsProductSetDetail: {
        pageNum: 1,
        pageSize: 10,
        setId: null,
      },

      // 表单参数
      form: {},
      // 表单校验
      rules: {
        storeId: [
          { required: true, message: "门店ID不能为空", trigger: "blur" }
        ],
        productName: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
        productDescribe: [
          { required: true, message: "商品描述不能为空", trigger: "blur" }
        ],
        productPrice: [
          { required: true, message: "商品价格不能为空", trigger: "blur" }
        ],
      },
      // 表单校验
      rulesSetDetail: {
        imageUrl: [
          { required: true, message: "图片不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        sort_order: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],
      },
      // 商品详情弹出层标题
      productSetDetailTitle : "",
      // 商品详情弹出层
      productSetDetailOpen : false,

      //商品详情新增修改弹出层标题
      productSetDetailAddUpdateTitle : "",
      //商品详情新增修改
      productSetDetailAddUpdateOpen : false,
      // 商品详情图表格数据
      setDetailList: [],
    };
  },
  created() {
    this.getList();
    this.getListAllStore();

  },
  methods: {
    /** 查询商品套装列表 */
    getList() {
      this.loading = true;
      listSet(this.queryParams).then(response => {
        this.setList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        storeId: null,
        productName: null,
        productDescribe: null,
        productPrice: null,
        imageUrl: null,
        status: null,
        sortOrder: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
    },
    /** 查询门店列表 */
    getListAllStore() {
      this.loading = true;
      listAllStore().then(response => {
        this.storeOptions = response.data;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加商品套装";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSet(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改商品套装";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateSet(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSet(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除商品套装编号为"' + ids + '"的数据项？').then(function() {
        return delSet(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('business/set/export', {
        ...this.queryParams
      }, `set_${new Date().getTime()}.xlsx`)
    },


    // 表单重置
    resetProductSetDetail() {
      this.productSetDetailForm = {
        id: null,
        imageUrl: null,
        status: "0",
        sortOrder: 1,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
    },

    // 商品详情图取消按钮
    cancelProductSetDetail() {
      this.productSetDetailOpen = false;
      this.resetProductSetDetail();
    },

    // 商品详情图新增修改取消按钮
    cancelProductSetAddUpdateDetail() {
      this.productSetDetailAddUpdateOpen = false;
      this.resetProductSetDetail();
    },


    /** 商品详情图 */
    handleProductSetDetail(rowProductId) {
      productSetIdGlobal = rowProductId;
      this.productSetDetailOpen = true;
      this.productSetDetailTitle = "商品套装详情图";
      this.getProductSetDetailList();
    },

    /** 商品参数新增按钮操作 */
    handleProductSetDetailAdd() {
      this.resetProductSetDetail();
      this.productSetDetailAddUpdateOpen = true;
      this.productSetDetailAddUpdateTitle = "添加商品套装详情图";
    },
    /** 商品参数修改按钮操作 */
    handleProductSetDetailUpdate(row) {
      this.resetProductSetDetail();
      const id = row.id || this.ids
      getImage(id).then(response => {
        this.productSetDetailForm = response.data;
        this.productSetDetailAddUpdateOpen = true;
        this.title = "修改商品套装详情图";
      });
    },
    /** 商品参数删除按钮操作 */
    handleProductSetDetailDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除商品套装详情图').then(function() {
        return delImage(ids);
      }).then(() => {
        this.getProductSetDetailList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },


    /** 查询商品参数列表 */
    getProductSetDetailList() {
      this.loading = true;
      const fullData = {
        ...this.queryParamsProductSetDetail,
        productSetId: productSetIdGlobal
      };
      listImage(fullData).then(response => {
        this.setDetailList = response.rows;
        this.totalProductSetDetail = response.total;
        this.loading = false;
      });
    },

    /** 提交按钮 */
    submitFormProductSetDetail() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const fullData = {
            ...this.productSetDetailForm,
            productSetId: productSetIdGlobal
          };
          if (fullData.id != null) {
            updateImage(fullData).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.productSetDetailAddUpdateOpen = false;
              this.getProductSetDetailList();
            });
          } else {
            addImage(fullData).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.productSetDetailAddUpdateOpen = false;
              this.getProductSetDetailList();
            });
          }
        }
      });
    },



  }
};
</script>
