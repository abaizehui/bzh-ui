<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="门店" prop="storeId">
        <el-select v-model="queryParams.storeId" placeholder="请选择门店">
          <el-option v-for="item in storeOptions" :key="item.id" :label="item.storeName" :value="item.id" ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="产品类目" prop="categoryId">
        <el-select v-model="queryParams.categoryId" placeholder="请选择产品类目">
          <el-option v-for="item in categoryOptions" :key="item.id" :label="item.categoryName" :value="item.id" ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="商品名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入商品名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="用户状态" clearable style="width: 240px">
          <el-option v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
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
          v-hasPermi="['business:product:add']"
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
          v-hasPermi="['business:product:edit']"
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
          v-hasPermi="['business:product:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['business:product:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="productList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="门店" align="center" prop="storeName" />
      <el-table-column label="产品类目" align="center" prop="categoryName" />
      <el-table-column label="商品名称" align="center" prop="productName" />
      <el-table-column label="商品价格" align="center" prop="productPrice" />
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
            @click="handleProductParam(scope.row.id)"
          >商品参数</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleProductDetail(scope.row.id)"
          >详情图</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleProductScene(scope.row.id)"
          >实景图</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
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

    <!-- 添加或修改商品对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="门店" prop="storeId">
          <el-select v-model="form.storeId" placeholder="请选择门店">
            <el-option v-for="item in storeOptions" :key="item.id" :label="item.storeName" :value="item.id" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品类目" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择产品类目">
            <el-option v-for="item in categoryOptions" :key="item.id" :label="item.categoryName" :value="item.id" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品价格" prop="productPrice">
          <el-input v-model="form.productPrice" placeholder="请输入商品价格" />
        </el-form-item>
        <el-form-item label="首页图片" prop="imageUrl">
          <image-upload v-model="form.imageUrl" :limit="1"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="form.sortOrder" controls-position="right" :min="0" :value="1" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 商品参数弹框 -->
    <el-dialog :title="productParamTitle" :visible.sync="productParamOpen" width="500px" append-to-body>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleProductParamAdd"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleProductParamUpdate"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="single"
            @click="handleProductParamDelete"
          >删除</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="paramList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="参数名称" align="center" prop="paramName" />
        <el-table-column label="参数值" align="center" prop="paramValue" />
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center" prop="sortOrder" />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelProductParam">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改商品参数对话框 -->
    <el-dialog :title="productParamAddUpdateTitle" :visible.sync="productParamAddUpdateOpen" width="500px" append-to-body>
      <el-form ref="form" :model="productParamForm" :rules="rulesParam" label-width="80px">
        <el-form-item label="参数名称" prop="paramName">
          <el-input v-model="productParamForm.paramName" placeholder="请输入参数名称" />
        </el-form-item>
        <el-form-item label="参数值" prop="paramValue">
          <el-input v-model="productParamForm.paramValue" placeholder="请输入参数值" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="productParamForm.status">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="productParamForm.sortOrder" controls-position="right" :min="0" :value="1"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormProductParam">确 定</el-button>
        <el-button @click="cancelProductAddUpdateParam">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 商品详情弹框 -->
    <el-dialog :title="productDetailTitle" :visible.sync="productDetailOpen" width="500px" append-to-body>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleProductDetailAdd"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleProductDetailUpdate"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="single"
            @click="handleProductDetailDelete"
          >删除</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="detailList" @selection-change="handleSelectionChange">
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
        <el-button @click="cancelProductDetail">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改商品详情图对话框 -->
    <el-dialog :title="productDetailAddUpdateTitle" :visible.sync="productDetailAddUpdateOpen" width="500px" append-to-body>
      <el-form ref="form" :model="productDetailForm" :rules="rulesDetail" label-width="80px">
        <el-form-item label="图片" prop="imageUrl">
          <image-upload v-model="productDetailForm.imageUrl" :limit="1"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="productDetailForm.status">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="productDetailForm.sortOrder" controls-position="right" :min="0" :value="1" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormProductDetail">确 定</el-button>
        <el-button @click="cancelProductAddUpdateDetail">取 消</el-button>
      </div>
    </el-dialog>



    <!-- 商品实景图弹框 -->
    <el-dialog :title="productSceneTitle" :visible.sync="productSceneOpen" width="500px" append-to-body>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleProductSceneAdd"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleProductSceneUpdate"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="single"
            @click="handleProductSceneDelete"
          >删除</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="sceneList" @selection-change="handleSelectionChange">
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
        <el-button @click="cancelProductScene">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改商品实景图对话框 -->
    <el-dialog :title="productSceneAddUpdateTitle" :visible.sync="productSceneAddUpdateOpen" width="500px" append-to-body>
      <el-form ref="form" :model="productSceneForm" :rules="rulesScene" label-width="80px">
        <el-form-item label="图片" prop="imageUrl">
          <image-upload v-model="productSceneForm.imageUrl" :limit="1"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="productSceneForm.status">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="productSceneForm.sortOrder" controls-position="right" :min="0" :value="1" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormProductScene">确 定</el-button>
        <el-button @click="cancelProductAddUpdateScene">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listProduct, getProduct, delProduct, addProduct, updateProduct } from "@/api/business/product";
