<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="门店名称" prop="storeName">
        <el-input
          v-model="queryParams.storeName"
          placeholder="请输入门店名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="tel">
        <el-input
          v-model="queryParams.tel"
          placeholder="请输入联系电话"
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
          v-hasPermi="['business:store:add']"
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
          v-hasPermi="['business:store:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['business:store:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="storeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="门店名称" align="center" prop="storeName" />
      <el-table-column label="门店地址名称" align="center" prop="addressName" />
      <el-table-column label="门店地址" align="center" prop="address" />
      <el-table-column label="纬度" align="center" prop="latitude" />
      <el-table-column label="经度" align="center" prop="longitude" />
      <el-table-column label="客服名片" align="center" prop="carUrl">
        <template #default="scope">
          <img :src="scope.row.carUrl" alt="图标" style="max-width: 100px; max-height: 100px;">
        </template>
      </el-table-column>
      <el-table-column label="门头" align="center" prop="imageUrl">
        <template #default="scope">
          <img :src="scope.row.imageUrl" alt="图标" style="max-width: 100px; max-height: 100px;">
        </template>
      </el-table-column>
      <el-table-column label="预约图" align="center" prop="shareUrl">
        <template #default="scope">
          <img :src="scope.row.shareUrl" alt="图标" style="max-width: 100px; max-height: 100px;">
        </template>
      </el-table-column>
      <el-table-column label="联系电话" align="center" prop="tel" />
      <el-table-column label="营业时间" align="center" prop="businessHours" />
      <el-table-column label="小程序ID" align="center" prop="appId" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleCarousel(scope.row.id)"
          >轮播图</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleVideo(scope.row.id)"
          >门店视频</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:store:remove']"
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

    <!-- 添加或修改门店对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="门店名称" prop="storeName">
          <el-input v-model="form.storeName" placeholder="请输入门店名称" />
        </el-form-item>
        <el-form-item label="门店地址名称" prop="addressName">
          <el-input v-model="form.addressName" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="门店地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="form.latitude" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="form.longitude" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="客服名片" prop="carUrl">
          <image-upload v-model="form.carUrl" :limit="1"/>
        </el-form-item>
        <el-form-item label="门头" prop="imageUrl">
          <image-upload v-model="form.imageUrl" :limit="1"/>
        </el-form-item>
        <el-form-item label="预约图" prop="shareUrl">
          <image-upload v-model="form.shareUrl" :limit="1"/>
        </el-form-item>
        <el-form-item label="联系电话" prop="tel">
          <el-input v-model="form.tel" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="营业时间" prop="businessHours">
          <el-input v-model="form.businessHours" placeholder="请输入营业时间" />
        </el-form-item>
        <el-form-item label="小程序ID" prop="appId">
          <el-input v-model="form.appId" placeholder="请输入小程序ID" />
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>



    <!-- 轮播图弹框 -->
    <el-dialog :title="carouselTitle" :visible.sync="carouselOpen" width="500px" append-to-body>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleCarouselAdd"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleCarouselUpdate"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="single"
            @click="handleCarouselDelete"
          >删除</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="carouselList" @selection-change="handleSelectionChange">
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
        <el-button @click="cancelCarousel">取 消</el-button>
      </div>
      <pagination
        v-show="totalCarousel>0"
        :total="totalCarousel"
        :page.sync="queryParamsCarousel.pageNum"
        :limit.sync="queryParamsCarousel.pageSize"
        @pagination="getCarouselList"
      />
    </el-dialog>

    <!-- 添加或修改轮播图对话框 -->
    <el-dialog :title="carouselAddUpdateTitle" :visible.sync="carouselAddUpdateOpen" width="500px" append-to-body>
      <el-form ref="carouselForm" :model="carouselForm" :rules="rulesCarousel" label-width="80px">
        <el-form-item label="图片" prop="imageUrl">
          <image-upload v-model="carouselForm.imageUrl" :limit="1"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="carouselForm.status">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="carouselForm.sortOrder" controls-position="right" :min="0" :value="1" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormCarousel">确 定</el-button>
        <el-button @click="cancelCarouselAddUpdate">取 消</el-button>
      </div>
    </el-dialog>



    <!-- 门店视频弹框 -->
    <el-dialog :title="videoTitle" :visible.sync="videoOpen" width="500px" append-to-body>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleVideoAdd"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleVideoUpdate"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="single"
            @click="handleVideoDelete"
          >删除</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="videoList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="图片" align="center" prop="imageUrl">
          <template #default="scope">
            <img :src="scope.row.imageUrl" alt="图片" style="max-width: 100px; max-height: 100px;">
          </template>
        </el-table-column>
        <el-table-column label="视频" align="center" prop="videoUrl">
          <template #default="scope">
            <img :src="scope.row.videoUrl" alt="视频" style="max-width: 100px; max-height: 100px;">
          </template>
        </el-table-column>
        <el-table-column label="视频描述" align="center" prop="videoDescribe" />
        <el-table-column label="视频播放数量" align="center" prop="videoPlay" />
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center" prop="sortOrder" />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelVideo">取 消</el-button>
      </div>
      <pagination
        v-show="totalVideo>0"
        :total="totalVideo"
        :page.sync="queryParamsVideo.pageNum"
        :limit.sync="queryParamsVideo.pageSize"
        @pagination="getVideoList"
      />
    </el-dialog>

    <!-- 添加或修改视频对话框 -->
    <el-dialog :title="videoAddUpdateTitle" :visible.sync="videoAddUpdateOpen" width="500px" append-to-body>
      <el-form ref="videoForm" :model="videoForm" :rules="rulesVideo" label-width="80px">
        <el-form-item label="图片" prop="imageUrl">
          <image-upload v-model="videoForm.imageUrl" :limit="1"/>
        </el-form-item>
        <el-form-item label="门店视频" prop="videoUrl">
          <image-upload v-model="videoForm.videoUrl" :limit="1"/>
        </el-form-item>
        <el-form-item label="视频描述" prop="videoDescribe">
          <el-input v-model="videoForm.videoDescribe" placeholder="请输入视频描述" />
        </el-form-item>
        <el-form-item label="视频播放数量" prop="videoPlay">
          <el-input v-model="videoForm.videoPlay" placeholder="请输入视频播放数量" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="videoForm.status">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="videoForm.sortOrder" controls-position="right" :min="0" :value="1" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormVideo">确 定</el-button>
        <el-button @click="cancelVideoAddUpdate">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listStore, getStore, delStore, addStore, updateStore } from "@/api/business/store";