import { listAllStore } from '@/api/business/carousel'
import { listAllCategory } from '@/api/business/category'
import { addParam, delParam, getParam, listParam, updateParam } from '@/api/business/param'
import { addDetail, delDetail, getDetail, listDetail, updateDetail } from '@/api/business/detail'
import { addScene, delScene, getScene, listScene, updateScene } from '@/api/business/scene'

let productIdGlobal = 0;

export default {
  name: "Product",
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
      // 商品表格数据
      productList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 商品参数弹出层标题
      productParamTitle : "",
      // 是否显示商品参数弹出层
      productParamOpen : false,

      //商品参数新增修改弹出层标题
      productParamAddUpdateTitle : "",
      //商品参数新增修改
      productParamAddUpdateOpen : false,

      // 商品详情弹出层标题
      productDetailTitle : "",
      // 商品详情弹出层
      productDetailOpen : false,

      //商品详情新增修改弹出层标题
      productDetailAddUpdateTitle : "",
      //商品详情新增修改
      productDetailAddUpdateOpen : false,

      // 商品实景图弹出层标题
      productSceneTitle : "",
      // 商品实景图弹出层
      productSceneOpen : false,

      //商品实景图新增修改弹出层标题
      productSceneAddUpdateTitle : "",
      //商品实景图新增修改
      productSceneAddUpdateOpen : false,

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        categoryId: null,
        storeId: null,
        productName: null,
        status: null,
      },
      // 表单参数
      form: {},

      // 表单参数
      productParamForm: {},
      // 表单参数
      productDetailForm: {},

      productSceneForm: {},
      // 表单校验
      rules: {
        categoryId: [
          { required: true, message: "产品类目不能为空", trigger: "blur" }
        ],
        storeId: [
          { required: true, message: "门店不能为空", trigger: "blur" }
        ],
        productName: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
        productPrice: [
          { required: true, message: "商品价格不能为空", trigger: "blur" }
        ],
      },

      // 表单校验
      rulesParam: {
        paramName: [
          { required: true, message: "参数名称不能为空", trigger: "blur" }
        ],
        paramValue: [
          { required: true, message: "参数值不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        sort_order: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],
      },

      // 表单校验
      rulesDetail: {
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

      // 表单校验
      rulesScene: {
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

      //门店
      storeOptions: [],

      //产品类目
      categoryOptions: [],

      // 商品参数表格数据
      paramList: [],

      // 商品详情图表格数据
      detailList: [],
      // 商品实景图表格数据
      sceneList: [],


    };
  },
  created() {
    this.getList();
    this.getListAllStore();
    this.getListAllCategory();
  },
  methods: {
    /** 查询商品列表 */
    getList() {
      this.loading = true;
      listProduct(this.queryParams).then(response => {
        this.productList = response.rows;
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
        categoryId: null,
        storeId: null,
        productName: null,
        productPrice: null,
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
      this.title = "添加商品";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getProduct(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改商品";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateProduct(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProduct(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除商品编号为"' + ids + '"的数据项？').then(function() {
        return delProduct(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('business/product/export', {
        ...this.queryParams
      }, `product_${new Date().getTime()}.xlsx`)
    },

    /** 查询门店列表 */
    getListAllStore() {
      this.loading = true;
      listAllStore().then(response => {
        this.storeOptions = response.data;
      });
    },

    /** 查询产品列表 */
    getListAllCategory() {
      this.loading = true;
      listAllCategory().then(response => {
        this.categoryOptions = response.data;
      });
    },


    // 表单重置
    resetProductParam() {
      this.productParamForm = {
        id: null,
        productId: null,
        paramName: null,
        paramValue: null,
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
    // 商品参数取消按钮
    cancelProductParam() {
      this.productParamOpen = false;
      this.resetProductParam();
    },

  // 商品参数新增修改取消按钮
    cancelProductAddUpdateParam() {
      this.productParamAddUpdateOpen = false;
      this.resetProductParam();
    },


    /** 商品参数弹框 */
    handleProductParam(rowProductId) {
      productIdGlobal = rowProductId;
      this.productParamOpen = true;
      this.productParamTitle = "商品参数";
      this.getProductParamList(productIdGlobal);
    },

    /** 商品参数新增按钮操作 */
    handleProductParamAdd() {
      this.resetProductParam();
      this.productParamAddUpdateOpen = true;
      this.productParamAddUpdateTitle = "添加商品参数";
    },
    /** 商品参数修改按钮操作 */
    handleProductParamUpdate(row) {
      this.resetProductParam();
      const id = row.id || this.ids
      getParam(id).then(response => {
        this.productParamForm = response.data;
        this.productParamAddUpdateOpen = true;
        this.title = "修改商品参数";
      });
    },
    /** 商品参数删除按钮操作 */
    handleProductParamDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除商品参数').then(function() {
        return delParam(ids);
      }).then(() => {
        this.getProductParamList(productIdGlobal);
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },

    /** 查询商品参数列表 */
    getProductParamList(productId) {
      this.loading = true;
      listParam(productId).then(response => {
        this.paramList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 提交按钮 */
    submitFormProductParam() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const fullData = {
            ...this.productParamForm,
            productId: productIdGlobal
          };
          if (fullData.id != null) {
            updateParam(fullData).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.productParamAddUpdateOpen = false;
              this.getProductParamList(productIdGlobal);
            });
          } else {
            addParam(fullData).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.productParamAddUpdateOpen = false;
              this.getProductParamList(productIdGlobal);
            });
          }
        }
      });
    },


    // 表单重置
    resetProductDetail() {
      this.productDetailForm = {
        id: null,
        productId: null,
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
    cancelProductDetail() {
      this.productDetailOpen = false;
      this.resetProductDetail();
    },

    // 商品详情图新增修改取消按钮
    cancelProductAddUpdateDetail() {
      this.productDetailAddUpdateOpen = false;
      this.resetProductDetail();
    },


    /** 商品详情图 */
    handleProductDetail(rowProductId) {
      productIdGlobal = rowProductId;
      this.productDetailOpen = true;
      this.productDetailTitle = "商品详情图";
      this.getProductDetailList(productIdGlobal);
    },

    /** 商品参数新增按钮操作 */
    handleProductDetailAdd() {
      this.resetProductDetail();
      this.productDetailAddUpdateOpen = true;
      this.productDetailAddUpdateTitle = "添加商品详情图";
    },
    /** 商品参数修改按钮操作 */
    handleProductDetailUpdate(row) {
      this.resetProductDetail();
      const id = row.id || this.ids
      getDetail(id).then(response => {
        this.productDetailForm = response.data;
        this.productDetailAddUpdateOpen = true;
        this.title = "修改商品详情图";
      });
    },
    /** 商品参数删除按钮操作 */
    handleProductDetailDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除商品详情图').then(function() {
        return delDetail(ids);
      }).then(() => {
        this.getProductDetailList(productIdGlobal);
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },


    /** 查询商品参数列表 */
    getProductDetailList(productId) {
      this.loading = true;
      listDetail(productId).then(response => {
        this.detailList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 提交按钮 */
    submitFormProductDetail() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const fullData = {
            ...this.productDetailForm,
            productId: productIdGlobal
          };
          if (fullData.id != null) {
            updateDetail(fullData).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.productDetailAddUpdateOpen = false;
              this.getProductDetailList(productIdGlobal);
            });
          } else {
            addDetail(fullData).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.productDetailAddUpdateOpen = false;
              this.getProductDetailList(productIdGlobal);
            });
          }
        }
      });
    },



    // 表单重置
    resetProductScene() {
      this.productSceneForm = {
        id: null,
        productId: null,
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

    // 商品实景图取消按钮
    cancelProductScene() {
      this.productSceneOpen = false;
      this.resetProductScene();
    },

    // 商品实景图新增修改取消按钮
    cancelProductAddUpdateScene() {
      this.productSceneAddUpdateOpen = false;
      this.resetProductScene();
    },


    /** 商品实景图 */
    handleProductScene(rowProductId) {
      productIdGlobal = rowProductId;
      this.productSceneOpen = true;
      this.productSceneTitle = "商品详情图";
      this.getProductSceneList(productIdGlobal);
    },

    /** 商品实景图新增按钮操作 */
    handleProductSceneAdd() {
      this.resetProductScene();
      this.productSceneAddUpdateOpen = true;
      this.productSceneAddUpdateTitle = "添加商品详情图";
    },
    /** 商品实景图修改按钮操作 */
    handleProductSceneUpdate(row) {
      this.resetProductScene();
      const id = row.id || this.ids
      getScene(id).then(response => {
        this.productSceneForm = response.data;
        this.productSceneAddUpdateOpen = true;
        this.title = "修改商品详情图";
      });
    },
    /** 商品实景图删除按钮操作 */
    handleProductSceneDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除商品详情图').then(function() {
        return delScene(ids);
      }).then(() => {
        this.getProductSceneList(productIdGlobal);
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },


    /** 查询商品实景图列表 */
    getProductSceneList(productId) {
      this.loading = true;
      listScene(productId).then(response => {
        this.sceneList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 提交按钮 */
    submitFormProductScene() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const fullData = {
            ...this.productSceneForm,
            productId: productIdGlobal
          };
          if (fullData.id != null) {
            updateScene(fullData).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.productSceneAddUpdateOpen = false;
              this.getProductSceneList(productIdGlobal);
            });
          } else {
            addScene(fullData).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.productSceneAddUpdateOpen = false;
              this.getProductSceneList(productIdGlobal);
            });
          }
        }
      });
    },
  }
};
</script>