import { addCarousel, delCarousel, getCarousel, listCarousel, updateCarousel } from '@/api/business/carousel'
import { addVideo, delVideo, getVideo, listVideo, updateVideo } from '@/api/business/video'

let storeIdGlobal = 0;

export default {
  name: "Store",
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
      // 门店表格数据
      storeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        storeName: null,
        tel: null,
      },

      // 总条数
      totalCarousel: 0,
      // 查询参数
      queryParamsCarousel: {
        pageNum: 1,
        pageSize: 10,
      },

      // 总条数
      totalVideo: 0,
      // 查询参数
      queryParamsVideo: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        storeName: [
          { required: true, message: "门店名称不能为空", trigger: "blur" }
        ],
        address: [
          { required: true, message: "门店地址不能为空", trigger: "blur" }
        ],
        tel: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
        appId: [
          { required: true, message: "小程序ID不能为空", trigger: "blur" }
        ]
      },

      // 轮播图表格数据
      carouselList: [],

      carouselForm: {},
      // 轮播图弹出层标题
      carouselTitle : "",
      // 轮播图弹出层
      carouselOpen : false,

      //轮播图新增修改弹出层标题
      carouselAddUpdateTitle : "",
      //轮播图新增修改
      carouselAddUpdateOpen : false,
      // 表单校验
      rulesCarousel: {
        imageUrl: [
          { required: true, message: "图片不能为空", trigger: "blur" }
        ],
        sortOrder: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ]
      },


      // 视频表格数据
      videoList: [],

      videoForm: {},
      // 视频弹出层标题
      videoTitle : "",
      // 视频弹出层
      videoOpen : false,

      //视频新增修改弹出层标题
      videoAddUpdateTitle : "",
      //视频新增修改
      videoAddUpdateOpen : false,
      // 表单校验
      rulesVideo: {
        imageUrl: [
          { required: true, message: "图片不能为空", trigger: "blur" }
        ],
        sortOrder: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询门店列表 */
    getList() {
      this.loading = true;
      listStore(this.queryParams).then(response => {
        this.storeList = response.rows;
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
        storeName: null,
        addressName: null,
        address: null,
        latitude: null,
        longitude: null,
        carUrl: null,
        imageUrl: null,
        shareUrl: null,
        tel: null,
        businessHours: null,
        status: "0",
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
      this.title = "添加门店";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getStore(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改门店";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateStore(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStore(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除门店编号为"' + ids + '"的数据项？').then(function() {
        return delStore(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('business/store/export', {
        ...this.queryParams
      }, `store_${new Date().getTime()}.xlsx`)
    },




    // 表单重置
    resetCarousel() {
      this.carouselForm = {
        id: null,
        storeId: null,
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

    // 轮播图取消按钮
    cancelCarousel() {
      this.carouselOpen = false;
      this.resetCarousel();
    },

    // 轮播图新增修改取消按钮
    cancelCarouselAddUpdate() {
      this.carouselAddUpdateOpen = false;
      this.resetCarousel();
    },


    /** 轮播图 */
    handleCarousel(rowStoreId) {
      storeIdGlobal = rowStoreId;
      this.carouselOpen = true;
      this.carouselTitle = "轮播图";
      this.getCarouselList(storeIdGlobal);
    },

    /** 轮播图新增按钮操作 */
    handleCarouselAdd() {
      this.resetCarousel();
      this.carouselAddUpdateOpen = true;
      this.carouselAddUpdateTitle = "添加商品详情图";
    },
    /** 轮播图修改按钮操作 */
    handleCarouselUpdate(row) {
      this.resetCarousel();
      const id = row.id || this.ids
      getCarousel(id).then(response => {
        this.carouselForm = response.data;
        this.carouselAddUpdateOpen = true;
        this.title = "修改轮播图";
      });
    },
    /** 轮播图删除按钮操作 */
    handleCarouselDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除轮播图').then(function() {
        return delCarousel(ids);
      }).then(() => {
        this.getCarouselList(storeIdGlobal);
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },


    /** 查询轮播图列表 */
    getCarouselList() {
      this.loading = true;
      const fullData = {
        ...this.queryParamsCarousel,
        storeId: storeIdGlobal
      };
      listCarousel(fullData).then(response => {
        this.carouselList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 提交按钮 */
    submitFormCarousel() {
      this.$refs["carouselForm"].validate(valid => {
        if (valid) {
          const fullData = {
            ...this.carouselForm,
            storeId: storeIdGlobal
          };
          if (fullData.id != null) {
            updateCarousel(fullData).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.carouselAddUpdateOpen = false;
              this.getCarouselList(storeIdGlobal);
            });
          } else {
            addCarousel(fullData).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.carouselAddUpdateOpen = false;
              this.getCarouselList(storeIdGlobal);
            });
          }
        }
      });
    },



    // 视频表单重置
    resetVideo() {
      this.videoForm = {
        id: null,
        storeId: null,
        imageUrl: null,
        videoUrl: null,
        videoDescribe: null,
        videoPlay: null,
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

    // 视频取消按钮c
    cancelVideo() {
      this.videoOpen = false;
      this.resetVideo();
    },

    // 视频新增修改取消按钮
    cancelVideoAddUpdate() {
      this.videoAddUpdateOpen = false;
      this.resetVideo();
    },


    /** 视频 */
    handleVideo(rowStoreId) {
      storeIdGlobal = rowStoreId;
      this.videoOpen = true;
      this.videoTitle = "门店视频";
      this.getVideoList(storeIdGlobal);
    },

    /** 视频新增按钮操作 */
    handleVideoAdd() {
      this.resetVideo();
      this.videoAddUpdateOpen = true;
      this.videoAddUpdateTitle = "添加门店视频";
    },
    /** 视频修改按钮操作 */
    handleVideoUpdate(row) {
      this.resetVideo();
      const id = row.id || this.ids
      getVideo(id).then(response => {
        this.videoForm = response.data;
        this.videoAddUpdateOpen = true;
        this.title = "修改门店视频";
      });
    },
    /** 视频删除按钮操作 */
    handleVideoDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除视频').then(function() {
        return delVideo(ids);
      }).then(() => {
        this.getVideoList(storeIdGlobal);
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },


    /** 查询视频列表 */
    getVideoList() {
      this.loading = true;
      const fullData = {
        ...this.queryParamsVideo,
        storeId: storeIdGlobal
      };
      listVideo(fullData).then(response => {
        this.videoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 提交按钮 */
    submitFormVideo() {
      this.$refs["videoForm"].validate(valid => {
        if (valid) {
          const fullData = {
            ...this.videoForm,
            storeId: storeIdGlobal
          };
          if (fullData.id != null) {
            updateVideo(fullData).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.videoAddUpdateOpen = false;
              this.getVideoList(storeIdGlobal);
            });
          } else {
            addVideo(fullData).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.videoAddUpdateOpen = false;
              this.getVideoList(storeIdGlobal);
            });
          }
        }
      });
    },


  }
};
</script>
